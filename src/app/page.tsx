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
        className={`flex flex-col md:flex-row ${isReversed ? "md:flex-row-reverse" : ""} gap-6 items-start`}
    >
      <div className="relative w-full md:w-1/2 overflow-hidden rounded-xl shadow-md group">
        <img
            src={image}
            alt={`Image of ${title}`}
            onError={(e) => ((e.target as HTMLImageElement).src = "/fallback.jpg")}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-orange-500 px-3 py-1 rounded-full text-sm font-medium">View Recipe</span>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-start space-y-3">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h3>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Clock className="w-5 h-5" />
          <span className="text-sm">{time}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
        <button
            aria-label={`Read more about ${title}`}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
        >
          Read More <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
);

const ThemeToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  return (
      <button
          onClick={() => setDark(!dark)}
          className="fixed top-4 right-4 z-50 p-2 rounded-full border bg-white/70 dark:bg-gray-800/70 backdrop-blur shadow-md text-gray-800 dark:text-gray-100"
          aria-label="Toggle Dark Mode"
      >
        {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
  );
};

const FoodBlogHome = () => {
  return (
      <div className={`${inter.className} min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white`}>
        <ThemeToggle />

        <main className="max-w-6xl mx-auto px-4 py-16 space-y-20">
          <section className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-snug">
              Welcome to Our Kitchen <span className="text-orange-500">Blog</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
              Discover delicious recipes, cooking tips, and behind-the-scenes stories from our kitchen to yours.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <RecipeCard
                image="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&h=500&fit=crop"
                title="Savory Herb Crusted Prime Rib"
                time="4 hours 30 minutes"
                description="A holiday classic with a garlic and rosemary crust, slow-roasted for a melt-in-your-mouth finish that’s pure perfection."
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
