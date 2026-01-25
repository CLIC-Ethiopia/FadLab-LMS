
import { Course, CourseCategory, Student, Enrollment, AdminStats, SocialPost, Project, Lab, Asset, Booking, DigitalAsset } from '../types';

const API_URL = (import.meta.env && import.meta.env.VITE_GOOGLE_SHEET_API_URL) || '';
const ADMIN_EMAIL = "frehun.demissie@gmail.com";
const ADMIN_PASS = "Assefa2!";

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

let MOCK_COURSES: Course[] = loadFromStorage('fadlab_courses', []);
let MOCK_STUDENTS: Student[] = loadFromStorage('fadlab_students', []);
let MOCK_ENROLLMENTS: Enrollment[] = loadFromStorage('fadlab_enrollments', []);
let MOCK_PROJECTS: Project[] = loadFromStorage('fadlab_projects', []);

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
      const admin = await this.getStudentProfile(email);
      if (admin) return admin;
      return { id: 'admin_sys', name: 'Frehun Demissie', email, role: 'admin', avatar: '', enrolledCourses: [], points: 0, rank: 0 };
    }
    throw new Error("Invalid Admin Credentials");
  },

  async loginWithSocial(provider: string): Promise<Student> {
    await delay(1000);
    const demoEmail = "student.demo@gmail.com";
    let user = await this.getStudentProfile(demoEmail);
    if (!user) {
      user = {
        id: `s_${Date.now()}`, name: "New Student", email: demoEmail,
        avatar: `https://picsum.photos/100/100?random=${Date.now()}`,
        role: 'student', enrolledCourses: [], points: 0, rank: 0, rankTitle: 'Campus Apprentice'
      };
      await fetchWithFallback('registerStudent', async () => {
        MOCK_STUDENTS.push(user!);
        saveToStorage('fadlab_students', MOCK_STUDENTS);
        return user!;
      }, 'POST', user);
    }
    return user;
  },

  async getCourses(): Promise<Course[]> {
    return fetchWithFallback<Course[]>('getCourses', async () => MOCK_COURSES);
  },

  async getStudentProfile(email: string): Promise<Student | null> {
    const profile = await fetchWithFallback<any | null>('getStudentProfile', async () => {
        const s = MOCK_STUDENTS.find(s => s.email === email);
        return s ? { ...s } : null;
    }, 'GET', { email });

    if (profile) {
      // Map 'knowledgeXP' to 'points' if backend uses the new name
      profile.points = Number(profile.knowledgeXP ?? profile.points ?? 0);
      profile.rankTitle = profile.rankTitle ?? 'Campus Apprentice';
    }
    return profile;
  },

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    const data = await fetchWithFallback<any[]>('getStudentEnrollments', async () => MOCK_ENROLLMENTS.filter(e => e.studentId === studentId), 'GET', { studentId });
    return data.map(e => ({
      ...e,
      progress: Number(e.progress || 0),
      plannedHoursPerWeek: Number(e.hoursPerWeek ?? e.plannedHoursPerWeek ?? 5),
      targetCompletionDate: e.targetDate ?? e.targetCompletionDate ?? '',
      xpEarned: Number(e.xpEarned ?? 0)
    }));
  },

  async enrollStudent(studentId: string, courseId: string, plan: any): Promise<Enrollment> {
    return fetchWithFallback<Enrollment>('enrollStudent', async () => {
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
    }, 'POST', { studentId, courseId, ...plan });
  },

  async updateProgress(studentId: string, courseId: string, progress: number): Promise<Enrollment | null> {
    const fallback = async () => {
      const eIdx = MOCK_ENROLLMENTS.findIndex(e => e.studentId === studentId && e.courseId === courseId);
      if (eIdx === -1) return null;
      MOCK_ENROLLMENTS[eIdx].progress = progress;
      saveToStorage('fadlab_enrollments', MOCK_ENROLLMENTS);
      return MOCK_ENROLLMENTS[eIdx];
    };
    return fetchWithFallback<Enrollment | null>('updateProgress', fallback, 'POST', { studentId, courseId, progress });
  },

  async getLeaderboard(): Promise<Student[]> {
    const data = await fetchWithFallback<any[]>('getLeaderboard', async () => [...MOCK_STUDENTS].sort((a, b) => (b.points || 0) - (a.points || 0)));
    return data.map(s => ({
      ...s,
      points: Number(s.knowledgeXP ?? s.points ?? 0),
      rankTitle: s.rankTitle ?? 'Campus Apprentice'
    }));
  },

  async getProjects(): Promise<Project[]> {
    return fetchWithFallback<Project[]>('getProjects', async () => MOCK_PROJECTS);
  },

  async addProject(project: Omit<Project, 'id' | 'timestamp'>): Promise<Project> {
    return fetchWithFallback<Project>('addProject', async () => {
        const newProject: Project = { 
            ...project, 
            id: `p${Date.now()}`,
            timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
        MOCK_PROJECTS.push(newProject);
        saveToStorage('fadlab_projects', MOCK_PROJECTS);
        return newProject;
    }, 'POST', project);
  },

  async likeProject(projectId: string): Promise<void> {
    const fallback = async () => {
      const p = MOCK_PROJECTS.find(p => p.id === projectId);
      if (p) p.likes = (p.likes || 0) + 1;
      saveToStorage('fadlab_projects', MOCK_PROJECTS);
    };
    return fetchWithFallback<void>('likeProject', fallback, 'POST', { projectId });
  },

  async addCourse(course: Omit<Course, 'id'>): Promise<Course> {
    return fetchWithFallback<Course>('addCourse', async () => {
        const newCourse: Course = { ...course, id: `c${Date.now()}` };
        MOCK_COURSES.push(newCourse);
        saveToStorage('fadlab_courses', MOCK_COURSES);
        return newCourse;
    }, 'POST', course);
  },

  async deleteCourse(courseId: string): Promise<void> {
    return fetchWithFallback<void>('deleteCourse', async () => {
        MOCK_COURSES = MOCK_COURSES.filter(c => c.id !== courseId);
        saveToStorage('fadlab_courses', MOCK_COURSES);
    }, 'POST', { courseId });
  },

  async getAdminStats(): Promise<AdminStats> {
    return fetchWithFallback<AdminStats>('getAdminStats', async () => ({
        totalCourses: MOCK_COURSES.length,
        totalStudents: MOCK_STUDENTS.length,
        totalEnrollments: MOCK_ENROLLMENTS.length,
        coursePerformance: []
    }));
  },

  async getSocialPosts(): Promise<SocialPost[]> {
    return fetchWithFallback<SocialPost[]>('getSocialPosts', async () => []);
  },

  async updateStudentAvatar(studentId: string, avatarUrl: string): Promise<void> {
    return fetchWithFallback<void>('updateAvatar', async () => {
        const s = MOCK_STUDENTS.find(s => s.id === studentId);
        if (s) s.avatar = avatarUrl;
        saveToStorage('fadlab_students', MOCK_STUDENTS);
    }, 'POST', { studentId, avatarUrl });
  },

  async getLabs(): Promise<Lab[]> { return fetchWithFallback<Lab[]>('getLabs', async () => []); },
  async getAssets(labId: string): Promise<Asset[]> { return fetchWithFallback<Asset[]>('getAssets', async () => [], 'GET', { labId }); },
  async getDigitalAssets(labId: string): Promise<DigitalAsset[]> { return fetchWithFallback<DigitalAsset[]>('getDigitalAssets', async () => [], 'GET', { labId }); },
  async createBooking(booking: any): Promise<Booking> { return fetchWithFallback<Booking>('createBooking', async () => ({...booking, id: 'b1'}), 'POST', booking); },
  async reportAssetIssue(assetId: string): Promise<void> { await fetchWithFallback('reportAssetIssue', async () => {}, 'POST', { assetId }); }
};
