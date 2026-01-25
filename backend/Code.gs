
/* =========================================
   FADLAB API BACKEND (Google Apps Script) - ROBUST VERSION
   ========================================= */

// 1. SETUP & SCHEMA
function setupFullDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const schemas = {
    "Students": ["name", "id", "email", "city", "country", "avatar", "role", "points", "rank", "joinedDate"],
    "Courses": ["id", "title", "category", "level", "instructor", "durationHours", "description", "thumbnail", "videoUrl", "resources", "learningPoints", "prerequisites", "curriculum"],
    "Enrollments": ["enrollmentId", "studentId", "courseId", "progress", "startDate", "targetDate", "hoursPerWeek"],
    "Projects": ["id", "title", "description", "authorId", "authorName", "authorAvatar", "category", "status", "thumbnail", "likes", "tags", "githubUrl", "demoUrl", "blogUrl", "docsUrl", "timestamp"],
    "SocialPosts": ["id", "source", "sourceUrl", "authorAvatar", "content", "image", "likes", "comments", "shares", "timestamp", "tags"],
    "Labs": ["id", "name", "type", "description", "icon", "capacity", "location", "consumables"],
    "Assets": ["id", "labId", "name", "model", "subCategory", "status", "certificationRequired", "image", "specs"],
    "DigitalAssets": ["id", "labId", "title", "type", "description", "url", "authorName", "downloads", "size"],
    "Bookings": ["id", "assetId", "studentId", "date", "startTime", "durationHours", "purpose"]
  };

  for (const [sheetName, headers] of Object.entries(schemas)) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    } else {
      // Ensure headers are correct if sheet exists (Optional: could add missing columns here)
      const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
      if (currentHeaders[0] === "") {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
      }
    }
  }
}

// 2. GET REQUESTS (Read Data)
function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const action = e.parameter.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let result = {};

    switch (action) {
      case 'getCourses':
        result = getSheetData(ss, 'Courses');
        result = result.map(c => ({
          ...c,
          resources: parseJSON(c.resources, []),
          learningPoints: parseJSON(c.learningPoints, []),
          prerequisites: parseJSON(c.prerequisites, []),
          curriculum: parseJSON(c.curriculum, [])
        }));
        break;
        
      case 'getStudentProfile':
        const email = e.parameter.email;
        const students = getSheetData(ss, 'Students');
        const student = students.find(s => s.email === email);
        if (student) {
          const enrollments = getSheetData(ss, 'Enrollments');
          const studentEnrollments = enrollments.filter(en => en.studentId === student.id);
          
          student.enrolledCourses = studentEnrollments.map(en => en.courseId);
          student.studyPlans = studentEnrollments.map(en => ({
             courseId: en.courseId,
             plannedHoursPerWeek: en.hoursPerWeek,
             startDate: en.startDate, // Ensure start date is returned
             targetCompletionDate: en.targetDate
          }));

          const projects = getSheetData(ss, 'Projects');
          student.projectIds = projects.filter(p => p.authorId === student.id).map(p => p.id);
          
          result = student;
        } else {
          result = null;
        }
        break;

      case 'getStudentEnrollments':
        const sId = e.parameter.studentId;
        const allEnrollments = getSheetData(ss, 'Enrollments');
        // Return detailed enrollment objects
        result = allEnrollments
          .filter(en => en.studentId === sId)
          .map(en => ({
             ...en,
             plannedHoursPerWeek: en.hoursPerWeek, // Map backend 'hoursPerWeek' to frontend 'plannedHoursPerWeek'
             targetCompletionDate: en.targetDate 
          }));
        break;

      case 'getLeaderboard':
        const allStudents = getSheetData(ss, 'Students');
        result = allStudents
          .filter(s => s.role === 'student')
          .sort((a, b) => Number(b.points) - Number(a.points));
        break;

      case 'getAdminStats':
        const courses = getSheetData(ss, 'Courses');
        const st = getSheetData(ss, 'Students');
        const en = getSheetData(ss, 'Enrollments');
        
        const coursePerformance = courses.map(c => {
           const cEnrolls = en.filter(e => e.courseId === c.id);
           const completed = cEnrolls.filter(e => Number(e.progress) === 100).length;
           return {
             courseId: c.id,
             title: c.title,
             enrolledCount: cEnrolls.length,
             completedCount: completed
           };
        });

        result = {
          totalCourses: courses.length,
          totalStudents: st.filter(s => s.role === 'student').length,
          totalEnrollments: en.length,
          coursePerformance: coursePerformance
        };
        break;

      case 'getProjects':
        result = getSheetData(ss, 'Projects');
        result = result.map(p => ({
          ...p,
          tags: p.tags ? p.tags.split(',') : []
        }));
        break;
        
      case 'getSocialPosts':
        result = getSheetData(ss, 'SocialPosts');
        result = result.map(p => ({
          ...p,
          tags: p.tags ? p.tags.split(',') : []
        }));
        break;

      case 'getLabs':
        result = getSheetData(ss, 'Labs');
        result = result.map(l => ({
           ...l, 
           consumables: parseJSON(l.consumables, [])
        }));
        break;

      case 'getAssets':
        const labId = e.parameter.labId;
        const allAssets = getSheetData(ss, 'Assets');
        const filteredAssets = labId ? allAssets.filter(a => a.labId === labId) : allAssets;
        result = filteredAssets.map(a => ({
           ...a,
           specs: a.specs ? a.specs.split(',') : []
        }));
        break;
        
      case 'getDigitalAssets':
        const dLabId = e.parameter.labId;
        const dAssets = getSheetData(ss, 'DigitalAssets');
        result = dLabId ? dAssets.filter(a => a.labId === dLabId) : dAssets;
        break;
        
      case 'getBookings':
        const aId = e.parameter.assetId;
        const bookings = getSheetData(ss, 'Bookings');
        result = aId ? bookings.filter(b => b.assetId === aId) : bookings;
        break;

      default:
        result = { error: 'Invalid Action' };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ 'error': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 3. POST REQUESTS (Write Data)
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch(err) {
      data = e.parameter; // Fallback
    }

    const action = data.action;
    let result = {};

    switch (action) {
      case 'enrollStudent':
        result = handleEnrollStudent(ss, data);
        break;

      case 'updateProgress':
        result = handleUpdateProgress(ss, data.studentId, data.courseId, data.progress);
        break;
        
      case 'registerStudent':
        const stSheet = ss.getSheetByName('Students');
        stSheet.appendRow([
          data.name, data.id, data.email, data.city || '', data.country || '', data.avatar, 'student', 0, 0, new Date().toISOString()
        ]);
        result = { status: 'registered', id: data.id };
        break;

      case 'addCourse':
        const cSheet = ss.getSheetByName('Courses');
        const newCId = 'c' + new Date().getTime();
        cSheet.appendRow([
          newCId, data.title, data.category, data.level, data.instructor, 
          data.durationHours, data.description, data.thumbnail, data.videoUrl || '', 
          JSON.stringify(data.resources || []), 
          JSON.stringify(data.learningPoints || []), 
          JSON.stringify(data.prerequisites || []), 
          JSON.stringify(data.curriculum || [])
        ]);
        result = { status: 'success', id: newCId };
        break;

      case 'deleteCourse':
        deleteRowById(ss, 'Courses', data.courseId);
        result = { status: 'deleted' };
        break;

      case 'updateAvatar':
        const studentSheet = ss.getSheetByName('Students');
        const studentData = studentSheet.getDataRange().getValues();
        for(let i=1; i<studentData.length; i++) {
           if(studentData[i][1] === data.studentId) {
              studentSheet.getRange(i+1, 6).setValue(data.avatarUrl);
              result = { status: 'updated' };
              break;
           }
        }
        if(!result.status) result = { error: 'Student not found' };
        break;

      case 'addProject':
        const pSheet = ss.getSheetByName('Projects');
        const newPId = 'p' + new Date().getTime();
        pSheet.appendRow([
           newPId, 
           data.title, 
           data.description, 
           data.authorId, 
           data.authorName, 
           data.authorAvatar,
           data.category, 
           data.status, 
           data.thumbnail, 
           0, // Initial likes
           Array.isArray(data.tags) ? data.tags.join(',') : data.tags, 
           data.githubUrl || '', 
           data.demoUrl || '', 
           data.blogUrl || '', 
           data.docsUrl || '', 
           new Date().toISOString().split('T')[0]
        ]);
        updateStudentPoints(ss, data.authorId, 50);
        result = { status: 'success', id: newPId };
        break;
        
      case 'likeProject':
        const projSheet = ss.getSheetByName('Projects');
        if (!projSheet) { result = { error: 'Projects sheet missing' }; break; }
        
        const projRange = projSheet.getDataRange();
        const projValues = projRange.getValues();
        const headers = projValues[0];
        const idIdx = headers.indexOf('id');
        let likesIdx = headers.indexOf('likes');
        
        // SELF-HEALING: If 'likes' column is missing in the Sheet, create it automatically
        if (likesIdx === -1) {
           likesIdx = headers.length; // New index at the end
           projSheet.getRange(1, likesIdx + 1).setValue('likes').setFontWeight('bold');
           // No need to reload values; we know new column is empty
        }
        
        let found = false;
        for (let i = 1; i < projValues.length; i++) {
           // String comparison for robustness
           if (String(projValues[i][idIdx]) === String(data.projectId)) {
              // Read current value directly from cell (in case likesIdx was just added and isn't in projValues)
              const cell = projSheet.getRange(i + 1, likesIdx + 1);
              const currentLikes = Number(cell.getValue()) || 0;
              
              cell.setValue(currentLikes + 1);
              found = true;
              break;
           }
        }
        result = { status: found ? 'liked' : 'not_found' };
        break;
        
      case 'createBooking':
        const bSheet = ss.getSheetByName('Bookings');
        const newBId = 'b' + new Date().getTime();
        bSheet.appendRow([
          newBId, data.assetId, data.studentId, data.date, data.startTime, data.durationHours, data.purpose
        ]);
        const today = new Date().toISOString().split('T')[0];
        if (data.date === today) updateAssetStatus(ss, data.assetId, 'In Use');
        result = { status: 'success', id: newBId };
        break;
        
      case 'reportAssetIssue':
        updateAssetStatus(ss, data.assetId, 'Maintenance');
        result = { status: 'reported' };
        break;

      default:
        result = { error: 'Invalid Action: ' + action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ 'error': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 4. ROBUST HELPER FUNCTIONS

function getSheetData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  const rows = data.slice(1);
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

function parseJSON(str, fallback) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

function deleteRowById(ss, sheetName, id) {
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('id');
  if (idIndex === -1) return;
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][idIndex] == id) sheet.deleteRow(i + 1);
  }
}

function updateStudentPoints(ss, studentId, pointsToAdd) {
  const sheet = ss.getSheetByName('Students');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf('id');
  const pointsIdx = headers.indexOf('points');
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIdx] == studentId) {
      const currentPoints = Number(data[i][pointsIdx]) || 0;
      sheet.getRange(i + 1, pointsIdx + 1).setValue(currentPoints + pointsToAdd);
      break;
    }
  }
}

function updateAssetStatus(ss, assetId, status) {
  const sheet = ss.getSheetByName('Assets');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf('id');
  const statusIdx = headers.indexOf('status');
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIdx] == assetId) {
      sheet.getRange(i + 1, statusIdx + 1).setValue(status);
      break;
    }
  }
}

// --- CORE FIX: ENROLLMENT LOGIC ---

function handleEnrollStudent(ss, data) {
  const sheet = ss.getSheetByName('Enrollments');
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idx = {};
  headers.forEach((h, i) => idx[h] = i);
  
  let rowIndex = -1;
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idx['studentId']] == data.studentId && allData[i][idx['courseId']] == data.courseId) {
      rowIndex = i + 1;
      break;
    }
  }

  const hours = data.hoursPerWeek || 0;
  const startDate = data.startDate || new Date().toISOString().split('T')[0];
  const targetDate = data.targetCompletionDate || data.targetDate || '';
  const progress = data.progress !== undefined ? data.progress : 0;

  if (rowIndex > -1) {
    if (data.hoursPerWeek) sheet.getRange(rowIndex, idx['hoursPerWeek'] + 1).setValue(hours);
    if (targetDate) sheet.getRange(rowIndex, idx['targetDate'] + 1).setValue(targetDate);
    if (data.startDate) sheet.getRange(rowIndex, idx['startDate'] + 1).setValue(startDate);
    
    return { status: 'updated', enrollmentId: allData[rowIndex-1][idx['enrollmentId']] };
  } else {
    const newId = 'e' + new Date().getTime();
    const newRow = headers.map(h => {
      if (h === 'enrollmentId') return newId;
      if (h === 'studentId') return data.studentId;
      if (h === 'courseId') return data.courseId;
      if (h === 'progress') return progress;
      if (h === 'startDate') return startDate;
      if (h === 'targetDate') return targetDate;
      if (h === 'hoursPerWeek') return hours;
      return '';
    });
    
    sheet.appendRow(newRow);
    return { status: 'created', enrollmentId: newId };
  }
}

function handleUpdateProgress(ss, studentId, courseId, progress) {
  const sheet = ss.getSheetByName('Enrollments');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const sIdIdx = headers.indexOf('studentId');
  const cIdIdx = headers.indexOf('courseId');
  const progIdx = headers.indexOf('progress');

  if (sIdIdx === -1 || cIdIdx === -1) return { error: 'Schema Error' };

  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][sIdIdx] == studentId && data[i][cIdIdx] == courseId) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex > -1) {
    sheet.getRange(rowIndex, progIdx + 1).setValue(progress);
    if (Number(progress) === 100 && Number(data[rowIndex-1][progIdx]) < 100) {
      updateStudentPoints(ss, studentId, 100);
    }
    return { status: 'updated', progress: progress };
  } else {
    return handleEnrollStudent(ss, {
      studentId: studentId,
      courseId: courseId,
      progress: progress,
      hoursPerWeek: 5,
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: ''
    });
  }
}

// 5. SAMPLE DATA (Run manually in Editor to reset)
function populateAllSampleData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setupFullDatabase();
}
