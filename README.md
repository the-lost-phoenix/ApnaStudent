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

### Production (Linode VPS - Arch Linux) 🚀
*   **Operating System**: **Arch Linux** (chosen for minimal footprint and rolling updates).
*   **Database**: MongoDB (via **Docker** container).
*   **Process Manager**: **PM2** (ensures 24/7 uptime for Backend & Frontend).

**Deployment Commands (Cheatsheet):**
1.  **System Setup (Arch)**:
    ```bash
    pacman -Syu git docker base-devel jdk21-openjdk maven nodejs npm
    systemctl start docker
    ```
2.  **Database**:
    ```bash
    docker run -d -p 27017:27017 --name mongo-db --restart always mongo:latest
    ```
3.  **Backend**:
    ```bash
    # IMPORTANT: Pass the admin email to sync permissions with Clerk
    pm2 start java --name "backend" -- -jar target/backend-0.0.1-SNAPSHOT.jar --app.admin.email=YOUR_ADMIN_EMAIL
    ```
4.  **Frontend**:
    ```bash
    pm2 start "serve -s dist -l 5173" --name "frontend"
    ```

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
