import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { searchStudents } from '../services/api';

interface UserSearchProps {
    className?: string;
    placeholder?: string;
    variant?: 'hero' | 'header'; // 'hero' = large, 'header' = compact
}

const UserSearch: React.FC<UserSearchProps> = ({
    className = "",
    placeholder = "Search students...",
    variant = 'hero'
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref for Portal content
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if click is outside BOTH the input container AND the dropdown portal
            const target = event.target as Node;
            if (
                containerRef.current &&
                !containerRef.current.contains(target) &&
                (!dropdownRef.current || !dropdownRef.current.contains(target))
            ) {
                setShowDropdown(false);
            }
        };

        const updatePosition = () => {
            if (showDropdown && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setCoords({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width
                });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true); // Update pos on scroll, don't close

        // Initial setup
        updatePosition();

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [showDropdown]);

    // Update Dropdown Position on search change (height might change? no width might)
    useEffect(() => {
        if (showDropdown && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [searchQuery, results]); // Update when results change too

    // Debounced Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                try {
                    const data = await searchStudents(searchQuery);
                    setResults(data);
                    setShowDropdown(true);
                } catch (error) {
                    console.error("Search failed", error);
                }
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            const data = await searchStudents(searchQuery);
            setResults(data);
            setShowDropdown(true);
        } catch (error) {
            console.error("Search failed", error);
        }
    };

    const handleNavigate = (user: any) => {
        navigate(`/${user.username || user.id}`);
        setShowDropdown(false);
        setSearchQuery("");
    };

    const isHero = variant === 'hero';

    return (
        <div ref={containerRef} className={`relative z-[100] ${className}`}>
            <div className="relative flex items-center">
                <input
                    type="text"
                    placeholder={placeholder}
                    className={`w-full bg-white/10 border border-white/20 text-white focus:outline-none focus:border-orange-500 transition-all
                        ${isHero ? 'px-8 py-4 rounded-full text-lg shadow-lg backdrop-blur-md' : 'px-4 py-2 rounded-lg text-sm bg-black/50 border-gray-700 focus:border-orange-500/50'}
                    `}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                />
                <button
                    onClick={handleSearch}
                    className={`absolute right-2 flex items-center justify-center transition-colors
                        ${isHero ? 'bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-full px-6 py-2 top-2' : 'text-gray-400 hover:text-white right-3'}
                    `}
                >
                    {isHero ? 'Search' : <span className="text-xl">🔍</span>}
                </button>
            </div>

            {/* PORTAL DROPDOWN */}
            {showDropdown && results.length > 0 && ReactDOM.createPortal(
                <div
                    ref={dropdownRef}
                    className="absolute z-[9999] glass-card overflow-hidden animate-fade-in-up shadow-2xl border border-white/10"
                    style={{
                        top: coords.top + (isHero ? 8 : 4),
                        left: coords.left,
                        width: coords.width,
                    }}
                >
                    <ul className="max-h-60 overflow-y-auto">
                        {results.map((user) => (
                            <li
                                key={user.id}
                                onClick={() => handleNavigate(user)}
                                className="px-4 py-3 border-b border-white/5 hover:bg-white/10 cursor-pointer flex items-center justify-between group transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold border border-white/10
                                        ${isHero ? 'w-10 h-10' : 'w-8 h-8 text-xs'}
                                    `}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <h3 className={`text-white font-semibold group-hover:text-orange-400 transition-colors ${isHero ? 'text-base' : 'text-sm'}`}>
                                            {user.name}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            @{user.username || "user" + user.id}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>,
                document.body
            )}

            {/* Fallback "No Results" (Inline only if needed, mostly hidden by portal logic) */}
            {showDropdown && results.length === 0 && (
                <div className={`absolute left-0 w-full mt-2 glass-card p-4 text-center text-gray-500 z-[101] ${isHero ? 'top-full' : 'top-full mt-1'}`}>
                    No students found.
                </div>
            )}
        </div>
    );
};

export default UserSearch;
