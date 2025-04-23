"use client";

import { Inter } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBell,
  FaChevronDown,
  FaComment,
  FaEdit,
  FaEllipsisH,
  FaEye,
  FaHome,
  FaPlus,
  FaSearch,
  FaShare,
  FaSignInAlt,
  FaSignOutAlt,
  FaTimes,
  FaTrash,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { IoArrowUp, IoHome, IoMoon, IoSunny } from "react-icons/io5";
import { useCallback, useEffect, useRef, useState } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Updated Color Palette
const colors = {
  primary: "#E60023",
  secondary: "#FFE4E6",
  accent: "#6B21A8",
  background: "#FFFFFF",
  darkBackground: "#1E1E1E",
  text: "#1F2937",
  textDark: "#E5E7EB",
  gray: "#D1D5DB",
  grayDark: "#4B5563",
  neutral: "#F3F4F6",
  success: "#10B981",
  warning: "#F59E0B",
};

// Interfaces
interface Pin {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  width: number;
  height: number;
  comments: { id: string; user: string; text: string; timestamp: string }[];
  creatorId: string;
}

interface Board {
  id: string;
  name: string;
  pins: string[];
}

interface User {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
}

interface TooltipProps {
  text: string;
  direction?: "bottom" | "right";
  children: React.ReactNode;
}

interface NotificationProps {
  id: string;
  message: string;
  icon: React.ReactNode;
  onClose: () => void;
}

interface PinCardProps {
  pin: Pin;
  darkMode: boolean;
  hoveredPin: string | null;
  setHoveredPin: (id: string | null) => void;
  hiddenPins: string[];
  reportedPins: string[];
  savedPins: string[];
  savingPins: string[];
  loadingImages: { [key: string]: boolean };
  failedImages: { [key: string]: number };
  handleSavePin: (pinId: string, e: React.MouseEvent) => void;
  sharePin: (pin: Pin, e: React.MouseEvent) => void;
  togglePinMenu: (pinId: string, e: React.MouseEvent) => void;
  handleImageLoad: (pinId: string) => void;
  handleImageError: (pinId: string, imageUrl: string) => void;
  addComment: (pinId: string, text: string) => void;
  currentUser: User | null;
  toggleHidePin: (pinId: string, e: React.MouseEvent) => void;
  openCommentSection: (pin: Pin) => void;
}

// Generate Pins
const generatePins = (count: number, creatorId: string = "user-1"): Pin[] => {
  const pins: Pin[] = [];
  const titles = [
    "Cozy Home Decor",
    "Modern Architecture",
    "Minimalist Art",
    "Street Fashion",
    "Gourmet Recipes",
    "Travel Adventures",
    "Portrait Photography",
    "Nature Escapes",
    "City Vibes",
    "Vintage Style",
  ];
  const categories = [
    "Decor",
    "Architecture",
    "Art",
    "Fashion",
    "Food",
    "Travel",
    "Photography",
    "Nature",
    "Urban",
    "Vintage",
  ];

  for (let i = 1; i <= count; i++) {
    const randomWidth = 400;
    const randomHeight = Math.floor(Math.random() * 400) + 200;
    const randomTitleIndex = Math.floor(Math.random() * titles.length);
    const randomCategoryIndex = Math.floor(Math.random() * categories.length);

    pins.push({
      id: `pin-${i}`,
      imageUrl: `https://picsum.photos/400/${randomHeight}?random=${i}`,
      title: titles[randomTitleIndex],
      category: categories[randomCategoryIndex],
      width: randomWidth,
      height: randomHeight,
      comments: [],
      creatorId,
    });
  }

  return pins;
};

// Notification Component
const Notification = ({ id, message, icon, onClose }: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className="relative w-80 bg-gray-900/95 text-white px-4 py-3 rounded-lg flex items-center shadow-xl border border-gray-700"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center flex-1">
        {icon}
        <span className="ml-3 text-sm font-medium">{message}</span>
      </div>
      <button
        className="ml-2 p-1 hover:bg-gray-800 rounded-full transition-colors"
        onClick={onClose}
      >
        <FaTimes className="w-3 h-3 text-gray-300" />
      </button>
    </motion.div>
  );
};

// Tooltip Component
const Tooltip = ({ text, direction = "bottom", children }: TooltipProps) => {
  return (
    <div className="relative group">
      {children}
      <div
        className={`absolute ${
          direction === "bottom"
            ? "top-full mt-2 left-1/2 -translate-x-1/2"
            : "left-full ml-2 top-1/2 -translate-y-1/2"
        } bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 scale-95 
        transition-all duration-200 group-hover:opacity-100 group-hover:scale-100
        whitespace-nowrap pointer-events-none z-50`}
      >
        {text}
      </div>
    </div>
  );
};

// Comment Section Component
const CommentSection = ({
  pin,
  darkMode,
  currentUser,
  addComment,
  onClose,
}: {
  pin: Pin;
  darkMode: boolean;
  currentUser: User | null;
  addComment: (pinId: string, text: string) => void;
  onClose: () => void;
}) => {
  const [commentText, setCommentText] = useState("");
  const commentInputRef = useRef<HTMLInputElement>(null);
  const commentContainerRef = useRef<HTMLDivElement>(null);

  const handleCommentSubmit = useCallback(() => {
    if (commentText.trim() && currentUser) {
      addComment(pin.id, commentText);
      setCommentText("");
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }
  }, [commentText, currentUser, addComment, pin.id]);

  useEffect(() => {
    if (commentContainerRef.current) {
      commentContainerRef.current.scrollTop =
        commentContainerRef.current.scrollHeight;
    }
  }, [pin.comments]);

  return (
    <motion.div
      className={`fixed inset-y-0 right-0 w-full sm:w-96 ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"} shadow-2xl z-50 flex flex-col`}
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-lg truncate">{pin.title}</h3>
        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          onClick={onClose}
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <img
          src={pin.imageUrl}
          alt={pin.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h4 className="font-semibold text-sm mb-3">Comments</h4>
        {pin.comments.length === 0 ? (
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} text-center py-4`}
          >
            Be the first to comment!
          </p>
        ) : (
          <div
            ref={commentContainerRef}
            className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto"
          >
            {pin.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                  <img
                    src={`https://picsum.photos/50?random=${comment.id}`}
                    alt={comment.user}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{comment.user}</p>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {new Date(comment.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <p className="text-sm mt-1">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {currentUser ? (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              ref={commentInputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className={`flex-1 py-2 px-4 ${
                darkMode
                  ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-[var(--primary)]"
                  : "bg-gray-100 text-gray-800 border-gray-300 focus:ring-[var(--primary)]"
              } rounded-full border focus:outline-none focus:ring-2 text-sm`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCommentSubmit();
                }
              }}
            />
            <motion.button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                commentText
                  ? darkMode
                    ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                    : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                  : darkMode
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              whileHover={{ scale: commentText ? 1.05 : 1 }}
              whileTap={{ scale: commentText ? 0.95 : 1 }}
              onClick={handleCommentSubmit}
              disabled={!commentText}
            >
              Post
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} text-center`}
          >
            Please log in to comment.
          </p>
        </div>
      )}
    </motion.div>
  );
};

// PinCard Component
function PinCard({
  pin,
  darkMode,
  hoveredPin,
  setHoveredPin,
  hiddenPins,
  reportedPins,
  savedPins,
  savingPins,
  loadingImages,
  failedImages,
  handleSavePin,
  sharePin,
  togglePinMenu,
  handleImageLoad,
  handleImageError,
  addComment,
  currentUser,
  toggleHidePin,
  openCommentSection,
}: PinCardProps) {
  return (
    <motion.div
      className={`break-inside-avoid ${darkMode ? "bg-gray-800" : "bg-white"} relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHoveredPin(pin.id)}
      onMouseLeave={() => setHoveredPin(null)}
      whileHover={{ y: -5 }}
    >
      <div
        className="relative"
        style={{ paddingBottom: `${(pin.height / pin.width) * 100}%` }}
      >
        <div
          className={`absolute inset-0 w-full h-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-2xl animate-pulse ${loadingImages[pin.id] ? "block" : "hidden"}`}
        />
        <img
          id={`pin-img-${pin.id}`}
          src={pin.imageUrl}
          alt={pin.title}
          className={`absolute inset-0 w-full h-full object-cover rounded-2xl ${hiddenPins.includes(pin.id) || reportedPins.includes(pin.id) ? "blur-sm" : ""}`}
          loading="lazy"
          onError={() => handleImageError(pin.id, pin.imageUrl)}
          onLoad={() => handleImageLoad(pin.id)}
          style={{ opacity: loadingImages[pin.id] === false ? 1 : 0 }}
        />
        {failedImages[pin.id] >= 3 && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <div
              className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm text-center p-4`}
            >
              <p>Image unavailable</p>
            </div>
          </div>
        )}
        {(hiddenPins.includes(pin.id) || reportedPins.includes(pin.id)) && (
          <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center z-20">
            <div className="text-left p-8">
              <h3 className="font-bold text-white text-lg mb-3">
                {reportedPins.includes(pin.id) ? "Reported Pin" : "Hidden Pin"}
              </h3>
              <p className="text-sm text-gray-200 mb-4">
                {reportedPins.includes(pin.id)
                  ? "Thanks for your feedback. We'll review this Pin."
                  : "Got it! We'll show you more relevant Pins in the future."}
              </p>
              {!reportedPins.includes(pin.id) && (
                <motion.button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90" : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => toggleHidePin(pin.id, e)}
                >
                  Unhide Pin
                </motion.button>
              )}
            </div>
          </div>
        )}
        {hoveredPin === pin.id &&
          !hiddenPins.includes(pin.id) &&
          !reportedPins.includes(pin.id) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-between p-4 z-10">
              <div className="flex justify-end space-x-2">
                <motion.button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${savingPins.includes(pin.id) ? "bg-gray-500 cursor-not-allowed" : savedPins.includes(pin.id) ? "bg-[var(--primary)]/90" : darkMode ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90" : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleSavePin(pin.id, e)}
                  disabled={savingPins.includes(pin.id)}
                >
                  {savingPins.includes(pin.id)
                    ? "Saving..."
                    : savedPins.includes(pin.id)
                      ? "Saved"
                      : "Save"}
                </motion.button>
                <motion.button
                  className={`p-2 rounded-full ${darkMode ? "bg-gray-800/80 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} shadow-md`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => sharePin(pin, e)}
                >
                  <FaShare
                    className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-gray-600"}`}
                  />
                </motion.button>
                <motion.button
                  className={`p-2 rounded-full ${darkMode ? "bg-gray-800/80 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} shadow-md`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => togglePinMenu(pin.id, e)}
                >
                  <FaEllipsisH
                    className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-gray-600"}`}
                  />
                </motion.button>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                  {pin.category}
                </div>
                <motion.button
                  className={`p-2 rounded-full ${darkMode ? "bg-gray-800/80 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} shadow-md`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openCommentSection(pin)}
                >
                  <FaComment
                    className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-gray-600"}`}
                  />
                </motion.button>
              </div>
            </div>
          )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm truncate">{pin.title}</h3>
        <p
          className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}
        >
          {pin.comments.length} comments
        </p>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [boards, setBoards] = useState<Board[]>([
    { id: "board-1", name: "Home Inspiration", pins: [] },
    { id: "board-2", name: "Travel Goals", pins: [] },
  ]);
  const [user, setUser] = useState<User | null>({
    id: "user-1",
    name: "Creative Explorer",
    bio: "Lover of art, travel, and all things beautiful.",
    avatar: "https://picsum.photos/200?random=1",
    followers: 1250,
  });
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState<{
    [key: string]: boolean;
  }>({});
  const [savedPins, setSavedPins] = useState<string[]>([]);
  const [savingPins, setSavingPins] = useState<string[]>([]);
  const [failedImages, setFailedImages] = useState<{ [key: string]: number }>(
    {},
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuPin, setOpenMenuPin] = useState<string | null>(null);
  const [hiddenPins, setHiddenPins] = useState<string[]>([]);
  const [reportedPins, setReportedPins] = useState<string[]>([]);
  const [reportReason, setReportReason] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [reportDialogPin, setReportDialogPin] = useState<string | null>(null);
  const [userMenuPosition, setUserMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [saveBoardPin, setSaveBoardPin] = useState<string | null>(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [profileTab, setProfileTab] = useState<"created" | "saved">("saved");
  const [editProfile, setEditProfile] = useState(false);
  const [createPin, setCreatePin] = useState(false);
  const [newPin, setNewPin] = useState<{
    title: string;
    category: string;
    imageUrl: string;
  }>({
    title: "",
    category: "",
    imageUrl: "",
  });
  const [editBoard, setEditBoard] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<
    { id: string; message: string; icon: React.ReactNode }[]
  >([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const maxRetries = 3;

  // Generate unique notification ID
  const generateNotificationId = () => {
    return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Notification handler
  const addNotification = (message: string, icon: React.ReactNode) => {
    const id = generateNotificationId();
    setNotifications((prev) => [...prev, { id, message, icon }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Dummy Authentication
  const login = () => {
    setUser({
      id: "user-1",
      name: "Creative Explorer",
      bio: "Lover of art, travel, and all things beautiful.",
      avatar: "https://picsum.photos/200?random=1",
      followers: 1250,
    });
    addNotification(
      "Logged in successfully",
      <FaSignInAlt
        className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
      />,
    );
  };

  const logout = () => {
    setUser(null);
    setSavedPins([]);
    addNotification(
      "Logged out successfully",
      <FaSignOutAlt
        className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
      />,
    );
  };

  // Handlers
  const handleImageLoad = (pinId: string) => {
    setLoadingImages((prev) => ({
      ...prev,
      [pinId]: false,
    }));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleUserDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (userDialogOpen) {
      setUserDialogOpen(false);
      setUserMenuPosition(null);
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setUserMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left,
      });
      setUserDialogOpen(true);
    }
  };

  const handleSavePin = (pinId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaveBoardPin(pinId);
  };

  const savePinToBoard = (pinId: string, boardId: string) => {
    if (savingPins.includes(pinId)) return;

    const pin = pins.find((p) => p.id === pinId);
    if (!pin) return;

    setSavingPins((prev) => [...prev, pinId]);

    setTimeout(() => {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId
            ? { ...board, pins: [...board.pins, pinId] }
            : board,
        ),
      );
      setSavedPins((prev) => [...prev, pinId]);
      setSavingPins((prev) => prev.filter((id) => id !== pinId));
      setSaveBoardPin(null);
      addNotification(
        `Saved to ${boards.find((b) => b.id === boardId)?.name}`,
        <FaHome
          className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
        />,
      );
    }, 1000);
  };

  const createBoard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newBoardName.trim()) {
      const newBoard: Board = {
        id: `board-${boards.length + 1}`,
        name: newBoardName,
        pins: [],
      };
      setBoards((prev) => [...prev, newBoard]);
      setNewBoardName("");
      addNotification(
        `Board "${newBoardName}" created`,
        <FaPlus
          className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
        />,
      );
    }
  };

  const editBoardName = (boardId: string, newName: string) => {
    if (newName.trim()) {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId ? { ...board, name: newName } : board,
        ),
      );
      setEditBoard(null);
      addNotification(
        `Board renamed to "${newName}"`,
        <FaEdit
          className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
        />,
      );
    }
  };

  const deleteBoard = (boardId: string) => {
    setBoards((prev) => prev.filter((board) => board.id !== boardId));
    addNotification(
      `Board deleted`,
      <FaTrash
        className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
      />,
    );
  };

  const createNewPin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newPin.title && newPin.category && user) {
      const newPinData: Pin = {
        id: `pin-${pins.length + 1}`,
        imageUrl:
          newPin.imageUrl ||
          `https://picsum.photos/400/300?random=${pins.length + 1}`,
        title: newPin.title,
        category: newPin.category,
        width: 400,
        height: 300,
        comments: [],
        creatorId: user.id,
      };
      setPins((prev) => [newPinData, ...prev]);
      setCreatePin(false);
      setNewPin({ title: "", category: "", imageUrl: "" });
      addNotification(
        `Pin "${newPin.title}" created`,
        <FaPlus
          className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
        />,
      );
    }
  };

  const handleSearchFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleImageError = (pinId: string, imageUrl: string) => {
    const currentRetries = failedImages[pinId] || 0;
    if (currentRetries < maxRetries) {
      setFailedImages((prev) => ({
        ...prev,
        [pinId]: currentRetries + 1,
      }));
      const imgElement = document.getElementById(
        `pin-img-${pinId}`,
      ) as HTMLImageElement;
      if (imgElement) {
        const newUrl = `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}retry=${currentRetries + 1}&t=${new Date().getTime()}`;
        imgElement.src = newUrl;
      }
    }
  };

  const togglePinMenu = (pinId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openMenuPin === pinId) {
      setOpenMenuPin(null);
      setMenuPosition(null);
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left,
      });
      setOpenMenuPin(pinId);
    }
  };

  const toggleHidePin = (pinId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (hiddenPins.includes(pinId)) {
      setHiddenPins((prev) => prev.filter((id) => id !== pinId));
      addNotification(
        "Pin unhidden",
        <FaEye
          className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
        />,
      );
    } else {
      setHiddenPins((prev) => [...prev, pinId]);
      addNotification(
        "Pin hidden",
        <FaEye
          className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
        />,
      );
    }
    setOpenMenuPin(null);
  };

  const downloadImage = async (pin: Pin, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(pin.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${pin.title.replace(/\s+/g, "-").toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      addNotification(
        "Image downloaded successfully",
        <FaShare
          className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
        />,
      );
    } catch (error) {
      console.error("Error downloading image:", error);
      addNotification(
        "Failed to download image",
        <FaTimes
          className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
        />,
      );
    }
    setOpenMenuPin(null);
  };

  const sharePin = (pin: Pin, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: pin.title,
          text: `Check out this pin: ${pin.title}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          addNotification(
            "Link copied to clipboard",
            <FaShare
              className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
            />,
          );
        })
        .catch((err) => console.error("Error copying link:", err));
    }
  };

  const openReportDialog = (pinId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReportDialogPin(pinId);
    setOpenMenuPin(null);
  };

  const submitReport = (pinId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (reportReason) {
      setReportedPins((prev) => [...prev, pinId]);
      setHiddenPins((prev) => [...prev, pinId]);
      setReportDialogPin(null);
      setReportReason(null);
      addNotification(
        `Pin reported`,
        <FaBell
          className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
        />,
      );
    }
  };

  const addComment = (pinId: string, text: string) => {
    if (text.trim() && user) {
      setPins((prev) =>
        prev.map((pin) =>
          pin.id === pinId
            ? {
                ...pin,
                comments: [
                  ...pin.comments,
                  {
                    id: `comment-${pinId}-${pin.comments.length + 1}`,
                    user: user.name,
                    text,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : pin,
        ),
      );
      addNotification(
        `Comment added`,
        <FaComment
          className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
        />,
      );
    }
  };

  const followUser = () => {
    if (user) {
      setUser((prev) =>
        prev ? { ...prev, followers: prev.followers + 1 } : null,
      );
      addNotification(
        `You followed ${user.name}`,
        <FaUserPlus
          className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
        />,
      );
    }
  };

  const updateProfile = (name: string, bio: string, avatar: string) => {
    if (user) {
      setUser({ ...user, name, bio, avatar });
      setEditProfile(false);
      addNotification(
        `Profile updated`,
        <FaEdit
          className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`}
        />,
      );
    }
  };

  const loadMorePins = () => {
    if (!hasMore) return;
    setLoading(true);
    setTimeout(() => {
      const newPins = generatePins(20);
      setPins((prev) => [...prev, ...newPins]);
      const newLoadingState: { [key: string]: boolean } = {};
      newPins.forEach((pin) => {
        newLoadingState[pin.id] = true;
      });
      setLoadingImages((prev) => ({ ...prev, ...newLoadingState }));
      setPage((prev) => prev + 1);
      setLoading(false);
      if (newPins.length < 20) setHasMore(false);
    }, 1000);
  };

  const openCommentSection = (pin: Pin) => {
    setSelectedPin(pin);
  };

  const closeCommentSection = () => {
    setSelectedPin(null);
  };

  // Effects
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const loadInitialPins = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const generatedPins = generatePins(50);
      setPins(generatedPins);
      const initialLoadingState: { [key: string]: boolean } = {};
      generatedPins.forEach((pin) => {
        initialLoadingState[pin.id] = true;
      });
      setLoadingImages(initialLoadingState);
      setLoading(false);
    };
    loadInitialPins();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePins();
        }
      },
      { threshold: 0.1 },
    );
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current && observerRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loading]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredPins = pins.filter(
    (pin) =>
      pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const categories = Array.from(new Set(pins.map((pin) => pin.category)));

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-[var(--darkBackground)] text-[var(--textDark)]" : "bg-[var(--background)] text-[var(--text)]"} ${inter.className} antialiased`}
    >
      <style jsx global>{`
        :root {
          --primary: ${colors.primary};
          --secondary: ${colors.secondary};
          --accent: ${colors.accent};
          --background: ${colors.background};
          --darkBackground: ${colors.darkBackground};
          --text: ${colors.text};
          --textDark: ${colors.textDark};
          --gray: ${colors.gray};
          --grayDark: ${colors.grayDark};
          --neutral: ${colors.neutral};
          --success: ${colors.success};
          --warning: ${colors.warning};
        }
        .dark {
          --background: var(--darkBackground);
          --text: var(--textDark);
          --gray: var(--grayDark);
          --neutral: var(--grayDark);
        }
      `}</style>

      <div className="flex min-h-screen">
        <div
          className={`w-16 flex-shrink-0 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border-r flex flex-col items-center py-6 fixed h-full hidden sm:flex z-50 shadow-md`}
        >
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] mb-8"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-bold text-xl">P</span>
          </motion.div>
          <Tooltip text="Home" direction="right">
            <motion.div
              className={`w-10 h-10 rounded-lg flex cursor-pointer items-center justify-center ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"} mb-6 transition-colors`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowProfile(false);
                setShowExplore(false);
              }}
            >
              <IoHome className="w-5 h-5" />
            </motion.div>
          </Tooltip>
          <Tooltip text="Profile" direction="right">
            <motion.div
              className={`w-10 h-10 rounded-lg flex cursor-pointer items-center justify-center ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"} mb-6 transition-colors`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowProfile(true);
                setShowExplore(false);
              }}
            >
              <FaUser className="w-5 h-5" />
            </motion.div>
          </Tooltip>
          <Tooltip text="Explore" direction="right">
            <motion.div
              className={`w-10 h-10 rounded-lg flex

 cursor-pointer items-center justify-center ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"} mb-6 transition-colors`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowExplore(true);
                setShowProfile(false);
              }}
            >
              <FaSearch className="w-5 h-5" />
            </motion.div>
          </Tooltip>
          <Tooltip text="Create Pin" direction="right">
            <motion.div
              className={`w-10 h-10 rounded-lg flex cursor-pointer items-center justify-center ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"} mb-6 transition-colors`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (user ? setCreatePin(true) : login())}
            >
              <FaPlus className="w-5 h-5" />
            </motion.div>
          </Tooltip>
          <Tooltip
            text={darkMode ? "Light Mode" : "Dark Mode"}
            direction="right"
          >
            <motion.div
              className={`w-10 h-10 rounded-lg flex cursor-pointer items-center justify-center ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"} mb-6 transition-colors`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <IoSunny className="w-5 h-5" />
              ) : (
                <IoMoon className="w-5 h-5" />
              )}
            </motion.div>
          </Tooltip>
        </div>

        <div className="flex-1 ml-0 sm:ml-16">
          <div
            className={`sticky top-0 z-40 ${darkMode ? "bg-gray-900" : "bg-white"} px-4 sm:px-6 py-3 shadow-sm`}
          >
            <div className="flex items-center max-w-7xl mx-auto">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FaSearch
                    className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for ideas..."
                  className={`w-full pl-10 pr-10 py-2.5 ${darkMode ? "bg-gray-800 text-gray-200 border-gray-700 focus:ring-[var(--primary)]" : "bg-gray-100 text-gray-800 border-gray-200 focus:ring-[var(--primary)]"} rounded-full border focus:outline-none focus:ring-2 text-sm transition-colors shadow-sm`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setShowProfile(false);
                      setShowExplore(false);
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={clearSearch}
                  >
                    <FaTimes
                      className={`h-4 w-4 ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                    />
                  </button>
                )}
              </div>
              <div className="ml-4 flex items-center space-x-2">
                {user ? (
                  <>
                    <Tooltip text="Your Profile" direction="bottom">
                      <motion.div
                        className={`w-8 h-8 rounded-full overflow-hidden ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-100"} cursor-pointer flex items-center justify-center transition-colors`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleUserDialog}
                      >
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </Tooltip>
                    <Tooltip text="Accounts" direction="bottom">
                      <motion.div
                        className={`p-1.5 rounded-lg ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-200 text-gray-600"} cursor-pointer transition-colors`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleUserDialog}
                      >
                        <FaChevronDown className="h-3.5 w-3.5" />
                      </motion.div>
                    </Tooltip>
                  </>
                ) : (
                  <motion.button
                    className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90" : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={login}
                  >
                    Log In
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
            {showProfile && user ? (
              <div className="py-8">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-4"></div>
                    <div className="h-6 w-48 bg-gray-200 animate-pulse mb-2"></div>
                    <div className="h-4 w-64 bg-gray-200 animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 animate-pulse"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center mb-10">
                      <motion.img
                        src={user.avatar}
                        alt={user.name}
                        className="w-32 h-32 rounded-full object-cover mb-4 shadow-md"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      />
                      <h2 className="text-3xl font-bold">{user.name}</h2>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mt-2 max-w-md text-center`}
                      >
                        {user.bio}
                      </p>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mt-1`}
                      >
                        {user.followers.toLocaleString()} followers
                      </p>
                      <div className="flex space-x-4 mt-6">
                        <motion.button
                          className={`px-6 py-2.5 rounded-full text-sm font-medium ${darkMode ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90" : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"} shadow-sm`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={followUser}
                        >
                          Follow
                        </motion.button>
                        <motion.button
                          className={`px-6 py-2.5 rounded-full text-sm font-medium ${darkMode ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"} shadow-sm`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditProfile(true)}
                        >
                          Edit Profile
                        </motion.button>
                      </div>
                    </div>
                    <div className="flex justify-center mb-8 border-b border-gray-200 dark:border-gray-800">
                      <button
                        className={`px-6 py-3 text-sm font-medium ${profileTab === "created" ? "border-b-2 border-[var(--primary)] text-[var(--primary)]" : darkMode ? "text-gray-400" : "text-gray-600"}`}
                        onClick={() => setProfileTab("created")}
                      >
                        Created
                      </button>
                      <button
                        className={`px-6 py-3 text-sm font-medium ${profileTab === "saved" ? "border-b-2 border-[var(--primary)] text-[var(--primary)]" : darkMode ? "text-gray-400" : "text-gray-600"}`}
                        onClick={() => setProfileTab("saved")}
                      >
                        Saved
                      </button>
                    </div>
                    {profileTab === "created" ? (
                      <>
                        <div className="mb-8">
                          <h3 className="text-xl font-semibold mb-4">
                            Your Pins
                          </h3>
                          {pins.filter((pin) => pin.creatorId === user.id)
                            .length === 0 ? (
                            <div className="text-center py-10">
                              <p
                                className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}
                              >
                                No pins created yet.
                              </p>
                              <motion.button
                                className={`px-6 py-2.5 rounded-full text-sm font-medium ${darkMode ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90" : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCreatePin(true)}
                              >
                                Create a Pin
                              </motion.button>
                            </div>
                          ) : (
                            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                              {pins
                                .filter((pin) => pin.creatorId === user.id)
                                .map((pin) => (
                                  <PinCard
                                    key={pin.id}
                                    pin={pin}
                                    darkMode={darkMode}
                                    hoveredPin={hoveredPin}
                                    setHoveredPin={setHoveredPin}
                                    hiddenPins={hiddenPins}
                                    reportedPins={reportedPins}
                                    savedPins={savedPins}
                                    savingPins={savingPins}
                                    loadingImages={loadingImages}
                                    failedImages={failedImages}
                                    handleSavePin={handleSavePin}
                                    sharePin={sharePin}
                                    togglePinMenu={togglePinMenu}
                                    handleImageLoad={handleImageLoad}
                                    handleImageError={handleImageError}
                                    addComment={addComment}
                                    currentUser={user}
                                    toggleHidePin={toggleHidePin}
                                    openCommentSection={openCommentSection}
                                  />
                                ))}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-8">
                          <h3 className="text-xl font-semibold mb-4">
                            Your Boards
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {boards.map((board) => (
                              <div
                                key={board.id}
                                className={`relative rounded-lg overflow-hidden ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"} cursor-pointer transition-colors shadow-sm`}
                                onClick={() => {
                                  setShowProfile(true);
                                }}
                              >
                                <div className="h-40 bg-gray-200">
                                  {board.pins.length > 0 && (
                                    <img
                                      src={
                                        pins.find((p) => p.id === board.pins[0])
                                          ?.imageUrl
                                      }
                                      alt={board.name}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="p-4">
                                  <h4 className="font-semibold text-sm">
                                    {board.name}
                                  </h4>
                                  <p
                                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                                  >
                                    {board.pins.length} pins
                                  </p>
                                </div>
                                <motion.button
                                  className={`absolute top-2 right-2 p-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} shadow-sm`}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditBoard(board.id);
                                  }}
                                >
                                  <FaEdit className="w-4 h-4" />
                                </motion.button>
                              </div>
                            ))}
                            <div
                              className={`p-4 rounded-lg ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"} flex items-center justify-center cursor-pointer transition-colors shadow-sm`}
                              onClick={() => setSaveBoardPin("new-board")}
                            >
                              <FaPlus
                                className={`w-6 h-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                              />
                              <span className="ml-2 text-sm font-medium">
                                Create Board
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-4">
                            Saved Pins
                          </h3>
                          {savedPins.length === 0 ? (
                            <div className="text-center py-10">
                              <p
                                className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}
                              >
                                No saved pins yet.
                              </p>
                              <motion.button
                                className={`px-6 py-2.5 rounded-full text-sm font-medium ${darkMode ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90" : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setShowProfile(false);
                                  setShowExplore(false);
                                }}
                              >
                                Explore Pins
                              </motion.button>
                            </div>
                          ) : (
                            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                              {pins
                                .filter((pin) => savedPins.includes(pin.id))
                                .map((pin) => (
                                  <PinCard
                                    key={pin.id}
                                    pin={pin}
                                    darkMode={darkMode}
                                    hoveredPin={hoveredPin}
                                    setHoveredPin={setHoveredPin}
                                    hiddenPins={hiddenPins}
                                    reportedPins={reportedPins}
                                    savedPins={savedPins}
                                    savingPins={savingPins}
                                    loadingImages={loadingImages}
                                    failedImages={failedImages}
                                    handleSavePin={handleSavePin}
                                    sharePin={sharePin}
                                    togglePinMenu={togglePinMenu}
                                    handleImageLoad={handleImageLoad}
                                    handleImageError={handleImageError}
                                    addComment={addComment}
                                    currentUser={user}
                                    toggleHidePin={toggleHidePin}
                                    openCommentSection={openCommentSection}
                                  />
                                ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            ) : showExplore ? (
              <div className="py-8">
                <h2 className="text-3xl font-bold mb-6">Explore Ideas</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${searchQuery === category ? "bg-[var(--primary)] text-white" : darkMode ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-gray-100 text-gray-800 hover:bg-gray-200"} transition-colors shadow-sm`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSearchQuery(category)}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                  {filteredPins.map((pin) => (
                    <PinCard
                      key={pin.id}
                      pin={pin}
                      darkMode={darkMode}
                      hoveredPin={hoveredPin}
                      setHoveredPin={setHoveredPin}
                      hiddenPins={hiddenPins}
                      reportedPins={reportedPins}
                      savedPins={savedPins}
                      savingPins={savingPins}
                      loadingImages={loadingImages}
                      failedImages={failedImages}
                      handleSavePin={handleSavePin}
                      sharePin={sharePin}
                      togglePinMenu={togglePinMenu}
                      handleImageLoad={handleImageLoad}
                      handleImageError={handleImageError}
                      addComment={addComment}
                      currentUser={user}
                      toggleHidePin={toggleHidePin}
                      openCommentSection={openCommentSection}
                    />
                  ))}
                </div>
                <div ref={loadMoreRef} className="h-10"></div>
                {loading && pins.length > 0 && (
                  <div className="flex justify-center mt-6">
                    <motion.div
                      className={`w-8 h-8 border-4 ${darkMode ? "border-[var(--primary)] border-t-gray-800" : "border-[var(--primary)] border-t-transparent"} rounded-full`}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-4">
                    Discover New Ideas
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 8).map((category) => (
                      <motion.button
                        key={category}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-gray-100 text-gray-800 hover:bg-gray-200"} transition-colors shadow-sm`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSearchQuery(category)}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>
                {loading && pins.length === 0 ? (
                  <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                    {Array(12)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className={`h-64 ${darkMode ? "bg-gray-800" : "bg-gray-200"} rounded-2xl animate-pulse shadow-sm`}
                        ></div>
                      ))}
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">
                        Trending Now
                      </h3>
                      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                        {filteredPins.slice(0, 10).map((pin) => (
                          <PinCard
                            key={pin.id}
                            pin={pin}
                            darkMode={darkMode}
                            hoveredPin={hoveredPin}
                            setHoveredPin={setHoveredPin}
                            hiddenPins={hiddenPins}
                            reportedPins={reportedPins}
                            savedPins={savedPins}
                            savingPins={savingPins}
                            loadingImages={loadingImages}
                            failedImages={failedImages}
                            handleSavePin={handleSavePin}
                            sharePin={sharePin}
                            togglePinMenu={togglePinMenu}
                            handleImageLoad={handleImageLoad}
                            handleImageError={handleImageError}
                            addComment={addComment}
                            currentUser={user}
                            toggleHidePin={toggleHidePin}
                            openCommentSection={openCommentSection}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        More to Explore
                      </h3>
                      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                        {filteredPins.slice(10).map((pin) => (
                          <PinCard
                            key={pin.id}
                            pin={pin}
                            darkMode={darkMode}
                            hoveredPin={hoveredPin}
                            setHoveredPin={setHoveredPin}
                            hiddenPins={hiddenPins}
                            reportedPins={reportedPins}
                            savedPins={savedPins}
                            savingPins={savingPins}
                            loadingImages={loadingImages}
                            failedImages={failedImages}
                            handleSavePin={handleSavePin}
                            sharePin={sharePin}
                            togglePinMenu={togglePinMenu}
                            handleImageLoad={handleImageLoad}
                            handleImageError={handleImageError}
                            addComment={addComment}
                            currentUser={user}
                            toggleHidePin={toggleHidePin}
                            openCommentSection={openCommentSection}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <div ref={loadMoreRef} className="h-10"></div>
                {loading && pins.length > 0 && (
                  <div className="flex justify-center mt-6">
                    <motion.div
                      className={`w-8 h-8 border-4 ${darkMode ? "border-[var(--primary)] border-t-gray-800" : "border-[var(--primary)] border-t-transparent"} rounded-full`}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--background)] dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around px-4 z-50 shadow-md">
        <motion.div
          className={`w-10 h-10 rounded-lg flex cursor-pointer items-center justify-center ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-200"} transition-colors`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowProfile(false);
            setShowExplore(false);
          }}
        >
          <IoHome className="w-5 h-5" />
        </motion.div>
        <motion.div
          className={`w-10 h-10 rounded-lg flex cursor-pointer items-center justify-center ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-200"} transition-colors`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowProfile(true);
            setShowExplore(false);
          }}
        >
          <FaUser className="w-5 h-5" />
        </motion.div>
        <motion.div
          className={`w-10 h-10 rounded-lg flex cursor-pointer items-center justify-center ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-200"} transition-colors`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowExplore(true);
            setShowProfile(false);
          }}
        >
          <FaSearch className="w-5 h-5" />
        </motion.div>
        <motion.div
          className={`w-10 h-10 rounded-lg flex cursor-pointer items-center justify-center ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-200"} transition-colors`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (user ? setCreatePin(true) : login())}
        >
          <FaPlus className="w-5 h-5" />
        </motion.div>
        <div className="flex items-center">
          {user ? (
            <>
              <motion.div
                className={`w-8 h-8 rounded-full overflow-hidden ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-100"} cursor-pointer flex items-center justify-center transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleUserDialog}
              >
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className={`p-1.5 rounded-lg ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-200 text-gray-600"} cursor-pointer transition-colors rotate-180`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleUserDialog}
              >
                <FaChevronDown className="h-3.5 w-3.5" />
              </motion.div>
            </>
          ) : (
            <motion.button
              className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90" : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={login}
            >
              Log In
            </motion.button>
          )}
        </div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className={`fixed bottom-20 right-4 p-3 rounded-full ${darkMode ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"} shadow-lg z-50`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <IoArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 space-y-2 max-w-md w-full">
        <AnimatePresence>
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              id={notification.id}
              message={notification.message}
              icon={notification.icon}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Comment Section */}
      <AnimatePresence>
        {selectedPin && (
          <CommentSection
            pin={selectedPin}
            darkMode={darkMode}
            currentUser={user}
            addComment={addComment}
            onClose={closeCommentSection}
          />
        )}
      </AnimatePresence>

      {/* Pin Menu */}
      {openMenuPin && menuPosition && (
        <div
          className={`fixed ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"} rounded-lg shadow-xl p-3 z-50 w-48 border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left - 150}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mb-2 text-left font-medium`}
          >
            Pin Options
          </p>
          <button
            className={`w-full text-left py-2 px-3 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded text-sm font-medium transition-colors`}
            onClick={(e) => toggleHidePin(openMenuPin, e)}
          >
            {hiddenPins.includes(openMenuPin) ? "Unhide Pin" : "Hide Pin"}
          </button>
          <button
            className={`w-full text-left py-2 px-3 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded text-sm font-medium transition-colors`}
            onClick={(e) => {
              const pin = pins.find((p) => p.id === openMenuPin);
              if (pin) downloadImage(pin, e);
            }}
          >
            Download Image
          </button>
          <button
            className={`w-full text-left py-2 px-3 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded text-sm font-medium transition-colors`}
            onClick={(e) => openReportDialog(openMenuPin, e)}
          >
            Report Pin
          </button>
        </div>
      )}

      {/* Report Dialog */}
      {reportDialogPin && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => {
            setReportDialogPin(null);
            setReportReason(null);
          }}
        >
          <div
            className={`${
              darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            } rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-xl mb-4">Report Pin</h3>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}
            >
              Why are you reporting this Pin?
            </p>
            <div className="space-y-3 mb-6">
              {["Spam", "Hate", "Violence"].map((reason) => (
                <label key={reason} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason.toLowerCase()}
                    onChange={() => setReportReason(reason.toLowerCase())}
                    checked={reportReason === reason.toLowerCase()}
                    className={
                      darkMode
                        ? "accent-[var(--primary)]"
                        : "accent-[var(--primary)]"
                    }
                  />
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-800"} transition-colors`}
                onClick={() => {
                  setReportDialogPin(null);
                  setReportReason(null);
                }}
              >
                Cancel
              </button>
              <motion.button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  reportReason
                    ? darkMode
                      ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                      : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                    : darkMode
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } transition-colors`}
                whileHover={{ scale: reportReason ? 1.05 : 1 }}
                whileTap={{ scale: reportReason ? 0.95 : 1 }}
                onClick={(e) =>
                  reportReason && submitReport(reportDialogPin, e)
                }
                disabled={!reportReason}
              >
                Report
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Save to Board Dialog */}
      {saveBoardPin && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => {
            setSaveBoardPin(null);
            setNewBoardName("");
          }}
        >
          <div
            className={`${
              darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            } rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-xl mb-4">Save to Board</h3>
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {boards.map((board) => (
                <button
                  key={board.id}
                  className={`w-full text-left py-2.5 px-4 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded text-sm font-medium flex items-center justify-between transition-colors`}
                  onClick={() => savePinToBoard(saveBoardPin, board.id)}
                >
                  <span>{board.name}</span>
                  <span
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {board.pins.length} pins
                  </span>
                </button>
              ))}
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="New board name..."
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className={`w-full py-2 px-4 ${darkMode ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-[var(--primary)]" : "bg-gray-100 text-gray-800 border-gray-200 focus:ring-[var(--primary)]"} rounded-full border focus:outline-none focus:ring-2 text-sm transition-colors shadow-sm`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newBoardName.trim()) {
                    createBoard(e as any);
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-800"} transition-colors`}
                onClick={() => {
                  setSaveBoardPin(null);
                  setNewBoardName("");
                }}
              >
                Cancel
              </button>
              <motion.button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  newBoardName
                    ? darkMode
                      ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                      : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                    : darkMode
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } transition-colors`}
                whileHover={{ scale: newBoardName ? 1.05 : 1 }}
                whileTap={{ scale: newBoardName ? 0.95 : 1 }}
                onClick={createBoard}
                disabled={!newBoardName}
              >
                Create Board
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* User Menu */}
      {userDialogOpen && userMenuPosition && (
        <div
          className={`fixed ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"} rounded-lg shadow-xl p-3 z-50 w-48 border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          style={{
            top: `${userMenuPosition.top}px`,
            left: `${userMenuPosition.left - 120}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mb-2 text-left font-medium`}
          >
            Your Account
          </p>
          <button
            className={`w-full text-left py-2 px-3 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded text-sm font-medium transition-colors`}
            onClick={() => {
              setShowProfile(true);
              setShowExplore(false);
              setUserDialogOpen(false);
            }}
          >
            View Profile
          </button>
          <button
            className={`w-full text-left py-2 px-3 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded text-sm font-medium transition-colors`}
            onClick={() => {
              setEditProfile(true);
              setUserDialogOpen(false);
            }}
          >
            Edit Profile
          </button>
          <button
            className={`w-full text-left py-2 px-3 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded text-sm font-medium transition-colors`}
            onClick={() => {
              logout();
              setUserDialogOpen(false);
            }}
          >
            Log Out
          </button>
        </div>
      )}

      {/* Edit Profile Dialog */}
      {editProfile && user && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setEditProfile(false)}
        >
          <div
            className={`${
              darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            } rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-xl mb-4">Edit Profile</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className={`w-full py-2 px-4 ${darkMode ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-[var(--primary)]" : "bg-gray-100 text-gray-800 border-gray-200 focus:ring-[var(--primary)]"} rounded-full border focus:outline-none focus:ring-2 text-sm transition-colors shadow-sm`}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  defaultValue={user.bio}
                  className={`w-full py-2 px-4 ${darkMode ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-[var(--primary)]" : "bg-gray-100 text-gray-800 border-gray-200 focus:ring-[var(--primary)]"} rounded-lg border focus:outline-none focus:ring-2 text-sm transition-colors shadow-sm resize-none h-24`}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Avatar URL
                </label>
                <input
                  type="text"
                  defaultValue={user.avatar}
                  className={`w-full py-2 px-4 ${darkMode ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-[var(--primary)]" : "bg-gray-100 text-gray-800 border-gray-200 focus:ring-[var(--primary)]"} rounded-full border focus:outline-none focus:ring-2 text-sm transition-colors shadow-sm`}
                  onChange={(e) => setUser({ ...user, avatar: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-800"} transition-colors`}
                onClick={() => setEditProfile(false)}
              >
                Cancel
              </button>
              <motion.button
                className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90" : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"} transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateProfile(user.name, user.bio, user.avatar)}
              >
                Save
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Create Pin Dialog */}
      {createPin && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setCreatePin(false)}
        >
          <div
            className={`${
              darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            } rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-xl mb-4">Create Pin</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newPin.title}
                  onChange={(e) =>
                    setNewPin({ ...newPin, title: e.target.value })
                  }
                  className={`w-full py-2 px-4 ${darkMode ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-[var(--primary)]" : "bg-gray-100 text-gray-800 border-gray-200 focus:ring-[var(--primary)]"} rounded-full border focus:outline-none focus:ring-2 text-sm transition-colors shadow-sm`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newPin.category}
                  onChange={(e) =>
                    setNewPin({ ...newPin, category: e.target.value })
                  }
                  className={`w-full py-2 px-4 ${darkMode ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-[var(--primary)]" : "bg-gray-100 text-gray-800 border-gray-200 focus:ring-[var(--primary)]"} rounded-full border focus:outline-none focus:ring-2 text-sm transition-colors shadow-sm`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="text"
                  value={newPin.imageUrl}
                  onChange={(e) =>
                    setNewPin({ ...newPin, imageUrl: e.target.value })
                  }
                  className={`w-full py-2 px-4 ${darkMode ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-[var(--primary)]" : "bg-gray-100 text-gray-800 border-gray-200 focus:ring-[var(--primary)]"} rounded-full border focus:outline-none focus:ring-2 text-sm transition-colors shadow-sm`}
                  placeholder="Enter image URL or leave blank for random"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-800"} transition-colors`}
                onClick={() => setCreatePin(false)}
              >
                Cancel
              </button>
              <motion.button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  newPin.title && newPin.category
                    ? darkMode
                      ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                      : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                    : darkMode
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } transition-colors`}
                whileHover={{
                  scale: newPin.title && newPin.category ? 1.05 : 1,
                }}
                whileTap={{ scale: newPin.title && newPin.category ? 0.95 : 1 }}
                onClick={createNewPin}
                disabled={!newPin.title || !newPin.category}
              >
                Create
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Board Dialog */}
      {editBoard && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setEditBoard(null)}
        >
          <div
            className={`${
              darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            } rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-xl mb-4">Edit Board</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Board Name
                </label>
                <input
                  type="text"
                  defaultValue={boards.find((b) => b.id === editBoard)?.name}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className={`w-full py-2 px-4 ${darkMode ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-[var(--primary)]" : "bg-gray-100 text-gray-800 border-gray-200 focus:ring-[var(--primary)]"} rounded-full border focus:outline-none focus:ring-2 text-sm transition-colors shadow-sm`}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <motion.button
                className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"} transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  deleteBoard(editBoard);
                  setEditBoard(null);
                }}
              >
                Delete Board
              </motion.button>
              <div className="flex space-x-3">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-800"} transition-colors`}
                  onClick={() => setEditBoard(null)}
                >
                  Cancel
                </button>
                <motion.button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    newBoardName
                      ? darkMode
                        ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                        : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                      : darkMode
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } transition-colors`}
                  whileHover={{ scale: newBoardName ? 1.05 : 1 }}
                  whileTap={{ scale: newBoardName ? 0.95 : 1 }}
                  onClick={() => {
                    editBoardName(editBoard, newBoardName);
                  }}
                  disabled={!newBoardName}
                >
                  Save
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
