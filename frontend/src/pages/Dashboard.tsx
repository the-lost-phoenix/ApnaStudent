import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProject, getStudentProjects, deleteProject } from '../services/api';
import UserSearch from '@/components/UserSearch';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [activeProject, setActiveProject] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        githubUrl: '',
        demoUrl: '',
        readmeContent: ''
    });

    // 1. Check if user is logged in
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate('/login'); // Kick them out if not logged in
        } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchMyProjects(parsedUser.id);
        }
    }, []);

    const fetchMyProjects = async (userId: number) => {
        const data = await getStudentProjects(userId);
        setProjects(data);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate('/');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            // Send data to backend
            // IMPORTANT: We must send the "user" object so the backend knows who owns this project
            const payload = {
                ...formData,
                user: { id: user.id }
            };

            await addProject(payload);
            alert("Project Added Successfully!");
            setShowAddForm(false); // Close form
            fetchMyProjects(user.id); // Refresh list

            // Clear form
            setFormData({ title: '', description: '', githubUrl: '', demoUrl: '', readmeContent: '' });
        } catch (error) {
            console.error("Failed to add project", error);
            alert("Error adding project. Check console.");
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen pb-20">
            {/* TOP NAVIGATION */}
            <div className="fixed top-0 left-0 w-full z-50 glass-card rounded-none border-x-0 border-t-0 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-500 flex items-center justify-center font-bold text-black text-lg">
                        {user.name.charAt(0)}
                    </div>
                    <div className="hidden md:block">
                        <h1 className="text-xl font-bold">Welcome, {user.name}</h1>
                        <p className="text-xs text-gray-400">Student Developer</p>
                    </div>
                </div>

                {/* Dashboard Search */}
                <div className="flex-1 max-w-md mx-8">
                    <UserSearch variant="header" placeholder="Find students..." />
                </div>

                <div className="flex gap-4">
                    <button onClick={() => navigate(`/${user.username || user.id}`)} className="text-sm text-gray-300 hover:text-white transition-colors">
                        View Profile
                    </button>
                    <button onClick={handleLogout} className="text-sm px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 rounded-lg transition-all">
                        Logout
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="pt-32 px-6 max-w-7xl mx-auto animate-fade-in-up">

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-bold mb-2">My Projects</h2>
                        <p className="text-gray-400">Manage and showcase your work.</p>
                    </div>

                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${showAddForm ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/20 hover:scale-105'}`}
                    >
                        {showAddForm ? "✖ Close Form" : "+ Add New Project"}
                    </button>
                </div>

                {/* ADD PROJECT FORM (Collapsible) */}
                {showAddForm && (
                    <div className="mb-12 glass-card p-8 animate-fade-in-up">
                        <h3 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Add Project Details</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 mb-1 block">Project Title</label>
                                    <input className="glass-input" placeholder="e.g. AI Content Generator" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 mb-1 block">Short Description</label>
                                    <input className="glass-input" placeholder="One line summary..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 mb-1 block">GitHub Repository</label>
                                    <input className="glass-input" placeholder="https://github.com/..." value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 mb-1 block">Live Demo Link</label>
                                    <input className="glass-input" placeholder="https://my-app.vercel.app" value={formData.demoUrl} onChange={e => setFormData({ ...formData, demoUrl: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 mb-1 block">README / Documentation</label>
                                <textarea className="glass-input min-h-[200px] font-mono text-sm" placeholder="# Project Documentation" value={formData.readmeContent} onChange={e => setFormData({ ...formData, readmeContent: e.target.value })}></textarea>
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" className="btn-primary">
                                    🚀 Publish Project
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* PROJECTS GRID */}
                {projects.length === 0 && !showAddForm ? (
                    <div className="text-center py-32 rounded-3xl border-2 border-dashed border-gray-800 bg-white/5">
                        <p className="text-2xl text-gray-500 font-bold mb-2">No projects yet</p>
                        <p className="text-gray-600 mb-6">Start building your portfolio by adding a project.</p>
                        <button onClick={() => setShowAddForm(true)} className="text-orange-500 underline hover:text-orange-400">Add your first project</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((p, idx) => (
                            <div
                                key={p.id}
                                // Added onClick to open modal
                                onClick={() => setActiveProject(p)}
                                className="glass-card p-6 hover:border-orange-500/50 hover:-translate-y-2 transition-all duration-300 group relative cursor-pointer"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Delete Button (Absolute top-right) */}
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (window.confirm("Delete this project?")) {
                                            await deleteProject(p.id);
                                            fetchMyProjects(user.id);
                                        }
                                    }}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    title="Delete Project"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>

                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold group-hover:text-orange-400 transition-colors pr-8">{p.title}</h3>
                                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">Project</span>
                                </div>

                                <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">{p.description}</p>

                                <div className="mt-auto pt-4 border-t border-white/5 flex gap-3">
                                    {p.githubUrl && (
                                        <a
                                            href={p.githubUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>GitHub
                                        </a>
                                    )}
                                    {p.demoUrl && (
                                        <a
                                            href={p.demoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>Demo
                                        </a>
                                    )}
                                    {!p.githubUrl && !p.demoUrl && <p className="text-xs text-gray-600 italic">No links added</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
        </div>
    );
};

export default Dashboard;