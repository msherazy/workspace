"use client";

import React, { useEffect, useState } from "react";
import { FiCopy, FiLock, FiMoon, FiRefreshCw, FiSun, FiUnlock } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const generateColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;

const ColorBlock = ({ color, locked, onToggleLock, onCopy }) => {
  return (
    <motion.div
      className="relative group rounded-2xl p-6 flex flex-col items-center justify-between 
                 shadow-lg w-full sm:w-48 h-48 transition-all duration-300 hover:scale-105"
      style={{ 
        backgroundColor: color,
        boxShadow: `0 8px 32px ${color}40`
      }}
      layout
      whileHover={{ y: -5 }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black/10 rounded-2xl opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300" />
      
      <p className="text-white font-mono text-lg tracking-wider mb-4 z-10">{color}</p>
      
      <div className="flex gap-6 z-10">
        <motion.button
          onClick={onToggleLock}
          className="text-white/90 hover:text-white hover:scale-110 transition-all duration-200"
          whileTap={{ scale: 0.9 }}
          aria-label={locked ? "Unlock color" : "Lock color"}
        >
          {locked ? <FiLock size={20} /> : <FiUnlock size={20} />}
        </motion.button>
        <motion.button
          onClick={() => onCopy(color)}
          className="text-white/90 hover:text-white hover:scale-110 transition-all duration-200"
          whileTap={{ scale: 0.9 }}
          aria-label="Copy color code"
        >
          <FiCopy size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function PaletteApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState("");
  const [colors, setColors] = useState(
    Array.from({ length: 5 }, () => ({ color: generateColor(), locked: false }))
  );

  const handleRefresh = () => {
    setColors((prev) =>
      prev.map((c) => (c.locked ? c : { ...c, color: generateColor() }))
    );
  };

  const handleToggleLock = (index) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c))
    );
  };

  const handleCopy = async (hex) => {
    try {
      await navigator.clipboard.writeText(hex);
      setToast(`Copied ${hex}`);
      setTimeout(() => setToast(""), 1500);
    } catch (err) {
      setToast("Failed to copy");
      setTimeout(() => setToast(""), 1500);
    }
  };

  useEffect(() => {
    const handleSpacebar = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleRefresh();
      }
    };
    window.addEventListener("keydown", handleSpacebar);
    return () => window.removeEventListener("keydown", handleSpacebar);
  }, []);

  return (
    <div className={`${darkMode ? "dark" : ""} ${inter.className}`}>
      <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-gray-900 
                    text-gray-900 dark:text-white transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-bold mb-2">Color Palette Generator</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Press spacebar to generate new colors
              </p>
            </div>
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md 
                       hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
            </motion.button>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
                        lg:grid-cols-5 mb-12">
            <AnimatePresence>
              {colors.map((c, i) => (
                <ColorBlock
                  key={i}
                  color={c.color}
                  locked={c.locked}
                  onToggleLock={() => handleToggleLock(i)}
                  onCopy={handleCopy}
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="text-center">
            <motion.button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 
                       rounded-full text-sm font-medium flex items-center gap-2 
                       mx-auto shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Generate new palette"
            >
              <FiRefreshCw /> Generate New Palette
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 
                       bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl 
                       text-sm font-medium"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}