import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn, useAuth, useClerk } from '@clerk/clerk-react';
import { loginUser } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const { isLoaded, signIn, setActive } = useSignIn();
    const { isSignedIn, userId } = useAuth();
    const { signOut } = useClerk();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    // AUTO-LOGIN: If Clerk says we have a session, just redirect!
    useEffect(() => {
        if (isLoaded && isSignedIn && userId) {
            console.log("Clerk Session Found (useEffect)! Redirecting...");
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                navigate('/dashboard');
            } else {
                // If we are signed in but don't have local user data, try to fetch it?
                // Or just let them click login, which will catch the 'already signed in' and fix it.
            }
        }
    }, [isLoaded, isSignedIn, userId, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        // Pre-check: If already signed in, just go!
        if (isSignedIn) {
            console.log("User is already signed in (Pre-check). Redirecting...");
            await syncAndRedirect(email); // Attempt sync with email entered
            return;
        }

        try {
            // 1. Authenticate with Clerk
            const result = await signIn.create({
                identifier: email,
                password: password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                await syncAndRedirect(email);
            } else {
                console.error(JSON.stringify(result, null, 2));
                alert("Login incomplete. Check console.");
            }
        } catch (err: any) {
            console.error("Clerk Login Error", err);
            const errorMessage = err.errors?.[0]?.message || err.message || JSON.stringify(err);

            // Gracefully handle "You're already signed in"
            if (errorMessage && (errorMessage.toLowerCase().includes("already signed in") || errorMessage.includes("session_exists"))) {
                console.log("Already signed in error caught. Redirecting...");
                await syncAndRedirect(email);
            } else {
                alert("Login Failed: " + errorMessage);
            }
        }
    };

    // Helper to fetch backend data and redirect
    const syncAndRedirect = async (userEmail: string) => {
        try {
            // If email is empty (auto-redirect case), we might fail here if we relying on input.
            // But if user just typed email and clicked login, we have it.
            // If auto-redirect, we might rely on localStorage.

            if (!userEmail) {
                const stored = JSON.parse(localStorage.getItem("user") || '{}');
                if (stored.email) userEmail = stored.email;
                else {
                    // Fallback: If we are signed in but have no email, we might need to fetch from Clerk user object
                    // For now, let's just assume if they are stuck, they entered the email.
                    alert("Please enter your email to sync your profile.");
                    return;
                }
            }

            const user = await loginUser(userEmail);
            localStorage.setItem("user", JSON.stringify(user));

            if (isAdminLogin && user.role !== 'ADMIN') {
                alert("Access Denied: You are not an Admin.");
                localStorage.removeItem("user");
                return;
            }

            alert(`Welcome back, ${user.name}!`);
            if (user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (backendError) {
            console.error("Backend login sync failed:", backendError);
            alert("Session active, but could not fetch user profile from Backend. Ensure your email matches!");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
            {/* Background Decor */}
            <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 ${isAdminLogin ? 'bg-red-500/20' : 'bg-orange-500/20'}`}></div>
            <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 ${isAdminLogin ? 'bg-orange-500/10' : 'bg-blue-500/10'}`}></div>

            <div className="w-full max-w-md glass-card p-10 relative z-10 animate-fade-in-up border border-white/10">
                <div className="text-center mb-10">
                    <h2 className={`text-4xl font-bold bg-clip-text text-transparent mb-2 transition-all duration-500 ${isAdminLogin ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-white to-gray-400'}`}>
                        {isAdminLogin ? 'Admin Portal' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-400">
                        {isAdminLogin ? 'Authorized personnel only.' : 'Enter your credentials to access your portfolio.'}
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="glass-input focus:border-opacity-50 transition-colors"
                            placeholder="you@university.edu"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="glass-input focus:border-opacity-50 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full font-bold py-3 rounded-xl transition-all duration-300 shadow-lg ${isAdminLogin
                            ? 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 shadow-red-500/20'
                            : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:scale-[1.02] shadow-orange-500/20'
                            }`}
                    >
                        {isAdminLogin ? 'Access Dashboard' : 'Login to Dashboard'}
                    </button>

                    <button
                        type="button"
                        onClick={() => signOut()}
                        className="w-full text-xs text-red-500 hover:text-red-400 uppercase tracking-widest mt-4"
                    >
                        Force Logout (Reset Session)
                    </button>

                </form>

                <div className="mt-8 flex flex-col gap-4 text-center text-sm">
                    <p className="text-gray-500">
                        New here? <button onClick={() => navigate('/register')} className="text-orange-400 hover:text-orange-300 font-medium hover:underline transition-all">Create an account</button>
                    </p>

                    <button
                        onClick={() => setIsAdminLogin(!isAdminLogin)}
                        className={`text-xs font-semibold uppercase tracking-wider transition-colors ${isAdminLogin ? 'text-red-400 hover:text-red-300' : 'text-gray-600 hover:text-gray-400'}`}
                    >
                        {isAdminLogin ? '← Back to Student Login' : 'Admin Access'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;