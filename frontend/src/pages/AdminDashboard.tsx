import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppStats, getAllUsers, deleteUser, adminAddUser } from '../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, projects: 0 });
    const [users, setUsers] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: '', email: '', username: '', password: '', role: 'STUDENT' });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.role !== "ADMIN") {
            alert("Access Denied: Admins Only");
            navigate('/');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const statsData = await getAppStats();
            setStats(statsData);
            const usersData = await getAllUsers();
            setUsers(usersData);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (window.confirm("Are you sure? This will delete the user and ALL their projects.")) {
            try {
                await deleteUser(id);
                alert("User deleted.");
                fetchData(); // Refresh
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete user.");
            }
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminAddUser(formData);
            alert("User added successfully!");
            setShowAddModal(false);
            setFormData({ name: '', email: '', username: '', password: '', role: 'STUDENT' }); // Reset
            fetchData();
        } catch (error) {
            console.error("Add user failed", error);
            alert("Failed to add user. Email/Username might be taken.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24 font-sans">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Admin Dashboard</h1>
                    <p className="text-gray-400">Manage platform users and view statistics.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/')} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Go Home</button>
                    <button onClick={() => setShowAddModal(true)} className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">+ Add User</button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="glass-card p-8 flex items-center justify-between border-l-4 border-l-blue-500">
                    <div>
                        <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Total Users</p>
                        <h2 className="text-5xl font-bold">{stats.users}</h2>
                    </div>
                    <div className="text-4xl">👥</div>
                </div>
                <div className="glass-card p-8 flex items-center justify-between border-l-4 border-l-orange-500">
                    <div>
                        <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Total Projects</p>
                        <h2 className="text-5xl font-bold">{stats.projects}</h2>
                    </div>
                    <div className="text-4xl">🚀</div>
                </div>
            </div>

            {/* Users Table */}
            <div className="max-w-7xl mx-auto glass-card overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold">User Database</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Email</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-500">#{u.id}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-xs">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{u.name}</p>
                                                <p className="text-xs text-gray-400">@{u.username || "user" + u.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {u.role || "STUDENT"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm">{u.email}</td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => navigate(`/${u.username || u.id}`)} className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 rounded">View</button>
                                        <button onClick={() => handleDeleteUser(u.id)} className="text-xs px-3 py-1 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded border border-red-500/20">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="glass-card w-full max-w-md p-8 animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-6">Add New User</h2>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <input className="glass-input" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <input className="glass-input" placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            <input className="glass-input" placeholder="Username (Optional)" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                            <input className="glass-input" placeholder="Password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />

                            <select className="glass-input" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                <option value="STUDENT" className="text-black">Student</option>
                                <option value="ADMIN" className="text-black">Admin</option>
                            </select>

                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
