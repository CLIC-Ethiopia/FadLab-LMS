
import { Course, CourseCategory, Student, Enrollment, AdminStats } from '../types';

/**
 * NOTE: In a production environment, this service would use `gapi.client.sheets`
 * to read/write directly to a Google Sheet.
 * 
 * For this demonstration, we are simulating the "Sheet" database using local mock data
 * and Promises to mimic network latency.
 */

// Mock Data derived from the CLIC Ethiopia PDF context
let MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Introduction to STEAM',
    category: CourseCategory.Science,
    durationHours: 15,
    description: 'Foundational concepts of Science, Technology, Engineering, Arts, and Math.',
    instructor: 'Prof. Frehun Adefris',
    thumbnail: 'https://picsum.photos/400/225?random=1',
    level: 'Beginner',
    resources: [
      { title: 'STEAM Education Framework PDF', url: '#', type: 'document' },
      { title: 'Introductory Lecture Video', url: '#', type: 'video' },
      { title: 'Official CLIC Africa Website', url: 'https://clicafrica.org', type: 'link' }
    ]
  },
  {
    id: 'c2',
    title: 'Smart Agriculture: Hydroponics',
    category: CourseCategory.Technology,
    durationHours: 30,
    description: 'Learn vertical farming and hydroponic systems for urban settings.',
    instructor: 'Dr. Abyot Redahegn',
    thumbnail: 'https://picsum.photos/400/225?random=2',
    level: 'Intermediate',
    resources: [
      { title: 'Hydroponic Systems Diagram', url: '#', type: 'document' },
      { title: 'Nutrient Solution Guide', url: '#', type: 'link' }
    ]
  },
  {
    id: 'c3',
    title: 'IoT & Industrial Robotics',
    category: CourseCategory.Engineering,
    durationHours: 45,
    description: 'Building smart machines and connected infrastructure.',
    instructor: 'Eng. Nathnael',
    thumbnail: 'https://picsum.photos/400/225?random=3',
    level: 'Advanced',
    resources: [
      { title: 'Arduino for Industry 4.0', url: '#', type: 'video' },
      { title: 'Sensor Integration Manual', url: '#', type: 'document' }
    ]
  },
  {
    id: 'c4',
    title: 'Entrepreneurship 101',
    category: CourseCategory.Entrepreneurship,
    durationHours: 20,
    description: 'From ideation to business incubation and funding.',
    instructor: 'Lecturer Mulunesh',
    thumbnail: 'https://picsum.photos/400/225?random=4',
    level: 'Beginner',
    resources: [
      { title: 'Business Model Canvas Template', url: '#', type: 'document' },
      { title: 'Pitch Deck Examples', url: '#', type: 'link' }
    ]
  },
  {
    id: 'c5',
    title: '3D Concrete Printing',
    category: CourseCategory.Innovation,
    durationHours: 40,
    description: 'Revolutionizing construction with additive manufacturing.',
    instructor: 'Prof. Frehun Adefris',
    thumbnail: 'https://picsum.photos/400/225?random=5',
    level: 'Advanced',
    resources: [
      { title: '3DCP Technology Overview', url: '#', type: 'video' }
    ]
  },
  {
    id: 'c6',
    title: 'Applied Industrial Math',
    category: CourseCategory.Mathematics,
    durationHours: 12,
    description: 'Statistical analysis and geometry for manufacturing.',
    instructor: 'Dr. Almaz',
    thumbnail: 'https://picsum.photos/400/225?random=6',
    level: 'Intermediate'
  },
  {
    id: 'c7',
    title: 'Digital Arts & Design',
    category: CourseCategory.Arts,
    durationHours: 25,
    description: 'Using digital tools for industrial design and creative expression.',
    instructor: 'Artist Kebede',
    thumbnail: 'https://picsum.photos/400/225?random=7',
    level: 'Beginner'
  }
];

const MOCK_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Abebe Bikila',
    email: 'abebe@fadlab.tech',
    avatar: 'https://picsum.photos/100/100?random=10',
    role: 'student',
    enrolledCourses: ['c1', 'c2'],
    studyPlans: [
      { courseId: 'c1', plannedHoursPerWeek: 5, targetCompletionDate: '2023-09-21' },
      { courseId: 'c2', plannedHoursPerWeek: 3, targetCompletionDate: '2023-12-10' }
    ],
    points: 1250,
    rank: 1
  },
  {
    id: 's2',
    name: 'Tirunesh Dibaba',
    email: 'tirunesh@fadlab.tech',
    avatar: 'https://picsum.photos/100/100?random=11',
    role: 'student',
    enrolledCourses: ['c4'],
    studyPlans: [
      { courseId: 'c4', plannedHoursPerWeek: 4, targetCompletionDate: '2023-11-15' }
    ],
    points: 980,
    rank: 2
  },
  {
    id: 's3',
    name: 'Haile Gebrselassie',
    email: 'haile@fadlab.tech',
    avatar: 'https://picsum.photos/100/100?random=12',
    role: 'student',
    enrolledCourses: ['c1', 'c3'],
    studyPlans: [],
    points: 850,
    rank: 3
  },
  {
    id: 'admin1',
    name: 'System Administrator',
    email: 'admin@fadlab.tech',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
    role: 'admin',
    enrolledCourses: [],
    points: 0,
    rank: 0
  }
];

const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    studentId: 's1',
    courseId: 'c1',
    progress: 100,
    plannedHoursPerWeek: 5,
    startDate: '2023-09-01',
    targetCompletionDate: '2023-09-21'
  },
  {
    studentId: 's1',
    courseId: 'c2',
    progress: 45,
    plannedHoursPerWeek: 3,
    startDate: '2023-10-01',
    targetCompletionDate: '2023-12-10'
  },
  {
    studentId: 's3',
    courseId: 'c1',
    progress: 100,
    plannedHoursPerWeek: 4,
    startDate: '2023-08-01',
    targetCompletionDate: '2023-08-20'
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sheetService = {
  /**
   * Mimics: GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/Courses!A:Z
   */
  async getCourses(): Promise<Course[]> {
    await delay(500);
    return [...MOCK_COURSES];
  },

  /**
   * ADMIN ONLY: Add a new course to the "Sheet"
   */
  async addCourse(course: Omit<Course, 'id'>): Promise<Course> {
    await delay(800);
    const newCourse: Course = {
      ...course,
      id: `c${Date.now()}` // Generate pseudo-ID
    };
    MOCK_COURSES.push(newCourse);
    return newCourse;
  },

  /**
   * ADMIN ONLY: Delete a course from the "Sheet"
   */
  async deleteCourse(courseId: string): Promise<void> {
    await delay(800);
    MOCK_COURSES = MOCK_COURSES.filter(c => c.id !== courseId);
  },

  /**
   * ADMIN ONLY: Get Statistics
   */
  async getAdminStats(): Promise<AdminStats> {
    await delay(600);
    
    // Calculate performance per course
    const coursePerformance = MOCK_COURSES.map(course => {
        const enrollments = MOCK_ENROLLMENTS.filter(e => e.courseId === course.id);
        const completed = enrollments.filter(e => e.progress === 100).length;
        return {
            courseId: course.id,
            title: course.title,
            enrolledCount: enrollments.length,
            completedCount: completed
        };
    });

    return {
        totalCourses: MOCK_COURSES.length,
        totalStudents: MOCK_STUDENTS.filter(s => s.role === 'student').length,
        totalEnrollments: MOCK_ENROLLMENTS.length,
        coursePerformance
    };
  },

  /**
   * Mimics: GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/Students!A:Z
   */
  async getStudentProfile(email: string): Promise<Student | null> {
    await delay(800);
    const student = MOCK_STUDENTS.find(s => s.email === email);
    return student || null;
  },

  /**
   * Mimics: PUT https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/Students!{range}
   */
  async updateStudentAvatar(studentId: string, avatarUrl: string): Promise<void> {
    await delay(800);
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (student) {
      student.avatar = avatarUrl;
    }
  },

  /**
   * Mimics: GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/Enrollments!A:Z
   */
  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    await delay(600);
    return MOCK_ENROLLMENTS.filter(e => e.studentId === studentId);
  },

  /**
   * Mimics: APPEND to Google Sheet
   */
  async enrollStudent(studentId: string, courseId: string, plan: { hoursPerWeek: number, targetDate: string }): Promise<Enrollment> {
    await delay(1000);
    
    // Update Student Mock Data
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (student) {
        if (!student.studyPlans) student.studyPlans = [];
        // Remove existing plan for this course if any
        student.studyPlans = student.studyPlans.filter(sp => sp.courseId !== courseId);
        
        student.studyPlans.push({
            courseId,
            plannedHoursPerWeek: plan.hoursPerWeek,
            targetCompletionDate: plan.targetDate
        });

        if (!student.enrolledCourses.includes(courseId)) {
            student.enrolledCourses.push(courseId);
        }
    }

    // Create Enrollment Record
    const newEnrollment: Enrollment = {
      studentId,
      courseId,
      progress: 0,
      plannedHoursPerWeek: plan.hoursPerWeek,
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: plan.targetDate
    };
    MOCK_ENROLLMENTS.push(newEnrollment);
    return newEnrollment;
  },

  /**
   * Mimics getting scoreboard data from a specific sheet range
   */
  async getLeaderboard(): Promise<Student[]> {
    await delay(500);
    return [...MOCK_STUDENTS].filter(s => s.role === 'student').sort((a, b) => b.points - a.points);
  }
};
