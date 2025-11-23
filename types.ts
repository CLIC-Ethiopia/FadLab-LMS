
export enum CourseCategory {
  Science = 'Science',
  Technology = 'Technology',
  Engineering = 'Engineering',
  Arts = 'Arts',
  Mathematics = 'Mathematics',
  Innovation = 'Innovation',
  Entrepreneurship = 'Entrepreneurship'
}

export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'document' | 'link';
}

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  durationHours: number;
  description: string;
  instructor: string;
  thumbnail: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  resources?: Resource[];
}

export interface StudyPlan {
  courseId: string;
  plannedHoursPerWeek: number;
  targetCompletionDate: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'admin'; // Added role
  enrolledCourses: string[]; // Array of Course IDs
  studyPlans?: StudyPlan[];
  points: number;
  rank: number;
}

export interface Enrollment {
  studentId: string;
  courseId: string;
  progress: number; // 0 to 100
  plannedHoursPerWeek: number;
  startDate: string;
  targetCompletionDate: string;
}

export interface AdminStats {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  coursePerformance: {
    courseId: string;
    title: string;
    enrolledCount: number;
    completedCount: number;
  }[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Student | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}