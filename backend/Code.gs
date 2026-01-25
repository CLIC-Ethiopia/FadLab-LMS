
/* =========================================
   FADLAB API BACKEND (Google Apps Script)
   REVISED: ADDITIVE SCHEMA & GAMIFICATION
   ========================================= */

function setupFullDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const schemas = {
    "Students": ["name", "id", "email", "avatar", "role", "knowledgeXP", "rank", "rankTitle", "joinedDate"],
    "Courses": ["id", "title", "category", "level", "instructor", "durationHours", "masteryPoints", "businessOpportunities", "description", "thumbnail", "videoUrl", "resources", "learningPoints", "prerequisites", "curriculum"],
    "Enrollments": ["enrollmentId", "studentId", "courseId", "progress", "startDate", "targetDate", "hoursPerWeek", "xpEarned"],
    "Projects": ["id", "title", "description", "authorId", "authorName", "authorAvatar", "category", "status", "thumbnail", "likes", "tags", "githubUrl", "demoUrl", "blogUrl", "docsUrl", "timestamp"]
  };

  for (const [sheetName, headers] of Object.entries(schemas)) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    } else {
      // Add missing columns non-destructively
      const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];
      headers.forEach(h => {
        if (currentHeaders.indexOf(h) === -1) {
          const newCol = sheet.getLastColumn() + 1;
          sheet.getRange(1, newCol).setValue(h).setFontWeight("bold");
        }
      });
    }
  }
}

/**
 * Migration Helper: Call this ONCE to populate new columns for existing data.
 */
function patchExistingData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Patch Courses
  const cSheet = ss.getSheetByName('Courses');
  const cData = cSheet.getDataRange().getValues();
  const cHeaders = cData[0];
  const mIdx = cHeaders.indexOf('masteryPoints');
  const dIdx = cHeaders.indexOf('durationHours');
  for (let i = 1; i < cData.length; i++) {
    if (!cData[i][mIdx]) {
      const duration = Number(cData[i][dIdx]) || 10;
      cSheet.getRange(i + 1, mIdx + 1).setValue(duration * 10);
    }
  }

  // Patch Students
  const sSheet = ss.getSheetByName('Students');
  const sData = sSheet.getDataRange().getValues();
  const sHeaders = sData[0];
  const xpIdx = sHeaders.indexOf('knowledgeXP');
  const oldPtsIdx = sHeaders.indexOf('points'); // Compatibility with old points column
  const titleIdx = sHeaders.indexOf('rankTitle');
  
  for (let i = 1; i < sData.length; i++) {
    const currentXP = Number(sData[i][xpIdx]) || Number(sData[i][oldPtsIdx]) || 0;
    if (xpIdx !== -1) sSheet.getRange(i + 1, xpIdx + 1).setValue(currentXP);
    if (titleIdx !== -1 && !sData[i][titleIdx]) {
      sSheet.getRange(i + 1, titleIdx + 1).setValue("Campus Apprentice");
    }
  }
}

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const action = e.parameter.action;
  let result = {};

  try {
    switch (action) {
      case 'getCourses':
        result = getSheetData(ss, 'Courses').map(c => ({
          ...c,
          resources: parseJSON(c.resources, []),
          learningPoints: parseJSON(c.learningPoints, []),
          prerequisites: parseJSON(c.prerequisites, []),
          curriculum: parseJSON(c.curriculum, []),
          masteryPoints: Number(c.masteryPoints || 100),
          durationHours: Number(c.durationHours || 10)
        }));
        break;

      case 'getStudentProfile':
        const student = getSheetData(ss, 'Students').find(s => s.email === e.parameter.email);
        if (student) {
          const enrollments = getSheetData(ss, 'Enrollments').filter(en => en.studentId === student.id);
          student.enrolledCourses = enrollments.map(en => en.courseId);
          student.knowledgeXP = Number(student.knowledgeXP || student.points || 0);
          result = student;
        } else result = null;
        break;

      case 'getLeaderboard':
        result = getSheetData(ss, 'Students')
          .filter(s => s.role === 'student')
          .sort((a, b) => Number(b.knowledgeXP || 0) - Number(a.knowledgeXP || 0));
        break;

      case 'getStudentEnrollments':
        result = getSheetData(ss, 'Enrollments').filter(en => en.studentId === e.parameter.studentId);
        break;

      case 'getProjects':
        result = getSheetData(ss, 'Projects');
        break;

      case 'getLabs':
        result = []; // Labs data can be added here
        break;

      default:
        result = { error: 'Unknown Action' };
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let data = JSON.parse(e.postData.contents);
  const action = data.action;
  let result = {};

  try {
    switch (action) {
      case 'registerStudent':
        const stSheet = ss.getSheetByName('Students');
        const headers = stSheet.getDataRange().getValues()[0];
        const newRow = headers.map(h => {
          if (h === 'name') return data.name;
          if (h === 'id') return data.id;
          if (h === 'email') return data.email;
          if (h === 'avatar') return data.avatar;
          if (h === 'role') return data.role || 'student';
          if (h === 'knowledgeXP') return 0;
          if (h === 'rank') return 0;
          if (h === 'rankTitle') return 'Campus Apprentice';
          if (h === 'joinedDate') return new Date().toISOString();
          return '';
        });
        stSheet.appendRow(newRow);
        result = { status: 'registered' };
        break;

      case 'updateProgress':
        result = handleUpdateProgress(ss, data.studentId, data.courseId, data.progress);
        break;

      case 'enrollStudent':
        result = handleEnrollStudent(ss, data);
        break;

      case 'addCourse':
        const cSheet = ss.getSheetByName('Courses');
        const cHeaders = cSheet.getDataRange().getValues()[0];
        const newCId = 'c' + new Date().getTime();
        const courseRow = cHeaders.map(h => {
          if (h === 'id') return newCId;
          if (h === 'resources' || h === 'learningPoints' || h === 'prerequisites' || h === 'curriculum') 
            return JSON.stringify(data[h] || []);
          return data[h] || '';
        });
        cSheet.appendRow(courseRow);
        result = { status: 'success', id: newCId };
        break;

      case 'likeProject':
        result = handleLikeProject(ss, data.projectId);
        break;

      case 'addProject':
        const pSheet = ss.getSheetByName('Projects');
        const pHeaders = pSheet.getDataRange().getValues()[0];
        const pRow = pHeaders.map(h => {
          if (h === 'id') return 'p' + new Date().getTime();
          if (h === 'likes') return 0;
          if (h === 'timestamp') return new Date().toISOString().split('T')[0];
          if (h === 'tags') return Array.isArray(data.tags) ? data.tags.join(',') : data.tags;
          return data[h] || '';
        });
        pSheet.appendRow(pRow);
        result = { status: 'success' };
        break;

      default:
        result = { error: 'Unknown Action: ' + action };
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

// HELPERS
function getSheetData(ss, name) {
  const sheet = ss.getSheetByName(name);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function parseJSON(s, f) { 
  if (!s) return f;
  try { return JSON.parse(s); } catch(e) { return f; } 
}

function handleEnrollStudent(ss, data) {
  const sheet = ss.getSheetByName('Enrollments');
  const headers = sheet.getDataRange().getValues()[0];
  const newRow = headers.map(h => {
    if (h === 'enrollmentId') return 'e' + new Date().getTime();
    if (h === 'studentId') return data.studentId;
    if (h === 'courseId') return data.courseId;
    if (h === 'progress') return 0;
    if (h === 'xpEarned') return 0;
    if (h === 'startDate') return data.startDate || new Date().toISOString();
    if (h === 'targetDate') return data.targetCompletionDate || data.targetDate || '';
    if (h === 'hoursPerWeek') return data.hoursPerWeek || 5;
    return '';
  });
  sheet.appendRow(newRow);
  return { status: 'enrolled' };
}

function handleUpdateProgress(ss, studentId, courseId, progress) {
  const enSheet = ss.getSheetByName('Enrollments');
  const enRows = enSheet.getDataRange().getValues();
  const headers = enRows[0];
  const sIdx = headers.indexOf('studentId');
  const cIdx = headers.indexOf('courseId');
  const pIdx = headers.indexOf('progress');
  const xpIdx = headers.indexOf('xpEarned');

  // Find mastery points for this course
  const course = getSheetData(ss, 'Courses').find(c => c.id == courseId);
  const mastery = Number(course?.masteryPoints) || 100;

  for (let i = 1; i < enRows.length; i++) {
    if (enRows[i][sIdx] == studentId && enRows[i][cIdx] == courseId) {
      const newXp = Math.floor((progress / 100) * mastery);
      enSheet.getRange(i + 1, pIdx + 1).setValue(progress);
      if (xpIdx !== -1) enSheet.getRange(i + 1, xpIdx + 1).setValue(newXp);
      
      // Re-calculate Student Total XP
      const allEnrolls = getSheetData(ss, 'Enrollments').filter(e => e.studentId == studentId);
      let totalXp = 0;
      allEnrolls.forEach(e => {
        if (e.courseId == courseId) totalXp += newXp;
        else totalXp += (Number(e.xpEarned) || 0);
      });

      updateStudentXP(ss, studentId, totalXp);
      return { status: 'updated', xpEarned: newXp };
    }
  }
  return { error: 'Enrollment not found' };
}

function updateStudentXP(ss, studentId, totalXp) {
  const sheet = ss.getSheetByName('Students');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const xpCol = headers.indexOf('knowledgeXP') + 1;
  const titleCol = headers.indexOf('rankTitle') + 1;
  const idCol = headers.indexOf('id');
  
  let title = "Campus Apprentice";
  if (totalXp > 2000) title = "Master Innovator";
  else if (totalXp > 1000) title = "Lead Engineer";
  else if (totalXp > 500) title = "Industrial Technician";

  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] == studentId) {
      if (xpCol > 0) sheet.getRange(i + 1, xpCol).setValue(totalXp);
      if (titleCol > 0) sheet.getRange(i + 1, titleCol).setValue(title);
      break;
    }
  }
}

function handleLikeProject(ss, projectId) {
  const sheet = ss.getSheetByName('Projects');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf('id');
  const likesIdx = headers.indexOf('likes');
  
  if (likesIdx === -1) return { error: 'Likes column missing' };

  for (let i = 1; i < data.length; i++) {
    if (data[i][idIdx] == projectId) {
      const current = Number(data[i][likesIdx]) || 0;
      sheet.getRange(i + 1, likesIdx + 1).setValue(current + 1);
      return { status: 'liked' };
    }
  }
  return { error: 'Project not found' };
}
