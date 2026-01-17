import { Course, CourseCategory, Student, Enrollment, AdminStats, SocialPost, Project, Lab, Asset, Booking, DigitalAsset } from '../types';

/**
 * SERVICE CONFIGURATION
 * ---------------------
 * We use a "Hybrid" approach:
 * 1. Try to connect to the Google Sheet API (if VITE_GOOGLE_SHEET_API_URL is set).
 * 2. If the API fails or is not configured, fall back to local MOCK_DATA.
 */
const API_URL = import.meta.env.VITE_GOOGLE_SHEET_API_URL || '';

// --- MOCK DATA STORE ---
// This acts as both the "Offline Database" and the "Optimistic Cache"

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
      { courseId: 'c4', plannedHoursPerWeek: 4, targetCompletionDate: '2023-11-15' }
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
  },
  {
    id: 'fb3',
    source: 'FadLab',
    sourceUrl: 'https://facebook.com/fadlab',
    authorAvatar: 'https://ui-avatars.com/api/?name=Fad+Lab&background=0D8ABC&color=fff',
    content: '📢 Hackathon Announcement! "Build for Impact 2024" is starting next month. Form your teams in the LMS and get ready to solve real-world challenges. Prizes include internship opportunities! 🏆',
    likes: 256,
    comments: 84,
    shares: 110,
    timestamp: '1 day ago',
    tags: ['Hackathon', 'Announcement']
  },
  {
    id: 'fb4',
    source: 'CLIC Ethiopia',
    sourceUrl: 'https://facebook.com/clicethiopia',
    authorAvatar: 'https://ui-avatars.com/api/?name=CLIC+Ethiopia&background=F59E0B&color=fff',
    content: 'Did you know? The "A" in STEAM stands for Arts, which is crucial for design thinking. Our new workshop explores how traditional Ethiopian patterns can influence modern architectural design. 🇪🇹✨',
    image: 'https://picsum.photos/600/300?random=103',
    likes: 156,
    comments: 24,
    shares: 30,
    timestamp: '2 days ago',
    tags: ['Culture', 'Design']
  }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Solar Auto-Irrigation',
    description: 'An IoT based system that uses soil moisture sensors to automatically water crops using solar power. Designed for small-holder farmers in rural Ethiopia.',
    category: CourseCategory.Engineering,
    tags: ['IoT', 'Solar', 'AgriTech'],
    thumbnail: 'https://picsum.photos/500/300?random=201',
    authorId: 's1',
    authorName: 'Abebe Bikila',
    authorAvatar: 'https://picsum.photos/100/100?random=10',
    likes: 45,
    status: 'Prototype',
    githubUrl: 'https://github.com/abebe/solar-irrigation',
    timestamp: '2023-11-10'
  },
  {
    id: 'p2',
    title: 'Recycled Plastic Bricks',
    description: 'Converting PET bottles into durable, interlocking construction bricks. A low-cost housing solution that addresses plastic pollution.',
    category: CourseCategory.Innovation,
    tags: ['Sustainability', 'Materials', 'Construction'],
    thumbnail: 'https://picsum.photos/500/300?random=202',
    authorId: 's3',
    authorName: 'Haile Gebrselassie',
    authorAvatar: 'https://picsum.photos/100/100?random=12',
    likes: 32,
    status: 'Idea',
    timestamp: '2023-11-12'
  },
  {
    id: 'p3',
    title: 'Ethiopian Pattern Generator',
    description: 'A generative art algorithm that creates modern textile designs based on traditional Tibeb patterns using p5.js.',
    category: CourseCategory.Arts,
    tags: ['CreativeCoding', 'Culture', 'Design'],
    thumbnail: 'https://picsum.photos/500/300?random=203',
    authorId: 's2',
    authorName: 'Tirunesh Dibaba',
    authorAvatar: 'https://picsum.photos/100/100?random=11',
    likes: 88,
    status: 'Launched',
    demoUrl: 'https://example.com/demo',
    timestamp: '2023-10-25'
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
      { name: 'Solder Wire', status: 'In Stock', unit: '5 kg' },
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
    consumables: [
      { name: 'VR Face Covers', status: 'In Stock', unit: '50 units' },
      { name: 'Printer Paper (A3)', status: 'Out of Stock', unit: '0 Reams' },
    ]
  },
  {
    id: 'l3',
    name: 'Agri-Tech Field Lab',
    type: 'Field',
    description: 'Outdoor testing ground featuring sensor networks, drone flight zones, and experimental hydroponic vertical farms.',
    icon: 'Sprout',
    capacity: 50,
    location: 'Campus Gardens, Zone 3',
    consumables: [
      { name: 'pH Buffer Solution', status: 'In Stock', unit: '10 Bottles' },
      { name: 'Nutrient Mix A', status: 'Low Stock', unit: '2 Liters' },
    ]
  },
  {
    id: 'l4',
    name: 'Business Incubator',
    type: 'Business',
    description: 'Professional collaboration spaces for startups. Features conference rooms, pitching stages, and content creation tools.',
    icon: 'Briefcase',
    capacity: 30,
    location: 'Building C, Room 301',
    consumables: [
      { name: 'Whiteboard Markers', status: 'In Stock', unit: '20 Pack' },
      { name: 'Coffee Beans', status: 'In Stock', unit: '5 kg' },
    ]
  }
];

const MOCK_ASSETS: Asset[] = [
  { id: 'a1', labId: 'l1', name: 'Prusa MK3 - 01', model: '3D Printer', subCategory: 'Printers', status: 'Available', certificationRequired: 'c5', image: 'https://picsum.photos/200/200?random=301', specs: ['Build Vol: 25x21x21cm', 'Nozzle: 0.4mm'] },
  { id: 'a2', labId: 'l1', name: 'Prusa MK3 - 02', model: '3D Printer', subCategory: 'Printers', status: 'In Use', certificationRequired: 'c5', image: 'https://picsum.photos/200/200?random=301', specs: ['Build Vol: 25x21x21cm', 'Nozzle: 0.6mm'] },
  { id: 'a3', labId: 'l1', name: 'Epilog Laser Fusion', model: 'Laser Cutter', subCategory: 'CNC & Cutters', status: 'Maintenance', certificationRequired: 'c3', image: 'https://picsum.photos/200/200?random=302', specs: ['60W CO2 Laser', 'Bed: 24x12 inch'] },
  { id: 'a8', labId: 'l1', name: 'ShopBot Desktop', model: 'CNC Router', subCategory: 'CNC & Cutters', status: 'Available', certificationRequired: 'c3', image: 'https://picsum.photos/200/200?random=310', specs: ['Spindle: 1HP', 'Cut Area: 24x18 inch'] },
  { id: 'a9', labId: 'l1', name: 'Hakko Soldering Station 1', model: 'Electronics Bench', subCategory: 'Electronics', status: 'Available', image: 'https://picsum.photos/200/200?random=311', specs: ['Temp: 200-480°C', 'Includes Fume Extractor'] },
  { id: 'a10', labId: 'l1', name: 'Roland Vinyl Cutter', model: 'Vinyl Cutter', subCategory: 'CNC & Cutters', status: 'Available', image: 'https://picsum.photos/200/200?random=312', specs: ['Width: 24 inch', 'Force: 350g'] },
  { id: 'a4', labId: 'l2', name: 'Oculus Quest 3 - Unit 1', model: 'VR Headset', subCategory: 'XR/VR', status: 'Available', image: 'https://picsum.photos/200/200?random=303', specs: ['128GB Storage', 'Includes Controllers'] },
  { id: 'a5', labId: 'l2', name: 'Alienware Aurora R15', model: 'Sim Workstation', subCategory: 'Workstations', status: 'Available', certificationRequired: 'c7', image: 'https://picsum.photos/200/200?random=304', specs: ['RTX 4090', '64GB RAM', 'SolidWorks Installed'] },
  { id: 'a11', labId: 'l2', name: 'Wacom Cintiq Pro', model: 'Drawing Tablet', subCategory: 'Peripherals', status: 'In Use', certificationRequired: 'c7', image: 'https://picsum.photos/200/200?random=313', specs: ['24 inch 4K Display', 'Pro Pen 2'] },
  { id: 'a12', labId: 'l2', name: 'HTC Vive Pro Eye', model: 'VR Headset', subCategory: 'XR/VR', status: 'Available', image: 'https://picsum.photos/200/200?random=314', specs: ['Eye Tracking', 'Requires PC Tether'] },
  { id: 'a6', labId: 'l3', name: 'DJI Mavic 3M', model: 'Multispectral Drone', subCategory: 'Drones', status: 'Available', certificationRequired: 'c2', image: 'https://picsum.photos/200/200?random=305', specs: ['RGB + Multispectral Cam', 'RTK Module'] },
  { id: 'a7', labId: 'l3', name: 'Soil Sensor Kit A', model: 'IoT Kit', subCategory: 'Sensors', status: 'In Use', certificationRequired: 'c3', image: 'https://picsum.photos/200/200?random=306', specs: ['NPK Sensor', 'Moisture/Temp/EC'] },
  { id: 'a13', labId: 'l3', name: 'LoRaWAN Gateway', model: 'Network Node', subCategory: 'Connectivity', status: 'Available', image: 'https://picsum.photos/200/200?random=315', specs: ['Range: 10km', '8 Channels'] },
  { id: 'a14', labId: 'l3', name: 'Dobot Magician', model: 'Robotic Arm', subCategory: 'Robotics', status: 'Available', certificationRequired: 'c3', image: 'https://picsum.photos/200/200?random=316', specs: ['Payload: 500g', 'End Effectors: Gripper/Suction'] },
  { id: 'a15', labId: 'l4', name: 'Sony A7III Kit', model: 'Camera Kit', subCategory: 'Media', status: 'Available', image: 'https://picsum.photos/200/200?random=317', specs: ['24-70mm Lens', '4K Video'] },
  { id: 'a16', labId: 'l4', name: 'Rode Caster Pro', model: 'Podcast Station', subCategory: 'Media', status: 'Available', image: 'https://picsum.photos/200/200?random=318', specs: ['4 Mic Inputs', 'Bluetooth'] },
  { id: 'a17', labId: 'l4', name: 'Epson 4K Projector', model: 'Presentation', subCategory: 'AV Equipment', status: 'In Use', image: 'https://picsum.photos/200/200?random=319', specs: ['3000 Lumens', 'HDMI/Wireless'] },
];

const MOCK_DIGITAL_ASSETS: DigitalAsset[] = [
  { id: 'da1', labId: 'l1', title: 'Gear Assembly STL', type: 'Model', description: 'Standard gear set for robotics projects.', url: '/models/gear_assembly.stl', authorName: 'System', downloads: 120, size: '45 MB' },
  { id: 'da2', labId: 'l1', title: 'Laser Cut Box Template', type: 'Template', description: 'Finger-joint box generator files.', url: '/models/box_template.dxf', authorName: 'Prof. Frehun', downloads: 85, size: '2 MB' },
  { id: 'da3', labId: 'l2', title: 'Unity VR Starter Kit', type: 'Code', description: 'Boilerplate for VR interactions.', url: '/google_drive/VR/StarterKit.zip', authorName: 'System', downloads: 200, size: '150 MB' },
  { id: 'da4', labId: 'l4', title: 'Startup Financial Model', type: 'Template', description: 'Excel sheet for calculating runway and burn rate.', url: '/google_drive/Finance/startup_model_v1.xlsx', authorName: 'Lecturer Mulunesh', downloads: 340, size: '1 MB' },
];

let MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', assetId: 'a2', studentId: 's2', date: new Date().toISOString().split('T')[0], startTime: '10:00', durationHours: 2, purpose: 'Prototyping chassis' }
];

// --- NETWORK UTILITIES ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Robust fetcher that tries to access the Google Sheet API (via Apps Script Web App).
 * If the API URL is missing, or the network request fails, it runs the fallback function
 * to return simulated local data.
 */
async function fetchWithFallback<T>(
    action: string, 
    fallback: () => Promise<T>, 
    method: 'GET' | 'POST' = 'GET', 
    payload?: any
): Promise<T> {
    if (!API_URL) {
        // No API configured, use mock
        return fallback();
    }

    try {
        let url = `${API_URL}?action=${action}`;
        const options: RequestInit = {
            method,
            // For Simple Requests (preventing CORS preflight), we might omit headers.
            // But usually we can send text/plain.
        };

        if (method === 'GET' && payload) {
            const params = new URLSearchParams();
            Object.keys(payload).forEach(key => params.append(key, String(payload[key])));
            url += `&${params.toString()}`;
        } else if (method === 'POST') {
             // Google Apps Script doPost(e) reads e.postData.contents
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
        
        // Return the data portion of the response
        return (result.data || result) as T;

    } catch (error) {
        console.warn(`API call '${action}' failed, falling back to mock data.`, error);
        return fallback();
    }
}

// --- EXPORTED SERVICE ---

export const sheetService = {
  
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
        return newCourse;
    };
    return fetchWithFallback<Course>('addCourse', fallback, 'POST', course);
  },

  async deleteCourse(courseId: string): Promise<void> {
    const fallback = async () => {
        await delay(800);
        MOCK_COURSES = MOCK_COURSES.filter(c => c.id !== courseId);
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
        return MOCK_STUDENTS.find(s => s.email === email) || null;
    };
    return fetchWithFallback<Student | null>('getStudentProfile', fallback, 'GET', { email });
  },

  async updateStudentAvatar(studentId: string, avatarUrl: string): Promise<void> {
    const fallback = async () => {
        await delay(800);
        const student = MOCK_STUDENTS.find(s => s.id === studentId);
        if (student) {
            student.avatar = avatarUrl;
        }
    };
    return fetchWithFallback<void>('updateAvatar', fallback, 'POST', { studentId, avatarUrl });
  },

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    const fallback = async () => {
        await delay(600);
        return MOCK_ENROLLMENTS.filter(e => e.studentId === studentId);
    };
    return fetchWithFallback<Enrollment[]>('getStudentEnrollments', fallback, 'GET', { studentId });
  },

  async enrollStudent(studentId: string, courseId: string, plan: { hoursPerWeek: number, targetDate: string }): Promise<Enrollment> {
    const fallback = async () => {
        await delay(1000);
        
        const student = MOCK_STUDENTS.find(s => s.id === studentId);
        if (student) {
            if (!student.studyPlans) student.studyPlans = [];
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
    };
    
    return fetchWithFallback<Enrollment>('enrollStudent', fallback, 'POST', { studentId, courseId, hoursPerWeek: plan.hoursPerWeek, targetDate: plan.targetDate });
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

        const student = MOCK_STUDENTS.find(s => s.id === project.authorId);
        if (student) {
          if (!student.projectIds) student.projectIds = [];
          student.projectIds.push(newProject.id);
          student.points += 50; 
        }

        return newProject;
    };
    return fetchWithFallback<Project>('addProject', fallback, 'POST', project);
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
