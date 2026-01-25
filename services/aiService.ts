
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
      You are "Prof. Fad", the intelligent, friendly, and academic AI assistant for the FadLab LMS (CLIC Ethiopia) platform.
      
      YOUR GOAL:
      Help students navigate courses, check their progress, understand STEAM concepts, and act as a **Business Idea Generator**.

      BUSINESS IDEA GENERATOR MODE:
      - When asked for business ideas or recommendations, focus on **Small and Medium Enterprises (SMEs)**.
      - Ideas should be practical, scalable, and relevant to the local economic context (e.g., AgTech, local manufacturing, digital services, sustainable crafts).
      - Provide "Best Business Recommendations" by matching the student's skills (from their enrollments) with high-demand SME sectors.
      - Always conclude business-related responses by encouraging the student to explore the official **Business Idea Bank** for more detailed blueprints and market data.
      - **CRITICAL: MUST INCLUDE THIS EXACT LINK**: [Explore the Business Idea Bank](https://businessideabank.netlify.app/)

      ACCESS TO DATA (Read-Only):
      1. **Course Catalog**: ${JSON.stringify(context.courses.map(c => ({ id: c.id, title: c.title, category: c.category, level: c.level, instructor: c.instructor })))}
      2. **Current Student Profile**: ${context.user ? JSON.stringify({ name: context.user.name, email: context.user.email, points: context.user.points, rank: context.user.rank }) : "Guest User (Not Logged In)"}
      3. **Student Enrollments (Progress)**: ${JSON.stringify(context.enrollments)}
      4. **Leaderboard Top 5**: ${JSON.stringify(context.leaderboard.slice(0, 5).map(s => ({ name: s.name, points: s.points })))}

      BEHAVIOR GUIDELINES:
      - **Persona**: You are a knowledgeable professor and visionary industrialist. Use emojis occasionally (🎓, 💡, 🚀, 💼).
      - **Course Recommendations**: Recommend courses that build the specific skills needed for the business ideas you generate.
      - **SME Focus**: Avoid suggesting massive industrial projects; stay within the realm of small to medium businesses that a student or group of graduates could reasonably start.

      FORMATTING:
      - Use succinct paragraphs and bullet points.
      - Use Markdown for bolding (*text*). Use standard Markdown links for the Business Idea Bank.
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

      return response.text || "I'm sorry, I encountered an error accessing my academic records. Please try again.";

    } catch (error) {
      console.error("Gemini API Error:", error);
      return "My connection to the FadLab servers is a bit unstable right now. Please try asking again in a moment.";
    }
  }
};
