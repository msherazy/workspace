"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

interface Shoutout {
    id: number;
    text: string;
    reactions: number;
}

const App = () => {
    const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
    const [newShoutout, setNewShoutout] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.5
            }
        },
        hover: {
            y: -3,
            transition: { duration: 0.2 }
        }
    };

    const formOverlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const formContentVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.5
            }
        },
        exit: {
            y: -20,
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    const reactionVariants = {
        rest: { scale: 1, color: "inherit" },
        active: {
            scale: [1, 1.3, 1],
            color: ["inherit", "#a78bfa", "inherit"],
            transition: { duration: 0.6 }
        }
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        const storedShoutouts = localStorage.getItem("shoutouts");
        if (storedShoutouts) {
            setShoutouts(JSON.parse(storedShoutouts));
        }

        const storedDarkMode = localStorage.getItem("darkMode");
        if (storedDarkMode) {
            setDarkMode(JSON.parse(storedDarkMode));
        }

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem("shoutouts", JSON.stringify(shoutouts));
    }, [shoutouts]);

    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    const handleAddShoutout = (e: React.FormEvent) => {
        e.preventDefault();
        if (newShoutout.trim()) {
            const updatedShoutouts = [
                { id: Date.now(), text: newShoutout, reactions: 0 },
                ...shoutouts,
            ];
            setShoutouts(updatedShoutouts);
            setNewShoutout("");
            setIsFormOpen(false);
        }
    };

    const handleReact = (id: number) => {
        const updatedShoutouts = shoutouts.map((shoutout) => {
            if (shoutout.id === id) {
                return { ...shoutout, reactions: shoutout.reactions + 1 };
            }
            return shoutout;
        });

        const sortedShoutouts = [...updatedShoutouts].sort(
            (a, b) => b.reactions - a.reactions
        );

        setShoutouts(sortedShoutouts);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const ReactionButton = ({ shoutout }: { shoutout: Shoutout }) => {
        const [isReacting, setIsReacting] = useState(false);

        const handleClick = () => {
            setIsReacting(true);
            handleReact(shoutout.id);
            setTimeout(() => setIsReacting(false), 600);
        };

        return (
            <motion.button
                onClick={handleClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center ${
                    darkMode
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-800"
                }`}
            >
                <motion.span
                    animate={isReacting ? "active" : "rest"}
                    variants={reactionVariants}
                    className="inline-flex items-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Smile
                </motion.span>
            </motion.button>
        );
    };

    return (
        <div className={`min-h-screen flex flex-col ${
            darkMode
                ? "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white"
                : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800"
        }`}>
            <header className="px-4 py-5 flex justify-between items-center">
                <motion.h1
                    className="text-2xl font-bold flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    SmileFeed
                </motion.h1>
                <motion.button
                    onClick={toggleDarkMode}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-full ${
                        darkMode
                            ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                            : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                    } transition-colors duration-300`}
                >
                    {darkMode ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                        </svg>
                    )}
                </motion.button>
            </header>

            <main className="flex-1 px-4 py-2 overflow-hidden flex flex-col">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    Recent Shoutouts
                </h2>

                <div className="flex-1 overflow-hidden">
                    {shoutouts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className={`flex-1 flex items-center justify-center p-6 rounded-xl ${
                                darkMode
                                    ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                                    : "bg-white/60 backdrop-blur-sm shadow-sm border border-indigo-100"
                            } transition-all duration-300`}
                        >
                            <div className="text-center max-w-md">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-12 w-12 mx-auto mb-4 ${
                                        darkMode ? "text-indigo-400" : "text-indigo-500"
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <p
                                    className={`text-lg font-medium mb-2 ${
                                        darkMode ? "text-gray-300" : "text-gray-700"
                                    }`}
                                >
                                    No shoutouts yet
                                </p>
                                <p
                                    className={`text-sm ${
                                        darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                                >
                                    Be the first to share something that made you smile!
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <LayoutGroup>
                            <motion.div
                                className={`grid grid-cols-1 ${
                                    isMobile ? "gap-4" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                                } overflow-y-auto h-full p-2`}
                                layout
                            >
                                {shoutouts.map((shoutout) => (
                                    <motion.div
                                        key={shoutout.id}
                                        layout
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        className={`flex flex-col rounded-xl p-5 ${
                                            darkMode
                                                ? "bg-gray-800/70 backdrop-blur-sm border border-gray-700"
                                                : "bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100"
                                        } space-y-4`}
                                    >
                                        <p
                                            className={`text-sm ${
                                                darkMode ? "text-gray-200" : "text-gray-700"
                                            }`}
                                        >
                                            {shoutout.text}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                      <span
                          className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 inline mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                          {shoutout.reactions} {shoutout.reactions === 1 ? "smile" : "smiles"}
                      </span>
                                            <ReactionButton shoutout={shoutout} />
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </LayoutGroup>
                    )}
                </div>
            </main>

            <div className="sticky bottom-4 right-4 flex justify-end p-4">
                <motion.button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`fixed bottom-8 right-8 z-10 flex items-center justify-center w-14 h-14 rounded-full ${
                        darkMode
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-800/20"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                    } transition-all duration-300 focus:outline-none`}
                    aria-label={isFormOpen ? "Close form" : "Add shoutout"}
                >
                    <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{ rotate: isFormOpen ? 45 : 0 }}
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </motion.svg>
                </motion.button>

                <AnimatePresence>
                    {isFormOpen && (
                        <>
                            <motion.div
                                variants={formOverlayVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                                onClick={() => setIsFormOpen(false)}
                            />

                            <motion.div
                                variants={formContentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            >
                                <div className="w-full max-w-md mx-auto">
                                    <motion.div
                                        layout
                                        className={`rounded-lg ${
                                            darkMode
                                                ? "bg-gray-800/90 backdrop-blur-md border border-gray-700"
                                                : "bg-white/90 backdrop-blur-md border border-indigo-100"
                                        } shadow-xl p-6 relative`}
                                    >
                                        <motion.button
                                            onClick={() => setIsFormOpen(false)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className={`absolute top-4 right-4 p-2 rounded-full ${
                                                darkMode
                                                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                                                    : "text-gray-500 hover:text-gray-700 hover:bg-indigo-100"
                                            } transition-colors duration-200`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </motion.button>
                                        <h3
                                            className={`text-xl font-semibold mb-4 flex items-center ${
                                                darkMode ? "text-indigo-300" : "text-indigo-600"
                                            }`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            Share Your Smile
                                        </h3>
                                        <form onSubmit={handleAddShoutout}>
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="shoutout"
                                                    className={`block text-sm font-medium mb-2 ${
                                                        darkMode ? "text-gray-300" : "text-gray-700"
                                                    }`}
                                                >
                                                    Something that made you smile today?
                                                </label>
                                                <motion.textarea
                                                    id="shoutout"
                                                    className={`w-full p-3 rounded-lg ${
                                                        darkMode
                                                            ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                            : "border border-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 placeholder-gray-500"
                                                    } transition-all duration-200`}
                                                    rows={3}
                                                    placeholder="Write your shoutout here..."
                                                    value={newShoutout}
                                                    onChange={(e) => setNewShoutout(e.target.value)}
                                                    required
                                                    whileFocus={{
                                                        scale: 1.01,
                                                        boxShadow: darkMode
                                                            ? "0 0 0 2px rgba(129, 140, 248, 0.5)"
                                                            : "0 0 0 2px rgba(99, 102, 241, 0.5)"
                                                    }}
                                                />
                                            </div>
                                            <motion.button
                                                type="submit"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors duration-300 shadow-md ${
                                                    darkMode
                                                        ? "bg-indigo-600 hover:bg-indigo-500"
                                                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                                }`}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 mr-2"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Share Shoutout
                                            </motion.button>
                                        </form>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default App;