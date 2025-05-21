"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const ThemeToggle = ({
  theme,
  toggleTheme,
}: {
  theme: string;
  toggleTheme: () => void;
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <motion.div
        className="relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer"
        onClick={toggleTheme}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 left-1 w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 z-10"
          animate={{
            x: theme === "dark" ? 20 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        />
        <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-900/30 to-blue-800/30 dark:from-blue-100/20 dark:to-blue-200/20 backdrop-blur-md" />
      </motion.div>
      <AnimatePresence mode="wait">
        {theme === "light" ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <FiSun className="text-xl text-amber-500" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <FiMoon className="text-xl text-blue-300" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DeepSeaJellyfish = () => {
  const [theme, setTheme] = useState("dark");
  const jellyfishRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    // Add deep sea particles for bioluminescent effect
    const container = document.querySelector(".deep-sea-container");
    if (container && theme === "dark") {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "bioluminescent-particle";
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 3 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(particle);
      }
    }

    return () => {
      const particles = document.querySelectorAll(".bioluminescent-particle");
      particles.forEach((p) => p.remove());
    };
  }, [theme]);

  const jellyfishVariants = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const tentacleVariants = {
    wave: (i: number) => ({
      rotate: [0, 15, 0, -15, 0],
      transition: {
        duration: 4,
        delay: i * 0.3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div
      className={`min-h-screen w-full deep-sea-container ${
        theme === "dark"
          ? "bg-gradient-to-b from-blue-950 via-indigo-900 to-blue-950"
          : "bg-gradient-to-b from-blue-100 via-blue-200 to-blue-100"
      } transition-colors duration-500 relative overflow-hidden`}
    >
      {/* Bioluminescent background elements */}
      {theme === "dark" && (
        <>
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500 blur-[80px] animate-pulse-slow"></div>
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-purple-500 blur-[60px] animate-pulse-slow animation-delay-2000"></div>
            <div className="absolute top-2/3 left-2/3 w-32 h-32 rounded-full bg-cyan-400 blur-[40px] animate-pulse-slow animation-delay-3000"></div>
          </div>
        </>
      )}

      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      <motion.main
        className="container mx-auto px-4 py-20 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="max-w-4xl mx-auto text-center mb-16"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className={`text-5xl font-bold mb-6 ${theme === "dark" ? "text-blue-100" : "text-blue-900"} ${spaceGrotesk.className}`}
          >
            Deep Sea Bioluminescence
          </h1>
          <p
            className={`text-xl ${theme === "dark" ? "text-blue-300" : "text-blue-700"}`}
          >
            Discover the mesmerizing world of deep-sea creatures that light up
            the dark ocean depths
          </p>
        </motion.div>

        {/* Jellyfish Animation */}
        <motion.div
          className="relative w-full flex justify-center mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.div
            className="relative w-64 h-64"
            ref={jellyfishRef}
            variants={jellyfishVariants}
            animate={["float", "pulse"]}
          >
            {/* Jellyfish Bell */}
            <motion.div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-32 rounded-full ${
                theme === "dark"
                  ? "bg-gradient-to-b from-blue-400/80 to-indigo-600/80"
                  : "bg-gradient-to-b from-blue-300/80 to-blue-500/80"
              } backdrop-blur-sm shadow-lg`}
            >
              {/* Bioluminescent spots */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`spot-${i}`}
                  className={`absolute rounded-full ${theme === "dark" ? "bg-blue-300" : "bg-blue-500"}`}
                  style={{
                    width: `${Math.random() * 6 + 4}px`,
                    height: `${Math.random() * 6 + 4}px`,
                    left: `${20 + (i % 4) * 20}%`,
                    top: `${20 + Math.floor(i / 4) * 30}%`,
                  }}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.5,
                  }}
                />
              ))}
            </motion.div>

            {/* Tentacles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`tentacle-${i}`}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 origin-top"
                style={{
                  width: "4px",
                  height: "80px",
                  zIndex: -1,
                  filter:
                    theme === "dark"
                      ? "drop-shadow(0 0 4px rgba(100, 200, 255, 0.5))"
                      : "none",
                }}
                custom={i}
                variants={tentacleVariants}
                animate="wave"
              >
                <div
                  className={`w-full h-full ${
                    theme === "dark"
                      ? "bg-gradient-to-b from-blue-400 to-indigo-600"
                      : "bg-gradient-to-b from-blue-300 to-blue-500"
                  } rounded-full`}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Content Sections */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {[
            {
              title: "Bioluminescent",
              description:
                "Specialized cells called photophores produce light through chemical reactions, creating stunning displays in the deep ocean darkness.",
              icon: "✨",
            },
            {
              title: "Deep Sea Habitat",
              description:
                "These creatures thrive in the midnight zone (1,000-4,000m deep) where sunlight never reaches and pressures are extreme.",
              icon: "🌊",
            },
            {
              title: "Ecological Role",
              description:
                "Bioluminescent organisms play vital roles in predator avoidance, prey attraction, and species communication in deep ecosystems.",
              icon: "🔄",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl backdrop-blur-md border ${
                theme === "dark"
                  ? "bg-blue-900/30 border-blue-700/50 hover:shadow-blue-500/20"
                  : "bg-blue-100/50 border-blue-300/50 hover:shadow-blue-300/20"
              } transition-all duration-300 hover:shadow-lg`}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3
                className={`text-xl font-bold mb-3 ${theme === "dark" ? "text-blue-100" : "text-blue-900"}`}
              >
                {item.title}
              </h3>
              <p
                className={theme === "dark" ? "text-blue-300" : "text-blue-700"}
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        @keyframes bioluminescent-pulse {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .bioluminescent-particle {
          position: absolute;
          background-color: #7ae7ff;
          border-radius: 50%;
          pointer-events: none;
          animation: bioluminescent-pulse 3s infinite ease-in-out;
        }
        .animate-pulse-slow {
          animation: pulse 8s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
};

export default DeepSeaJellyfish;
