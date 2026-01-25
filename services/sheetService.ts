
import { Course, CourseCategory, Student, Enrollment, AdminStats, SocialPost, Project, Lab, Asset, Booking, DigitalAsset } from '../types';

const API_URL = (import.meta.env && import.meta.env.VITE_GOOGLE_SHEET_API_URL) || '';
const ADMIN_EMAIL = "frehun.demissie@gmail.com";
const ADMIN_PASS = "Assefa2!";

const DEFAULT_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Introduction to STEAM',
    category: CourseCategory.Science,
    durationHours: 15,
    masteryPoints: 150,
    businessOpportunities: 'Educational Consultant, STEM Kit Designer',
    description: 'Foundational concepts of Science, Technology, Engineering, Arts, and Math.',
    instructor: 'Prof. Frehun Adefris',
    thumbnail: 'https://picsum.photos/400/225?random=1',
    level: 'Beginner',
    videoUrl: 'https://www.youtube.com/watch?v=nKIu9yen5nc',
    learningPoints: ['STEAM framework', 'Design thinking'],
    prerequisites: ['Curiosity'],
    curriculum: [{ title: 'S in STEAM', duration: '2h', content: 'Observation' }]
  },
  {
    id: 'c2',
    title: 'Smart Agriculture: Hydroponics',
    category: CourseCategory.Technology,
    durationHours: 30,
    masteryPoints: 300,
    businessOpportunities: 'Vertical Farming SME, Hydroponic Kit Retailer, Organic Juice Production',
    description: 'Learn vertical farming and hydroponic systems for urban settings.',
    instructor: 'Dr. Abyot Redahegn',
    thumbnail: 'https://picsum.photos/400/225?random=2',
    level: 'Intermediate',
    learningPoints: ['Vertical systems', 'Nutrient management']
  },
  {
    id: 'c3',
    title: 'IoT & Industrial Robotics',
    category: CourseCategory.Engineering,
    durationHours: 45,
    masteryPoints: 500,
    businessOpportunities: 'Smart Factory Consulting, Custom Robot Assembly, IoT Maintenance Services',
    description: 'Building smart machines and connected infrastructure.',
    instructor: 'Eng. Nathnael',
    thumbnail: 'https://picsum.photos/400/225?random=3',
    level: 'Advanced'
  }
];

const DEFAULT_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Abebe Bikila',
    email: 'abebe@fadlab.tech',
    avatar: 'https://picsum.photos/100/100?random=10',
    role: 'student',
    enrolledCourses: ['c1', 'c2'],
    points: 1250,
    rank: 1,
    rankTitle: 'Lead Engineer'
  },
  {
    id: 'admin_main',
    name: 'Frehun Demissie',
    email: ADMIN_EMAIL,
    avatar: 'https://ui-avatars.com/api/?name=Frehun+Demissie&background=0D8ABC&color=fff',
    role: 'admin',
    enrolledCourses: [],
    points: 0,
    rank: 0,
    rankTitle: 'Administrator'
  }
];

const DEFAULT_ENROLLMENTS: Enrollment[] = [
  {
    studentId: 's1',
    courseId: 'c1',
    progress: 100,
    plannedHoursPerWeek: 5,
    startDate: '2023-09-01',
    targetCompletionDate: '2023-09-21',
    xpEarned: 150
  },
  {
    studentId: 's1',
    courseId: 'c2',
    progress: 45,
    plannedHoursPerWeek: 3,
    startDate: '2023-10-01',
    targetCompletionDate: '2023-12-10',
    xpEarned: 135
  }
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Solar Auto-Irrigation System',
    description: 'An IoT based system that uses soil moisture sensors.',
    category: CourseCategory.Engineering,
    tags: ['IoT', 'Solar'],
    thumbnail: 'https://picsum.photos/400/225?random=20',
    authorId: 's1',
    authorName: 'Abebe Bikila',
    authorAvatar: 'https://picsum.photos/100/100?random=10',
    likes: 45,
    status: 'Prototype',
    timestamp: '2023-11-10'
  }
];

// Added mock social posts data
const DEFAULT_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'sp1',
    source: 'FadLab',
    sourceUrl: 'https://facebook.com/fadlab',
    authorAvatar: 'https://ui-avatars.com/api/?name=Fad+Lab&background=0D8ABC&color=fff',
    content: 'Big news! Our new IoT workshop starts next week. Register now and join the revolution in industrial automation!',
    image: 'https://picsum.photos/800/600?random=30',
    likes: 124,
    comments: 12,
    shares: 45,
    timestamp: '2 hours ago',
    tags: ['IoT', 'Workshop', 'FadLab']
  },
  {
    id: 'sp2',
    source: 'CLIC Ethiopia',
    sourceUrl: 'https://facebook.com/clicethiopia',
    authorAvatar: 'https://ui-avatars.com/api/?name=CLIC+Ethiopia&background=FFB300&color=fff',
    content: 'The community gathering in Bahir Dar was a huge success. Over 200 STEAM enthusiasts joined to share their prototypes and ideas!',
    image: 'https://picsum.photos/800/600?random=31',
    likes: 342,
    comments: 56,
    shares: 89,
    timestamp: '5 hours ago',
    tags: ['Community', 'CLIC', 'Ethiopia']
  }
];

// Local Storage Helper
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) { return defaultValue; }
};

const saveToStorage = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
};

let MOCK_COURSES = loadFromStorage('fadlab_courses', DEFAULT_COURSES);
let MOCK_STUDENTS = loadFromStorage('fadlab_students', DEFAULT_STUDENTS);
let MOCK_ENROLLMENTS = loadFromStorage('fadlab_enrollments', DEFAULT_ENROLLMENTS);
let MOCK_PROJECTS = loadFromStorage('fadlab_projects', DEFAULT_PROJECTS);
let MOCK_BOOKINGS: Booking[] = loadFromStorage('fadlab_bookings', []);
let MOCK_SOCIAL_POSTS = loadFromStorage('fadlab_social', DEFAULT_SOCIAL_POSTS);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithFallback<T>(action: string, fallback: () => Promise<T>, method: 'GET' | 'POST' = 'GET', payload?: any): Promise<T> {
    if (!API_URL) return fallback();
    try {
        let url = `${API_URL}?action=${action}`;
        const options: RequestInit = { method };
        if (method === 'GET' && payload) {
            const params = new URLSearchParams();
            Object.keys(payload).forEach(key => params.append(key, String(payload[key])));
            url += `&${params.toString()}`;
        } else if (method === 'POST') {
            options.headers = { 'Content-Type': 'text/plain;charset=utf-8' };
            options.body = JSON.stringify({ action, ...payload });
        }
        const response = await fetch(url, options);
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        return (result.data || result) as T;
    } catch (error) {
        console.warn(`API call '${action}' failed.`, error);
        return fallback();
    }
}

export const sheetService = {
  async verifyAdmin(email: string, pass: string): Promise<Student> {
    await delay(800);
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      return MOCK_STUDENTS.find(s => s.email === email && s.role === 'admin') || DEFAULT_STUDENTS[1];
    }
    throw new Error("Invalid Admin Credentials");
  },

  async loginWithSocial(provider: string): Promise<Student> {
    await delay(1000);
    const demoEmail = "student.demo@gmail.com";
    let user = MOCK_STUDENTS.find(s => s.email === demoEmail);
    if (!user) {
      user = {
        id: `s_${Date.now()}`, name: "New Student", email: demoEmail,
        avatar: `https://picsum.photos/100/100?random=${Date.now()}`,
        role: 'student', enrolledCourses: [], points: 0, rank: MOCK_STUDENTS.length + 1, rankTitle: 'Campus Apprentice'
      };
      MOCK_STUDENTS.push(user);
      saveToStorage('fadlab_students', MOCK_STUDENTS);
    }
    return { ...user };
  },

  async getCourses(): Promise<Course[]> {
    return fetchWithFallback<Course[]>('getCourses', async () => MOCK_COURSES);
  },

  async addCourse(course: Omit<Course, 'id'>): Promise<Course> {
    const fallback = async () => {
        const newCourse: Course = { ...course, id: `c${Date.now()}` };
        MOCK_COURSES.push(newCourse);
        saveToStorage('fadlab_courses', MOCK_COURSES);
        return newCourse;
    };
    return fetchWithFallback<Course>('addCourse', fallback, 'POST', course);
  },

  async deleteCourse(courseId: string): Promise<void> {
    const fallback = async () => {
        MOCK_COURSES = MOCK_COURSES.filter(c => c.id !== courseId);
        saveToStorage('fadlab_courses', MOCK_COURSES);
    };
    return fetchWithFallback<void>('deleteCourse', fallback, 'POST', { courseId });
  },

  async getStudentProfile(email: string): Promise<Student | null> {
    return fetchWithFallback<Student | null>('getStudentProfile', async () => {
        const s = MOCK_STUDENTS.find(s => s.email === email);
        return s ? { ...s } : null;
    }, 'GET', { email });
  },

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    return fetchWithFallback<Enrollment[]>('getStudentEnrollments', async () => MOCK_ENROLLMENTS.filter(e => e.studentId === studentId), 'GET', { studentId });
  },

  async enrollStudent(studentId: string, courseId: string, plan: any): Promise<Enrollment> {
    const fallback = async () => {
        const course = MOCK_COURSES.find(c => c.id === courseId);
        const enrollment: Enrollment = {
            studentId, courseId, progress: 0, 
            plannedHoursPerWeek: plan.hoursPerWeek,
            startDate: plan.startDate,
            targetCompletionDate: plan.targetDate,
            xpEarned: 0
        };
        MOCK_ENROLLMENTS.push(enrollment);
        saveToStorage('fadlab_enrollments', MOCK_ENROLLMENTS);
        return enrollment;
    };
    return fetchWithFallback<Enrollment>('enrollStudent', fallback, 'POST', { studentId, courseId, ...plan });
  },

  async updateProgress(studentId: string, courseId: string, progress: number): Promise<Enrollment | null> {
    const fallback = async () => {
      const eIdx = MOCK_ENROLLMENTS.findIndex(e => e.studentId === studentId && e.courseId === courseId);
      if (eIdx === -1) return null;
      
      const course = MOCK_COURSES.find(c => c.id === courseId);
      const mastery = course?.masteryPoints || 100;
      const newXp = Math.floor((progress / 100) * mastery);
      
      MOCK_ENROLLMENTS[eIdx].progress = progress;
      MOCK_ENROLLMENTS[eIdx].xpEarned = newXp;
      
      // Update student total XP
      const sIdx = MOCK_STUDENTS.findIndex(s => s.id === studentId);
      if (sIdx !== -1) {
          const totalXp = MOCK_ENROLLMENTS.filter(e => e.studentId === studentId).reduce((sum, e) => sum + (e.xpEarned || 0), 0);
          MOCK_STUDENTS[sIdx].points = totalXp;
          
          if (totalXp > 2000) MOCK_STUDENTS[sIdx].rankTitle = "Master Innovator";
          else if (totalXp > 1000) MOCK_STUDENTS[sIdx].rankTitle = "Lead Engineer";
          else if (totalXp > 500) MOCK_STUDENTS[sIdx].rankTitle = "Industrial Technician";
          else MOCK_STUDENTS[sIdx].rankTitle = "Campus Apprentice";
          
          saveToStorage('fadlab_students', MOCK_STUDENTS);
      }
      
      saveToStorage('fadlab_enrollments', MOCK_ENROLLMENTS);
      return MOCK_ENROLLMENTS[eIdx];
    };
    return fetchWithFallback<Enrollment | null>('updateProgress', fallback, 'POST', { studentId, courseId, progress });
  },

  async getLeaderboard(): Promise<Student[]> {
    return fetchWithFallback<Student[]>('getLeaderboard', async () => [...MOCK_STUDENTS].sort((a, b) => b.points - a.points));
  },

  async getProjects(): Promise<Project[]> {
    return fetchWithFallback<Project[]>('getProjects', async () => MOCK_PROJECTS);
  },

  async addProject(project: any): Promise<Project> {
    const fallback = async () => {
      const newProject = { ...project, id: `p${Date.now()}`, timestamp: new Date().toISOString().split('T')[0] };
      MOCK_PROJECTS.unshift(newProject);
      saveToStorage('fadlab_projects', MOCK_PROJECTS);
      return newProject;
    };
    return fetchWithFallback<Project>('addProject', fallback, 'POST', project);
  },

  async likeProject(projectId: string): Promise<void> {
    const fallback = async () => {
      const p = MOCK_PROJECTS.find(p => p.id === projectId);
      if (p) p.likes += 1;
      saveToStorage('fadlab_projects', MOCK_PROJECTS);
    };
    return fetchWithFallback<void>('likeProject', fallback, 'POST', { projectId });
  },

  async updateStudentAvatar(studentId: string, avatarUrl: string): Promise<void> {
    const fallback = async () => {
        const s = MOCK_STUDENTS.find(s => s.id === studentId);
        if (s) s.avatar = avatarUrl;
        saveToStorage('fadlab_students', MOCK_STUDENTS);
    };
    return fetchWithFallback<void>('updateAvatar', fallback, 'POST', { studentId, avatarUrl });
  },

  async getAdminStats(): Promise<AdminStats> {
    return fetchWithFallback<AdminStats>('getAdminStats', async () => ({
        totalCourses: MOCK_COURSES.length,
        totalStudents: MOCK_STUDENTS.length,
        totalEnrollments: MOCK_ENROLLMENTS.length,
        coursePerformance: []
    }));
  },

  // Added missing getSocialPosts method to resolve SocialHub error
  async getSocialPosts(): Promise<SocialPost[]> {
    return fetchWithFallback<SocialPost[]>('getSocialPosts', async () => MOCK_SOCIAL_POSTS);
  },

  async getLabs(): Promise<Lab[]> { return []; },
  async getAssets(labId: string): Promise<Asset[]> { return []; },
  async getDigitalAssets(labId: string): Promise<DigitalAsset[]> { return []; },
  async createBooking(booking: any): Promise<Booking> { throw new Error('Not implemented'); },
  async reportAssetIssue(assetId: string): Promise<void> { }
};
