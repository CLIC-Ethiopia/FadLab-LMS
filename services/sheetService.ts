import { Course, CourseCategory, Student, Enrollment, AdminStats, SocialPost, Project, Lab, Asset, Booking, DigitalAsset } from '../types';

// Use the environment variable if available, otherwise fallback to the hardcoded URL
const API_URL = import.meta.env.VITE_GOOGLE_SHEET_URL || "https://script.google.com/macros/s/AKfycbwSroyQSFa-orqeF2TbkaxmfSs8mzC4edJ-ma4u6JQpt9PrT2ZoA_vUPIL4n-CCUYySDg/exec";

// --- MOCK DATA FOR FALLBACK ---
const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Introduction to Robotics & IoT',
    category: CourseCategory.Engineering,
    durationHours: 24,
    description: 'Learn the fundamentals of building autonomous robots and connecting them to the internet. Includes hands-on projects with Arduino and Raspberry Pi.',
    instructor: 'Dr. Frehun',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    level: 'Beginner',
    resources: [{ title: 'Arduino Setup Guide', url: 'https://arduino.cc', type: 'document' }]
  },
  {
    id: 'c2',
    title: 'Sustainable Energy Systems',
    category: CourseCategory.Science,
    durationHours: 18,
    description: 'Explore renewable energy technologies including solar, wind, and hydro power. Design your own micro-grid prototype.',
    instructor: 'Prof. Sarah',
    thumbnail: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800',
    level: 'Intermediate',
    resources: []
  },
  {
    id: 'c3',
    title: 'Digital Fabrication 101',
    category: CourseCategory.Technology,
    durationHours: 30,
    description: 'Master the tools of the FabLab: 3D Printing, Laser Cutting, and CNC routing. Go from digital design to physical object.',
    instructor: 'Lab Manager John',
    thumbnail: 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?auto=format&fit=crop&q=80&w=800',
    level: 'Beginner',
    resources: []
  },
  {
    id: 'c4',
    title: 'Business for Innovators',
    category: CourseCategory.Entrepreneurship,
    durationHours: 12,
    description: 'Turn your prototype into a product. Learn about business models, pitching, and intellectual property.',
    instructor: 'Ms. Almaz',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
    level: 'Advanced',
    resources: []
  }
];

const MOCK_STUDENT: Student = {
  id: 's1',
  name: 'Abebe Bikila',
  email: 'abebe@fadlab.tech',
  avatar: 'https://ui-avatars.com/api/?name=Abebe+Bikila&background=0D8ABC&color=fff',
  role: 'student',
  enrolledCourses: ['c1'],
  points: 450,
  rank: 12,
  studyPlans: [
    { courseId: 'c1', plannedHoursPerWeek: 5, targetCompletionDate: new Date(Date.now() + 86400000 * 30).toISOString() }
  ]
};

const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    studentId: 's1',
    courseId: 'c1',
    progress: 35,
    plannedHoursPerWeek: 5,
    startDate: '2024-01-01',
    targetCompletionDate: '2024-03-01'
  }
];

const MOCK_LEADERBOARD: Student[] = [
  { ...MOCK_STUDENT, id: 's2', name: 'Sara Tadesse', points: 1200, rank: 1 },
  { ...MOCK_STUDENT, id: 's3', name: 'Dawit Kebede', points: 980, rank: 2 },
  { ...MOCK_STUDENT, id: 's4', name: 'Tigist Haile', points: 850, rank: 3 },
  { ...MOCK_STUDENT, id: 's5', name: 'Mohammed Ali', points: 720, rank: 4 },
  { ...MOCK_STUDENT, id: 's1', name: 'Abebe Bikila', points: 450, rank: 12 }
];

const MOCK_LABS: Lab[] = [
  {
    id: 'l1',
    name: 'Main Fabrication Lab',
    type: 'Fabrication',
    description: 'Equipped with heavy machinery including CNC routers, laser cutters, and welding stations.',
    icon: 'Hammer',
    capacity: 20,
    location: 'Building A, Room 101',
    consumables: [
      { name: 'PLA Filament (White)', status: 'In Stock', unit: 'Spools' },
      { name: 'Plywood (4mm)', status: 'Low Stock', unit: 'Sheets' }
    ]
  },
  {
    id: 'l2',
    name: 'Digital Design Studio',
    type: 'Digital',
    description: 'High-performance workstations for CAD, rendering, and circuit design.',
    icon: 'Monitor',
    capacity: 15,
    location: 'Building A, Room 204'
  }
];

const MOCK_ASSETS: Asset[] = [
  {
    id: 'a1',
    labId: 'l1',
    name: 'Prusa i3 MK3S+',
    model: '3D Printer',
    subCategory: 'Rapid Prototyping',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1623932880735-e6a32338fb24?auto=format&fit=crop&q=80&w=400',
    specs: ['Build Vol: 25x21x21cm', 'Layer Height: 0.05mm', 'Nozzle: 0.4mm']
  },
  {
    id: 'a2',
    labId: 'l1',
    name: 'Epilog Laser Fusion',
    model: 'Laser Cutter',
    subCategory: 'Cutting',
    status: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=400',
    certificationRequired: 'c3',
    specs: ['60 Watt CO2', 'Work Area: 24x12 in']
  }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Smart Irrigation System',
    description: 'An IoT based water pump that detects soil moisture and waters plants automatically.',
    category: CourseCategory.Technology,
    tags: ['IoT', 'Arduino', 'Agriculture'],
    thumbnail: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=400',
    authorId: 's2',
    authorName: 'Sara Tadesse',
    authorAvatar: 'https://ui-avatars.com/api/?name=Sara+T',
    likes: 24,
    status: 'Prototype',
    timestamp: '2024-02-15'
  }
];

const MOCK_POSTS: SocialPost[] = [
  {
    id: 'sp1',
    source: 'FadLab',
    sourceUrl: '#',
    authorAvatar: 'https://ui-avatars.com/api/?name=FadLab&background=000&color=fff',
    content: '🚀 The new semester has officially started! Check out the updated course catalog for new additions in Robotics and AI.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    likes: 45,
    comments: 12,
    shares: 5,
    timestamp: '2 hours ago',
    tags: ['NewSemester', 'Robotics']
  },
  {
    id: 'sp2',
    source: 'CLIC Ethiopia',
    sourceUrl: '#',
    authorAvatar: 'https://ui-avatars.com/api/?name=CLIC&background=facc15&color=000',
    content: 'Great turnout at the Innovation Fair yesterday! So many inspiring projects from our students.',
    likes: 89,
    comments: 24,
    shares: 15,
    timestamp: '1 day ago',
    tags: ['Innovation', 'Community']
  }
];

// --- API IMPLEMENTATION ---

const apiCall = async (action: string, method: 'GET' | 'POST' = 'GET', payload?: any) => {
  if (!API_URL) {
    console.warn("API URL missing, returning mock data.");
    throw new Error("MOCK_FALLBACK");
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
      'Content-Type': 'text/plain;charset=utf-8', 
    },
  };

  if (method === 'POST') {
    const fullPayload = { action, ...payload };
    options.body = JSON.stringify(fullPayload);
  }

  try {
    const response = await fetch(url, options);
    const text = await response.text();
    
    // Check if the response is HTML (often happens with GAS errors)
    if (text.trim().startsWith('<')) {
       throw new Error("Received HTML instead of JSON");
    }

    try {
      const json = JSON.parse(text);
      if (json.error) {
        throw new Error(json.error);
      }
      return json;
    } catch (e) {
      throw new Error("Invalid JSON Response");
    }
  } catch (error) {
    // console.error(`API Call Failed [${action}] - Falling back to mock data`);
    throw new Error("MOCK_FALLBACK");
  }
};

export const sheetService = {
  async getCourses(): Promise<Course[]> {
    try {
      const rawData = await apiCall('getCourses');
      if (!Array.isArray(rawData)) throw new Error("Invalid Data");
      
      return rawData.map((c: any) => ({
        ...c,
        resources: typeof c.resources === 'string' && c.resources.startsWith('[') 
          ? JSON.parse(c.resources) 
          : []
      }));
    } catch (e) {
      return MOCK_COURSES;
    }
  },

  async addCourse(course: Omit<Course, 'id'>): Promise<Course> {
    try {
      const response = await apiCall('addCourse', 'POST', course);
      return { ...course, id: response.id };
    } catch (e) {
      return { ...course, id: `mock_${Date.now()}` };
    }
  },

  async deleteCourse(courseId: string): Promise<void> {
    try {
      await apiCall('deleteCourse', 'POST', { courseId });
    } catch (e) {
      // Mock success
    }
  },

  async getAdminStats(): Promise<AdminStats> {
    try {
      return await apiCall('getAdminStats');
    } catch (e) {
      return {
        totalCourses: MOCK_COURSES.length,
        totalStudents: 150,
        totalEnrollments: 320,
        coursePerformance: MOCK_COURSES.map(c => ({
          courseId: c.id,
          title: c.title,
          enrolledCount: Math.floor(Math.random() * 50),
          completedCount: Math.floor(Math.random() * 20)
        }))
      };
    }
  },

  async getStudentProfile(email: string): Promise<Student | null> {
    try {
      const student = await apiCall('getStudentProfile', 'GET', { email });
      if (!student) throw new Error("Not Found");
      return student;
    } catch (e) {
      // Return mock student for demo/fallback purposes if it matches the demo email
      // Or if generic failure, return mock to allow login
      return { ...MOCK_STUDENT, email: email };
    }
  },

  async updateStudentAvatar(studentId: string, avatarUrl: string): Promise<void> {
    try {
      await apiCall('updateAvatar', 'POST', { studentId, avatarUrl });
    } catch (e) {
      // Mock success
    }
  },

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    try {
      const data = await apiCall('getStudentEnrollments', 'GET', { studentId });
      if (!Array.isArray(data)) throw new Error("Invalid Data");
      return data;
    } catch (e) {
      return MOCK_ENROLLMENTS;
    }
  },

  async enrollStudent(studentId: string, courseId: string, plan: { hoursPerWeek: number, targetDate: string }): Promise<Enrollment> {
    try {
      const response = await apiCall('enrollStudent', 'POST', {
        studentId,
        courseId,
        hoursPerWeek: plan.hoursPerWeek,
        targetDate: plan.targetDate
      });
      return {
        enrollmentId: response.enrollmentId,
        studentId,
        courseId,
        progress: 0,
        plannedHoursPerWeek: plan.hoursPerWeek,
        startDate: new Date().toISOString().split('T')[0],
        targetCompletionDate: plan.targetDate
      } as unknown as Enrollment;
    } catch (e) {
      return {
        studentId,
        courseId,
        progress: 0,
        plannedHoursPerWeek: plan.hoursPerWeek,
        startDate: new Date().toISOString().split('T')[0],
        targetCompletionDate: plan.targetDate
      } as unknown as Enrollment;
    }
  },

  async getLeaderboard(): Promise<Student[]> {
    try {
      const data = await apiCall('getLeaderboard');
      if (!Array.isArray(data)) throw new Error("Invalid Data");
      return data;
    } catch (e) {
      return MOCK_LEADERBOARD;
    }
  },

  async getSocialPosts(): Promise<SocialPost[]> {
    try {
      const data = await apiCall('getSocialPosts');
      if (!Array.isArray(data)) throw new Error("Invalid Data");
      return data;
    } catch (e) {
      return MOCK_POSTS;
    }
  },

  async getProjects(): Promise<Project[]> {
    try {
      const data = await apiCall('getProjects');
      if (!Array.isArray(data)) throw new Error("Invalid Data");
      return data;
    } catch (e) {
      return MOCK_PROJECTS;
    }
  },

  async addProject(project: Omit<Project, 'id' | 'timestamp'>): Promise<Project> {
    try {
      const response = await apiCall('addProject', 'POST', project);
      return { ...project, id: response.id, timestamp: new Date().toISOString() };
    } catch (e) {
      return { ...project, id: `mock_p_${Date.now()}`, timestamp: new Date().toISOString() };
    }
  },

  async getLabs(): Promise<Lab[]> {
    try {
      const data = await apiCall('getLabs');
      if (!Array.isArray(data)) throw new Error("Invalid Data");
      return data;
    } catch (e) {
      return MOCK_LABS;
    }
  },

  async getAssets(labId: string): Promise<Asset[]> {
    try {
      const data = await apiCall('getAssets', 'GET', { labId });
      if (!Array.isArray(data)) throw new Error("Invalid Data");
      return data;
    } catch (e) {
      return MOCK_ASSETS.filter(a => a.labId === labId);
    }
  },

  async getDigitalAssets(labId: string): Promise<DigitalAsset[]> {
    try {
      const data = await apiCall('getDigitalAssets', 'GET', { labId });
      if (!Array.isArray(data)) throw new Error("Invalid Data");
      return data;
    } catch (e) {
      // Mock empty for now
      return [];
    }
  },

  async getBookings(assetId: string): Promise<Booking[]> {
    try {
      const data = await apiCall('getBookings', 'GET', { assetId });
      if (!Array.isArray(data)) throw new Error("Invalid Data");
      return data;
    } catch (e) {
      return [];
    }
  },

  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    try {
      const response = await apiCall('createBooking', 'POST', booking);
      return { ...booking, id: response.id };
    } catch (e) {
      return { ...booking, id: `mock_b_${Date.now()}` };
    }
  },

  async reportAssetIssue(assetId: string): Promise<void> {
    try {
      await apiCall('reportAssetIssue', 'POST', { assetId });
    } catch (e) {
      // Mock success
    }
  }
};
