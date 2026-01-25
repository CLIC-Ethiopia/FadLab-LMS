
import { GoogleGenAI } from "@google/genai";
import { Course, Student, Enrollment } from '../types';

// Initialize the Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiService = {
  /**
   * Generates a response from Prof. Fad (Gemini) based on user input and app context.
   */
  async sendMessage(
    message: string, 
    context: {
      courses: Course[];
      user: Student | null;
      enrollments: Enrollment[];
      leaderboard: Student[];
    },
    chatHistory: { role: 'user' | 'model'; text: string }[]
  ): Promise<string> {
    
    // Construct the System Instruction with dynamic data and Business Idea Generator logic
    const systemInstruction = `
      You are "Prof. Fad", the intelligent assistant for the FadLab LMS (CLIC Ethiopia) platform.
      
      GOAL: Help students with courses, progress, and SME business recommendations.

      BUSINESS RECOMMENDATIONS:
      - Match student's skill radar (completed courses) to high-demand SME sectors.
      - Use course metadata: ${JSON.stringify(context.courses.map(c => ({ title: c.title, opportunities: c.businessOpportunities })))}
      - Suggest practical SMEs (e.g., AgriTech, local fabrication).
      - Always include the **Idea Bank** link: [Explore Business Idea Bank](https://businessideabank.netlify.app/)

      CONTEXT DATA:
      1. **Course Catalog**: ${JSON.stringify(context.courses.map(c => ({ id: c.id, title: c.title, category: c.category, points: c.masteryPoints })))}
      2. **Student Profile**: ${context.user ? JSON.stringify({ name: context.user.name, xp: context.user.points, title: context.user.rankTitle }) : "Guest"}
      3. **Enrollments**: ${JSON.stringify(context.enrollments.map(e => ({ courseId: e.courseId, progress: e.progress })))}

      BEHAVIOR:
      - Professional, visionary, and industrialist persona.
      - Succinct paragraphs and bullet points.
    `;

    try {
      let conversationLog = "";
      chatHistory.slice(-6).forEach(msg => {
        conversationLog += `${msg.role === 'user' ? 'Student' : 'Prof. Fad'}: ${msg.text}\n`;
      });
      conversationLog += `Student: ${message}\nProf. Fad:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: conversationLog,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      return response.text || "I encountered an error. Please try again.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Connection issues. Please try again in a moment.";
    }
  }
};
