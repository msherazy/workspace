"use client";

import React, {useEffect, useState} from "react";
import {ArrowRight, Clock, Moon, Sun} from "lucide-react";
import {motion} from "framer-motion";
import {Inter} from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type RecipeProps = {
  image: string;
  title: string;
  time: string;
  description: string;
  isReversed?: boolean;
};

const RecipeCard: React.FC<RecipeProps> = ({ image, title, time, description, isReversed }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={`flex flex-col md:flex-row ${isReversed ? "md:flex-row-reverse" : ""} gap-6 items-start 
        p-5 rounded-2xl border border-orange-100 dark:border-gray-700 
        hover:shadow-lg dark:hover:shadow-gray-800/30 transition-all duration-300
        bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm`}
    >
      <div className="relative w-full md:w-1/2 overflow-hidden rounded-xl shadow-md group">
        <img
            src={image}
            alt={`Image of ${title}`}
            onError={(e) =>
                ((e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&h=500&fit=crop&q=80")
            }
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-start space-y-3">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h3>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Clock className="w-5 h-5" />
          <span className="text-sm">{time}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
        <a
            href="#"
            aria-label={`Read more about ${title}`}
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors
            hover:translate-x-1 duration-200"
        >
          Read More <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
);

const ThemeToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);



  return (
    <button
      onClick={() => setDark((prev) => !prev)}
      className="fixed top-4 right-4 z-50 p-2 rounded-full border bg-white/70 dark:bg-gray-800/70 backdrop-blur shadow-md text-gray-800 dark:text-gray-100 cursor-pointer transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

const FoodBlogHome = () => {
  return (
      <div
          className={`${inter.className} darkMode ? "bg-[#23272F] text-gray-100" : "bg-gray-100 text-gray-900" min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white`}
      >
        <ThemeToggle />

        <main className="max-w-6xl mx-auto px-4 py-16 space-y-20">
          {/* Enhanced Soft Hero */}
          <section className="max-w-4xl mx-auto p-8 md:p-12 mb-12 text-center rounded-2xl
            bg-gradient-to-r from-orange-50 via-orange-100/50 to-orange-50
            dark:from-gray-800/80 dark:via-gray-700/40 dark:to-gray-800/80
            border border-orange-200/50 dark:border-white/10
            shadow-lg shadow-orange-100 dark:shadow-gray-900/30
            backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 -z-10 rounded-2xl bg-white/20 dark:bg-white/5 opacity-50"
            ></motion.div>
            <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white
                text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600 dark:from-orange-400 dark:to-amber-500"
            >
              Culinary Creations
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-4 text-lg text-gray-700 dark:text-gray-300"
            >
              Discover delicious recipes, cooking tips, and behind-the-scenes bites from our kitchen.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6">
              <a
                  href='https://www.allrecipes.com' target="_blank"
                  className="cursor-pointer px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-500
                text-white rounded-full hover:shadow-lg hover:from-orange-500 hover:to-amber-600
                transition-all duration-300 font-medium">
                Explore Recipes
              </a>
            </motion.div>
          </section>

          {/* Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <RecipeCard
                image="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&h=500&fit=crop"
                title="Savory Herb Crusted Prime Rib"
                time="4 hours 30 minutes"
                description="A holiday classic with a garlic and rosemary crust, slow-roasted for a melt-in-your-mouth finish that's pure perfection."
            />
            <RecipeCard
                image="https://plus.unsplash.com/premium_photo-1732473760222-389820a18261?w=500&h=500&fit=crop"
                title="Cranberry Brie Bites"
                time="25 minutes"
                description="Flaky pastry filled with creamy brie and tart cranberry — an easy yet elegant appetizer your guests will love."
                isReversed
            />
            <RecipeCard
                image="https://images.unsplash.com/photo-1709429790175-b02bb1b19207?w=500&h=500&fit=crop"
                title="Garlic Parmesan Mashed Potatoes"
                time="1 hour 15 minutes"
                description="Creamy Yukon Gold potatoes blended with roasted garlic and parmesan for the ultimate comfort food side dish."
            />
            <RecipeCard
                image="https://www.cathysglutenfree.com/wp-content/uploads/2021/01/molten-chocolate-lava-cake-bite.jpg"
                title="Chocolate Lava Cake"
                time="45 minutes"
                description="Rich, decadent, and gooey in the center — this molten chocolate dessert is easier than it looks and sure to impress."
                isReversed
            />
          </section>
        </main>
      </div>
  );
};

export default FoodBlogHome;

