/* =========================================
   FADLAB API BACKEND (Google Apps Script) - UPDATED
   ========================================= */

// 1. SETUP & SCHEMA
function setupFullDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const schemas = {
    "Students": ["name", "id", "email", "city", "country", "avatar", "role", "points", "rank", "joinedDate"],
    // UPDATED: Added learningPoints, prerequisites, curriculum
    "Courses": ["id", "title", "category", "level", "instructor", "durationHours", "description", "thumbnail", "videoUrl", "resources", "learningPoints", "prerequisites", "curriculum"],
    "Enrollments": ["enrollmentId", "studentId", "courseId", "progress", "startDate", "targetDate", "hoursPerWeek"],
    "Projects": ["id", "title", "description", "authorId", "authorName", "authorAvatar", "category", "status", "thumbnail", "likes", "tags", "githubUrl", "demoUrl", "timestamp"],
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
      // Ensure headers are correct if sheet exists
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
        // Parse the new JSON fields for the frontend
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
        result = allEnrollments.filter(en => en.studentId === sId);
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
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    let result = {};

    switch (action) {
      // --- NEW FIX: HANDLE PROGRESS UPDATES ---
      case 'updateProgress':
        result = updateProgress(ss, data.studentId, data.courseId, data.progress);
        break;
      // ----------------------------------------

      case 'enrollStudent':
        const enrollSheet = ss.getSheetByName('Enrollments');
        const enrollData = getSheetData(ss, 'Enrollments');
        const exists = enrollData.find(en => en.studentId === data.studentId && en.courseId === data.courseId);
        
        if (exists) {
           const headers = enrollSheet.getRange(1, 1, 1, enrollSheet.getLastColumn()).getValues()[0];
           const rowIndex = enrollData.findIndex(en => en.studentId === data.studentId && en.courseId === data.courseId) + 2;
           enrollSheet.getRange(rowIndex, headers.indexOf('hoursPerWeek') + 1).setValue(data.hoursPerWeek);
           enrollSheet.getRange(rowIndex, headers.indexOf('targetDate') + 1).setValue(data.targetDate);
           result = { status: 'updated', enrollmentId: exists.enrollmentId };
        } else {
           const newId = 'e' + new Date().getTime();
           enrollSheet.appendRow([
             newId, data.studentId, data.courseId, 0, new Date().toISOString().split('T')[0], data.targetDate, data.hoursPerWeek
           ]);
           result = { status: 'created', enrollmentId: newId };
        }
        break;

      case 'addCourse':
        const cSheet = ss.getSheetByName('Courses');
        const newCId = 'c' + new Date().getTime();
        
        // Handle complex objects -> JSON strings
        const resourcesStr = JSON.stringify(data.resources || []);
        const learningStr = JSON.stringify(data.learningPoints || []);
        const prereqStr = JSON.stringify(data.prerequisites || []);
        const curriculumStr = JSON.stringify(data.curriculum || []);

        cSheet.appendRow([
          newCId, data.title, data.category, data.level, data.instructor, 
          data.durationHours, data.description, data.thumbnail, data.videoUrl || '', 
          resourcesStr, learningStr, prereqStr, curriculumStr
        ]);
        result = { status: 'success', id: newCId };
        break;

      case 'deleteCourse':
        deleteRowById(ss, 'Courses', data.courseId);
        result = { status: 'deleted' };
        break;

      case 'updateAvatar':
        const stSheet = ss.getSheetByName('Students');
        const stData = getSheetData(ss, 'Students');
        const stIndex = stData.findIndex(s => s.id === data.studentId);
        if (stIndex >= 0) {
           const headers = stSheet.getRange(1, 1, 1, stSheet.getLastColumn()).getValues()[0];
           stSheet.getRange(stIndex + 2, headers.indexOf('avatar') + 1).setValue(data.avatarUrl);
           result = { status: 'updated' };
        } else {
           result = { error: 'Student not found' };
        }
        break;

      case 'addProject':
        const pSheet = ss.getSheetByName('Projects');
        const newPId = 'p' + new Date().getTime();
        pSheet.appendRow([
           newPId, data.title, data.description, data.authorId, data.authorName, data.authorAvatar,
           data.category, data.status, data.thumbnail, 0, 
           data.tags.join(','), data.githubUrl, data.demoUrl, new Date().toISOString().split('T')[0]
        ]);
        updateStudentPoints(ss, data.authorId, 50);
        result = { status: 'success', id: newPId };
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

// 4. HELPER FUNCTIONS

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

// --- NEW HELPER FOR PROGRESS UPDATE ---
function updateProgress(ss, studentId, courseId, progress) {
  const sheet = ss.getSheetByName('Enrollments');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const sIdIdx = headers.indexOf('studentId');
  const cIdIdx = headers.indexOf('courseId');
  const progIdx = headers.indexOf('progress');

  if (sIdIdx === -1 || cIdIdx === -1 || progIdx === -1) {
    return { result: 'error', error: 'Invalid Sheet Schema' };
  }

  // Find the row (skipping header)
  for (let i = 1; i < data.length; i++) {
    if (data[i][sIdIdx] == studentId && data[i][cIdIdx] == courseId) {
      // Sheet rows are 1-indexed, so i+1
      sheet.getRange(i + 1, progIdx + 1).setValue(progress);
      
      // OPTIONAL: If progress is 100, give points
      if (Number(progress) === 100 && Number(data[i][progIdx]) < 100) {
        updateStudentPoints(ss, studentId, 100);
      }
      
      return { status: 'updated', progress: progress };
    }
  }
  return { result: 'error', error: 'Enrollment not found' };
}
// --------------------------------------

/* =========================================
   DATA POPULATION SCRIPT
   ========================================= */

function populateAllSampleData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Re-run setup to ensure columns exist
  setupFullDatabase();

  // --- 1. STUDENTS ---
  const students = [
    ["Abebe Bikila", "s1", "abebe@fadlab.tech", "Addis Ababa", "Ethiopia", "https://picsum.photos/100/100?random=10", "student", 1250, 1, "2023-01-15"],
    ["Tirunesh Dibaba", "s2", "tirunesh@fadlab.tech", "Hawassa", "Ethiopia", "https://picsum.photos/100/100?random=11", "student", 980, 2, "2023-02-20"],
    ["Haile Gebrselassie", "s3", "haile@fadlab.tech", "Adama", "Ethiopia", "https://picsum.photos/100/100?random=12", "student", 850, 3, "2023-03-10"],
    ["System Administrator", "admin1", "admin@fadlab.tech", "Addis Ababa", "Ethiopia", "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff", "admin", 0, 0, "2023-01-01"]
  ];
  fillSheet(ss, "Students", students);

  // --- 2. COURSES (UPDATED) ---
  const res1 = JSON.stringify([{ title: 'STEAM Framework', url: '/docs/steam.pdf', type: 'document' }]);
  const res2 = JSON.stringify([{ title: 'Arduino Guide', url: '#', type: 'link' }]);
  
  // New details
  const learn1 = JSON.stringify(["Scientific Method", "STEAM Integration", "Problem Solving", "Ethics"]);
  const prereq1 = JSON.stringify(["Basic Literacy", "Curiosity"]);
  const curric1 = JSON.stringify([
    { title: "Intro to STEAM", duration: "1h 30m" }, 
    { title: "Design Thinking", duration: "2h" },
    { title: "Final Project", duration: "1h" }
  ]);
  
  const learn2 = JSON.stringify(["Hydroponics Basics", "Nutrient Solutions", "Vertical Farming"]);
  const prereq2 = JSON.stringify(["Intro to STEAM", "Basic Biology"]);
  const curric2 = JSON.stringify([
    { title: "Soil vs Hydro", duration: "2h" }, 
    { title: "System Setup", duration: "4h" },
    { title: "Maintenance", duration: "2h" }
  ]);

  const courses = [
    ["c1", "Introduction to STEAM", "Science", "Beginner", "Prof. Frehun Adefris", 15, "Foundational concepts of Science, Technology, Engineering, Arts, and Math.", "https://picsum.photos/400/225?random=1", "lxb3EKWsInQ", res1, learn1, prereq1, curric1],
    ["c2", "Smart Agriculture: Hydroponics", "Technology", "Intermediate", "Dr. Abyot Redahegn", 30, "Learn vertical farming and hydroponic systems for urban settings.", "https://picsum.photos/400/225?random=2", "Ilg3gGewQ5U", res2, learn2, prereq2, curric2],
    ["c3", "IoT & Industrial Robotics", "Engineering", "Advanced", "Eng. Nathnael", 45, "Building smart machines and connected infrastructure.", "https://picsum.photos/400/225?random=3", "aircAruvnKk", "[]", "[]", "[]", "[]"],
    ["c4", "Entrepreneurship 101", "Entrepreneurship", "Beginner", "Lecturer Mulunesh", 20, "From ideation to business incubation and funding.", "https://picsum.photos/400/225?random=4", "", "[]", "[]", "[]", "[]"],
    ["c5", "3D Concrete Printing", "Innovation", "Advanced", "Prof. Frehun Adefris", 40, "Revolutionizing construction with additive manufacturing.", "https://picsum.photos/400/225?random=5", "", "[]", "[]", "[]", "[]"]
  ];
  fillSheet(ss, "Courses", courses);

  // --- 3. ENROLLMENTS ---
  const enrollments = [
    ["e1", "s1", "c1", 100, "2023-09-01", "2023-09-21", 5],
    ["e2", "s1", "c2", 45, "2023-10-01", "2023-12-10", 3],
    ["e3", "s2", "c4", 10, "2023-11-01", "2023-11-15", 4],
    ["e4", "s3", "c1", 100, "2023-08-01", "2023-08-20", 4],
    ["e5", "s3", "c3", 20, "2023-09-15", "2023-12-20", 6]
  ];
  fillSheet(ss, "Enrollments", enrollments);

  // --- 4. PROJECTS ---
  const projects = [
    ["p1", "Solar Auto-Irrigation", "IoT based system using soil moisture sensors.", "s1", "Abebe Bikila", "https://picsum.photos/100/100?random=10", "Engineering", "Prototype", "https://picsum.photos/500/300?random=201", 45, "IoT,Solar,AgriTech", "https://github.com", "", "2023-11-10"],
    ["p2", "Recycled Plastic Bricks", "Converting PET bottles into bricks.", "s3", "Haile Gebrselassie", "https://picsum.photos/100/100?random=12", "Innovation", "Idea", "https://picsum.photos/500/300?random=202", 32, "Sustainability,Materials", "", "", "2023-11-12"],
    ["p3", "Ethiopian Pattern Generator", "Generative art algorithm for Tibeb.", "s2", "Tirunesh Dibaba", "https://picsum.photos/100/100?random=11", "Arts", "Launched", "https://picsum.photos/500/300?random=203", 88, "CreativeCoding,Culture", "", "https://example.com", "2023-10-25"]
  ];
  fillSheet(ss, "Projects", projects);

  // --- 5. SOCIAL POSTS ---
  const posts = [
    ["fb1", "FadLab", "https://facebook.com/fadlab", "https://ui-avatars.com/api/?name=Fad+Lab&background=0D8ABC&color=fff", "🚀 New Project Alert!", "https://picsum.photos/600/300?random=101", 124, 18, 45, "2 hours ago", "Innovation,AgriTech"],
    ["fb2", "CLIC Ethiopia", "https://facebook.com/clicethiopia", "https://ui-avatars.com/api/?name=CLIC+Ethiopia&background=F59E0B&color=fff", "Community Spotlight: Meet Sarah.", "https://picsum.photos/600/300?random=102", 89, 32, 12, "5 hours ago", "Community,Events"],
    ["fb3", "FadLab", "https://facebook.com/fadlab", "https://ui-avatars.com/api/?name=Fad+Lab&background=0D8ABC&color=fff", "📢 Hackathon Announcement!", "", 256, 84, 110, "1 day ago", "Hackathon,Announcement"]
  ];
  fillSheet(ss, "SocialPosts", posts);

  // --- 6. LABS ---
  const labs = [
    ["l1", "Fabrication Lab", "Fabrication", "Hardware heart of FadLab.", "Hammer", 20, "Building A", JSON.stringify([{name: 'PLA Filament', status: 'In Stock', unit: '15 Spools'}])],
    ["l2", "Digital Studio", "Digital", "Computing center for VR/AI.", "Monitor", 15, "Building B", JSON.stringify([{name: 'VR Covers', status: 'In Stock', unit: '50 units'}])],
    ["l3", "Agri-Tech Field Lab", "Field", "Outdoor testing ground.", "Sprout", 50, "Campus Gardens", JSON.stringify([{name: 'pH Buffer', status: 'Low Stock', unit: '2 Bottles'}])],
    ["l4", "Business Incubator", "Business", "Startup space.", "Briefcase", 30, "Building C", JSON.stringify([{name: 'Markers', status: 'In Stock', unit: '20 Pack'}])]
  ];
  fillSheet(ss, "Labs", labs);

  // --- 7. ASSETS ---
  const assets = [
    ["a1", "l1", "Prusa MK3 - 01", "3D Printer", "Printers", "Available", "c5", "https://picsum.photos/200/200?random=301", "Build Vol: 25x21x21cm,Nozzle: 0.4mm"],
    ["a2", "l1", "Prusa MK3 - 02", "3D Printer", "Printers", "In Use", "c5", "https://picsum.photos/200/200?random=301", "Build Vol: 25x21x21cm"],
    ["a3", "l1", "Epilog Laser Fusion", "Laser Cutter", "CNC & Cutters", "Maintenance", "c3", "https://picsum.photos/200/200?random=302", "60W CO2 Laser"],
    ["a4", "l2", "Oculus Quest 3", "VR Headset", "XR/VR", "Available", "", "https://picsum.photos/200/200?random=303", "128GB Storage"],
    ["a5", "l2", "Alienware Aurora", "Sim Workstation", "Workstations", "Available", "c7", "https://picsum.photos/200/200?random=304", "RTX 4090"],
    ["a6", "l3", "DJI Mavic 3M", "Multispectral Drone", "Drones", "Available", "c2", "https://picsum.photos/200/200?random=305", "RGB + Multispectral"],
    ["a15", "l4", "Sony A7III Kit", "Camera Kit", "Media", "Available", "", "https://picsum.photos/200/200?random=317", "4K Video"]
  ];
  fillSheet(ss, "Assets", assets);

  // --- 8. DIGITAL ASSETS ---
  const digitalAssets = [
    ["da1", "l1", "Gear Assembly STL", "Model", "Standard gear set.", "/models/gear.stl", "System", 120, "45 MB"],
    ["da2", "l1", "Laser Cut Box", "Template", "Box generator.", "/models/box.dxf", "Prof. Frehun", 85, "2 MB"],
    ["da3", "l2", "Unity VR Starter Kit", "Code", "VR boilerplate.", "#", "System", 200, "150 MB"],
    ["da4", "l4", "Startup Financial Model", "Template", "Excel sheet.", "#", "Lecturer Mulunesh", 340, "1 MB"]
  ];
  fillSheet(ss, "DigitalAssets", digitalAssets);

  // --- 9. BOOKINGS ---
  const bookings = [
    ["b1", "a2", "s2", new Date().toISOString().split('T')[0], "10:00", 2, "Prototyping chassis"]
  ];
  fillSheet(ss, "Bookings", bookings);
}

function fillSheet(ss, sheetName, data) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
  }
}