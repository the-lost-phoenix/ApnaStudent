# ApnaStudent - Student Portfolio & Project Showcase Platform

**ApnaStudent** is a modern, full-stack web application designed for students to showcase their projects, skills, and portfolios in a professional and visually stunning way. It connects students with peers and potential recruiters by allowing them to create dynamic profiles and share their work.

![ApnaStudent Hero Section](https://via.placeholder.com/1200x600?text=ApnaStudent+Hero+Preview)
*(Replace with actual screenshot)*

---

## 🚀 Key Features

*   **🎓 Student Portfolios**: Create a unique profile (`apnastudent.com/username`) to share your bio, USN, and skills.
*   **📂 Project Showcase**: Upload project details, GitHub links, live demos, and rich README documentation.
*   **🔍 Global Search**: Find students by name or username instantly with our powerful search bar.
*   **🔐 Secure Authentication**: Seamless Login/Register flow powered by **Clerk** (supports Google Auth).
*   **🎨 Glassmorphism UI**: A premium, "Space/Dark Mode" aesthetic built with Tailwind CSS and advanced animations.
*   **🛠️ Admin Dashboard**: Manage users, view platform statistics, and moderate content.
*   **📱 Mobile Responsive**: Fully optimized for all devices.

---

## 🛠️ Tech Stack

### Frontend
*   **React (Vite)**: Fast, modern UI library.
*   **Tailwind CSS**: Utility-first styling for the Glassmorphism design.
*   **Clerk**: Best-in-class authentication and user management.
*   **Axios**: For API communication.

### Backend
*   **Java 21 (Spring Boot)**: Robust, enterprise-grade backend API.
*   **Spring Data JPA (Hibernate)**: ORM for database interactions.
*   **Database**:
    *   **Local**: MySQL (for development).
    *   **Production**: PostgreSQL (Render Cloud DB).
*   **Docker**: Containerized deployment support.

---

## ⚙️ Local Setup Guide

Follow these steps to run the project on your machine.

### Prerequisites
*   Java 21 (JDK)
*   Node.js (v18+)
*   MySQL Server (Running locally)

### 1. Backend Setup
1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Open `src/main/resources/application.properties` and update your MySQL password:
    ```properties
    spring.datasource.password=YOUR_MYSQL_PASSWORD
    ```
3.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
    The server will start at `http://localhost:8080`.

### 2. Frontend Setup
1.  Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in `frontend/` and add:
    ```env
    VITE_CLERK_PUBLISHABLE_KEY=pk_test_... (Get this from Clerk Dashboard)
    VITE_API_URL=http://localhost:8080/api
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
    The app will open at `http://localhost:5173`.

---

## ☁️ Deployment

This project is configured for cloud deployment.

*   **Backend**: Deploy on **Render** (using Docker runtime).
*   **Database**: Hosted **PostgreSQL** on Render.
*   **Frontend**: Deploy on **Vercel** or **Netlify**.

> For detailed deployment instructions, please refer to the internal [DEPLOYMENT.md](DEPLOYMENT.md) guide (if available) or check the project wiki.

---

## 🤝 Contributing

Contributions are welcome!
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

---

**Developed with ❤️ by [Your Name]**
