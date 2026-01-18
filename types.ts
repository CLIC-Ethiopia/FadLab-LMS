

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
  startDate: string; // Added start date
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
  projectIds?: string[]; // Added: Array of Project IDs authored by student
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

export interface SocialPost {
  id: string;
  source: 'CLIC Ethiopia' | 'FadLab';
  sourceUrl: string; // URL to the FB page
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
  timestamp: string;
}

// --- LAB MANAGER TYPES ---

export type LabType = 'Fabrication' | 'Digital' | 'Field' | 'Business';

export interface Consumable {
  name: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  unit: string; // e.g., "Spools", "Sheets"
}

export interface Lab {
  id: string;
  name: string;
  type: LabType;
  description: string;
  icon: string; // Lucide icon name or image url
  capacity: number;
  location: string;
  consumables?: Consumable[]; // New: Track materials
}

export interface Asset {
  id: string;
  labId: string;
  name: string;
  model: string;
  subCategory: string; // New: e.g., "Printer", "Sensor", "Software"
  status: 'Available' | 'In Use' | 'Maintenance';
  certificationRequired?: string; // Course ID required to use this
  image: string;
  specs?: string[];
}

export interface Booking {
  id: string;
  assetId: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:00
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