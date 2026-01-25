
import { Course, CourseCategory, Student, Enrollment, AdminStats, SocialPost, Project, Lab, Asset, Booking, DigitalAsset } from '../types';

/**
 * SERVICE CONFIGURATION
 * ---------------------
 * We use a "Hybrid" approach:
 * 1. Try to connect to the Google Sheet API (if VITE_GOOGLE_SHEET_API_URL is set).
 * 2. If the API fails or is not configured, fall back to local MOCK_DATA.
 * 3. NEW: We persist MOCK_DATA to localStorage to act as a client-side database.
 */
// Defensive check for import.meta.env to avoid runtime errors in some environments
const API_URL = (import.meta.env && import.meta.env.VITE_GOOGLE_SHEET_API_URL) || '';

// Admin Credentials
const ADMIN_EMAIL = "frehun.demissie@gmail.com";
const ADMIN_PASS = "Assefa2!";

// --- DEFAULT DATA (Used if localStorage is empty) ---

const DEFAULT_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Introduction to STEAM',
    category: CourseCategory.Science,
    durationHours: 15,
    description: 'Foundational concepts of Science, Technology, Engineering, Arts, and Math.',
    instructor: 'Prof. Frehun Adefris',
    thumbnail: 'https://picsum.photos/400/225?random=1',
    level: 'Beginner',
    videoUrl: 'https://www.youtube.com/watch?v=nKIu9yen5nc',
    learningPoints: [
      'Understand the interdisciplinary nature of STEAM',
      'Apply scientific methods to daily problem solving',
      'Design thinking basics',
      'Introduction to local innovation contexts'
    ],
    prerequisites: [
      'No prior experience required',
      'Curiosity about how things work'
    ],
    curriculum: [
      { title: 'The S in STEAM', duration: '2h', content: 'Exploring the natural world through observation.' },
      { title: 'Technology & Tools', duration: '3h', content: 'Digital literacy basics.' },
      { title: 'Engineering Design Process', duration: '4h', content: 'From idea to prototype.' }
    ],
    resources: [
      { title: 'STEAM Education Framework PDF', url: '/docs/steam_framework.pdf', type: 'document' },
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
    videoUrl: '',
    learningPoints: [
      'Build a vertical farm system',
      'Manage nutrient solutions',
      'IoT sensors for agriculture'
    ],
    prerequisites: [
      'Basic biology knowledge',
      'Introduction to STEAM course recommended'
    ],
    curriculum: [
       { title: 'Plant Biology Basics', duration: '5h', content: 'Understanding root systems.' },
       { title: 'Hydroponic Systems', duration: '10h', content: 'NFT, DWC, and Aeroponics.' }
    ],
    resources: [
      { title: 'Hydroponic Systems Diagram', url: '/images/hydro_diagram.png', type: 'document' },
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
      { title: 'Sensor Integration Manual', url: '/docs/sensor_manual.pdf', type: 'document' }
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
      { title: 'Business Model Canvas Template', url: '/google_drive/Templates/BMC_v2.pdf', type: 'document' },
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

const DEFAULT_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Abebe Bikila',
    email: 'abebe@fadlab.tech',
    avatar: 'https://picsum.photos/100/100?random=10',
    role: 'student',
    enrolledCourses: ['c1', 'c2'],
    studyPlans: [
      { courseId: 'c1', plannedHoursPerWeek: 5, startDate: '2023-09-01', targetCompletionDate: '2023-09-21' },
      { courseId: 'c2', plannedHoursPerWeek: 3, startDate: '2023-10-01', targetCompletionDate: '2023-12-10' }
    ],
    projectIds: ['p1'],
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
      { courseId: 'c4', plannedHoursPerWeek: 4, startDate: '2023-10-15', targetCompletionDate: '2023-11-15' }
    ],
    projectIds: [],
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
    projectIds: ['p2'],
    points: 850,
    rank: 3
  },
  {
    id: 'admin_main',
    name: 'Frehun Demissie',
    email: ADMIN_EMAIL,
    avatar: 'https://ui-avatars.com/api/?name=Frehun+Demissie&background=0D8ABC&color=fff',
    role: 'admin',
    enrolledCourses: [],
    points: 0,
    rank: 0
  }
];

const DEFAULT_ENROLLMENTS: Enrollment[] = [
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

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Solar Auto-Irrigation System',
    description: 'An IoT based system that uses soil moisture sensors to automatically water crops using solar power. This project aims to assist small-holder farmers in rural Ethiopia by reducing water waste and labor.',
    category: CourseCategory.Engineering,
    tags: ['IoT', 'Solar', 'AgriTech', 'Arduino'],
    thumbnail: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e10?q=80&w=800&auto=format&fit=crop',
    authorId: 's1',
    authorName: 'Abebe Bikila',
    authorAvatar: 'https://picsum.photos/100/100?random=10',
    likes: 45,
    status: 'Prototype',
    githubUrl: 'https://github.com/abebe/solar-irrigation',
    docsUrl: 'https://github.com/abebe/solar-irrigation/wiki',
    timestamp: '2023-11-10'
  },
  {
    id: 'p2',
    title: 'Biodegradable Plastic from Injera',
    description: 'A scientific experiment exploring the polymer properties of Teff starch to create sustainable, biodegradable packaging materials. This study documents the chemical process and tensile strength testing results.',
    category: CourseCategory.Science,
    tags: ['Chemistry', 'Sustainability', 'Material Science'],
    thumbnail: 'https://images.unsplash.com/photo-1532634993-15f421e42ec0?q=80&w=800&auto=format&fit=crop',
    authorId: 's3',
    authorName: 'Haile Gebrselassie',
    authorAvatar: 'https://picsum.photos/100/100?random=12',
    likes: 32,
    status: 'Idea',
    blogUrl: 'https://medium.com/@haile/teff-plastic',
    timestamp: '2023-11-15'
  },
  {
    id: 'p3',
    title: 'Amharic OCR Scanner App',
    description: 'A mobile application utilizing Tesseract OCR trained on Amharic script datasets. The app allows users to scan paper documents and convert them into editable digital text files, facilitating digitization of old records.',
    category: CourseCategory.Technology,
    tags: ['AI', 'Mobile Dev', 'Computer Vision', 'Python'],
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop',
    authorId: 's4',
    authorName: 'Bethelhem Dessie',
    authorAvatar: 'https://ui-avatars.com/api/?name=Bethelhem+Dessie&background=random',
    likes: 89,
    status: 'Launched',
    githubUrl: 'https://github.com/beth/amharic-ocr',
    demoUrl: 'https://play.google.com/store/apps',
    blogUrl: 'https://dev.to/beth/ocr-amharic',
    timestamp: '2023-10-05'
  },
  {
    id: 'p4',
    title: 'Ethio-Pattern Digital Weaving',
    description: 'A digital art project that uses algorithmic design to generate new patterns inspired by traditional Ethiopian Tibeb. These patterns are then exported for use on modern Jacquard looms.',
    category: CourseCategory.Arts,
    tags: ['Generative Art', 'Textile', 'Culture', 'Design'],
    thumbnail: 'https://images.unsplash.com/photo-1523920716677-4847043cb837?q=80&w=800&auto=format&fit=crop',
    authorId: 's5',
    authorName: 'Sarah Mohammed',
    authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+M&background=random',
    likes: 56,
    status: 'Prototype',
    timestamp: '2023-11-20'
  },
  {
    id: 'p5',
    title: 'Addis Traffic Optimization Model',
    description: 'A mathematical model using graph theory and queuing theory to optimize traffic light timing at major intersections in Addis Ababa. Simulations show a potential 15% reduction in congestion.',
    category: CourseCategory.Mathematics,
    tags: ['Data Science', 'Simulation', 'Urban Planning', 'Statistics'],
    thumbnail: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=800&auto=format&fit=crop',
    authorId: 's6',
    authorName: 'Dawit Kebede',
    authorAvatar: 'https://ui-avatars.com/api/?name=Dawit+K&background=random',
    likes: 28,
    status: 'Idea',
    docsUrl: 'https://arxiv.org/abs/example',
    timestamp: '2023-11-01'
  },
  {
    id: 'p6',
    title: 'Low-Cost Modular Housing',
    description: 'An innovative architectural design for rapid-deployment housing using locally sourced bamboo and interlocking compressed earth blocks (ICEB). Designed for scalability and affordability.',
    category: CourseCategory.Innovation,
    tags: ['Architecture', 'Sustainable Housing', '3D Modeling'],
    thumbnail: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop',
    authorId: 's2',
    authorName: 'Tirunesh Dibaba',
    authorAvatar: 'https://picsum.photos/100/100?random=11',
    likes: 67,
    status: 'Prototype',
    timestamp: '2023-12-01'
  },
  {
    id: 'p7',
    title: 'CoffeeChain: Fair Trade Tracker',
    description: 'A blockchain-based platform ensuring transparency in the coffee supply chain. It connects farmers directly to exporters, ensuring fair pricing and traceability for Ethiopian premium coffee.',
    category: CourseCategory.Entrepreneurship,
    tags: ['Blockchain', 'Supply Chain', 'FinTech', 'Business'],
    thumbnail: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop',
    authorId: 's7',
    authorName: 'Samuel Alemu',
    authorAvatar: 'https://ui-avatars.com/api/?name=Samuel+A&background=random',
    likes: 92,
    status: 'Launched',
    demoUrl: 'https://coffeechain.eth',
    timestamp: '2023-09-15'
  }
];

// --- LOCAL STORAGE INITIALIZATION ---

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error loading ${key} from storage`, e);
    return defaultValue;
  }
};

const saveToStorage = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage`, e);
  }
};

// Initialize State from Storage or Defaults
let MOCK_COURSES: Course[] = loadFromStorage('fadlab_courses', DEFAULT_COURSES);
let MOCK_STUDENTS: Student[] = loadFromStorage('fadlab_students', DEFAULT_STUDENTS);
let MOCK_ENROLLMENTS: Enrollment[] = loadFromStorage('fadlab_enrollments', DEFAULT_ENROLLMENTS);
let MOCK_PROJECTS: Project[] = loadFromStorage('fadlab_projects', DEFAULT_PROJECTS);

// Static data (not editable yet)
const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'fb1',
    source: 'FadLab',
    sourceUrl: 'https://facebook.com/fadlab',
    authorAvatar: 'https://ui-avatars.com/api/?name=Fad+Lab&background=0D8ABC&color=fff',
    content: '🚀 New Project Alert! Our students just prototyped a solar-powered irrigation system for small-scale farms. Check out the details in the course "Smart Agriculture". #Innovation #AgriTech #STEAM',
    image: 'https://picsum.photos/600/300?random=101',
    likes: 124,
    comments: 18,
    shares: 45,
    timestamp: '2 hours ago',
    tags: ['Innovation', 'AgriTech']
  },
  {
    id: 'fb2',
    source: 'CLIC Ethiopia',
    sourceUrl: 'https://facebook.com/clicethiopia',
    authorAvatar: 'https://ui-avatars.com/api/?name=CLIC+Ethiopia&background=F59E0B&color=fff',
    content: 'Community Spotlight: Meet Sarah, one of our top students who is using Arts to visualize complex Engineering problems. Join us this Friday for her gallery showcase! 🎨⚙️ #STEAM #WomenInSTEM',
    image: 'https://picsum.photos/600/300?random=102',
    likes: 89,
    comments: 32,
    shares: 12,
    timestamp: '5 hours ago',
    tags: ['Community', 'Events']
  }
];

const MOCK_LABS: Lab[] = [
  {
    id: 'l1',
    name: 'Fabrication Lab',
    type: 'Fabrication',
    description: 'The hardware heart of FadLab. Equipped with heavy machinery for physical prototyping, subtractive manufacturing, and electronics assembly.',
    icon: 'Hammer',
    capacity: 20,
    location: 'Building A, Room 101',
    consumables: [
      { name: 'PLA Filament (White)', status: 'In Stock', unit: '15 Spools' },
      { name: 'Plywood (3mm)', status: 'Low Stock', unit: '5 Sheets' },
    ]
  },
  {
    id: 'l2',
    name: 'Digital Studio',
    type: 'Digital',
    description: 'High-performance computing center for VR simulation, 3D rendering, AI model training, and professional media editing.',
    icon: 'Monitor',
    capacity: 15,
    location: 'Building B, Room 204',
    consumables: []
  },
  {
    id: 'l3',
    name: 'Agri-Tech Field Lab',
    type: 'Field',
    description: 'Outdoor testing ground featuring sensor networks, drone flight zones, and experimental hydroponic vertical farms.',
    icon: 'Sprout',
    capacity: 50,
    location: 'Campus Gardens, Zone 3',
    consumables: []
  },
  {
    id: 'l4',
    name: 'Business Incubator',
    type: 'Business',
    description: 'Professional collaboration spaces for startups. Features conference rooms, pitching stages, and content creation tools.',
    icon: 'Briefcase',
    capacity: 30,
    location: 'Building C, Room 301',
    consumables: []
  }
];

const MOCK_ASSETS: Asset[] = [
  { id: 'a1', labId: 'l1', name: 'Prusa MK3 - 01', model: '3D Printer', subCategory: 'Printers', status: 'Available', certificationRequired: 'c5', image: 'https://picsum.photos/200/200?random=301', specs: ['Build Vol: 25x21x21cm', 'Nozzle: 0.4mm'] },
  { id: 'a2', labId: 'l1', name: 'Prusa MK3 - 02', model: '3D Printer', subCategory: 'Printers', status: 'In Use', certificationRequired: 'c5', image: 'https://picsum.photos/200/200?random=301', specs: ['Build Vol: 25x21x21cm', 'Nozzle: 0.6mm'] },
];

const MOCK_DIGITAL_ASSETS: DigitalAsset[] = [
  { id: 'da1', labId: 'l1', title: 'Gear Assembly STL', type: 'Model', description: 'Standard gear set for robotics projects.', url: '/models/gear_assembly.stl', authorName: 'System', downloads: 120, size: '45 MB' },
];

let MOCK_BOOKINGS: Booking[] = loadFromStorage('fadlab_bookings', []);

// --- NETWORK UTILITIES ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithFallback<T>(
    action: string, 
    fallback: () => Promise<T>, 
    method: 'GET' | 'POST' = 'GET', 
    payload?: any
): Promise<T> {
    if (!API_URL) {
        return fallback();
    }

    try {
        let url = `${API_URL}?action=${action}`;
        const options: RequestInit = {
            method,
        };

        if (method === 'GET' && payload) {
            const params = new URLSearchParams();
            Object.keys(payload).forEach(key => params.append(key, String(payload[key])));
            url += `&${params.toString()}`;
        } else if (method === 'POST') {
            // FIX: Apps Script POST requests must be sent as text/plain to avoid CORS preflight (OPTIONS) check failure.
            options.headers = {
              'Content-Type': 'text/plain;charset=utf-8'
            };
            options.body = JSON.stringify({ action, ...payload });
        }

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.result === 'error' || result.error) {
           throw new Error(result.error || 'Unknown Script Error');
        }
        
        return (result.data || result) as T;

    } catch (error) {
        console.warn(`API call '${action}' failed, falling back to mock data.`, error);
        return fallback();
    }
}

// --- EXPORTED SERVICE ---

export const sheetService = {
  
  // --- AUTH METHODS ---

  async verifyAdmin(email: string, pass: string): Promise<Student> {
    await delay(1000);
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      const admin = MOCK_STUDENTS.find(s => s.email === email && s.role === 'admin');
      if (admin) return { ...admin };
      // Fallback if admin removed from array but creds match
      return {
        id: 'admin_sys',
        name: 'Frehun Demissie',
        email: ADMIN_EMAIL,
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin',
        enrolledCourses: [],
        points: 0,
        rank: 0
      };
    }
    throw new Error("Invalid Administrator Credentials");
  },

  async loginWithSocial(provider: 'google' | 'facebook'): Promise<Student> {
    await delay(1500); // Simulate OAuth popup delay
    
    // Simulate finding a user or creating a new one
    // For demo: Facebook -> "Tirunesh" (Existing), Google -> "Demo User" (New or Existing)
    
    if (provider === 'facebook') {
      const existing = MOCK_STUDENTS.find(s => s.email === 'tirunesh@fadlab.tech');
      if (existing) return { ...existing };
    }

    // Google Login Logic (Simulated)
    const demoEmail = "student.demo@gmail.com";
    let user = MOCK_STUDENTS.find(s => s.email === demoEmail);

    if (!user) {
      // Create new user (First time login)
      user = {
        id: `s_${Date.now()}`,
        name: "New Student",
        email: demoEmail,
        avatar: `https://picsum.photos/100/100?random=${Date.now()}`,
        role: 'student',
        enrolledCourses: [],
        studyPlans: [],
        projectIds: [],
        points: 0,
        rank: MOCK_STUDENTS.length + 1
      };
      // Register them
      return this.registerStudent(user);
    }

    return { ...user };
  },

  async registerStudent(student: Student): Promise<Student> {
    const fallback = async () => {
      MOCK_STUDENTS.push(student);
      saveToStorage('fadlab_students', MOCK_STUDENTS);
      return { ...student };
    };
    // We try to POST to sheet to save the user in the cloud
    return fetchWithFallback<Student>('registerStudent', fallback, 'POST', student);
  },

  // --- COURSE & DATA METHODS ---
  
  async getCourses(): Promise<Course[]> {
    const fallback = async () => {
        await delay(500);
        return [...MOCK_COURSES];
    };
    return fetchWithFallback<Course[]>('getCourses', fallback);
  },

  async addCourse(course: Omit<Course, 'id'>): Promise<Course> {
    const fallback = async () => {
        await delay(800);
        const newCourse: Course = {
            ...course,
            id: `c${Date.now()}`
        };
        MOCK_COURSES.push(newCourse);
        saveToStorage('fadlab_courses', MOCK_COURSES);
        return newCourse;
    };
    return fetchWithFallback<Course>('addCourse', fallback, 'POST', course);
  },

  async deleteCourse(courseId: string): Promise<void> {
    const fallback = async () => {
        await delay(800);
        MOCK_COURSES = MOCK_COURSES.filter(c => c.id !== courseId);
        saveToStorage('fadlab_courses', MOCK_COURSES);
    };
    return fetchWithFallback<void>('deleteCourse', fallback, 'POST', { courseId });
  },

  async getAdminStats(): Promise<AdminStats> {
    const fallback = async () => {
        await delay(600);
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
    };
    return fetchWithFallback<AdminStats>('getAdminStats', fallback);
  },

  async getStudentProfile(email: string): Promise<Student | null> {
    const fallback = async () => {
        await delay(800);
        // CRITICAL: We find the student and return a DEEP copy to ensure React re-renders.
        // Reading directly from MOCK_STUDENTS ensures we get the latest data after an update.
        const student = MOCK_STUDENTS.find(s => s.email === email);
        if (!student) return null;
        
        return { 
          ...student,
          studyPlans: student.studyPlans ? [...student.studyPlans] : [],
          enrolledCourses: [...student.enrolledCourses],
          projectIds: student.projectIds ? [...student.projectIds] : []
        };
    };
    return fetchWithFallback<Student | null>('getStudentProfile', fallback, 'GET', { email });
  },

  async updateStudentAvatar(studentId: string, avatarUrl: string): Promise<void> {
    const fallback = async () => {
        await delay(800);
        const index = MOCK_STUDENTS.findIndex(s => s.id === studentId);
        if (index !== -1) {
            MOCK_STUDENTS[index] = {
                ...MOCK_STUDENTS[index],
                avatar: avatarUrl
            };
            saveToStorage('fadlab_students', MOCK_STUDENTS);
        }
    };
    return fetchWithFallback<void>('updateAvatar', fallback, 'POST', { studentId, avatarUrl });
  },

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    const fallback = async () => {
        await delay(600);
        return MOCK_ENROLLMENTS.filter(e => e.studentId === studentId);
    };
    // Fetch data and map it defensively to ensure properties exist
    const data = await fetchWithFallback<any[]>('getStudentEnrollments', fallback, 'GET', { studentId });
    return data.map(e => ({
      ...e,
      // Map 'hoursPerWeek' (backend) to 'plannedHoursPerWeek' (frontend) if missing
      plannedHoursPerWeek: e.plannedHoursPerWeek ?? e.hoursPerWeek ?? 0,
      targetCompletionDate: e.targetCompletionDate || e.targetDate || ''
    }));
  },

  async enrollStudent(studentId: string, courseId: string, plan: { hoursPerWeek: number, startDate: string, targetDate: string }): Promise<Enrollment> {
    const fallback = async () => {
        await delay(1000);
        
        // 1. Update Student's enrolledCourses list (simple string array) for quick lookups if needed
        const index = MOCK_STUDENTS.findIndex(s => s.id === studentId);
        if (index !== -1) {
            const student = MOCK_STUDENTS[index];
            if (!student.enrolledCourses.includes(courseId)) {
                // Update student immutably
                 MOCK_STUDENTS[index] = {
                    ...student,
                    enrolledCourses: [...student.enrolledCourses, courseId]
                };
                saveToStorage('fadlab_students', MOCK_STUDENTS);
            }
        }

        // 2. Manage the Enrollment Record (The Source of Truth for Progress & Plans)
        // Check if enrollment already exists
        const existingEnrollmentIndex = MOCK_ENROLLMENTS.findIndex(e => e.studentId === studentId && e.courseId === courseId);

        let resultEnrollment: Enrollment;

        if (existingEnrollmentIndex !== -1) {
             // Update existing enrollment with new plan details
             const existing = MOCK_ENROLLMENTS[existingEnrollmentIndex];
             resultEnrollment = {
                 ...existing,
                 plannedHoursPerWeek: plan.hoursPerWeek,
                 startDate: plan.startDate,
                 targetCompletionDate: plan.targetDate
             };
             MOCK_ENROLLMENTS[existingEnrollmentIndex] = resultEnrollment;
        } else {
            // Create new
            resultEnrollment = {
              studentId,
              courseId,
              progress: 0,
              plannedHoursPerWeek: plan.hoursPerWeek,
              startDate: plan.startDate,
              targetCompletionDate: plan.targetDate
            };
            MOCK_ENROLLMENTS.push(resultEnrollment);
        }
        
        saveToStorage('fadlab_enrollments', MOCK_ENROLLMENTS);
        return resultEnrollment;
    };
    
    // FIX: Send 'hoursPerWeek' instead of 'plannedHoursPerWeek' to match Backend expectations
    return fetchWithFallback<Enrollment>('enrollStudent', fallback, 'POST', { 
      studentId, 
      courseId, 
      hoursPerWeek: plan.hoursPerWeek, // <-- Corrected Key
      startDate: plan.startDate, 
      targetCompletionDate: plan.targetDate 
    });
  },

  async updateProgress(studentId: string, courseId: string, progress: number): Promise<Enrollment | null> {
    const fallback = async () => {
      await delay(500);
      const index = MOCK_ENROLLMENTS.findIndex(e => e.studentId === studentId && e.courseId === courseId);
      if (index !== -1) {
        // Clamp progress to 100
        const newProgress = Math.min(Math.max(progress, 0), 100);
        MOCK_ENROLLMENTS[index] = {
          ...MOCK_ENROLLMENTS[index],
          progress: newProgress
        };
        saveToStorage('fadlab_enrollments', MOCK_ENROLLMENTS);
        return MOCK_ENROLLMENTS[index];
      }
      return null;
    };
    return fetchWithFallback<Enrollment | null>('updateProgress', fallback, 'POST', { studentId, courseId, progress });
  },

  async getLeaderboard(): Promise<Student[]> {
    const fallback = async () => {
        await delay(500);
        return [...MOCK_STUDENTS].filter(s => s.role === 'student').sort((a, b) => b.points - a.points);
    };
    return fetchWithFallback<Student[]>('getLeaderboard', fallback);
  },

  async getSocialPosts(): Promise<SocialPost[]> {
    const fallback = async () => {
        await delay(700);
        return [...MOCK_SOCIAL_POSTS];
    };
    return fetchWithFallback<SocialPost[]>('getSocialPosts', fallback);
  },

  async getProjects(): Promise<Project[]> {
    const fallback = async () => {
        await delay(600);
        return [...MOCK_PROJECTS];
    };
    return fetchWithFallback<Project[]>('getProjects', fallback);
  },

  async addProject(project: Omit<Project, 'id' | 'timestamp'>): Promise<Project> {
    const fallback = async () => {
        await delay(1000);
        const newProject: Project = {
          ...project,
          id: `p${Date.now()}`,
          timestamp: new Date().toISOString().split('T')[0]
        };
        MOCK_PROJECTS.unshift(newProject);
        saveToStorage('fadlab_projects', MOCK_PROJECTS);

        const index = MOCK_STUDENTS.findIndex(s => s.id === project.authorId);
        if (index !== -1) {
            const student = MOCK_STUDENTS[index];
            MOCK_STUDENTS[index] = {
                ...student,
                projectIds: student.projectIds ? [...student.projectIds, newProject.id] : [newProject.id],
                points: student.points + 50
            };
            saveToStorage('fadlab_students', MOCK_STUDENTS);
        }

        return newProject;
    };
    return fetchWithFallback<Project>('addProject', fallback, 'POST', project);
  },

  async likeProject(projectId: string): Promise<void> {
    const fallback = async () => {
      await delay(400);
      const project = MOCK_PROJECTS.find(p => p.id === projectId);
      if (project) {
        project.likes += 1;
        saveToStorage('fadlab_projects', MOCK_PROJECTS);
      }
    };
    return fetchWithFallback<void>('likeProject', fallback, 'POST', { projectId });
  },

  async getLabs(): Promise<Lab[]> {
    const fallback = async () => {
        await delay(400);
        return [...MOCK_LABS];
    };
    return fetchWithFallback<Lab[]>('getLabs', fallback);
  },

  async getAssets(labId: string): Promise<Asset[]> {
    const fallback = async () => {
      await delay(500);
      return MOCK_ASSETS.filter(a => a.labId === labId);
    };
    return fetchWithFallback<Asset[]>('getAssets', fallback, 'GET', { labId });
  },

  async getDigitalAssets(labId: string): Promise<DigitalAsset[]> {
    const fallback = async () => {
      await delay(500);
      return MOCK_DIGITAL_ASSETS.filter(d => d.labId === labId);
    };
    return fetchWithFallback<DigitalAsset[]>('getDigitalAssets', fallback, 'GET', { labId });
  },

  async getBookings(assetId: string): Promise<Booking[]> {
    const fallback = async () => {
      await delay(400);
      return MOCK_BOOKINGS.filter(b => b.assetId === assetId);
    };
    return fetchWithFallback<Booking[]>('getBookings', fallback, 'GET', { assetId });
  },

  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    const fallback = async () => {
      await delay(800);
      const newBooking: Booking = {
        ...booking,
        id: `b${Date.now()}`
      };
      MOCK_BOOKINGS.push(newBooking);
      saveToStorage('fadlab_bookings', MOCK_BOOKINGS);
      
      const asset = MOCK_ASSETS.find(a => a.id === booking.assetId);
      if (asset && booking.date === new Date().toISOString().split('T')[0]) {
        asset.status = 'In Use';
      }
      return newBooking;
    };
    return fetchWithFallback<Booking>('createBooking', fallback, 'POST', booking);
  },

  async reportAssetIssue(assetId: string): Promise<void> {
    const fallback = async () => {
      await delay(500);
      const asset = MOCK_ASSETS.find(a => a.id === assetId);
      if (asset) {
        asset.status = 'Maintenance';
      }
    };
    return fetchWithFallback<void>('reportAssetIssue', fallback, 'POST', { assetId });
  }
};
