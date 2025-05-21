"use client"

import React, { useState, useEffect } from "react";
import { Sun, Moon, Search, Menu, X } from "lucide-react";

type Post = {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    image: string;
    date: string;
};

type Category = {
    id: string;
    name: string;
    postCount: number;
};

const BlogHome = () => {
    // Theme state
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [displayQuery, setDisplayQuery] = useState("");
    const [isFiltering, setIsFiltering] = useState(false);

    // Category state
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Mobile menu state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    // Initialize theme and filters
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }

        // Initialize from URL
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        const search = params.get('search');

        if (category) setSelectedCategory(category);
        if (search) setSearchQuery(search);
    }, []);

    // Apply dark mode
    useEffect(() => {
        if (!mounted) return;
        const body = document.documentElement;
        body.classList.toggle('dark', darkMode);
    }, [darkMode, mounted]);

    // Debounce search
    useEffect(() => {
        setIsFiltering(true);
        const timer = setTimeout(() => {
            setDisplayQuery(searchQuery);
            updateFilters(selectedCategory, searchQuery);
            setIsFiltering(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Update URL with filters
    const updateFilters = (category: string | null, query: string) => {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (query) params.set('search', query);
        window.history.pushState({}, '', `?${params.toString()}`);
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    const handleCategorySelect = (categoryId: string) => {
        const newCategory = selectedCategory === categoryId ? null : categoryId;
        setSelectedCategory(newCategory);
        updateFilters(newCategory, searchQuery);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory(null);
        updateFilters(null, "");
    };

    const handleReadMore = (post: Post) => {
        setSelectedPost(post);
        setIsDialogOpen(true);
    };

    // Highlight search matches
    const highlightText = (text: string, query: string) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.split(regex).map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ?
                <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark> :
                part
        );
    };

    // Close mobile menu when clicking outside
    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('aside') && !target.closest('button[aria-label="Mobile menu"]')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobileMenuOpen]);

    // Sample data
    const blogName = "My Personal Blog";
    const blogDescription = "Sharing stories, reviews, and tips with friends and family";

    const categories: Category[] = [
        { id: "stories", name: "Stories", postCount: 12 },
        { id: "reviews", name: "Reviews", postCount: 8 },
        { id: "tips", name: "Tips & Tricks", postCount: 15 },
        { id: "travel", name: "Travel", postCount: 5 },
        { id: "food", name: "Food & Cooking", postCount: 7 },
        { id: "lifestyle", name: "Lifestyle", postCount: 10 },
    ];

    const allPosts: Post[] = [
        {
            id: "1",
            title: "My Vacation in Hawaii",
            excerpt: "A beautiful journey through the Hawaiian islands",
            content: `
            <p>
                My trip to Hawaii was an unforgettable adventure. From relaxing on the golden sands of Waikiki Beach to hiking the stunning trails of Kauai, every moment was magical. I swam with sea turtles, tasted authentic poke bowls, and witnessed a breathtaking sunset at Haleakalā National Park. If you visit, don't miss the local farmer's markets and a traditional luau—it’s the perfect way to experience Hawaiian culture!
            </p>
            <ul>
                <li>Visited: Honolulu, Maui, Kauai</li>
                <li>Highlights: Snorkeling, waterfalls, volcanic craters</li>
                <li>Tip: Rent a car to explore the islands at your own pace.</li>
            </ul>
        `,
            category: "travel",
            image: "https://images.unsplash.com/photo-1600199031090-cf0e930ffb55?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            date: "2023-05-15",
        },
        {
            id: "2",
            title: "Review: New Smartphone",
            excerpt: "In-depth review of the latest flagship phone",
            content: `
            <p>
                After a month with the new smartphone, I’m impressed by its performance. The camera system produces stunning photos in all lighting conditions, and the battery easily lasts a full day, even with heavy use. The display is vibrant and smooth, making video streaming a pleasure. My favorite feature is the fast wireless charging. However, I found the device a bit slippery without a case and wish the ultra-wide camera had less distortion.
            </p>
            <ul>
                <li>Pros: Excellent camera, battery life, gorgeous display</li>
                <li>Cons: Pricey, fingerprints on the back</li>
                <li>Verdict: Worth the investment for tech enthusiasts</li>
            </ul>
        `,
            category: "reviews",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
            date: "2023-06-20",
        },
        {
            id: "3",
            title: "10 Cooking Tips for Beginners",
            excerpt: "Essential kitchen tips for new cooks",
            content: `
            <p>
                Starting in the kitchen can feel daunting, but a few simple tricks can boost your confidence. Always read the entire recipe before you start. Prep all ingredients (mise en place) to stay organized. Use fresh herbs to add flavor, and don’t be afraid to season generously. Invest in a good chef’s knife and keep it sharp. Remember, practice makes perfect!
            </p>
            <ol>
                <li>Prep before cooking</li>
                <li>Keep your knives sharp</li>
                <li>Taste as you go</li>
                <li>Use fresh ingredients</li>
                <li>Don’t overcrowd the pan</li>
            </ol>
        `,
            category: "food",
            image: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&w=800&q=80",
            date: "2023-07-10",
        },
        {
            id: "4",
            title: "My Favorite Stories Vol. 1",
            excerpt: "A collection of my best short stories",
            content: `
            <p>
                Over the years, I’ve penned many stories, but these are closest to my heart. Each one explores different themes—love, adventure, loss, and hope. "The Last Train" is a tale of unexpected friendship. "Starlit Night" captures the wonder of childhood. I hope you enjoy reading them as much as I enjoyed writing.
            </p>
            <ul>
                <li><strong>The Last Train</strong> – On journeys and goodbyes</li>
                <li><strong>Starlit Night</strong> – Childhood wonder</li>
                <li><strong>Finding Home</strong> – A search for belonging</li>
            </ul>
        `,
            category: "stories",
            image: "https://images.unsplash.com/photo-1515630771457-09367d0ae038?auto=format&fit=crop&w=800&q=80",
            date: "2023-04-25",
        },
        {
            id: "5",
            title: "Productivity Tips for Better Work",
            excerpt: "How to improve your work efficiency",
            content: `
            <p>
                Productivity isn’t about working harder—it’s about working smarter. Start your day by prioritizing three main tasks. Use time blocks to avoid distractions, and schedule short breaks to recharge. Declutter your workspace weekly. My favorite hack is the Pomodoro Technique: 25 minutes focused work, 5 minutes rest. It keeps you energized and focused.
            </p>
            <ul>
                <li>Set clear daily goals</li>
                <li>Minimize digital distractions</li>
                <li>Take regular breaks</li>
            </ul>
        `,
            category: "tips",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
            date: "2023-08-05",
        },
        {
            id: "6",
            title: "Delicious Local Restaurant Review",
            excerpt: "Review of a hidden gem in our city",
            content: `
            <p>
                Last weekend I tried "Olive & Thyme," a small, family-run restaurant tucked away on Main Street. The ambiance was cozy, and the staff were welcoming. My favorite dish was the roasted lamb with seasonal vegetables, but the tiramisu was a close second. Prices are reasonable for the quality. Highly recommended for a quiet dinner out!
            </p>
            <ul>
                <li>Must-try: Roasted lamb, tiramisu</li>
                <li>Atmosphere: Warm and inviting</li>
                <li>Service: Friendly and attentive</li>
            </ul>
        `,
            category: "reviews",
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
            date: "2023-09-12",
        },
    ];

    // Process posts
    const recentPosts = allPosts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

    const filteredPosts = allPosts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(displayQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(displayQuery.toLowerCase());
        const matchesCategory = selectedCategory
            ? post.category === selectedCategory
            : true;
        return matchesSearch && matchesCategory;
    });

    // Vibrant accent colors for category badges
    const getCategoryColor = (category: string) => {
        switch (category) {
            case "stories": return "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 dark:from-purple-700 dark:via-pink-600 dark:to-purple-900";
            case "reviews": return "bg-gradient-to-r from-blue-500 via-sky-400 to-blue-700 dark:from-blue-600 dark:via-sky-500 dark:to-blue-900";
            case "tips": return "bg-gradient-to-r from-green-500 via-lime-400 to-green-700 dark:from-green-600 dark:via-lime-500 dark:to-green-900";
            case "travel": return "bg-gradient-to-r from-teal-400 via-indigo-400 to-teal-700 dark:from-teal-700 dark:via-indigo-600 dark:to-teal-900";
            case "food": return "bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-600 dark:from-orange-600 dark:via-yellow-500 dark:to-orange-900";
            case "lifestyle": return "bg-gradient-to-r from-pink-400 via-fuchsia-400 to-pink-700 dark:from-pink-700 dark:via-fuchsia-600 dark:to-pink-900";
            default: return "bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-700 dark:to-gray-900";
        }
    };

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"></div>;
    }

    return (
        <div className={`min-h-screen relative transition-colors duration-500 ${darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
            {/* Global styles and custom effects */}
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap");

                :root {
                    --font-heading: "Playfair Display", Georgia, serif;
                    --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                body {
                    font-family: var(--font-body);
                    transition: background 0.5s cubic-bezier(.45,1.14,.55,.92), color 0.3s;
                    margin: 0;
                    padding: 0;
                }
                h1, h2, h3, h4, h5, h6 {
                    font-family: var(--font-heading);
                }
                /* Glassmorphism card effect */
                .glass-card {
                    background: rgba(255,255,255,0.75);
                    border: 1.5px solid rgba(255,255,255,0.18);
                    box-shadow: 0 8px 40px rgba(50,50,100,0.14);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-radius: 2rem;
                    transition: box-shadow 0.25s, transform 0.22s, background 0.4s;
                }
                .glass-card:hover {
                    box-shadow: 0 12px 48px 0 rgba(40,40,80,0.22), 0 2px 8px rgba(0,0,0,0.04);
                    transform: scale(1.025) translateY(-2px);
                }
                .dark .glass-card {
                    background: rgba(24,27,41,0.65);
                    border: 1.5px solid rgba(255,255,255,0.08);
                    box-shadow: 0 8px 40px rgba(10,10,40,0.19);
                }
                .dark .glass-card:hover {
                    box-shadow: 0 16px 60px 0 rgba(80,80,150,0.18), 0 2px 8px rgba(0,0,0,0.07);
                }
                /* Glassy sidebar effect */
                .glass-sidebar {
                    background: rgba(255,255,255,0.68);
                    border: 1px solid rgba(255,255,255,0.15);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    border-radius: 1.5rem;
                    box-shadow: 0 4px 24px rgba(80,80,150,0.08);
                }
                .dark .glass-sidebar {
                    background: rgba(24,27,41,0.58);
                    border: 1px solid rgba(255,255,255,0.08);
                }
                /* Glassy button (read more, theme toggle) */
                .glass-btn {
                    background: rgba(255,255,255,0.38);
                    border-radius: 9999px;
                    border: 1.5px solid rgba(255,255,255,0.18);
                    font-weight: 500;
                    font-family: "Inter", sans-serif;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    box-shadow: 0 2px 8px rgba(80,80,180,0.07);
                    cursor: pointer;
                    position: relative;
                    transition: box-shadow 0.16s, border 0.18s, background 0.25s, color 0.13s;
                    font-size: 1rem;
                    padding: 0.4rem 1.2rem;
                    min-width: 0;
                }
                .glass-btn:hover, .glass-btn:focus {
                    background: rgba(255,255,255,0.58);
                    box-shadow: 0 4px 16px 0 rgba(124,58,237,0.09), 0 1px 5px rgba(0,0,0,0.02);
                }
                .dark .glass-btn {
                    background: rgba(36,40,60,0.45);
                    border-image: linear-gradient(90deg, #38bdf8 10%, #a21caf 60%, #f472b6 100%) 1;
                    color: #f9fafb;
                }
                .dark .glass-btn:hover, .dark .glass-btn:focus {
                    background: rgba(60,65,90,0.62);
                    border-image: linear-gradient(90deg, #a21caf 10%, #38bdf8 80%, #22d3ee 100%) 1;
                }
                /* Read more button specific styles */
                .read-more-btn {
                    font-size: 0.875rem;
                    padding: 0.25rem 0.75rem;
                }
                @media (max-width: 768px) {
                    .read-more-btn {
                        font-size: 0.75rem;
                        padding: 0.2rem 0.5rem;
                    }
                    .read-more-btn svg {
                        width: 14px;
                        height: 14px;
                    }
                }
                /* Glassy theme toggle */
                .glass-toggle {
                    background: rgba(255,255,255,0.26);
                    border-radius: 9999px;
                    border: 2.5px solid rgba(124,58,237,0.22);
                    box-shadow: 0 2px 18px rgba(124,58,237,0.14);
                    transition: box-shadow 0.18s, border 0.22s, background 0.34s;
                    position: relative;
                    overflow: hidden;
                }
                .glass-toggle:focus, .glass-toggle:hover {
                    background: rgba(124,58,237,0.12);
                    border: 2.5px solid #7c3aed;
                    box-shadow: 0 4px 32px rgba(124,58,237,0.25);
                }
                .dark .glass-toggle {
                    background: rgba(36,40,60,0.38);
                    border: 2.5px solid rgba(56,189,248,0.22);
                    box-shadow: 0 2px 18px rgba(56,189,248,0.13);
                }
                .dark .glass-toggle:focus, .dark .glass-toggle:hover {
                    background: rgba(56,189,248,0.13);
                    border: 2.5px solid #38bdf8;
                    box-shadow: 0 4px 32px rgba(56,189,248,0.23);
                }
                /* Toggle pulse effect */
                .toggle-pulse {
                    animation: pulseGlow 0.5s;
                }
                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4);}
                    60% { box-shadow: 0 0 0 16px rgba(124,58,237,0);}
                    100% { box-shadow: 0 0 0 0 rgba(124,58,237,0);}
                }
                .dark .toggle-pulse {
                    animation: pulseGlowDark 0.5s;
                }
                @keyframes pulseGlowDark {
                    0% { box-shadow: 0 0 0 0 rgba(56,189,248,0.4);}
                    60% { box-shadow: 0 0 0 16px rgba(56,189,248,0);}
                    100% { box-shadow: 0 0 0 0 rgba(56,189,248,0);}
                }
                /* Animated blob/radial background */
                .blog-bg-blob {
                    position: fixed;
                    z-index: 0;
                    pointer-events: none;
                    top: -120px;
                    left: -160px;
                    width: 700px;
                    height: 600px;
                    border-radius: 50%;
                    background: radial-gradient(ellipse at 40% 30%, #a5b4fc 0%, #c7d2fe 60%, #f3f4f6 100%);
                    filter: blur(80px) brightness(1.05);
                    opacity: 0.55;
                    transition: background 0.5s, opacity 0.5s;
                }
                .dark .blog-bg-blob {
                    background: radial-gradient(ellipse at 45% 25%, #312e81 0%, #06b6d4 50%, #0f172a 100%);
                    opacity: 0.45;
                    filter: blur(100px) brightness(0.97);
                }
                /* Animations */
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .mobile-menu {
                    animation: slideIn 0.3s ease-out forwards;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                .gradient-border {
                    background: linear-gradient(90deg, #38bdf8 0%, #a21caf 60%, #f472b6 100%);
                    padding: 2px; /* controls border thickness */
                    border-radius: 9999px;
                    display: inline-flex;
                }
                .dark .gradient-border {
                    background: linear-gradient(90deg, #a21caf 0%, #38bdf8 60%, #22d3ee 100%);
                }
                .glass-btn.read-more-btn {
                    background: rgba(255,255,255,0.65);
                    border: none;
                    outline: none;
                    box-shadow: 0 2px 8px 0 rgba(80,80,180,0.06);
                }
                .dark .glass-btn.read-more-btn {
                    background: rgba(36,40,60,0.52);
                }
            `}</style>
            {/* Animated/gradient blog background blob */}
            <div className="blog-bg-blob"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <header className="py-10 border-b border-gray-200 dark:border-gray-800 flex flex-col gap-3 md:gap-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1
                                className="text-4xl md:text-6xl font-bold mb-1"
                                style={{
                                    fontFamily: "Playfair Display, serif",
                                    textShadow: darkMode
                                        ? "0 2px 24px rgba(56,189,248,0.08)"
                                        : "0 2px 16px rgba(124,58,237,0.11)"
                                }}
                            >
                                {blogName}
                            </h1>
                            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium mt-1">
                                {blogDescription}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    toggleDarkMode();
                                    // Pulse animation trigger
                                    const el = document.getElementById("theme-toggle-btn");
                                    if (el) {
                                        el.classList.remove("toggle-pulse");
                                        void el.offsetWidth; // force reflow
                                        el.classList.add("toggle-pulse");
                                    }
                                }}
                                id="theme-toggle-btn"
                                className={`glass-toggle p-3 text-2xl transition-all duration-200 focus:outline-none`}
                                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                                tabIndex={0}
                            >
                                {darkMode ? <Sun size={28} className="drop-shadow-lg" /> : <Moon size={28} className="drop-shadow-lg" />}
                            </button>
                            <button
                                className="lg:hidden p-2 rounded-xl bg-white/70 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-700 transition-colors shadow-md"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Mobile menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Post Dialog */}
                {isDialogOpen && selectedPost && (
                    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            {/* Background overlay */}
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                 onClick={() => setIsDialogOpen(false)} />

                            {/* Dialog panel */}
                            <div className="relative inline-block align-bottom bg-white dark:bg-gray-900 rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                                <div className="absolute right-4 top-4">
                                    <button
                                        onClick={() => setIsDialogOpen(false)}
                                        className="glass-btn p-2 rounded-full"
                                        aria-label="Close dialog"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="w-full">
                                    <img
                                        src={selectedPost.image}
                                        alt={selectedPost.title}
                                        className="w-full h-72 object-cover object-center"
                                    />
                                </div>

                                <div className="px-6 pt-6 pb-8">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(selectedPost.category)}`}>
                                        {categories.find((cat) => cat.id === selectedPost.category)?.name || selectedPost.category}
                                    </span>

                                    <h3 className="mt-4 text-2xl font-bold" style={{ fontFamily: "Playfair Display, serif" }}>
                                        {selectedPost.title}
                                    </h3>

                                    <time className="block mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(selectedPost.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>

                                    <div className="mt-4 prose dark:prose-invert max-w-none">
                                        <div
                                            className="text-gray-600 dark:text-gray-300"
                                            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <main className="lg:col-span-8">
                        <section className="mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                                Recent Posts
                            </h2>
                            <div className="grid gap-10 md:grid-cols-3">
                                {recentPosts.map((post) => (
                                    <article
                                        key={post.id}
                                        className="glass-card group rounded-3xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col h-full"
                                    >
                                        <div className="relative">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-52 object-cover object-center"
                                                loading="lazy"
                                                style={{ borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}
                                            />
                                            <span
                                                className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full shadow-md text-white bg-opacity-90 ${getCategoryColor(
                                                    post.category
                                                )}`}
                                                style={{ fontWeight: 700, letterSpacing: "0.01em" }}
                                            >
                                                {categories.find((cat) => cat.id === post.category)?.name || post.category}
                                            </span>
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <h3
                                                className="text-xl md:text-2xl font-extrabold mb-2 line-clamp-2"
                                                style={{ fontFamily: "Playfair Display, serif", letterSpacing: "-0.01em" }}
                                            >
                                                {highlightText(post.title, displayQuery)}
                                            </h3>
                                            <p className="text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 font-medium">
                                                {highlightText(post.excerpt, displayQuery)}
                                            </p>
                                            <div className="flex justify-between items-end mt-auto">
                                                <time className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                                    {new Date(post.date).toLocaleDateString()}
                                                </time>
                                                <div className="gradient-border rounded-full inline-flex p-[2px]">
                                                    <button
                                                        onClick={() => handleReadMore(post)}
                                                        className="glass-btn read-more-btn text-sm font-semibold flex items-center gap-1 bg-white dark:bg-transparent text-gray-900 dark:text-white px-4 py-1.5 rounded-full w-full"
                                                    >
                                                        Read more
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "Playfair Display, serif" }}>
                                    All Posts
                                </h2>
                                {(displayQuery || selectedCategory) && (
                                    <div className="gradient-border rounded-full inline-flex p-[2px]">
                                        <button
                                            onClick={clearFilters}
                                            className="glass-btn read-more-btn text-sm font-semibold flex items-center gap-1 bg-white dark:bg-transparent text-gray-900 dark:text-white px-4 py-1.5 rounded-full w-full"
                                        >
                                            Clear filters
                                        </button>
                                    </div>
                                )}
                            </div>

                            {filteredPosts.length === 0 ? (
                                <div className="text-center py-16 px-4 glass-card rounded-3xl shadow-lg">
                                    <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                                        No posts found matching your criteria.
                                    </p>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-6 glass-btn text-base px-6 py-2.5"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            ) : (
                                <div className="grid gap-10 md:grid-cols-2">
                                    {filteredPosts.map((post) => (
                                        <article
                                            key={post.id}
                                            className="glass-card flex flex-col md:flex-row gap-0 rounded-3xl overflow-hidden shadow-lg transition-all duration-300"
                                        >
                                            <div className="relative w-full md:w-1/3 h-52 md:h-auto">
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover object-center"
                                                    loading="lazy"
                                                    style={{ borderTopLeftRadius: "1.5rem", borderBottomLeftRadius: "1.5rem" }}
                                                />
                                                <span
                                                    className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full shadow-md text-white bg-opacity-90 ${getCategoryColor(
                                                        post.category
                                                    )}`}
                                                    style={{ fontWeight: 700, letterSpacing: "0.01em" }}
                                                >
                                                    {categories.find((cat) => cat.id === post.category)?.name || post.category}
                                                </span>
                                            </div>
                                            <div className="p-7 flex-1 flex flex-col">
                                                <h3
                                                    className="text-xl md:text-2xl font-extrabold mb-2"
                                                    style={{ fontFamily: "Playfair Display, serif", letterSpacing: "-0.01em" }}
                                                >
                                                    {highlightText(post.title, displayQuery)}
                                                </h3>
                                                <p className="text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 font-medium">
                                                    {highlightText(post.excerpt, displayQuery)}
                                                </p>
                                                <div className="flex justify-between items-end mt-auto">
                                                    <time className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                                        {new Date(post.date).toLocaleDateString()}
                                                    </time>
                                                    <div className="gradient-border rounded-full inline-flex p-[2px]">
                                                        <button
                                                            onClick={() => handleReadMore(post)}
                                                            className="glass-btn read-more-btn text-sm font-semibold flex items-center gap-1 bg-white dark:bg-transparent text-gray-900 dark:text-white px-4 py-1.5 rounded-full w-full"
                                                        >
                                                            Read more
                                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </main>

                    {/* Mobile menu overlay */}
                    {isMobileMenuOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-90 lg:hidden transition-opacity"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                    )}

                    <aside
                        className={`lg:col-span-4 ${
                            isMobileMenuOpen
                                ? "fixed inset-y-0 right-0 z-50 w-80 p-6 overflow-y-auto shadow-2xl mobile-menu"
                                : "hidden lg:block"
                        }`}
                        aria-label="Sidebar"
                        style={{ zIndex: 30 }}
                    >
                        {isMobileMenuOpen && (
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="glass-toggle p-2"
                                    aria-label="Close menu"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        )}
                        <div className="sticky top-10 space-y-8">
                            <div className="glass-sidebar p-7 rounded-2xl shadow-lg transition-colors">
                                <h3 className="text-xl font-extrabold mb-3 tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                                    Search
                                </h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search posts..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-12 py-3 rounded-full border border-transparent bg-white/60 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 transition-all text-base shadow-inner"
                                        aria-label="Search posts"
                                        aria-busy={isFiltering}
                                        style={{
                                            fontWeight: 500,
                                            letterSpacing: "0.01em",
                                            backdropFilter: "blur(4px)",
                                        }}
                                    />
                                    <Search
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    {isFiltering && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-xl">🌀</div>
                                    )}
                                </div>
                            </div>

                            <div className="glass-sidebar p-7 rounded-2xl shadow-lg transition-colors">
                                <h3 className="text-xl font-extrabold mb-3 tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                                    Categories
                                </h3>
                                <ul className="space-y-2">
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <button
                                                onClick={() => handleCategorySelect(category.id)}
                                                className={`w-full text-left px-4 py-3 rounded-xl flex justify-between items-center transition-colors font-medium ${
                                                    selectedCategory === category.id
                                                        ? "bg-gradient-to-r from-blue-100 via-sky-100 to-blue-200 dark:from-blue-900/40 dark:via-sky-900/30 dark:to-blue-900/70 text-blue-700 dark:text-blue-200 shadow"
                                                        : "hover:bg-gray-100 dark:hover:bg-gray-800/60"
                                                }`}
                                                aria-current={selectedCategory === category.id ? "true" : undefined}
                                                style={{
                                                    fontWeight: selectedCategory === category.id ? 700 : 500,
                                                    fontFamily: "Inter, sans-serif"
                                                }}
                                            >
                                                <span>{category.name}</span>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                                                        selectedCategory === category.id
                                                            ? "bg-blue-300 dark:bg-blue-800 text-blue-900 dark:text-blue-100"
                                                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                    }`}
                                                >
                                                    {category.postCount}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <footer
                className={`py-12 border-t transition-colors ${
                    darkMode
                        ? "bg-gray-900/90 border-gray-800 text-gray-300"
                        : "bg-white/80 border-gray-200 text-gray-600"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-base font-semibold tracking-wide" style={{ letterSpacing: "0.01em" }}>
                            &copy; {new Date().getFullYear()} My Personal Blog
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default BlogHome;
