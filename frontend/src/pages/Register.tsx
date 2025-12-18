import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';
import { registerUser } from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const { isLoaded, signUp, setActive } = useSignUp();
    const [step, setStep] = useState(1); // 1 = Details, 2 = OTP
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        usn: '',
        bio: '',
        role: 'STUDENT',
        username: ''
    });
    const [otp, setOtp] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // STEP 1: Create User in Clerk
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        try {
            await signUp.create({
                emailAddress: formData.email,
                password: formData.password,
                firstName: formData.name.split(" ")[0],
                lastName: formData.name.split(" ").slice(1).join(" "),
                // Removed username to avoid "is unknown" error if not enabled in Clerk
            });

            // Start Email Verification
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            setStep(2); // Move to OTP step
        } catch (err: any) {
            console.error("Clerk Registration Error:", err);
            // Show more detailed error
            const errorMessage = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || JSON.stringify(err);
            alert("Registration failed: " + errorMessage);
        }
    };

    // STEP 2: Verify OTP and Sync with Backend
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: otp,
            });

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });

                // IMPORTANT: Sync user to our Backend so we have a record in our DB
                // We send the data we collected in Step 1
                try {
                    await registerUser(formData);
                    alert("Account Verified & Created! Welcome.");
                    navigate('/dashboard');
                } catch (backendError) {
                    console.error("Backend Sync Failed:", backendError);
                    alert("Account created in Clerk but failed to sync to database. Please contact support.");
                }
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2));
                alert("Verification incomplete. Check console.");
            }
        } catch (err: any) {
            console.error("Clerk Verification Error:", err);
            alert("Verification failed: " + (err.errors?.[0]?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="w-full max-w-md glass-card p-8 md:p-10 relative z-10 animate-fade-in-up">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-200 bg-clip-text text-transparent mb-2">
                        {step === 1 ? "Join ApnaStudent" : "Verify Email"}
                    </h2>
                    <p className="text-gray-400">
                        {step === 1 ? "Create your developer portfolio today." : `Enter the code sent to ${formData.email}`}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-300 ml-1 mb-1 block">Full Name</label>
                            <input name="name" type="text" onChange={handleChange} className="glass-input" placeholder="John Doe" required />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-300 ml-1 mb-1 block">Email</label>
                            <input name="email" type="email" onChange={handleChange} className="glass-input" placeholder="john@college.edu" required />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-300 ml-1 mb-1 block">Password</label>
                            <input name="password" type="password" onChange={handleChange} className="glass-input" placeholder="Create a strong password" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-300 ml-1 mb-1 block">Username</label>
                                <input name="username" type="text" onChange={handleChange} className="glass-input" placeholder="vijaynetekal" required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 ml-1 mb-1 block">USN</label>
                                <input name="usn" type="text" onChange={handleChange} className="glass-input" placeholder="1MS21CS..." required />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-300 ml-1 mb-1 block">Short Bio</label>
                            <textarea name="bio" onChange={handleChange} className="glass-input min-h-[80px]" placeholder="I am a Full Stack Developer..." rows={3}></textarea>
                        </div>

                        <button type="submit" className="w-full btn-primary mt-6">
                            Next: Verify Email
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div>
                            <label className="text-sm font-medium text-gray-300 ml-1 mb-1 block">Verification Code (OTP)</label>
                            <input
                                name="otp"
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="glass-input text-center text-2xl tracking-widest font-mono"
                                placeholder="000000"
                                required
                            />
                        </div>

                        <button type="submit" className="w-full btn-primary mt-6">
                            Verify & Register
                        </button>

                        <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-400 hover:text-white mt-4">
                            ← Back to details
                        </button>
                    </form>
                )}

                <p className="text-center text-gray-500 mt-6 text-sm">
                    Already have an account? <button onClick={() => navigate('/login')} className="text-orange-400 hover:text-orange-300 font-medium hover:underline transition-all">Login here</button>
                </p>
            </div>
        </div>
    );
};

export default Register;