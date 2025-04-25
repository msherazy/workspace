"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Demo images for realism
const experienceImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", // Cruise
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80", // Sandbank
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", // Snorkel
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80", // Island
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80", // Yacht
  "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=600&q=80", // Manta
];

const experiences = [
  {
    id: 1,
    title: "Sunset Dolphin Cruise",
    location: "North Malé Atoll",
    rating: 4.9,
    price: 120,
    duration: "3 hours",
    image: experienceImages[0],
    category: "boat",
    bookings: 172,
  },
  {
    id: 2,
    title: "Private Sandbank Picnic",
    location: "Ari Atoll",
    rating: 5.0,
    price: 350,
    duration: "6 hours",
    image: experienceImages[1],
    category: "private",
    bookings: 53,
  },
  {
    id: 3,
    title: "Coral Reef Snorkeling",
    location: "Vaavu Atoll",
    rating: 4.7,
    price: 75,
    duration: "2 hours",
    image: experienceImages[2],
    category: "water",
    bookings: 311,
  },
  {
    id: 4,
    title: "Traditional Island Hopping",
    location: "Baa Atoll",
    rating: 4.8,
    price: 95,
    duration: "4 hours",
    image: experienceImages[3],
    category: "culture",
    bookings: 142,
  },
  {
    id: 5,
    title: "Luxury Yacht Charter",
    location: "South Malé Atoll",
    rating: 5.0,
    price: 1500,
    duration: "Full day",
    image: experienceImages[4],
    category: "private",
    bookings: 12,
  },
  {
    id: 6,
    title: "Freediving with Mantas",
    location: "Raa Atoll",
    rating: 4.9,
    price: 220,
    duration: "5 hours",
    image: experienceImages[5],
    category: "water",
    bookings: 89,
  },
];

const categories = [
  { id: "all", name: "All Experiences" },
  { id: "water", name: "Water Activities" },
  { id: "boat", name: "Boat Tours" },
  { id: "private", name: "Private Charters" },
  { id: "culture", name: "Cultural Tours" },
];

type Experience = {
  id: number;
  title: string;
  location: string;
  rating: number;
  price: number;
  duration: string;
  image: string;
  category: string;
  bookings: number;
};

export default function IslandQuest() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingExp, setBookingExp] = useState<Experience | null>(null);
  const [showBooked, setShowBooked] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  const filteredExperiences = experiences.filter((experience) => {
    const matchesCategory =
      selectedCategory === "all" || experience.category === selectedCategory;
    const matchesSearch =
      experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const bookNow = (exp: Experience) => {
    setBookingExp(exp);
    setShowBooked(true);
    setTimeout(() => setShowBooked(false), 1600);
  };

  // For logo: simple bold text with subtle sea accent
  const Logo = () => (
    <div className="flex items-center font-bold text-xl tracking-tight">
      <span className={darkMode ? "text-cyan-300" : "text-cyan-700"}>
        Island
      </span>
      <span className={darkMode ? "text-amber-200" : "text-amber-400"}>
        Quest
      </span>
    </div>
  );

  // Sun and Moon SVGs (modern and minimal)
  const SunIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#fbbf24">
      <circle cx="12" cy="12" r="5" fill="#fde68a" />
      <path
        stroke="#fbbf24"
        strokeWidth="2"
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M17.36 17.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42"
      />
    </svg>
  );
  const MoonIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#0ea5e9">
      <path
        stroke="#0ea5e9"
        strokeWidth="2"
        d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
      />
    </svg>
  );

  return (
    <div
      style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
      className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? "bg-slate-900 text-slate-100" : "bg-sky-50 text-slate-800"}`}
    >
      <nav
        className={`sticky top-0 z-50 ${darkMode ? "bg-slate-800" : "bg-white"} shadow-lg transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.93 }}
            onClick={toggleDarkMode}
            className={`p-2 rounded-full border ${darkMode ? "bg-slate-700 text-amber-300 border-slate-600" : "bg-slate-100 text-sky-700 border-slate-300"} focus:outline-none`}
            title="Toggle light/dark"
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </motion.button>
        </div>
      </nav>

      <section
        className={`relative ${darkMode ? "bg-slate-800" : "bg-cyan-700"} overflow-hidden`}
      >
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Discover Paradise{" "}
              <span className="text-amber-300">Experiences</span>
            </h1>
            <p className="text-xl text-slate-100 mb-8">
              Curated island adventures that create lifetime memories. Book
              unique experiences across the Maldives' most breathtaking
              locations.
            </p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="max-w-md mx-auto relative"
            >
              <input
                type="text"
                placeholder="Search experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-6 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 ${darkMode ? "bg-slate-700 text-white focus:ring-teal-400" : "bg-white focus:ring-cyan-500"}`}
              />
              <div
                className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center ${darkMode ? "bg-cyan-300 text-slate-900" : "bg-cyan-600 text-white"}`}
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 overflow-hidden"
        >
          <div
            className={`absolute -right-40 -top-40 w-96 h-96 rounded-full ${darkMode ? "bg-teal-500" : "bg-cyan-300"} opacity-20 filter blur-3xl`}
          ></div>
          <div
            className={`absolute -left-40 -bottom-40 w-96 h-96 rounded-full ${darkMode ? "bg-cyan-500" : "bg-teal-300"} opacity-20 filter blur-3xl`}
          ></div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-8 flex-1">
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium ${selectedCategory === category.id ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-800"} focus:outline-none`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {filteredExperiences.map((experience) => (
            <motion.div
              key={experience.id}
              whileHover={{ scale: 1.03 }}
              className={`rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${darkMode ? "bg-slate-800" : "bg-white"}`}
            >
              <img
                src={experience.image}
                alt={experience.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-5">
                <h2 className="text-lg font-semibold mb-1">
                  {experience.title}
                </h2>
                <div className="text-sm text-slate-500 mb-1">
                  {experience.location}
                </div>
                <div className="flex items-center gap-2 text-yellow-500 mb-1">
                  <svg
                    className="w-4 h-4"
                    fill="#fde68a"
                    stroke="#fbbf24"
                    strokeWidth={1.2}
                    viewBox="0 0 20 20"
                  >
                    <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" />
                  </svg>
                  <span className="font-medium">{experience.rating}</span>
                  <span className="ml-2 text-xs text-slate-400">
                    {experience.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8 17a7 7 0 106-6.32V13a3 3 0 01-6 0v-2.32A7 7 0 008 17zm7-5v-1a7 7 0 10-6 6.93V15a1 1 0 012 0v1.93A7.01 7.01 0 0015 12z" />
                  </svg>
                  {experience.bookings} booked
                </div>
                <div className="font-bold text-teal-600 mb-3">
                  ${experience.price}
                </div>
                <button
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full transition w-full"
                  onClick={() => bookNow(experience)}
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        {showBooked && bookingExp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl px-6 py-4 flex items-center gap-3 z-50 border border-cyan-300"
            style={{ minWidth: 250 }}
          >
            <svg
              className="w-6 h-6 text-emerald-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-slate-900 font-semibold">
              Booked: {bookingExp.title}
            </span>
          </motion.div>
        )}
      </section>

      <footer
        className={`${darkMode ? "bg-slate-900 text-slate-400" : "bg-white text-slate-500"} text-center py-4 text-xs mt-8 border-t border-slate-200`}
      >
        <div>
          © {new Date().getFullYear()} IslandQuest. All rights reserved. | For
          demo purposes only.
        </div>
        <div>
          Experience data, photos, and booking features are for UI demonstration
          only.
        </div>
      </footer>
    </div>
  );
}
