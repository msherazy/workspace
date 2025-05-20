"use client";

import React from "react";
import { useState, useEffect, FormEvent } from "react";
import { FiSun, FiMoon, FiArrowRight, FiX } from "react-icons/fi";

const injectFonts = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
`;

interface Soap {
    name: string;
    price: string;
    image: string;
    description: string;
}

const soaps: Soap[] = [
    {
        name: "Lavender Dream",
        price: "$6.99",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000",
        description: "Relax with our lavender soap, made with real lavender petals and essential oils.",
    },
    {
        name: "Citrus Burst",
        price: "$7.99",
        image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=1000",
        description: "Invigorate your senses with our citrus blend, combining orange, lemon, and grapefruit essential oils.",
    },
    {
        name: "Minty Fresh",
        price: "$8.99",
        image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?q=80&w=1000",
        description: "Cool down with our refreshing mint soap, perfect for morning routines.",
    },
];

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    soap: Soap | null;
}

const Modal = ({ isOpen, onClose, soap }: ModalProps) => {
    if (!isOpen || !soap) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label="Close modal"
                >
                    <FiX size={24} />
                </button>
                <div className="h-64 overflow-hidden">
                    <img src={soap.image} alt={soap.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {soap.name}
                        </h3>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 font-semibold text-xl">
                            {soap.price}
                        </p>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {soap.description}
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Ingredients</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Natural oils, essential oils, organic herbs, plant extracts, and other natural ingredients.
                            No synthetic fragrances or harsh chemicals.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SoapCard = ({soap, onLearnMore, isDarkMode}: {
    soap: Soap,
    onLearnMore: (soap: Soap) => void,
    isDarkMode?: boolean
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`${isDarkMode ? "dark bg-gray-800" : "bg-white"} relative rounded-xl shadow-sm overflow-hidden transition-all duration-500 hover:shadow-lg border ${isDarkMode ? "border-gray-700" : "border-gray-100"} group flex flex-col h-full`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden h-60">
                <img
                    src={soap.image}
                    alt={soap.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                />
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                    <h3 className={`${isDarkMode ? "text-white" : "text-gray-900"} text-xl font-bold `} style={{ fontFamily: "'Playfair Display', serif" }}>
                        {soap.name}
                    </h3>
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 font-semibold">
                        {soap.price}
                    </p>
                </div>
                <p className={`${isDarkMode ? "text-white" : "text-gray-700"} text-sm mb-auto`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {soap.description}
                </p>
                <div className="mt-5">
                    <button
                        onClick={() => onLearnMore(soap)}
                        className={`w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${isHovered ? 'hover:-translate-y-0.5' : ''}`}
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        <span>Learn More</span>
                        <FiArrowRight className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Home() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedSoap, setSelectedSoap] = useState<Soap | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [subscribeStatus, setSubscribeStatus] = useState<{
        message: string;
        isError: boolean;
    } | null>(null);

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = injectFonts;
        document.head.appendChild(style);
        document.documentElement.classList.toggle("dark", isDarkMode);

        return () => {
            document.head.removeChild(style);
        };
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    const handleLearnMore = (soap: Soap) => {
        setSelectedSoap(soap);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubscribe = (e: FormEvent) => {
        e.preventDefault();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setSubscribeStatus({
                message: "Please enter a valid email address",
                isError: true
            });
            return;
        }

        setTimeout(() => {
            setSubscribeStatus({
                message: "Thanks for subscribing! Please check your email for our newsletter.",
                isError: false
            });
            setEmail("");

            setTimeout(() => {
                setSubscribeStatus(null);
            }, 5000);
        }, 500);
    };

    return (
        <div className={`${isDarkMode ? "dark bg-gray-950" : "bg-gray-50"} min-h-screen transition-colors duration-500`} style={{ fontFamily: "'Poppins', sans-serif" }}>
            <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                            Artisan Soap Collection
                        </h1>
                        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} mt-3 text-lg max-w-lg`}>
                            Handcrafted with <span className="text-indigo-600 dark:text-indigo-400 font-medium">natural ingredients</span> for a luxurious cleansing experience
                        </p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`p-3 rounded-full transition-all duration-500 shadow-md hover:shadow-lg ${
                            isDarkMode ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white" : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"
                        }`}
                        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                    >
                        {isDarkMode ? <FiMoon className="text-xl" /> : <FiSun className="text-xl" />}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {soaps.map((soap, index) => (
                        <SoapCard key={index} soap={soap} onLearnMore={handleLearnMore} isDarkMode={isDarkMode} />
                    ))}
                </div>

                <div className="relative overflow-hidden rounded-2xl p-8 text-white bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 shadow-xl">
                    <div className="relative z-10 max-w-2xl mx-auto text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Join Our Community</h2>
                        <p className="text-indigo-100 dark:text-indigo-200 mb-6 text-lg">
                            Get exclusive access to new arrivals, promotions, and skincare tips
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-5 py-3 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300 focus:bg-white/15"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Subscribe
                            </button>
                        </form>
                        {subscribeStatus && (
                            <div className={`mt-4 p-3 rounded-lg ${
                                subscribeStatus.isError
                                    ? "bg-red-500/20 text-red-100"
                                    : "bg-green-500/20 text-green-100"
                            }`}>
                                {subscribeStatus.message}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={closeModal} soap={selectedSoap} />
        </div>
    );
}