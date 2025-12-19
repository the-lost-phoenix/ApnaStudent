import React from 'react';

interface LoaderProps {
    message?: string;
    fullscreen?: boolean;
    inline?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading...", fullscreen = false, inline = false }) => {
    if (inline) {
        return (
            <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                {message && <span className="text-sm text-gray-300">{message}</span>}
            </div>
        );
    }

    const containerClasses = fullscreen
        ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-500"
        : "flex flex-col items-center justify-center p-8";

    return (
        <div className={containerClasses}>
            <div className="relative">
                {/* Outer Ring */}
                <div className="w-20 h-20 rounded-full border-4 border-white/5 border-t-orange-500 animate-spin shadow-[0_0_30px_rgba(249,115,22,0.3)]"></div>

                {/* Inner Ring */}
                <div className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-white/5 border-b-yellow-400 animate-spin-slow"></div>

                {/* Center Dot or Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
            </div>

            {message && (
                <div className="mt-6 text-center">
                    <p className="text-lg font-medium text-white tracking-widest uppercase animate-pulse">{message}</p>
                </div>
            )}
        </div>
    );
};

export default Loader;
