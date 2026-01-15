
# FadLab LMS - System Architecture & Developer Guide

## 1. Project Overview

**FadLab LMS** is a specialized E-Learning Management System designed for CLIC Ethiopia. Unlike standard LMS platforms, it integrates **Physical Maker Space Management** (FabLabs) with **Digital Learning**. 

### Core Objectives:
1.  **Hybrid Learning**: Combine video/text courses with physical resource booking (3D printers, CNCs).
2.  **Innovation Tracking**: Allow students to upload and showcase projects (Inno-Lab).
3.  **AI Advising**: Provide a context-aware AI assistant ("Prof. Fad") to guide students.
4.  **Low-Code Backend**: Designed to use Google Sheets as a database for easy administration by non-technical staff in the future.

---

## 2. Technology Stack

*   **Frontend Framework**: React 19 (TypeScript) via Vite.
*   **Styling**: Tailwind CSS (Utility-first, with Dark Mode support).
*   **State Management**: React Context / Local State (Lifted to `App.tsx`).
*   **Routing**: Conditional View Rendering (SPA) wrapped in `HashRouter`.
*   **Icons**: Lucide React.
*   **Charts**: Recharts.
*   **AI Integration**: Google GenAI SDK (`@google/genai`) accessing Gemini models.

---

## 3. Directory Structure

```
/
├── public/                 # Static assets (images, docs, models)
│   ├── docs/               # PDF manuals repository
│   ├── models/             # STL/DXF fabrication files
│   └── google_drive/       # Mount point for future Drive sync
├── src/
│   ├── components/         # UI Components (Views, Modals, Widgets)
│   ├── services/           # Business Logic & API Abstractions
│   │   ├── sheetService.ts # Data Layer (Mock/Google Sheets)
│   │   └── aiService.ts    # AI Layer (Gemini)
│   ├── types.ts            # TypeScript Interfaces (The Data Model)
│   └── App.tsx             # Main Controller & State Holder
└── index.html              # Entry Point
```

---

## 4. Key Architectural Concepts

### A. The Data Layer (`sheetService.ts`)
The application currently runs on a **Mock Service Architecture**.
*   **Current Behavior**: All data (Students, Courses, Assets) is stored in local arrays (`MOCK_DATA`) within `sheetService.ts`. Functions simulate network latency with promises.
*   **Future Integration**: This service is designed to be swapped. The function signatures (e.g., `getCourses()`, `enrollStudent()`) should remain the same, but the internal logic should be updated to make HTTP calls to the **Google Sheets API**.

### B. View Management
The app uses a **State-Based Router** in `App.tsx`:
1.  `currentView` state determines which main component renders (`Dashboard`, `CourseList`, `LabManager`, etc.).
2.  Sidebar navigation updates this state.
3.  This approach ensures instant transitions and preserves state (like chat history) while the app is open.

### C. Lab Resource Management
The Lab Manager handles two distinct types of assets:
1.  **Physical Assets**: Items that require booking (e.g., 3D Printers).
    *   *Logic*: Check Availability -> Book Date/Time -> Update Status.
    *   *Files*: `LabManager.tsx`, `LabDetail.tsx`, `AssetBookingModal.tsx`.
2.  **Digital Assets**: Files that are downloaded (e.g., Scripts, Models).
    *   *Logic*: Filter by Type -> Download Link.
    *   *Files*: `LabDetail.tsx` (Digital Tab).

### D. AI Integration (RAG-Lite)
The Chatbot (`ChatBot.tsx` + `aiService.ts`) implements a lightweight **Retrieval-Augmented Generation** pattern.
1.  **Context Injection**: When a user sends a message, `aiService.sendMessage` captures the *current application state* (User Profile, Enrollments, Leaderboard, Course List).
2.  **Prompt Engineering**: This data is stringified and injected into the `systemInstruction` of the Gemini call.
3.  **Result**: The AI "knows" who the user is and what they are studying without needing a persistent vector database.

---

## 5. Data Models (`types.ts`)

The application relies on strict typing to ensure stability.

*   **`Student`**: Extends standard user auth with gamification (`points`, `rank`) and academic tracking (`enrolledCourses`).
*   **`Lab` & `Asset`**: Defines physical spaces. `Asset` includes `subCategory` and `specs` for filtering.
*   **`Project`**: The core unit of the "Inno-Lab". Represents student work with status flags (`Idea` vs `Launched`).

---

## 6. Extension Points (For Future Developers)

### How to Connect Real Google Sheets
1.  Enable Google Sheets API in Google Cloud Console.
2.  Create an API Key or OAuth Client ID.
3.  Rewrite `services/sheetService.ts`:
    ```typescript
    // Example replacement
    async getCourses(): Promise<Course[]> {
       const response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: 'YOUR_SHEET_ID',
          range: 'Courses!A:Z'
       });
       return mapRowsToCourses(response.result.values);
    }
    ```

### How to Connect Google Drive
1.  The `public/google_drive` folder is a placeholder.
2.  **Method A (Build Time)**: Write a Node.js script to download files from Drive to `public/google_drive` before running `npm build`.
3.  **Method B (Runtime)**: Update `sheetService` to store Google Drive **File IDs** instead of local paths. Update UI components to use the Google Drive Embed API to display these files.

### How to Add Real Authentication
1.  Replace `components/Login.tsx` logic.
2.  Integrate Firebase Auth or Auth0.
3.  Update `auth` state in `App.tsx` to store the returned JWT/User Object.

---

## 7. Styling Guidelines

*   **Dark Mode**: Every component MUST support dark mode. Use `dark:` variants for all color classes (e.g., `bg-white dark:bg-slate-900`).
*   **Responsiveness**: Mobile-first design. Use `hidden md:block` for sidebar logic.
*   **Animations**: Use `animate-fade-in` and `animate-scale-in` (defined in `index.css`/Tailwind config) for smoother UI transitions.

