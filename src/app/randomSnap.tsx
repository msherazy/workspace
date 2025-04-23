"use client";
import React, { useEffect, useRef, useState } from "react";

// Sun and Moon icons as SVGs for the toggle
const SunIcon = () => (
  <svg
    className="h-6 w-6 text-yellow-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="5" fill="currentColor" />
    <path
      stroke="currentColor"
      strokeWidth="2"
      d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M17.36 17.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42"
    />
  </svg>
);
const MoonIcon = () => (
  <svg
    className="h-6 w-6 text-indigo-400 mr-0.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke="currentColor"
      strokeWidth="2"
      d="M21 12.79A9 9 0 0112.21 3c0 .35.01.7.04 1.05a7 7 0 109.7 9.7c.35.03.7.04 1.05.04z"
    />
  </svg>
);

interface PhotoPost {
  id: string;
  username: string;
  imageUrl: string;
  caption: string;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  date: string;
}

const initialPosts: PhotoPost[] = [
  {
    id: "1",
    username: "adventure_sarah",
    imageUrl: "https://placehold.co/600x400?text=Coffee%0APost",
    caption:
      "Found this in my coffee today. Pretty sure it's an alien warning sign.",
    likes: 42,
    dislikes: 5,
    likedBy: [],
    dislikedBy: [],
    date: "April 15, 2025",
  },
  {
    id: "2",
    username: "tech_nomad",
    imageUrl: "https://placehold.co/600x400?text=Pet%0ACat",
    caption: "My cat's plotting world domination. Evidence: Exhibit A.",
    likes: 83,
    dislikes: 2,
    likedBy: [],
    dislikedBy: [],
    date: "April 16, 2025",
  },
];

const captionSuggestions = [
  "When your plant starts judging your life choices",
  "This is what happens when you don't read the instructions",
  "Found this in the wild. Scientists are baffled.",
  "My breakfast told me a secret today",
  "Evidence that aliens walk among us",
  "When Monday has a face",
  "Pretty sure this violates the laws of physics",
  "What happens at 3 AM when you can't sleep",
  "My dog said it's art, I'm not allowed to question it",
  "Time traveler from 2050 left this behind",
];

const PhotoSharingApp = () => {
  const [posts, setPosts] = useState<PhotoPost[]>(initialPosts);
  const [newPost, setNewPost] = useState({
    username: "",
    imageUrl: "https://placehold.co/600x400?text=Upload%0APhoto",
    caption: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [randomCaption, setRandomCaption] = useState("");
  const [animatePost, setAnimatePost] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dark, setDark] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate user id
  const [currentUserId] = useState(
    "user-" + Math.random().toString(36).substr(2, 9),
  );

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * captionSuggestions.length);
    setRandomCaption(captionSuggestions[randomIndex]);
  }, []);

  // -- THEME MODE --
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  // Input handlers, file, drag/drop etc (same as before)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setNewPost((prev) => ({
            ...prev,
            imageUrl: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setNewPost((prev) => ({
            ...prev,
            imageUrl: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  // Submit a new post
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      const newPostId = Date.now().toString();
      const newPostObject: PhotoPost = {
        id: newPostId,
        username: newPost.username || "anonymous_user",
        imageUrl: newPost.imageUrl,
        caption: newPost.caption || randomCaption,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      setPosts((prev) => [newPostObject, ...prev]);
      setNewPost({
        username: "",
        imageUrl: "https://placehold.co/600x400",
        caption: "",
      });
      setIsUploading(false);
      setShowModal(false);
      const randomIndex = Math.floor(Math.random() * captionSuggestions.length);
      setRandomCaption(captionSuggestions[randomIndex]);
      setAnimatePost(newPostId);
      setTimeout(() => setAnimatePost(null), 1000);
    }, 1000);
  };

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev?.map((post) => {
        if (post.id === id) {
          if (post.likedBy.includes(currentUserId)) return post;
          const updatedDislikedBy = post.dislikedBy.filter(
            (uid) => uid !== currentUserId,
          );
          const newDislikes = updatedDislikedBy.length;
          const updatedLikedBy = [...post.likedBy, currentUserId];
          return {
            ...post,
            likes: post.likes + 1,
            dislikes: newDislikes,
            likedBy: updatedLikedBy,
            dislikedBy: updatedDislikedBy,
          };
        }
        return post;
      }),
    );
  };
  const handleDislike = (id: string) => {
    setPosts((prev) =>
      prev?.map((post) => {
        if (post.id === id) {
          if (post.dislikedBy.includes(currentUserId)) return post;
          const updatedLikedBy = post.likedBy.filter(
            (uid) => uid !== currentUserId,
          );
          const newLikes = updatedLikedBy.length;
          const updatedDislikedBy = [...post.dislikedBy, currentUserId];
          return {
            ...post,
            likes: newLikes,
            dislikes: post.dislikes + 1,
            likedBy: updatedLikedBy,
            dislikedBy: updatedDislikedBy,
          };
        }
        return post;
      }),
    );
  };
  const hasLiked = (postId: string) =>
    posts.find((p) => p.id === postId)?.likedBy.includes(currentUserId) ??
    false;
  const hasDisliked = (postId: string) =>
    posts.find((p) => p.id === postId)?.dislikedBy.includes(currentUserId) ??
    false;

  // === RENDER ===
  return (
    <div
      className={`
      min-h-screen transition-colors duration-500 
      ${
        dark
          ? "bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900"
          : "bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100"
      } 
      px-2 sm:px-4
    `}
    >
      {/* HEADER */}
      <header
        className={`
        flex flex-col md:flex-row items-center md:justify-between gap-4 pt-10 pb-6 max-w-4xl mx-auto
        ${dark ? "" : ""}
      `}
      >
        <div className="flex-1 flex justify-center md:justify-start">
          <span className="text-4xl sm:text-5xl font-bold select-none tracking-tight">
            <span className="text-purple-600">Random</span>
            <span className="text-yellow-400">Snap</span>
          </span>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="
              bg-gradient-to-r from-purple-400 to-blue-400 text-white font-bold
              py-2 px-7 rounded-full shadow-lg
              text-lg sm:text-xl
              hover:scale-105 hover:shadow-xl transition
            "
          >
            Share Your Snap
          </button>
          <button
            onClick={() => setDark((prev) => !prev)}
            className={`
              rounded-full border-2 border-purple-200 shadow-md p-3 flex items-center 
              transition
              ${
                dark
                  ? "bg-indigo-800 border-indigo-600"
                  : "bg-white border-purple-200"
              }
            `}
            aria-label="Toggle dark mode"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full max-w-lg mx-auto pt-2 pb-8">
        {posts?.map((post) => (
          <div
            key={post.id}
            className={`
              bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl overflow-hidden mb-8 transition duration-500 w-full
              ${animatePost === post.id ? "scale-105 shadow-2xl" : ""}
            `}
          >
            <div
              className={`
              px-6 py-3 
              bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100
              dark:from-indigo-900 dark:via-purple-800 dark:to-gray-900
            `}
            >
              <p className="font-bold text-purple-700 dark:text-purple-300 text-lg">
                @{post.username}
              </p>
            </div>
            <div className="relative overflow-hidden">
              <img
                src={post.imageUrl}
                alt="User post"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-5">
              <p className="text-base sm:text-lg font-medium italic text-gray-700 dark:text-gray-200 mb-4">
                {post.caption}
              </p>
              <div className="flex items-center justify-between flex-wrap gap-y-2">
                <div className="flex space-x-6">
                  {/* Like button */}
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`
                      flex items-center space-x-1 
                      ${
                        hasLiked(post.id)
                          ? "text-pink-500"
                          : "text-gray-400 dark:text-gray-300 hover:text-pink-400"
                      } transition
                    `}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="font-semibold">{post.likes}</span>
                  </button>
                  {/* Dislike button */}
                  <button
                    onClick={() => handleDislike(post.id)}
                    className={`
                      flex items-center space-x-1 
                      ${
                        hasDisliked(post.id)
                          ? "text-blue-500"
                          : "text-gray-400 dark:text-gray-300 hover:text-blue-400"
                      } transition
                    `}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ transform: "rotate(180deg)" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="font-semibold">{post.dislikes}</span>
                  </button>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-300">
                  {post.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-600 dark:text-purple-300">
                Share Your Random Snap
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={newPost.username}
                  onChange={handleInputChange}
                  placeholder="Your username"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 focus:border-transparent text-black dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Your Photo
                </label>
                <div
                  className={`border-2 ${isDragging ? "border-purple-500 bg-purple-50 dark:bg-purple-900" : "border-dashed border-gray-300 dark:border-gray-600"} rounded-md p-4 text-center hover:border-purple-400 transition`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  <img
                    src={newPost.imageUrl}
                    alt="Preview"
                    className="mx-auto h-48 w-48 object-cover rounded-md transition hover:scale-105"
                  />
                  <div className="mt-4 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-400 dark:text-purple-300 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                      />
                    </svg>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {isDragging
                        ? "Drop your image here"
                        : "Click or drag to upload a photo"}
                    </p>
                  </div>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="text-sm text-purple-600 dark:text-purple-300 hover:text-purple-800 font-medium"
                    >
                      Browse files
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Silly Caption
                </label>
                <textarea
                  name="caption"
                  value={newPost.caption}
                  onChange={handleInputChange}
                  placeholder={randomCaption}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 focus:border-transparent text-black dark:text-gray-100"
                  rows={3}
                />
                <button
                  type="button"
                  onClick={() =>
                    setRandomCaption(
                      captionSuggestions[
                        Math.floor(Math.random() * captionSuggestions.length)
                      ],
                    )
                  }
                  className="mt-1 text-sm text-purple-600 dark:text-purple-300 hover:text-purple-800 transition"
                >
                  Get random caption suggestion
                </button>
                <p className="text-sm text-gray-500 italic mt-1">
                  {randomCaption}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`
                    bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 px-6 rounded-full 
                    ${isUploading ? "opacity-70 cursor-not-allowed" : "hover:from-purple-600 hover:to-indigo-700 hover:scale-105"}
                    transition
                  `}
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    "Share Now!"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoSharingApp;
