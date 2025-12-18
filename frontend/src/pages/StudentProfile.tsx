import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentProjects, getStudentByUsername, getUserById, deleteUser } from '../services/api';

// Define types for our data so TypeScript is happy
interface Project {
    id: number;
    title: string;
    description: string;
    githubUrl: string;
    demoUrl: string;
    readmeContent: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    bio: string;
    role: string;
    usn: string;
}

const StudentProfile = () => {
    const { username } = useParams(); // Get username from URL
    const navigate = useNavigate();

    // State to store data
    const [student, setStudent] = useState<User | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [activeProject, setActiveProject] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!username) return;
                setLoading(true);

                // 1. Fetch User Details by Username
                const user = await getStudentByUsername(username);
                setStudent(user);

                // 2. Fetch Projects using the user's ID
                const userProjects = await getStudentProjects(user.id);
                setProjects(userProjects);

            } catch (error) {
                console.error("Failed to fetch profile", error);
                // Optional: Redirect to home if user not found
                // navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    // Loading State UI
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-pulse text-2xl text-orange-500 font-bold">Loading Profile...</div>
            </div>
        );
    }

    // Error State UI (if user not found)
    if (!student) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold text-red-500">Student Not Found</h2>
                <button onClick={() => navigate('/')} className="mt-4 text-gray-400 hover:text-white underline">
                    Go Back Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pb-20">
            {/* HERO SECTION */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-orange-500/10 rounded-full blur-[128px] pointer-events-none"></div>

                <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
                    <div className="inline-block p-1 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full mb-6">
                        <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center border-4 border-black">
                            <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-yellow-500">{student.name.charAt(0)}</span>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent mb-6 tracking-tight">
                        {student.name}
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
                        {student.bio || "Student Developer & Tech Enthusiast"}
                    </p>

                    <div className="flex justify-center gap-4">
                        <button onClick={() => navigate('/')} className="px-6 py-3 border border-gray-800 hover:border-white/30 rounded-full text-gray-400 hover:text-white transition-all text-sm">
                            ← Back to Search
                        </button>
                        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-400 text-sm font-mono">
                            USN: {student.usn || "N/A"}
                        </div>
                    </div>
                </div>
            </div>

            {/* PROJECTS SECTION */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-px bg-white/10 flex-grow"></div>
                    <h2 className="text-2xl font-bold text-gray-200">Portfolio Showcase</h2>
                    <div className="h-px bg-white/10 flex-grow"></div>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>🚀 No projects uploaded yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, idx) => (
                            <div
                                key={project.id}
                                // Added onClick to open modal
                                onClick={() => setActiveProject(project)}
                                className="glass-card hover:bg-white/10 transition-all duration-300 group overflow-hidden cursor-pointer"
                                style={{ animationDelay: `${idx * 100} ms` }}
                            >
                                <div className="p-8 h-full flex flex-col">
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <div className="w-10 h-1 bg-orange-500/50 rounded-full group-hover:w-20 transition-all duration-300"></div>
                                    </div>

                                    <p className="text-gray-400 leading-relaxed mb-8 flex-grow">
                                        {project.description}
                                    </p>

                                    <div className="flex gap-3 mt-auto">
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex-1 btn-secondary text-center text-sm py-2 px-0"
                                            >
                                                GitHub
                                            </a>
                                        )}
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex-1 btn-primary text-center text-sm py-2 px-0 bg-none bg-orange-600 hover:bg-orange-500 text-white"
                                            >
                                                Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PROJECT DETAILS MODAL */}
                {activeProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setActiveProject(null)}>
                        <div className="w-full max-w-3xl glass-card p-8 max-h-[80vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setActiveProject(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>

                            <h2 className="text-3xl font-bold text-white mb-2">{activeProject.title}</h2>
                            <p className="text-gray-400 text-lg mb-6">{activeProject.description}</p>

                            <div className="flex gap-4 mb-8">
                                {activeProject.githubUrl && (
                                    <a href={activeProject.githubUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                        View Source
                                    </a>
                                )}
                                {activeProject.demoUrl && (
                                    <a href={activeProject.demoUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-sm text-white font-bold transition-all flex items-center gap-2">
                                        <span>🚀</span> Live Demo
                                    </a>
                                )}
                            </div>

                            <div className="text-gray-300 leading-relaxed font-light whitespace-pre-wrap font-sans border-t border-white/10 pt-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">About this project</h3>
                                {activeProject.readmeContent || "No detailed documentation provided."}
                            </div>
                        </div>
                    </div>
                )}

                {/* DANGER ZONE (Delete Account) - Only visible to owner */}
                {currentUser && currentUser.id === student.id && (
                    <div className="mt-20 border-t border-red-500/20 pt-10">
                        <h3 className="text-red-500 font-bold mb-2">Danger Zone</h3>
                        <div className="flex items-center justify-between bg-red-500/5 border border-red-500/10 p-6 rounded-xl">
                            <div>
                                <p className="text-gray-300 font-semibold">Delete Account</p>
                                <p className="text-xs text-gray-500">Once you delete your account, there is no going back. Please be certain.</p>
                            </div>
                            <button
                                onClick={async () => {
                                    if (window.confirm("Are you sure? This action is IRREVERSIBLE. All your projects will be deleted.")) {
                                        await deleteUser(student.id);
                                        localStorage.removeItem("user");
                                        navigate('/');
                                        alert("Account deleted.");
                                    }
                                }}
                                className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentProfile;