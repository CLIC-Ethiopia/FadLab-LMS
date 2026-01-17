import { Course, CourseCategory, Student, Enrollment, AdminStats, SocialPost, Project, Lab, Asset, Booking, DigitalAsset } from '../types';

// Use the environment variable if available, otherwise fallback to the hardcoded URL
// This ensures it works on Netlify even if the environment variable isn't set in the dashboard
const API_URL = import.meta.env.VITE_GOOGLE_SHEET_URL || "https://script.google.com/macros/s/AKfycbwSroyQSFa-orqeF2TbkaxmfSs8mzC4edJ-ma4u6JQpt9PrT2ZoA_vUPIL4n-CCUYySDg/exec";

/**
 * Generic API Caller for Google Apps Script
 * Note: We use 'Content-Type': 'text/plain' for POST requests to avoid CORS preflight (OPTIONS) checks
 * which Google Apps Script does not natively support.
 */
const apiCall = async (action: string, method: 'GET' | 'POST' = 'GET', payload?: any) => {
  if (!API_URL) {
    console.error("Google Sheet API URL is missing configuration.");
    throw new Error("API Configuration Missing");
  }

  let url = `${API_URL}`;

  // For GET requests, parameters must be in the URL string
  if (method === 'GET') {
    const params = new URLSearchParams();
    params.append('action', action);
    if (payload) {
      Object.keys(payload).forEach(key => {
        if (payload[key] !== undefined && payload[key] !== null) {
          params.append(key, String(payload[key]));
        }
      });
    }
    url += `?${params.toString()}`;
  }

  const options: RequestInit = {
    method: method,
    headers: {
       // text/plain avoids OPTIONS preflight request which GAS fails on
      'Content-Type': 'text/plain;charset=utf-8', 
    },
  };

  if (method === 'POST') {
    // For POST, we send the action inside the body as per our GAS script logic
    const fullPayload = { action, ...payload };
    options.body = JSON.stringify(fullPayload);
  }

  try {
    const response = await fetch(url, options);
    const text = await response.text();
    
    try {
      const json = JSON.parse(text);
      if (json.error) {
        console.error("GAS API Error:", json.error);
        throw new Error(json.error);
      }
      return json;
    } catch (e) {
      console.warn("API returned invalid JSON:", text);
      throw new Error("Invalid API Response: " + text.substring(0, 50));
    }
  } catch (error) {
    console.error(`API Call Failed [${action}]:`, error);
    throw error;
  }
};

export const sheetService = {
  /**
   * Get all courses
   */
  async getCourses(): Promise<Course[]> {
    const rawData = await apiCall('getCourses');
    
    // Transform raw data (parse resources JSON string)
    return rawData.map((c: any) => ({
      ...c,
      // Parse resources if it's a string, otherwise empty array
      resources: typeof c.resources === 'string' && c.resources.startsWith('[') 
        ? JSON.parse(c.resources) 
        : []
    }));
  },

  /**
   * ADMIN ONLY: Add a new course
   */
  async addCourse(course: Omit<Course, 'id'>): Promise<Course> {
    const response = await apiCall('addCourse', 'POST', course);
    return { ...course, id: response.id };
  },

  /**
   * ADMIN ONLY: Delete a course
   */
  async deleteCourse(courseId: string): Promise<void> {
    await apiCall('deleteCourse', 'POST', { courseId });
  },

  /**
   * ADMIN ONLY: Get Statistics
   */
  async getAdminStats(): Promise<AdminStats> {
    return await apiCall('getAdminStats');
  },

  /**
   * Get Student Profile by Email
   */
  async getStudentProfile(email: string): Promise<Student | null> {
    const student = await apiCall('getStudentProfile', 'GET', { email });
    // API returns null if not found
    return student || null;
  },

  /**
   * Update Student Avatar
   */
  async updateStudentAvatar(studentId: string, avatarUrl: string): Promise<void> {
    await apiCall('updateAvatar', 'POST', { studentId, avatarUrl });
  },

  /**
   * Get Enrollments for a specific student
   */
  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    return await apiCall('getStudentEnrollments', 'GET', { studentId });
  },

  /**
   * Enroll a student in a course
   */
  async enrollStudent(studentId: string, courseId: string, plan: { hoursPerWeek: number, targetDate: string }): Promise<Enrollment> {
    const response = await apiCall('enrollStudent', 'POST', {
      studentId,
      courseId,
      hoursPerWeek: plan.hoursPerWeek,
      targetDate: plan.targetDate
    });
    
    // Return constructed enrollment object (optimistic or derived)
    return {
      enrollmentId: response.enrollmentId,
      studentId,
      courseId,
      progress: 0,
      plannedHoursPerWeek: plan.hoursPerWeek,
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: plan.targetDate
    } as unknown as Enrollment; // Cast to bypass strict check if DB schema differs slightly from Frontend types
  },

  /**
   * Get Leaderboard (Students sorted by points)
   */
  async getLeaderboard(): Promise<Student[]> {
    return await apiCall('getLeaderboard');
  },

  /**
   * Get Social Media Posts
   */
  async getSocialPosts(): Promise<SocialPost[]> {
    return await apiCall('getSocialPosts');
  },

  /**
   * Get all projects
   */
  async getProjects(): Promise<Project[]> {
    return await apiCall('getProjects');
  },

  /**
   * Create a new project
   */
  async addProject(project: Omit<Project, 'id' | 'timestamp'>): Promise<Project> {
    const response = await apiCall('addProject', 'POST', project);
    return {
      ...project,
      id: response.id,
      timestamp: new Date().toISOString().split('T')[0]
    };
  },

  // --- LAB MANAGER SERVICES ---

  async getLabs(): Promise<Lab[]> {
    return await apiCall('getLabs');
  },

  async getAssets(labId: string): Promise<Asset[]> {
    return await apiCall('getAssets', 'GET', { labId });
  },

  async getDigitalAssets(labId: string): Promise<DigitalAsset[]> {
    return await apiCall('getDigitalAssets', 'GET', { labId });
  },

  async getBookings(assetId: string): Promise<Booking[]> {
    return await apiCall('getBookings', 'GET', { assetId });
  },

  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    const response = await apiCall('createBooking', 'POST', booking);
    return { ...booking, id: response.id };
  },

  async reportAssetIssue(assetId: string): Promise<void> {
    await apiCall('reportAssetIssue', 'POST', { assetId });
  }
};