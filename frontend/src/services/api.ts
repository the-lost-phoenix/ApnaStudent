import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const api = axios.create({
    baseURL: API_URL,
});

// User APIs
export const searchStudents = async (name: string) => {
    try {
        const response = await api.get(`/users/search?name=${name}`);
        return response.data;
    } catch (error) {
        console.error("Error searching students:", error);
        return [];
    }
};

// Project APIs (We will use these later)
export const getStudentProjects = async (userId: number) => {
    const response = await api.get(`/projects/user/${userId}`);
    return response.data;
};

// New function to fetch student by username
export const getStudentByUsername = async (username: string) => {
    const response = await api.get(`/users/u/${username}`);
    return response.data;
};


export const getUserById = async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

// Authentication APIs

// 1. Register a new user
export const registerUser = async (userData: any) => {
    // userData should be { name, email, password, usn, bio, role: "STUDENT" }
    const response = await api.post("/users/register", userData);
    return response.data;
};

// 1.5 Verify OTP (Obsolete with Clerk)
// export const verifyUser = async (email: string, otp: string) => {
//     const response = await api.post(`/users/verify?email=${email}&otp=${otp}`);
//     return response.data;
// };

// 2. Login (For now, we just check if the email exists and matches)
// In a real production app, we would use JWT tokens.
// For learning, we will match the email and password manually on the frontend or backend.
export const loginUser = async (email: string) => {
    const response = await api.get(`/users/find?email=${email}`);
    return response.data;
};

// 3. Add a New Project
export const addProject = async (projectData: any) => {
    const response = await api.post("/projects/add", projectData);
    return response.data;
};

// 4. Delete a Project
export const deleteProject = async (id: number) => {
    await api.delete(`/projects/${id}`);
};

// ---------------- ADMIN APIs ----------------

export const getAppStats = async () => {
    const response = await api.get("/users/stats");
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

export const deleteUser = async (id: number) => {
    await api.delete(`/users/${id}`);
};

export const adminAddUser = async (userData: any) => {
    const response = await api.post("/users/add", userData);
    return response.data;
};