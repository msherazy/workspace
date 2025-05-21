"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { FiMoon, FiSearch, FiStar, FiSun, FiX } from "react-icons/fi";
import { Inter } from "next/font/google";

// Initialize the Inter font
const inter = Inter({ subsets: ["latin"] });

interface Review {
  id: number;
  name: string;
  description: string;
  rating: number;
  reviewer: string;
  category: "Laptops" | "Smartphones" | "Accessories";
  image: string;
  longDescription: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Dell XPS 15",
    description:
      "Premium laptop with stunning 4K display and long battery life.",
    rating: 4.8,
    reviewer: "Jane Doe",
    category: "Laptops",
    image:
      "https://images.unsplash.com/photo-1720556405438-d67f0f9ecd44?q=80&w=3460&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    longDescription: "The Dell XPS 15 is a powerhouse...",
  },
  {
    id: 2,
    name: "iPhone 14 Pro",
    description:
      "Flagship smartphone with advanced camera and lightning-fast performance.",
    rating: 4.9,
    reviewer: "John Smith",
    category: "Smartphones",
    image:
      "https://images.unsplash.com/photo-1663408466313-2d4e7edaf172?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    longDescription: "The iPhone 14 Pro sets a new standard...",
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise-cancelling headphones.",
    rating: 4.7,
    reviewer: "Emily Chen",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1586343797367-c8942268df67?q=80&w=3628&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    longDescription: "The Sony WH-1000XM5 headphones...",
  },
  {
    id: 4,
    name: "MacBook Air M2",
    description: "Ultra-thin and light laptop with Apple's powerful M2 chip.",
    rating: 4.5,
    reviewer: "Michael Johnson",
    category: "Laptops",
    image:
      "https://images.unsplash.com/photo-1659135890064-d57187f0946c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    longDescription: "The MacBook Air M2 revolutionizes...",
  },
  {
    id: 5,
    name: "Samsung Galaxy S23 Ultra",
    description: "Powerful Android flagship with long-lasting battery.",
    rating: 4.6,
    reviewer: "Sarah Williams",
    category: "Smartphones",
    image:
      "https://images.unsplash.com/photo-1678958274412-563119ec18ab?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    longDescription: "The Samsung Galaxy S23 Ultra is a behemoth...",
  },
  {
    id: 6,
    name: "Apple Watch Ultra",
    description: "Rugged smartwatch designed for outdoor enthusiasts.",
    rating: 4.4,
    reviewer: "David Brown",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1679436204470-87dc7da1e8be?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    longDescription: "The Apple Watch Ultra is built for adventure...",
  },
];

const categoryOptions = ["All", "Laptops", "Smartphones", "Accessories"];

// ReviewDialog component to display full review details
const ReviewDialog = ({
  review,
  isOpen,
  onClose,
}: {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Prevent scroll on body when dialog is open
  useEffect(() => {
    if (isOpen && review) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen, review]);

  if (!isOpen || !review) return null;

  const badgeColor = {
    Laptops: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    Smartphones:
      "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    Accessories:
      "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100",
  }[review.category];

  // Stop event propagation to prevent main page scrolling
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={handleDialogClick}
      >
        {/* Header with image */}
        <div className="relative h-64 sm:h-80">
          <img
            src={review.image}
            alt={review.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiX className="text-gray-800 dark:text-white" size={20} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <span
              className={`inline-block text-xs font-medium uppercase px-2 py-1 rounded-full mb-2 ${badgeColor}`}
            >
              {review.category}
            </span>
            <h1 className="text-3xl font-bold text-white">{review.name}</h1>
          </div>
        </div>

        {/* Content area with its own scrolling */}
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 20rem)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(review.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {review.rating.toFixed(1)} / 5
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Reviewed by {review.reviewer}
            </span>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {review.description}
            </p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Full Review
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {review.longDescription}
            </p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Pros & Cons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-bold text-green-700 dark:text-green-400 mb-2">
                  Pros
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>High quality construction</li>
                  <li>Excellent performance</li>
                  <li>Great value for the price</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h3 className="font-bold text-red-700 dark:text-red-400 mb-2">
                  Cons
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Could have better battery life</li>
                  <li>Limited color options</li>
                </ul>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Verdict
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Overall, this is an excellent product that we highly recommend for
              most users. It strikes a great balance between performance,
              quality, and price.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewCard = ({
  review,
  onOpenReview,
}: {
  review: Review;
  onOpenReview: (review: Review) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const badgeColor = {
    Laptops: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    Smartphones:
      "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    Accessories:
      "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100",
  }[review.category];

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={review.image}
        alt={review.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <span
            className={`inline-block text-xs font-medium uppercase px-2 py-1 rounded-full mb-2 ${badgeColor}`}
          >
            {review.category}
          </span>
          <h3 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-1">
            {review.name}
          </h3>
          {/* Georgia is kept only for the card heading above via font-serif */}
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {review.description}
          </p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(review.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
              {isHovered && (
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {review.rating.toFixed(1)} / 5
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {review.reviewer}
            </span>
          </div>
        </div>
        <button
          onClick={() => onOpenReview(review)}
          className="w-full mt-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          Read Full Review
        </button>
      </div>
    </div>
  );
};

const ReviewWebsite = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [, setMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const matchesCategory =
      selectedCategory === "All" || review.category === selectedCategory;
    const matchesSearch = review.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenReview = (review: Review) => {
    setSelectedReview(review);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div
      className={`${inter.className} min-h-screen ${darkMode ? "dark bg-gray-900" : "light bg-gray-100"}`}
    >
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 md:py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              GadgetReview
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300 cursor-pointer"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Reviews
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by product name..."
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onOpenReview={handleOpenReview}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No reviews found. Try adjusting your filters or search query.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Review Dialog */}
      <ReviewDialog
        review={selectedReview}
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default ReviewWebsite;
