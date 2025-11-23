# FadLab LMS - Creative Learning Platform

A comprehensive E-Learning Management System (LMS) designed for CLIC Ethiopia/FadLab. This application features student dashboards, course enrollment, study planning, gamification (leaderboards), and a dedicated administration panel for content management.

## 🏗 Project Architecture & File Structure

The project is built using **React (TypeScript)** and follows a service-based architecture to separate UI logic from data fetching.

### Core Files

*   **`index.html`**: The entry point of the application. It loads the DOM root, imports the Tailwind CSS framework via CDN, and defines global styles (scrollbars, fonts).
*   **`index.tsx`**: The React entry point. It mounts the `App` component into the DOM.
*   **`App.tsx`**: The main application controller. It handles:
    *   Global State (User authentication, Theme toggle, Data loading).
    *   Routing (Switching between Dashboard, Courses, Admin, and Settings views).
    *   Layout (Sidebar navigation and responsive header).
*   **`types.ts`**: The TypeScript definitions. This file defines the shape of all data objects (`Student`, `Course`, `Enrollment`, `AdminStats`) to ensure type safety across the app.

### Services

*   **`services/sheetService.ts`**: The Data Layer.
    *   This file mimics a backend API connected to Google Sheets.
    *   It contains all CRUD (Create, Read, Update, Delete) operations.
    *   *Note*: Currently uses mock data with simulated network delays for demonstration.

### Components (`components/`)

*   **`Login.tsx`**: The authentication screen. Handles student login and provides an "Admin Login" option.
*   **`Dashboard.tsx`**: The main student view. Displays personal progress charts, statistics, and the leaderboard.
*   **`CourseList.tsx`**: A searchable and filterable catalog of all available courses.
*   **`CourseDetailsModal.tsx`**: A detailed view of a specific course showing the syllabus, instructor info, and supplementary resources (videos/docs).
*   **`StudyPlanner.tsx`**: An interactive modal allowing students to set weekly study hours and calculate completion dates.
*   **`AdminDashboard.tsx`**: **(Admin Only)** A secure dashboard for:
    *   Viewing platform statistics (Total enrollments, completion rates).
    *   Adding new courses to the catalog.
    *   Deleting old courses.

---

## 🚀 How to Run Locally

Since this project uses TypeScript and React, it requires a build tool to run on your local machine. We recommend using **Vite**.

### Prerequisites
*   **Node.js** (v18 or higher)
*   **npm** (Node Package Manager)

### Step 1: Scaffold the Project
Open your terminal and create a new Vite project:

```bash
npm create vite@latest fadlab-lms -- --template react-ts
cd fadlab-lms
```

### Step 2: Install Dependencies
Install the required packages used in this project:

```bash
npm install react-router-dom recharts lucide-react
```
*   `react-router-dom`: For routing (if using strict routing, though this app currently uses conditional rendering in App.tsx, this is good practice).
*   `recharts`: For the data visualization charts in the dashboard.
*   `lucide-react`: For the icon set.

### Step 3: Configure Tailwind CSS
While the provided `index.html` uses a CDN, for local development it is best to install Tailwind locally:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js` to scan your files:
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Important for the Dark Mode feature
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#151e2e',
          950: '#020617',
        }
      }
    },
  },
  plugins: [],
}
```
Add the directives to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 4: Move Files
1.  Copy the code from the provided `App.tsx` into `src/App.tsx`.
2.  Create a folder `src/components` and add all component files there.
3.  Create a folder `src/services` and add `sheetService.ts`.
4.  Copy `types.ts` to `src/types.ts`.

### Step 5: Run Development Server
Start the local development server to see your changes in real-time:

```bash
npm run dev
```
Open the link shown (usually `http://localhost:5173`) in your browser.

---

## 📦 Build & Production

To prepare the application for deployment (e.g., to Vercel, Netlify, or GitHub Pages):

1.  **Build the project**:
    This compiles the TypeScript and optimizes the assets.
    ```bash
    npm run build
    ```
    The output will be in the `dist/` folder.

2.  **Preview the build**:
    To test the production build locally before deploying:
    ```bash
    npm run preview
    ```

## 🔑 Key Features to Test

1.  **Role Switching**: Use the "Switch Role (Demo)" button in the sidebar to toggle between Student and Admin views instantly.
2.  **Dark Mode**: Toggle the Moon/Sun icon to test the dark theme implementation.
3.  **Admin Functions**:
    *   Switch to Admin.
    *   Go to "Admin Panel".
    *   Try adding a new course (it will appear in the list).
    *   Try deleting a course.
4.  **Student Functions**:
    *   Go to "All Courses".
    *   Click a course to see "Details".
    *   Click "Enroll" to set up a study plan.
    *   Check the "Dashboard" to see the new enrollment.
