"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const quotes = [
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", author: "Steve Jobs" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Believe you can and you’re halfway there.", author: "Theodore Roosevelt" },
];

const colors = [
  { bg: "#FF6B6B", accent: "#FF8E8E", quote: "#FFFFFF", author: "#FFE3E3" },   // Coral
  { bg: "#4ECDC4", accent: "#6ED3C9", quote: "#FFFFFF", author: "#E8F7F6" },   // Teal
  { bg: "#45B7D1", accent: "#5DC3D7", quote: "#FFFFFF", author: "#E4F4F8" },   // Blue
  { bg: "#96CEB4", accent: "#A9D9C3", quote: "#FFFFFF", author: "#F0F8F4" },   // Green
  { bg: "#FFEEAD", accent: "#FFF0B8", quote: "#5A5A5A", author: "#FFF8E1" },   // Yellow
  { bg: "#D4A5A5", accent: "#DAB3B3", quote: "#FFFFFF", author: "#F8F0F0" },   // Soft Red
  { bg: "#9B59B6", accent: "#A76AC4", quote: "#FFFFFF", author: "#F4EAF7" },   // Purple
  { bg: "#3498DB", accent: "#4BA3EB", quote: "#FFFFFF", author: "#E7F3FC" },   // Royal Blue
  { bg: "#E74C3C", accent: "#EC5F4F", quote: "#FFFFFF", author: "#FCEDEA" },   // Red Orange
  { bg: "#2ECC71", accent: "#40D47E", quote: "#FFFFFF", author: "#E6F9EF" },   // Emerald
];

export default function Home() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsQuoteVisible(false);

      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setColorIndex((prev) => (prev + 1) % colors.length);
        setIsQuoteVisible(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const currentQuote = quotes[quoteIndex];
  const currentColor = colors[colorIndex];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
        duration: 0.8
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
  };

  const logoVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2
      }
    },
  };

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: 1.1,
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        duration: 3,
        ease: "easeInOut"
      }
    },
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden ${spaceGrotesk.className}`}
      style={{
        backgroundColor: currentColor.bg,
        transition: "background-color 0.8s ease"
      }}
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-full z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.8 }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={currentColor.accent} strokeWidth="0.5" strokeOpacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-0 left-0 w-full h-full z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="noise" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
              <feColorMatrix type="saturate" values="0"/>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="white" filter="url(#noise)" opacity="0.8"/>
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/10 bg-white/5"
            style={{
              width: `${60 + i * 40}px`,
              height: `${60 + i * 40}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0, 0.15, 0]
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.8
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute top-0 left-0 w-full h-full z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="slow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors[(colorIndex + 1) % colors.length].bg} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={colors[(colorIndex + 2) % colors.length].bg} stopOpacity="0.4"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#slow-gradient)">
            <animate attributeName="x" values="0%;-100%;0%" dur="80s" repeatCount="indefinite"/>
          </rect>
        </svg>
      </motion.div>

      <motion.header
        className="absolute top-0 w-full px-6 py-5 flex justify-between items-center z-10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
      >
        <motion.div
          className="flex items-center gap-2"
          variants={logoVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative w-12 h-12">
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-md z-0"
              animate={{
                scale: [1, 1.15, 1],
                boxShadow: [
                  "0 0 0 0 rgba(255,255,255,0.4)",
                  "0 0 20px 10px rgba(255,255,255,0.2)",
                  "0 0 0 0 rgba(255,255,255,0.4)"
                ]
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 4,
                ease: "easeInOut"
              }}
            />

            <motion.svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
              animate={{
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 6,
                ease: "easeInOut",
                repeatDelay: 1
              }}
            >
              <path
                d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
                fill="white"
                stroke={currentColor.accent}
                strokeWidth="2"
              />
              <path
                d="M24 16V32"
                stroke={currentColor.bg}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16 24H32"
                stroke={currentColor.bg}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </motion.svg>
          </div>

          <div className="relative">
            <motion.h1
              className="text-2xl font-bold tracking-tight text-white drop-shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Inspiro
            </motion.h1>
            <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-white/0 via-white/80 to-white/0"></span>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100, damping: 20 }}
        >
          <motion.button
            className="px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-sm font-medium transition-all duration-200 flex items-center gap-2"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative">
              Explore
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30"></span>
            </span>
          </motion.button>

          <motion.button
            className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-gray-800 text-sm font-medium shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative">
              Discover
              <span className="absolute top-[-4px] right-[-4px] w-2 h-2 bg-red-500 rounded-full"></span>
            </span>
          </motion.button>
        </motion.div>
      </motion.header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 z-10">
        <motion.div
          className="max-w-3xl w-full space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-center space-y-6"
            variants={itemVariants}
          >
            <motion.div
              className="inline-block px-6 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.span
                className="text-white/90 text-sm font-medium tracking-widest"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  ease: "easeInOut",
                }}
              >
                FEATURED QUOTE
              </motion.span>
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 12 }}
            >
              {isLoading ? (
                <>
                  <span className="block">Discover Your</span>
                  <span className="block text-white/80 text-2xl mt-2">Daily Inspiration</span>
                </>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={quoteIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                  >
                    &quot;{currentQuote.text}&quot;
                  </motion.span>
                </AnimatePresence>
              )}
            </motion.h2>
          </motion.div>

          <motion.div
            className="text-center space-y-4"
            variants={itemVariants}
          >
            <motion.p
              className="text-white/80 italic text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {isLoading ? "Loading author..." : currentQuote.author}
            </motion.p>

            <motion.div
              className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            />
          </motion.div>

          <motion.div
            className="flex justify-center pt-4"
            variants={itemVariants}
          >
            <motion.button
              className="group relative px-8 py-4 rounded-full bg-white/90 backdrop-blur-md text-gray-800 font-medium shadow-lg transition-all duration-200 overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="relative">
                  View Collection
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-current group-hover:w-0 transition-all duration-300"></span>
                </span>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="relative"
                  animate={{
                    x: [0, 4, 0],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    ease: "easeInOut",
                    repeatDelay: 0.5
                  }}
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </motion.svg>
              </span>

              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      <motion.footer
        className="absolute bottom-0 w-full px-6 py-4 flex justify-between items-center z-10"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 1.3 }}
      >
        <motion.div
          className="text-white/60 text-xs flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
        >
          <span className="relative">
            © {new Date().getFullYear()} Inspiro
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/60 group-hover:w-full transition-all duration-300"></span>
          </span>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
        >
          <motion.a
            href="#"
            className="text-white/60 hover:text-white transition-colors duration-200 px-2 py-1 rounded-full hover:bg-white/5"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Privacy
          </motion.a>
          <motion.a
            href="#"
            className="text-white/60 hover:text-white transition-colors duration-200 px-2 py-1 rounded-full hover:bg-white/5"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Terms
          </motion.a>
        </motion.div>
      </motion.footer>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="w-6 h-10 rounded-full bg-white/80 flex justify-center overflow-hidden"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, type: "spring", stiffness: 100, damping: 20 }}
        >
          <motion.div
            className="w-1 h-2 bg-gray-800 rounded-full"
            animate={{
              y: [0, 3, 0]
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
