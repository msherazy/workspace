"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaHeart,
  FaMoon,
  FaPaperPlane,
  FaRegCommentDots,
  FaRegHeart,
  FaShare,
  FaSun,
} from "react-icons/fa";

const avatarColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-red-500",
];

function getAvatarColor(name: string) {
  const idx =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    avatarColors.length;
  return avatarColors[idx];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function SocialWall() {
  const [dark, setDark] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Jane Cooper",
      content:
        "Just finished reading Atomic Habits. Highly recommend for anyone looking to build better habits! What are you all reading lately?",
      timestamp: "2h ago",
      likes: 24,
      comments: 2,
      liked: false,
      commentOpen: false,
      commentsList: [
        {
          id: 1,
          author: "Alex Morgan",
          content: "I just started this too! So insightful.",
          timestamp: "1h ago",
        },
        {
          id: 2,
          author: "Sam Wilson",
          content: "The power of tiny changes is game-changing.",
          timestamp: "45m ago",
        },
      ],
      newComment: "",
    },
    {
      id: 2,
      author: "Michael Scott",
      content: "Beach day with the team! 🏖️ Who else is enjoying the summer?",
      timestamp: "5h ago",
      likes: 42,
      comments: 1,
      liked: false,
      commentOpen: false,
      commentsList: [
        {
          id: 1,
          author: "Jim Halpert",
          content: "Looks amazing! What beach is that?",
          timestamp: "4h ago",
        },
      ],
      newComment: "",
    },
  ]);
  const [newPost, setNewPost] = useState("");

  // Light/dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const toggleComments = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, commentOpen: !post.commentOpen } : post,
      ),
    );
  };

  const addComment = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId && post.newComment.trim() !== ""
          ? {
              ...post,
              commentsList: [
                ...post.commentsList,
                {
                  id: post.commentsList.length + 1,
                  author: "You",
                  content: post.newComment,
                  timestamp: "Just now",
                },
              ],
              comments: post.comments + 1,
              newComment: "",
            }
          : post,
      ),
    );
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim() === "") return;

    setPosts([
      {
        id: posts.length + 1,
        author: "You",
        content: newPost,
        timestamp: "Just now",
        likes: 0,
        comments: 0,
        liked: false,
        commentOpen: false,
        commentsList: [],
        newComment: "",
      },
      ...posts,
    ]);
    setNewPost("");
  };

  return (
    <div
      className={`min-h-screen py-8 px-2 sm:px-0 transition-colors duration-300 ${dark ? "bg-gray-950" : "bg-gray-100"}`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header + Dark/Light Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h1
            className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-800"}`}
          >
            Social Wall
          </h1>
          <button
            className="rounded-full p-2 border bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200 shadow-sm hover:shadow-md transition"
            onClick={() => setDark((v) => !v)}
            title="Toggle dark mode"
          >
            {dark ? (
              <FaSun className="h-5 w-5 text-yellow-400" />
            ) : (
              <FaMoon className="h-5 w-5 text-blue-600" />
            )}
          </button>
        </div>

        {/* Create Post */}
        <div
          className={`mb-6 p-4 rounded-lg shadow-sm ${dark ? "bg-gray-900" : "bg-white"}`}
        >
          <form onSubmit={handlePostSubmit}>
            <textarea
              className={`w-full p-3 border rounded-lg mb-3 resize-none bg-transparent ${
                dark
                  ? "border-gray-700 focus:ring-blue-900 focus:border-blue-900 text-white placeholder-gray-400"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              rows={3}
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Post
              </button>
            </div>
          </form>
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center py-16 ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            <span className="text-5xl mb-4">🪴</span>
            <div className="font-semibold mb-1">No posts yet</div>
            <div className="text-sm">
              Be the first to start the conversation!
            </div>
          </motion.div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ type: "spring", duration: 0.3 }}
                className={`border rounded-lg p-4 hover:shadow transition-shadow duration-200 ${
                  dark
                    ? "border-gray-800 bg-gray-900 text-gray-100"
                    : "border-gray-200 bg-white text-gray-900"
                }`}
              >
                {/* Post Header */}
                <div className="flex items-center mb-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shadow-sm ring-2 ring-white ${getAvatarColor(
                      post.author,
                    )}`}
                  >
                    {getInitials(post.author)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold">{post.author}</h3>
                    <p className="text-xs text-gray-400">{post.timestamp}</p>
                  </div>
                </div>
                {/* Post Content */}
                <p className="mb-4 text-base">{post.content}</p>
                {/* Post Actions */}
                <div className="flex items-center justify-between text-sm border-t border-b py-2 mb-3 border-gray-200 dark:border-gray-800">
                  <button
                    className="flex items-center space-x-1 group"
                    onClick={() => handleLike(post.id)}
                    aria-label={post.liked ? "Unlike" : "Like"}
                  >
                    {post.liked ? (
                      <FaHeart className="h-5 w-5 text-red-500 group-hover:scale-110 transition" />
                    ) : (
                      <FaRegHeart className="h-5 w-5 group-hover:text-red-500 transition" />
                    )}
                    <span>{post.likes}</span>
                  </button>
                  <button
                    className="flex items-center space-x-1 group"
                    onClick={() => toggleComments(post.id)}
                    aria-label="Comment"
                  >
                    <FaRegCommentDots className="h-5 w-5 group-hover:text-blue-600 transition" />
                    <span>{post.comments}</span>
                  </button>
                  <button
                    className="flex items-center space-x-1 group"
                    aria-label="Share"
                  >
                    <FaShare className="h-5 w-5 group-hover:text-green-600 transition" />
                    <span>Share</span>
                  </button>
                </div>
                {/* Comments Section */}
                <AnimatePresence>
                  {post.commentOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ type: "spring", duration: 0.25 }}
                      className="mt-2"
                    >
                      <div className="space-y-3 mb-3">
                        {post.commentsList.map((comment) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.07 * comment.id }}
                            className="flex items-start"
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white mr-2 mt-1 shadow-sm ${getAvatarColor(
                                comment.author,
                              )}`}
                            >
                              {getInitials(comment.author)}
                            </div>
                            <div className="flex-1">
                              <div
                                className={`p-3 rounded-lg ${dark ? "bg-gray-800" : "bg-gray-100"}`}
                              >
                                <div className="text-sm font-medium">
                                  {comment.author}
                                </div>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">
                                {comment.timestamp}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {/* Add Comment */}
                      <div className="flex items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white mr-2 ${getAvatarColor(
                            "You",
                          )}`}
                        >
                          Y
                        </div>
                        <div className="flex-1 flex">
                          <input
                            type="text"
                            className={`flex-1 border rounded-l-lg px-3 py-2 text-sm bg-transparent ${
                              dark
                                ? "border-gray-700 text-white placeholder-gray-400 focus:ring-blue-900 focus:border-blue-900"
                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            placeholder="Add a comment..."
                            value={post.newComment}
                            onChange={(e) =>
                              setPosts(
                                posts.map((p) =>
                                  p.id === post.id
                                    ? { ...p, newComment: e.target.value }
                                    : p,
                                ),
                              )
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" && addComment(post.id)
                            }
                          />
                          <button
                            onClick={() => addComment(post.id)}
                            className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-700 transition"
                            aria-label="Send"
                          >
                            <FaPaperPlane className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
