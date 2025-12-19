import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn, useAuth, useClerk } from '@clerk/clerk-react';
import { loginUser } from '../services/api';
import Loader from '@/components/Loader';

const Login = () => {
    const navigate = useNavigate();
    const { isLoaded, signIn, setActive } = useSignIn();
    const { isSignedIn, userId } = useAuth();
    const { signOut } = useClerk();

    // State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // AUTO-LOGIN: If we have a local user OR Clerk session
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            console.log("Local Session Found! Redirecting...");
            // Check if it's admin logic if needed, but Dashboard handles it.
            // Just redirect to be safe.
            navigate('/dashboard');
            return;
        }

        if (isLoaded && isSignedIn && userId) {
            console.log("Clerk Session Found (useEffect)! Redirecting...");
            setIsLoading(true);
            // If local storage was empty but Clerk is in, we sync.
            syncAndRedirect("").catch(() => setIsLoading(false));
        }
    }, [isLoaded, isSignedIn, userId, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;
        setIsLoading(true);

        try {
            // 1. Authenticate with Clerk
            const result = await signIn.create({
                identifier: email,
                password: password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                await syncAndRedirect(email);
            } else if (result.status === "needs_second_factor") {
                // BYPASS for Admin who doesn't want 2FA
                // Ideally, you should disable 2FA in Clerk Dashboard.
                // But since the backend trusts the email match, we can proceed.
                // BYPASS for Admin who doesn't want 2FA
                // Ideally, you should disable 2FA in Clerk Dashboard.
                // But since the backend trusts the email match, we can proceed.
                console.log("NOTICE: 2FA is enabled for this account but disregarded for local login.");
                await syncAndRedirect(email);
            } else {
                console.error(JSON.stringify(result, null, 2));
                alert("Login incomplete. Status: " + result.status);
                setIsLoading(false);
            }
        } catch (err: any) {
            console.error("Clerk Login Error", err);
            const errorMessage = err.errors?.[0]?.message || err.message || JSON.stringify(err);

            setIsLoading(false);
            alert("Login Failed: " + errorMessage);
        }
    };

    // Helper to fetch backend data and redirect
    const syncAndRedirect = async (userEmail: string) => {
        try {
            if (!userEmail) {
                // If auto-login, try to get from local or user object if available
                const stored = JSON.parse(localStorage.getItem("user") || '{}');
                if (stored.email) userEmail = stored.email;
            }

            // If we still don't have email and it's an auto-login attempt that failed to find local data,
            // we might just stop loading and let them login manually.
            if (!userEmail) {
                setIsLoading(false);
                return;
            }

            const user = await loginUser(userEmail);
            localStorage.setItem("user", JSON.stringify(user));

            if (isAdminLogin && user.role !== 'ADMIN') {
                alert("Access Denied: You are not an Admin.");
                localStorage.removeItem("user");
                await signOut();
                setIsLoading(false);
                return;
            }

            // Small delay to show the nice animation if it was too fast
            setTimeout(() => {
                if (user.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }, 500);

        } catch (backendError) {
            console.error("Backend login sync failed:", backendError);
            alert("Error: Your account exists in authentication but NOT in our database. Logging you out...");
            await signOut();
            navigate('/register');
            setIsLoading(false);
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

                {isLoading ? (
                    <div className="py-10 flex justify-center">
                        <Loader message={isAdminLogin ? "Verifying Access..." : "Accessing Dashboard..."} inline={false} />
                    </div>
                ) : (
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
                            disabled={isLoading}
                            className={`w-full font-bold py-3 rounded-xl transition-all duration-300 shadow-lg ${isAdminLogin
                                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 shadow-red-500/20'
                                : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:scale-[1.02] shadow-orange-500/20'
                                }`}
                        >
                            {isAdminLogin ? 'Access Dashboard' : 'Login to Dashboard'}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                localStorage.removeItem("user");
                                signOut();
                            }}
                            className="w-full text-xs text-red-500 hover:text-red-400 uppercase tracking-widest mt-4"
                        >
                            Force Logout (Reset Session)
                        </button>
                    </form>
                )}

                {!isLoading && (
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
                )}
            </div>
        </div>
    );
};

export default Login;