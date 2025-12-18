# ApnaStudent - Student Project Portfolio Platform 🚀

**ApnaStudent** is a modern platform designed for students to showcase their academic and personal projects. It acts as a centralized portfolio where students can upload project details, GitHub links, and live demos, creating a public profile to share with recruiters and peers.

Built with a **Spring Boot** backend and a **React (Vite)** frontend, it features a premium "Glassmorphism" UI, secure authentication via **Clerk**, and a flexible **MongoDB** database.

---

## ✨ Key Features

### 👨‍🎓 For Students
*   **Portfolio Profile**: A public, shareable profile page (e.g., `apnastudent.com/u/john_doe`) showcasing all your work.
*   **Project Management**: Add, **Edit**, and Delete projects.
*   **Markdown Support**: Write rich project descriptions with headers, code blocks, and lists (just like GitHub Readmes).
*   **Profile Customization**: **Edit** your Bio, Name, and University ID (USN) directly from your profile.
*   **Secure Login**: Seamless sign-in/sign-up using **Clerk** (Google/GitHub/Email).

### 🔎 For Recruiters & Peers
*   **Global Search**: Find students by Name or Username instantly.
*   **Project Explorer**: Browse projects with links to source code (GitHub) and live demos.

### 🛡️ Admin Features
*   **Admin Dashboard**: View platform statistics (Total Users, Total Projects).
*   **User Management**: Search for users and delete accounts (moderation).

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), TypeScript, Tailwind CSS (Glassmorphism Design).
*   **Backend**: Java 21, Spring Boot 3.4.
*   **Database**: **MongoDB** (switched from SQL for flexibility).
*   **Authentication**: Clerk.com.
*   **Deployment**: Render (Backend & DB), Vercel (Frontend).

---

## 🚀 Getting Started

### Prerequisites
*   Node.js & npm
*   Java 21 (JDK)
*   MongoDB Cluster (Atlas) or Local MongoDB

### 1. Backend Setup
1.  Navigate to `backend/`:
    ```bash
    cd backend
    ```
2.  Configure Database:
    *   The app uses `MONGO_URL` from environment variables.
    *   For local dev, it defaults to `mongodb://localhost:27017/apnastudent_db`.
3.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
    *Server starts on `http://localhost:8080`*

### 2. Frontend Setup
1.  Navigate to `frontend/`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up Environment Variables (`.env`):
    ```env
    VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
    VITE_API_URL=http://localhost:8080/api
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
    *App opens at `http://localhost:5173`*

---

## 📦 Deployment

### Backend (Render)
*   **Type**: Web Service (Docker)
*   **Env Vars**:
    *   `MONGO_URL`: `mongodb+srv://<user>:<pass>@cluster...`
    *   `PORT`: `8080`

### Frontend (Vercel)
*   **Type**: Vite SPA
*   **Env Vars**:
    *   `VITE_API_URL`: `https://your-backend.onrender.com/api`
    *   `VITE_CLERK_PUBLISHABLE_KEY`: `pk_test_...`

---

### 🤝 Contributing
Built with ❤️ by **Vijay**.
