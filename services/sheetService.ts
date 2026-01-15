

import { Course, CourseCategory, Student, Enrollment, AdminStats, SocialPost, Project, Lab, Asset, Booking, DigitalAsset } from '../types';

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

// Mock Social Posts (Facebook Integration Simulation)
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

// Mock Projects for Inno-Lab
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

// --- LAB MANAGER MOCK DATA (Expanded Phase 4) ---

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

// Expanded Asset List
const MOCK_ASSETS: Asset[] = [
  // --- FABRICATION LAB ---
  { id: 'a1', labId: 'l1', name: 'Prusa MK3 - 01', model: '3D Printer', subCategory: 'Printers', status: 'Available', certificationRequired: 'c5', image: 'https://picsum.photos/200/200?random=301', specs: ['Build Vol: 25x21x21cm', 'Nozzle: 0.4mm'] },
  { id: 'a2', labId: 'l1', name: 'Prusa MK3 - 02', model: '3D Printer', subCategory: 'Printers', status: 'In Use', certificationRequired: 'c5', image: 'https://picsum.photos/200/200?random=301', specs: ['Build Vol: 25x21x21cm', 'Nozzle: 0.6mm'] },
  { id: 'a3', labId: 'l1', name: 'Epilog Laser Fusion', model: 'Laser Cutter', subCategory: 'CNC & Cutters', status: 'Maintenance', certificationRequired: 'c3', image: 'https://picsum.photos/200/200?random=302', specs: ['60W CO2 Laser', 'Bed: 24x12 inch'] },
  { id: 'a8', labId: 'l1', name: 'ShopBot Desktop', model: 'CNC Router', subCategory: 'CNC & Cutters', status: 'Available', certificationRequired: 'c3', image: 'https://picsum.photos/200/200?random=310', specs: ['Spindle: 1HP', 'Cut Area: 24x18 inch'] },
  { id: 'a9', labId: 'l1', name: 'Hakko Soldering Station 1', model: 'Electronics Bench', subCategory: 'Electronics', status: 'Available', image: 'https://picsum.photos/200/200?random=311', specs: ['Temp: 200-480°C', 'Includes Fume Extractor'] },
  { id: 'a10', labId: 'l1', name: 'Roland Vinyl Cutter', model: 'Vinyl Cutter', subCategory: 'CNC & Cutters', status: 'Available', image: 'https://picsum.photos/200/200?random=312', specs: ['Width: 24 inch', 'Force: 350g'] },

  // --- DIGITAL STUDIO ---
  { id: 'a4', labId: 'l2', name: 'Oculus Quest 3 - Unit 1', model: 'VR Headset', subCategory: 'XR/VR', status: 'Available', image: 'https://picsum.photos/200/200?random=303', specs: ['128GB Storage', 'Includes Controllers'] },
  { id: 'a5', labId: 'l2', name: 'Alienware Aurora R15', model: 'Sim Workstation', subCategory: 'Workstations', status: 'Available', certificationRequired: 'c7', image: 'https://picsum.photos/200/200?random=304', specs: ['RTX 4090', '64GB RAM', 'SolidWorks Installed'] },
  { id: 'a11', labId: 'l2', name: 'Wacom Cintiq Pro', model: 'Drawing Tablet', subCategory: 'Peripherals', status: 'In Use', certificationRequired: 'c7', image: 'https://picsum.photos/200/200?random=313', specs: ['24 inch 4K Display', 'Pro Pen 2'] },
  { id: 'a12', labId: 'l2', name: 'HTC Vive Pro Eye', model: 'VR Headset', subCategory: 'XR/VR', status: 'Available', image: 'https://picsum.photos/200/200?random=314', specs: ['Eye Tracking', 'Requires PC Tether'] },
  
  // --- AGRI-TECH FIELD LAB ---
  { id: 'a6', labId: 'l3', name: 'DJI Mavic 3M', model: 'Multispectral Drone', subCategory: 'Drones', status: 'Available', certificationRequired: 'c2', image: 'https://picsum.photos/200/200?random=305', specs: ['RGB + Multispectral Cam', 'RTK Module'] },
  { id: 'a7', labId: 'l3', name: 'Soil Sensor Kit A', model: 'IoT Kit', subCategory: 'Sensors', status: 'In Use', certificationRequired: 'c3', image: 'https://picsum.photos/200/200?random=306', specs: ['NPK Sensor', 'Moisture/Temp/EC'] },
  { id: 'a13', labId: 'l3', name: 'LoRaWAN Gateway', model: 'Network Node', subCategory: 'Connectivity', status: 'Available', image: 'https://picsum.photos/200/200?random=315', specs: ['Range: 10km', '8 Channels'] },
  { id: 'a14', labId: 'l3', name: 'Dobot Magician', model: 'Robotic Arm', subCategory: 'Robotics', status: 'Available', certificationRequired: 'c3', image: 'https://picsum.photos/200/200?random=316', specs: ['Payload: 500g', 'End Effectors: Gripper/Suction'] },
  
  // --- BUSINESS INCUBATOR ---
  { id: 'a15', labId: 'l4', name: 'Sony A7III Kit', model: 'Camera Kit', subCategory: 'Media', status: 'Available', image: 'https://picsum.photos/200/200?random=317', specs: ['24-70mm Lens', '4K Video'] },
  { id: 'a16', labId: 'l4', name: 'Rode Caster Pro', model: 'Podcast Station', subCategory: 'Media', status: 'Available', image: 'https://picsum.photos/200/200?random=318', specs: ['4 Mic Inputs', 'Bluetooth'] },
  { id: 'a17', labId: 'l4', name: 'Epson 4K Projector', model: 'Presentation', subCategory: 'AV Equipment', status: 'In Use', image: 'https://picsum.photos/200/200?random=319', specs: ['3000 Lumens', 'HDMI/Wireless'] },
];

const MOCK_DIGITAL_ASSETS: DigitalAsset[] = [
  { id: 'da1', labId: 'l1', title: 'Gear Assembly STL', type: 'Model', description: 'Standard gear set for robotics projects.', url: '#', authorName: 'System', downloads: 120, size: '45 MB' },
  { id: 'da2', labId: 'l1', title: 'Laser Cut Box Template', type: 'Template', description: 'Finger-joint box generator files.', url: '#', authorName: 'Prof. Frehun', downloads: 85, size: '2 MB' },
  { id: 'da3', labId: 'l2', title: 'Unity VR Starter Kit', type: 'Code', description: 'Boilerplate for VR interactions.', url: '#', authorName: 'System', downloads: 200, size: '150 MB' },
  { id: 'da4', labId: 'l4', title: 'Startup Financial Model', type: 'Template', description: 'Excel sheet for calculating runway and burn rate.', url: '#', authorName: 'Lecturer Mulunesh', downloads: 340, size: '1 MB' },
];

let MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', assetId: 'a2', studentId: 's2', date: new Date().toISOString().split('T')[0], startTime: '10:00', durationHours: 2, purpose: 'Prototyping chassis' }
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
  },

  /**
   * Mimics getting Social Media Posts from Facebook
   */
  async getSocialPosts(): Promise<SocialPost[]> {
    await delay(700);
    return [...MOCK_SOCIAL_POSTS];
  },

  /**
   * Get all projects
   */
  async getProjects(): Promise<Project[]> {
    await delay(600);
    return [...MOCK_PROJECTS];
  },

  /**
   * Create a new project
   */
  async addProject(project: Omit<Project, 'id' | 'timestamp'>): Promise<Project> {
    await delay(1000);
    
    const newProject: Project = {
      ...project,
      id: `p${Date.now()}`,
      timestamp: new Date().toISOString().split('T')[0]
    };
    
    MOCK_PROJECTS.unshift(newProject); // Add to top

    // Update student record
    const student = MOCK_STUDENTS.find(s => s.id === project.authorId);
    if (student) {
      if (!student.projectIds) student.projectIds = [];
      student.projectIds.push(newProject.id);
      
      // Award points for creating a project
      student.points += 50; 
    }

    return newProject;
  },

  // --- LAB MANAGER SERVICES ---

  async getLabs(): Promise<Lab[]> {
    await delay(400);
    return [...MOCK_LABS];
  },

  async getAssets(labId: string): Promise<Asset[]> {
    await delay(500);
    return MOCK_ASSETS.filter(a => a.labId === labId);
  },

  async getDigitalAssets(labId: string): Promise<DigitalAsset[]> {
    await delay(500);
    return MOCK_DIGITAL_ASSETS.filter(d => d.labId === labId);
  },

  async getBookings(assetId: string): Promise<Booking[]> {
    await delay(400);
    return MOCK_BOOKINGS.filter(b => b.assetId === assetId);
  },

  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    await delay(800);
    const newBooking: Booking = {
      ...booking,
      id: `b${Date.now()}`
    };
    MOCK_BOOKINGS.push(newBooking);
    
    // Also update asset status temporarily for demo
    const asset = MOCK_ASSETS.find(a => a.id === booking.assetId);
    if (asset && booking.date === new Date().toISOString().split('T')[0]) {
      asset.status = 'In Use';
    }

    return newBooking;
  },

  async reportAssetIssue(assetId: string): Promise<void> {
    await delay(500);
    const asset = MOCK_ASSETS.find(a => a.id === assetId);
    if (asset) {
      asset.status = 'Maintenance';
    }
  }
};
