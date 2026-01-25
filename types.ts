
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

export interface CourseModule {
  title: string;
  duration: string;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  durationHours: number;
  masteryPoints: number; 
  businessOpportunities?: string; // Comma separated list for SME ideas
  description: string;
  instructor: string;
  thumbnail: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  videoUrl?: string;
  resources?: Resource[];
  learningPoints?: string[];
  prerequisites?: string[];
  curriculum?: CourseModule[];
}

export interface StudyPlan {
  courseId: string;
  plannedHoursPerWeek: number;
  startDate: string; 
  targetCompletionDate: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'admin';
  enrolledCourses: string[]; 
  studyPlans?: StudyPlan[];
  projectIds?: string[];
  points: number; // Knowledge XP
  rank: number;
  rankTitle?: string; // e.g. "Master Innovator"
}

export interface Enrollment {
  studentId: string;
  courseId: string;
  progress: number;
  plannedHoursPerWeek: number;
  startDate: string;
  targetCompletionDate: string;
  xpEarned?: number; // Tracks XP awarded from this specific course
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

export interface SocialPost {
  id: string;
  source: 'CLIC Ethiopia' | 'FadLab';
  sourceUrl: string;
  authorAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  tags: string[];
  thumbnail: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  likes: number;
  status: 'Idea' | 'Prototype' | 'Launched';
  githubUrl?: string;
  demoUrl?: string;
  blogUrl?: string; 
  docsUrl?: string; 
  timestamp: string;
}

// --- LAB MANAGER TYPES ---

export type LabType = 'Fabrication' | 'Digital' | 'Field' | 'Business';

export interface Consumable {
  name: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  unit: string;
}

export interface Lab {
  id: string;
  name: string;
  type: LabType;
  description: string;
  icon: string;
  capacity: number;
  location: string;
  consumables?: Consumable[];
}

export interface Asset {
  id: string;
  labId: string;
  name: string;
  model: string;
  subCategory: string;
  status: 'Available' | 'In Use' | 'Maintenance';
  certificationRequired?: string;
  image: string;
  specs?: string[];
}

export interface Booking {
  id: string;
  assetId: string;
  studentId: string;
  date: string;
  startTime: string;
  durationHours: number;
  purpose: string;
}

export interface DigitalAsset {
  id: string;
  labId: string;
  title: string;
  type: 'Model' | 'Code' | 'Texture' | 'Template' | 'Dataset';
  description: string;
  url: string;
  authorName: string;
  downloads: number;
  size: string;
}
