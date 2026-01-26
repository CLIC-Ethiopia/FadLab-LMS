
import { supabase } from './supabaseClient';
import { 
  Course, Student, Enrollment, AdminStats, SocialPost, 
  Project, Lab, Asset, Booking, DigitalAsset, CourseCategory 
} from '../types';

// Hardcoded admin for legacy compatibility during migration
const ADMIN_EMAIL = "frehun.demissie@gmail.com";
const ADMIN_PASS = "Assefa2!";

export const supabaseService = {

  // --- AUTHENTICATION ---

  async verifyAdmin(email: string, pass: string): Promise<Student> {
    // Note: In a real app, use supabase.auth.signInWithPassword
    // Here we maintain the existing simple check logic but fetch profile from DB
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error || !data) throw new Error("Admin profile not found in database.");
      return this.mapProfile(data);
    }
    throw new Error("Invalid Admin Credentials");
  },

  async loginWithSocial(provider: string): Promise<Student> {
    // MOCK LOGIN FLOW for "Student Demo" to avoid full Auth rewrite immediately.
    // In production, call supabase.auth.signInWithOAuth({ provider: 'google' })
    
    const demoEmail = "student.demo@gmail.com";
    
    // Check if demo user exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', demoEmail)
      .single();

    if (existingUser) {
      return this.mapProfile(existingUser);
    }

    // Create if not exists
    const newUser = {
      id: `s_${Date.now()}`,
      email: demoEmail,
      name: "New Student",
      avatar: `https://picsum.photos/100/100?random=${Date.now()}`,
      role: 'student',
      points: 0,
      rank: 0,
      joined_date: new Date().toISOString()
    };

    const { error } = await supabase.from('profiles').insert(newUser);
    if (error) throw new Error("Failed to create demo user: " + error.message);
    
    return this.mapProfile(newUser);
  },

  // --- COURSES ---

  async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase.from('courses').select('*');
    if (error) { console.error(error); return []; }
    
    return data.map((c: any) => ({
      id: c.id,
      title: c.title,
      category: c.category as CourseCategory,
      durationHours: c.duration_hours,
      masteryPoints: c.mastery_points || 0,
      description: c.description,
      instructor: c.instructor,
      thumbnail: c.thumbnail,
      level: c.level,
      videoUrl: c.video_url,
      resources: c.resources || [],
      learningPoints: c.learning_points || [],
      prerequisites: c.prerequisites || [],
      curriculum: c.curriculum || []
    }));
  },

  async addCourse(course: Omit<Course, 'id'>): Promise<Course> {
    const newId = `c${Date.now()}`;
    const dbCourse = {
      id: newId,
      title: course.title,
      category: course.category,
      duration_hours: course.durationHours,
      mastery_points: course.masteryPoints,
      description: course.description,
      instructor: course.instructor,
      thumbnail: course.thumbnail,
      level: course.level,
      video_url: course.videoUrl,
      resources: course.resources,
      learning_points: course.learningPoints,
      prerequisites: course.prerequisites,
      curriculum: course.curriculum
    };

    const { error } = await supabase.from('courses').insert(dbCourse);
    if (error) throw error;
    return { ...course, id: newId };
  },

  async deleteCourse(courseId: string): Promise<void> {
    await supabase.from('courses').delete().eq('id', courseId);
  },

  // --- STUDENTS & ENROLLMENTS ---

  async getStudentProfile(email: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !data) return null;
    return this.mapProfile(data);
  },

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId);
      
    if (error) return [];
    return data.map((e: any) => ({
      studentId: e.student_id,
      courseId: e.course_id,
      progress: e.progress,
      plannedHoursPerWeek: e.planned_hours,
      startDate: e.start_date,
      targetCompletionDate: e.target_date,
      xpEarned: e.xp_earned || 0
    }));
  },

  async enrollStudent(studentId: string, courseId: string, plan: any): Promise<Enrollment> {
    // 1. Check if already enrolled
    const { data: existing } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .single();

    const enrollmentData = {
      student_id: studentId,
      course_id: courseId,
      planned_hours: plan.hoursPerWeek,
      start_date: plan.startDate,
      target_date: plan.targetDate,
      progress: existing ? existing.progress : 0
    };

    if (existing) {
       await supabase
        .from('enrollments')
        .update(enrollmentData)
        .eq('id', existing.id);
    } else {
       await supabase
        .from('enrollments')
        .insert(enrollmentData);
       
       // Update local profile enrolledCourses via side-effect if needed, 
       // but strictly we just read from Enrollments table now.
    }

    return {
      studentId,
      courseId,
      progress: enrollmentData.progress,
      plannedHoursPerWeek: enrollmentData.planned_hours,
      startDate: enrollmentData.start_date,
      targetCompletionDate: enrollmentData.target_date
    };
  },

  async updateProgress(studentId: string, courseId: string, progress: number): Promise<Enrollment | null> {
    const { data, error } = await supabase
      .from('enrollments')
      .update({ progress })
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .select()
      .single();

    if (error || !data) return null;

    // Check if completed to award XP
    if (progress === 100) {
       const { data: course } = await supabase.from('courses').select('mastery_points').eq('id', courseId).single();
       if (course) {
         await this.addPoints(studentId, course.mastery_points || 0);
       }
    }

    return {
      studentId: data.student_id,
      courseId: data.course_id,
      progress: data.progress,
      plannedHoursPerWeek: data.planned_hours,
      startDate: data.start_date,
      targetCompletionDate: data.target_date
    };
  },

  async updateStudentAvatar(studentId: string, avatarUrl: string): Promise<void> {
    await supabase.from('profiles').update({ avatar: avatarUrl }).eq('id', studentId);
  },

  // --- GAMIFICATION ---

  async getLeaderboard(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('points', { ascending: false });
      
    if (error) return [];
    return data.map(this.mapProfile);
  },

  async addPoints(studentId: string, points: number) {
    // Need to fetch current first to increment safely
    const { data: student } = await supabase.from('profiles').select('points').eq('id', studentId).single();
    if (student) {
      await supabase.from('profiles').update({ points: (student.points || 0) + points }).eq('id', studentId);
    }
  },

  // --- PROJECTS ---

  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      tags: p.tags || [],
      thumbnail: p.thumbnail,
      authorId: p.author_id,
      authorName: p.author_name,
      authorAvatar: p.author_avatar,
      likes: p.likes,
      status: p.status,
      githubUrl: p.github_url,
      demoUrl: p.demo_url,
      blogUrl: p.blog_url,
      docsUrl: p.docs_url,
      timestamp: new Date(p.created_at).toLocaleDateString()
    }));
  },

  async addProject(project: Omit<Project, 'id' | 'timestamp'>): Promise<Project> {
    const newId = `p${Date.now()}`;
    const dbProject = {
      id: newId,
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags,
      thumbnail: project.thumbnail,
      author_id: project.authorId,
      author_name: project.authorName,
      author_avatar: project.authorAvatar,
      likes: 0,
      status: project.status,
      github_url: project.githubUrl,
      demo_url: project.demoUrl,
      blog_url: project.blogUrl,
      docs_url: project.docsUrl
    };

    const { error } = await supabase.from('projects').insert(dbProject);
    if (error) throw error;
    
    // Award XP
    await this.addPoints(project.authorId, 50);

    return { 
      ...project, 
      id: newId, 
      timestamp: new Date().toLocaleDateString(),
      likes: 0 
    };
  },

  async likeProject(projectId: string): Promise<void> {
    // Simple increment
    // Note: Concurrency issues possible without an RPC, but acceptable for now.
    const { data } = await supabase.from('projects').select('likes').eq('id', projectId).single();
    if (data) {
       await supabase.from('projects').update({ likes: data.likes + 1 }).eq('id', projectId);
    }
  },

  // --- SOCIAL ---

  async getSocialPosts(): Promise<SocialPost[]> {
    const { data, error } = await supabase.from('social_posts').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data.map((p: any) => ({
      id: p.id,
      source: p.source,
      sourceUrl: p.source_url,
      authorAvatar: p.author_avatar,
      content: p.content,
      image: p.image,
      likes: p.likes,
      comments: p.comments,
      shares: p.shares,
      timestamp: new Date(p.created_at).toLocaleDateString(),
      tags: p.tags || []
    }));
  },

  // --- LABS & ASSETS ---

  async getLabs(): Promise<Lab[]> {
    const { data, error } = await supabase.from('labs').select('*');
    if (error) return [];
    return data.map((l: any) => ({
      id: l.id,
      name: l.name,
      type: l.type,
      description: l.description,
      icon: l.icon,
      capacity: l.capacity,
      location: l.location,
      consumables: l.consumables || []
    }));
  },

  async getAssets(labId: string): Promise<Asset[]> {
    const { data, error } = await supabase.from('assets').select('*').eq('lab_id', labId);
    if (error) return [];
    return data.map((a: any) => ({
      id: a.id,
      labId: a.lab_id,
      name: a.name,
      model: a.model,
      subCategory: a.sub_category,
      status: a.status,
      certificationRequired: a.certification_required,
      image: a.image,
      specs: a.specs || []
    }));
  },

  async getDigitalAssets(labId: string): Promise<DigitalAsset[]> {
    const { data, error } = await supabase.from('digital_assets').select('*').eq('lab_id', labId);
    if (error) return [];
    return data.map((d: any) => ({
      id: d.id,
      labId: d.lab_id,
      title: d.title,
      type: d.type,
      description: d.description,
      url: d.url,
      authorName: d.author_name,
      downloads: d.downloads,
      size: d.size
    }));
  },

  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    const newId = `b${Date.now()}`;
    const dbBooking = {
      id: newId,
      asset_id: booking.assetId,
      student_id: booking.studentId,
      date: booking.date,
      start_time: booking.startTime,
      duration_hours: booking.durationHours,
      purpose: booking.purpose
    };
    
    await supabase.from('bookings').insert(dbBooking);
    
    // Update asset status if booking is today (Simple Logic)
    const today = new Date().toISOString().split('T')[0];
    if (booking.date === today) {
       await supabase.from('assets').update({ status: 'In Use' }).eq('id', booking.assetId);
    }

    return { ...booking, id: newId };
  },

  async reportAssetIssue(assetId: string): Promise<void> {
    await supabase.from('assets').update({ status: 'Maintenance' }).eq('id', assetId);
  },

  // --- ADMIN STATS ---

  async getAdminStats(): Promise<AdminStats> {
    const { count: studentCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
    const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
    const { count: enrollCount } = await supabase.from('enrollments').select('*', { count: 'exact', head: true });
    
    // For course performance, we need to join. Supabase JS doesn't do deep aggregation easily without Views.
    // We will do a simpler fetch for now.
    const { data: courses } = await supabase.from('courses').select('id, title');
    const { data: enrollments } = await supabase.from('enrollments').select('course_id, progress');
    
    const performance = (courses || []).map((c: any) => {
       const relevant = (enrollments || []).filter((e: any) => e.course_id === c.id);
       const completed = relevant.filter((e: any) => e.progress === 100).length;
       return {
         courseId: c.id,
         title: c.title,
         enrolledCount: relevant.length,
         completedCount: completed
       };
    });

    return {
      totalStudents: studentCount || 0,
      totalCourses: courseCount || 0,
      totalEnrollments: enrollCount || 0,
      coursePerformance: performance
    };
  },

  // --- HELPERS ---

  async mapProfile(dbProfile: any): Promise<Student> {
     // We need to fetch enrollment IDs for the profile
     const { data: enrolls } = await supabase.from('enrollments').select('course_id').eq('student_id', dbProfile.id);
     const enrolledCourses = enrolls ? enrolls.map((e: any) => e.course_id) : [];
     
     // Fetch projects
     const { data: projs } = await supabase.from('projects').select('id').eq('author_id', dbProfile.id);
     const projectIds = projs ? projs.map((p: any) => p.id) : [];

     return {
       id: dbProfile.id,
       name: dbProfile.name,
       email: dbProfile.email,
       avatar: dbProfile.avatar,
       role: dbProfile.role as 'student' | 'admin',
       points: dbProfile.points,
       rank: dbProfile.rank,
       enrolledCourses,
       projectIds
     };
  }
};
