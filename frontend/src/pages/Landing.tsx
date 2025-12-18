import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from "@/components/ui/animated-shader-hero";
import UserSearch from "@/components/UserSearch";

const Landing = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleDashboardClick = () => {
        if (user?.role === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="w-full min-h-screen bg-black relative">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-black/30 border-b border-white/5">
                <div className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-200 bg-clip-text text-transparent">
                    ApnaStudent
                </div>
                <div className="flex gap-4">
                    {user ? (
                        <button
                            onClick={handleDashboardClick}
                            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 rounded-full text-sm text-white font-medium transition-all shadow-lg shadow-orange-500/20"
                        >
                            Go to Dashboard
                        </button>
                    ) : (
                        <>
                            <button onClick={() => navigate('/login')} className="text-sm text-gray-300 hover:text-white transition-colors">
                                Login
                            </button>
                            <button onClick={() => navigate('/register')} className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm text-white transition-all">
                                Register
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <Hero
                trustBadge={{ text: "The Official Student Portfolio Hub", icons: ["🎓", "🚀"] }}
                headline={{ line1: "ApnaStudent", line2: "Showcase Your Code" }}
                subtitle="The central platform for students to host projects."
                buttons={{
                    primary: { text: "Explore Portfolios", onClick: () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }) },
                    secondary: {
                        text: user ? "Go to Dashboard" : "Student Login",
                        onClick: user ? handleDashboardClick : () => navigate('/login')
                    }
                }}
            >
                {/* Search Bar Embedded in Hero */}
                <UserSearch variant="hero" placeholder="Find a Student Developer..." />
            </Hero>

            {/* Info Section (Formerly Search) */}
            <div className="bg-black py-20 px-4 min-h-[50vh] flex flex-col items-center justify-center border-t border-white/10 text-center">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200 mb-6">
                    Why ApnaStudent?
                </h2>
                <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
                    Connect with thousands of student developers, browse their portfolios, and find the perfect collaborator for your next project.
                    Built for students, by students.
                </p>
            </div>
        </div>
    );
}
export default Landing;