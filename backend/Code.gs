
/* =========================================
   FADLAB API BACKEND (Google Apps Script)
   REVISED VERSION FOR GAMIFICATION & SME
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
          curriculum: parseJSON(c.curriculum, [])
        }));
        break;

      case 'getStudentProfile':
        const student = getSheetData(ss, 'Students').find(s => s.email === e.parameter.email);
        if (student) {
          const enrollments = getSheetData(ss, 'Enrollments').filter(en => en.studentId === student.id);
          student.enrolledCourses = enrollments.map(en => en.courseId);
          student.points = Number(student.knowledgeXP) || 0; // Standardize field name for frontend
          result = student;
        } else result = null;
        break;

      case 'getLeaderboard':
        result = getSheetData(ss, 'Students')
          .filter(s => s.role === 'student')
          .sort((a, b) => Number(b.knowledgeXP) - Number(a.knowledgeXP));
        break;

      case 'getProjects':
        result = getSheetData(ss, 'Projects');
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
        stSheet.appendRow([data.name, data.id, data.email, data.avatar, 'student', 0, 0, 'Campus Apprentice', new Date().toISOString()]);
        result = { status: 'registered' };
        break;

      case 'addCourse':
        const cSheet = ss.getSheetByName('Courses');
        const newCId = 'c' + new Date().getTime();
        cSheet.appendRow([
          newCId, data.title, data.category, data.level, data.instructor, data.durationHours, data.masteryPoints, 
          data.businessOpportunities || '', data.description, data.thumbnail, data.videoUrl || '', 
          JSON.stringify(data.resources || []), JSON.stringify(data.learningPoints || []), 
          JSON.stringify(data.prerequisites || []), JSON.stringify(data.curriculum || [])
        ]);
        result = { status: 'success', id: newCId };
        break;

      case 'updateProgress':
        result = handleUpdateProgress(ss, data.studentId, data.courseId, data.progress);
        break;

      case 'enrollStudent':
        result = handleEnrollStudent(ss, data);
        break;

      case 'addProject':
        const pSheet = ss.getSheetByName('Projects');
        pSheet.appendRow([
          'p' + new Date().getTime(), data.title, data.description, data.authorId, data.authorName, data.authorAvatar,
          data.category, data.status, data.thumbnail, 0, Array.isArray(data.tags) ? data.tags.join(',') : data.tags,
          data.githubUrl || '', data.demoUrl || '', data.blogUrl || '', data.docsUrl || '', new Date().toISOString()
        ]);
        result = { status: 'success' };
        break;

      case 'likeProject':
        const projSheet = ss.getSheetByName('Projects');
        const projRows = projSheet.getDataRange().getValues();
        const likesColIdx = projRows[0].indexOf('likes');
        for (let i = 1; i < projRows.length; i++) {
          if (projRows[i][0] == data.projectId) {
            const currentLikes = Number(projRows[i][likesColIdx]) || 0;
            projSheet.getRange(i + 1, likesColIdx + 1).setValue(currentLikes + 1);
            result = { status: 'liked' };
            break;
          }
        }
        break;

      default:
        result = { error: 'Unknown POST Action' };
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
  const headers = data[0];
  return data.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function parseJSON(s, f) { try { return JSON.parse(s); } catch(e) { return f; } }

function handleEnrollStudent(ss, data) {
  const sheet = ss.getSheetByName('Enrollments');
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const sIdx = headers.indexOf('studentId');
  const cIdx = headers.indexOf('courseId');
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][sIdx] == data.studentId && rows[i][cIdx] == data.courseId) return { status: 'exists' };
  }
  
  const newRow = headers.map(h => {
    if (h === 'enrollmentId') return 'e' + new Date().getTime();
    if (h === 'studentId') return data.studentId;
    if (h === 'courseId') return data.courseId;
    if (h === 'progress') return 0;
    if (h === 'xpEarned') return 0;
    return data[h] || '';
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
      enSheet.getRange(i + 1, xpIdx + 1).setValue(newXp);
      
      // Re-calculate Student Total XP and Rank Title
      const allEnrolls = getSheetData(ss, 'Enrollments').filter(e => e.studentId == studentId);
      // We must consider the update we just made as getSheetData might be cached or slow
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
  
  let title = "Campus Apprentice";
  if (totalXp > 2000) title = "Master Innovator";
  else if (totalXp > 1000) title = "Lead Engineer";
  else if (totalXp > 500) title = "Industrial Technician";

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] == studentId) {
      sheet.getRange(i + 1, xpCol).setValue(totalXp);
      sheet.getRange(i + 1, titleCol).setValue(title);
      break;
    }
  }
}
