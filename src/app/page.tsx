"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const experiences = [
  {
    id: 1,
    title: "Sunset Dolphin Cruise",
    location: "North Malé Atoll",
    rating: 4.9,
    price: 120,
    duration: "3 hours",
    image: "https://placehold.co/300x200?text=Cruise",
    category: "boat",
  },
  {
    id: 2,
    title: "Private Sandbank Picnic",
    location: "Ari Atoll",
    rating: 5.0,
    price: 350,
    duration: "6 hours",
    image: "https://placehold.co/300x200?text=Sandbank",
    category: "private",
  },
  {
    id: 3,
    title: "Coral Reef Snorkeling",
    location: "Vaavu Atoll",
    rating: 4.7,
    price: 75,
    duration: "2 hours",
    image: "https://placehold.co/300x200?text=Snorkel",
    category: "water",
  },
  {
    id: 4,
    title: "Traditional Island Hopping",
    location: "Baa Atoll",
    rating: 4.8,
    price: 95,
    duration: "4 hours",
    image: "https://placehold.co/300x200?text=Island",
    category: "culture",
  },
  {
    id: 5,
    title: "Luxury Yacht Charter",
    location: "South Malé Atoll",
    rating: 5.0,
    price: 1500,
    duration: "Full day",
    image: "https://placehold.co/300x200?text=Yacht",
    category: "private",
  },
  {
    id: 6,
    title: "Freediving with Mantas",
    location: "Raa Atoll",
    rating: 4.9,
    price: 220,
    duration: "5 hours",
    image: "https://placehold.co/300x200?text=Manta",
    category: "water",
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
};

export default function IslandQuest() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((d) => !d);
  };

  const filteredExperiences = experiences.filter((experience) => {
    const matchesCategory =
      selectedCategory === "all" || experience.category === selectedCategory;
    const matchesSearch =
      experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openBooking = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsBooking(true);
  };

  const closeBooking = () => {
    setIsBooking(false);
    setTimeout(() => setSelectedExperience(null), 300);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-900 text-slate-100" : "bg-sky-50 text-slate-800"}`}
    >
      <nav
        className={`sticky top-0 z-50 ${darkMode ? "bg-slate-800" : "bg-white"} shadow-lg transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <div
              className={`w-8 h-8 rounded-full ${darkMode ? "bg-teal-400" : "bg-cyan-600"}`}
            ></div>
            <h1 className="text-xl font-bold">IslandQuest</h1>
          </motion.div>

          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? "bg-slate-700 text-amber-300 hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              {darkMode ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" fill="#FDB813" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                    fill="#1E293B"
                  />
                </svg>
              )}
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-lg font-medium ${darkMode ? "bg-cyan-600 hover:bg-cyan-700" : "bg-teal-500 hover:bg-teal-600 text-white"}`}
            >
              Sign In
            </motion.div>
          </div>
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
                className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center ${darkMode ? "bg-teal-400 text-slate-900" : "bg-cyan-600 text-white"}`}
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

      <section className="container mx-auto px-4 py-8">
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
              className={`px-4 py-2 rounded-lg font-medium ${selectedCategory === category.id ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-800"}`}
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
                <div className="text-sm text-slate-500 mb-2">
                  {experience.location}
                </div>
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  ★ {experience.rating}
                  <span className="text-xs text-slate-400 ml-2">
                    {experience.duration}
                  </span>
                </div>
                <div className="font-bold text-teal-600 mb-3">
                  ${experience.price}
                </div>
                <button
                  onClick={() => openBooking(experience)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full transition"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
