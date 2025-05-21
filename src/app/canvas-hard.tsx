"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { MdDraw } from "react-icons/md";
import {
  IoEllipse,
  IoSettings,
  IoSquare,
  IoTrash,
  IoTriangle,
  IoChevronDown,
  IoChevronUp,
  IoChevronForward,
} from "react-icons/io5";
import {
  FaExpandArrowsAlt,
  FaHeart,
  FaMoon,
  FaPause,
  FaPlay,
  FaRedo,
  FaShare,
  FaSun,
  FaUndo,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

interface Point {
  x: number;
  y: number;
}

interface Shape {
  id: number;
  type: "circle" | "square" | "triangle";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  animation?: "bounce" | "pulse" | "spin";
  speed: number;
  isFavorite: boolean;
  zIndex: number;
}

const shapeIcons = {
  circle: IoEllipse,
  square: IoSquare,
  triangle: IoTriangle,
};

const animationOptions = [
  { value: "bounce", label: "Bounce" },
  { value: "pulse", label: "Pulse" },
  { value: "spin", label: "Spin" },
];

const colorOptions = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#14b8a6",
  "#0ea5e9",
];

const welcomeMessages = [
  "Welcome to Shape Editor!",
  "Create and animate shapes",
  "Drag to resize, click to select",
];

const ModernPanel = ({
  children,
  title,
  lightTheme,
}: {
  children: ReactNode;
  title: string;
  lightTheme: boolean;
}) => (
  <motion.div
    className={`relative p-6 rounded-3xl border shadow-2xl backdrop-blur-xl
            ${
              lightTheme
                ? "bg-white/70 border-gray-200"
                : "bg-gray-900/70 border-gray-700"
            }
            transition-all duration-300`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {title && (
      <h3
        className={`text-xl font-bold mb-4 tracking-tight ${lightTheme ? "text-gray-800" : "text-white"}`}
      >
        {title}
      </h3>
    )}
    {children}
  </motion.div>
);

const CollapsiblePanel = ({
  title,
  children,
  defaultOpen = true,
  lightTheme,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  lightTheme: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full p-3 rounded-xl font-semibold shadow
                    ${
                      lightTheme
                        ? "bg-white/60 hover:bg-indigo-50"
                        : "bg-gray-800/60 hover:bg-gray-700"
                    }
                    transition-all duration-200`}
      >
        <span
          className={`font-medium ${lightTheme ? "text-gray-800" : "text-white"}`}
        >
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <IoChevronUp
              className={`h-5 w-5 ${lightTheme ? "text-gray-600" : "text-gray-300"}`}
            />
          ) : (
            <IoChevronDown
              className={`h-5 w-5 ${lightTheme ? "text-gray-600" : "text-gray-300"}`}
            />
          )}
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShapeEditor = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [newShape, setNewShape] = useState<Shape>({
    id: 0,
    type: "circle",
    x: 0,
    y: 0,
    width: 80,
    height: 80,
    rotation: 0,
    color: "#6366f1",
    animation: undefined,
    speed: 1,
    isFavorite: false,
    zIndex: 0,
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [lightTheme, setLightTheme] = useState(true);
  const [history, setHistory] = useState<Shape[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isHoveringPlay, setIsHoveringPlay] = useState(false);
  const [isDraggingShape, setIsDraggingShape] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentWelcomeIndex, setCurrentWelcomeIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isToolsCollapsed, setIsToolsCollapsed] = useState(false);
  const [resizingDirection, setResizingDirection] = useState<string | null>(
    null,
  );

  const canvasRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showWelcome) return;

    const timer = setInterval(() => {
      setCurrentWelcomeIndex((prev) => (prev + 1) % welcomeMessages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [showWelcome]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedShape &&
        canvasRef.current &&
        !canvasRef.current.contains(event.target as Node)
      ) {
        setSelectedShape(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedShape]);

  const saveToHistory = (newShapes: Shape[]) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push([...newShapes]);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (currentIndex > 0) {
      const previousShapes = history[currentIndex - 1];
      setShapes(previousShapes);
      setCurrentIndex(currentIndex - 1);
      setSelectedShape(null);
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      const nextShapes = history[currentIndex + 1];
      setShapes(nextShapes);
      setCurrentIndex(currentIndex + 1);
      setSelectedShape(null);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      controlsRef.current &&
      controlsRef.current.contains(event.target as Node)
    ) {
      return;
    }

    if (event.button === 0) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Check if we clicked on a resize handle
      if (selectedShape && resizingDirection) {
        setStartPoint({ x, y });
        return;
      }

      // Check if we clicked on an existing shape
      const clickedShape = [...shapes].reverse().find((shape) => {
        return (
          x >= shape.x &&
          x <= shape.x + shape.width &&
          y >= shape.y &&
          y <= shape.y + shape.height
        );
      });

      if (clickedShape) {
        setSelectedShape(clickedShape);
        setIsDraggingShape(true);
        setDragOffset({
          x: x - clickedShape.x,
          y: y - clickedShape.y,
        });
        return;
      }

      // Create a new shape
      const newId =
        shapes.length > 0 ? Math.max(...shapes.map((s) => s.id)) + 1 : 1;
      const newShapes = [
        ...shapes,
        {
          ...newShape,
          id: newId,
          x,
          y,
          zIndex: shapes.length,
        },
      ];

      setShapes(newShapes);
      saveToHistory(newShapes);
      setSelectedShape(newShapes[newShapes.length - 1]);
      setIsDrawing(true);
      setStartPoint({ x, y });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingShape && !isDrawing && !resizingDirection) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    if (isDraggingShape && selectedShape) {
      const updatedShapes = shapes.map((shape) =>
        shape.id === selectedShape.id
          ? {
              ...shape,
              x: currentX - dragOffset.x,
              y: currentY - dragOffset.y,
            }
          : shape,
      );
      setShapes(updatedShapes);
    } else if (resizingDirection && selectedShape && startPoint) {
      const updatedShapes = shapes.map((shape) => {
        if (shape.id !== selectedShape.id) return shape;

        let newX = shape.x;
        let newY = shape.y;
        let newWidth = shape.width;
        let newHeight = shape.height;

        switch (resizingDirection) {
          case "n":
            newHeight = shape.height + (shape.y - currentY);
            newY = currentY;
            break;
          case "s":
            newHeight = currentY - shape.y;
            break;
          case "e":
            newWidth = currentX - shape.x;
            break;
          case "w":
            newWidth = shape.width + (shape.x - currentX);
            newX = currentX;
            break;
          case "ne":
            newHeight = shape.height + (shape.y - currentY);
            newY = currentY;
            newWidth = currentX - shape.x;
            break;
          case "nw":
            newHeight = shape.height + (shape.y - currentY);
            newY = currentY;
            newWidth = shape.width + (shape.x - currentX);
            newX = currentX;
            break;
          case "se":
            newHeight = currentY - shape.y;
            newWidth = currentX - shape.x;
            break;
          case "sw":
            newHeight = currentY - shape.y;
            newWidth = shape.width + (shape.x - currentX);
            newX = currentX;
            break;
        }

        return {
          ...shape,
          x: newX,
          y: newY,
          width: Math.max(20, newWidth),
          height: Math.max(20, newHeight),
        };
      });

      setShapes(updatedShapes);
    } else if (isDrawing && selectedShape && startPoint) {
      const width = Math.abs(currentX - startPoint.x);
      const height = Math.abs(currentY - startPoint.y);
      const x = Math.min(currentX, startPoint.x);
      const y = Math.min(currentY, startPoint.y);

      const updatedShapes = shapes.map((shape) =>
        shape.id === selectedShape.id
          ? { ...shape, x, y, width, height }
          : shape,
      );
      setShapes(updatedShapes);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsDraggingShape(false);
    setResizingDirection(null);
    setStartPoint(null);
    if (selectedShape) {
      saveToHistory(shapes);
    }
  };

  const handleShapeChange = (type: "circle" | "square" | "triangle") => {
    setNewShape({ ...newShape, type });
  };

  const handleColorChange = (color: string) => {
    setNewShape({ ...newShape, color });
    if (selectedShape) {
      const updatedShapes = shapes.map((shape) =>
        shape.id === selectedShape.id ? { ...shape, color } : shape,
      );
      setShapes(updatedShapes);
      saveToHistory(updatedShapes);
    }
  };

  const handleAnimationChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const animation = event.target.value as
      | "bounce"
      | "pulse"
      | "spin"
      | undefined;

    if (selectedShape) {
      const updatedShape = { ...selectedShape, animation };
      const updatedShapes = shapes.map((shape) =>
        shape.id === selectedShape.id ? updatedShape : shape,
      );

      setSelectedShape(updatedShape);
      setShapes(updatedShapes);
      saveToHistory(updatedShapes);
    }
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseFloat(event.target.value);
    setNewShape({ ...newShape, speed });
    if (selectedShape) {
      const updatedShapes = shapes.map((shape) =>
        shape.id === selectedShape.id ? { ...shape, speed } : shape,
      );
      setShapes(updatedShapes);
      saveToHistory(updatedShapes);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedShape) {
      const updatedShapes = shapes.map((shape) =>
        shape.id === selectedShape.id
          ? { ...shape, isFavorite: !shape.isFavorite }
          : shape,
      );
      setShapes(updatedShapes);
      saveToHistory(updatedShapes);
    }
  };

  const deleteSelectedShape = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedShape) {
      const updatedShapes = shapes.filter(
        (shape) => shape.id !== selectedShape.id,
      );
      setShapes(updatedShapes);
      saveToHistory(updatedShapes);
      setSelectedShape(null);
    }
  };

  const handleThemeChange = () => {
    setLightTheme(!lightTheme);
  };

  const handleAnimationPlayPause = () => {
    setIsAnimating(!isAnimating);
  };

  const handleReset = () => {
    setShapes([]);
    setHistory([[]]);
    setCurrentIndex(-1);
    setSelectedShape(null);
    setIsAnimating(false);
  };

  const shareCanvas = async () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = canvasRef.current!.clientWidth;
      canvas.height = canvasRef.current!.clientHeight;

      ctx.fillStyle = lightTheme ? "#f8fafc" : "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      shapes.forEach((shape) => {
        ctx.save();
        ctx.translate(shape.x + shape.width / 2, shape.y + shape.height / 2);
        ctx.rotate((shape.rotation * Math.PI) / 180);
        ctx.fillStyle = shape.color;
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;

        if (shape.type === "circle") {
          ctx.beginPath();
          ctx.ellipse(
            0,
            0,
            shape.width / 2,
            shape.height / 2,
            0,
            0,
            2 * Math.PI,
          );
          ctx.fill();
        } else if (shape.type === "square") {
          ctx.fillRect(
            -shape.width / 2,
            -shape.height / 2,
            shape.width,
            shape.height,
          );
        } else if (shape.type === "triangle") {
          ctx.beginPath();
          ctx.moveTo(0, -shape.height / 2);
          ctx.lineTo(-shape.width / 2, shape.height / 2);
          ctx.lineTo(shape.width / 2, shape.height / 2);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();

      if (navigator.canShare && navigator.canShare({ files: [blob] })) {
        await navigator.share({
          files: [new File([blob], "canvas.png", { type: "image/png" })],
          title: "Shape Editor Artwork",
          text: "Created with Shape Editor",
        });
      } else if (navigator.share) {
        await navigator.share({
          title: "Shape Editor Artwork",
          text: "Created with Shape Editor",
          url: typeof window !== "undefined" ? window.location.href : "",
        });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "shape-artwork.png";
        a.click();
      }
    } catch (error) {
      console.error("Error sharing canvas:", error);
    }
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setResizingDirection(direction);
    const rect = canvasRef.current!.getBoundingClientRect();
    setStartPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const renderShape = (shape: Shape) => {
    const ShapeIcon = shapeIcons[shape.type];
    const isCurrent = selectedShape?.id === shape.id;

    // Animation logic for Framer Motion
    let animateProps: any = {};
    let transitionProps: any = {};

    if (isAnimating && shape.animation) {
      if (shape.animation === "bounce") {
        animateProps = {
          x: [shape.x, shape.x + 20, shape.x, shape.x - 20, shape.x],
          y: [shape.y, shape.y - 20, shape.y, shape.y + 20, shape.y],
        };
        transitionProps = {
          x: {
            repeat: Infinity,
            duration: 2 / (shape.speed * animationSpeed),
            ease: "easeInOut",
          },
          y: {
            repeat: Infinity,
            duration: 2 / (shape.speed * animationSpeed),
            ease: "easeInOut",
          },
        };
      } else if (shape.animation === "pulse") {
        animateProps = {
          scale: [1, 1.2, 1, 0.8, 1],
        };
        transitionProps = {
          scale: {
            repeat: Infinity,
            duration: 2 / (shape.speed * animationSpeed),
            ease: "easeInOut",
          },
        };
      } else if (shape.animation === "spin") {
        animateProps = {
          rotate: [0, 360],
        };
        transitionProps = {
          rotate: {
            repeat: Infinity,
            duration: 2 / (shape.speed * animationSpeed),
            ease: "linear",
          },
        };
      }
    } else {
      // No animation: static position/rotation/scale
      animateProps = {
        x: shape.x,
        y: shape.y,
        scale: 1,
        rotate: shape.rotation || 0,
      };
    }

    return (
      <motion.div
        key={shape.id}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: 1,
          scale: animateProps.scale ?? 1,
          x: animateProps.x ?? shape.x,
          y: animateProps.y ?? shape.y,
          rotate: animateProps.rotate ?? (shape.rotation || 0),
        }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          duration: 0.25,
          ...transitionProps,
        }}
        className={`absolute group ${isCurrent ? "z-50" : "z-0"} transition-all`}
        style={{
          width: shape.width,
          height: shape.height,
          boxShadow: isCurrent
            ? "0 0 0 4px #818cf8cc, 0 8px 32px 0 rgba(31,38,135,0.15)"
            : "0 2px 8px 0 rgba(31,38,135,0.07)",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedShape(shape);
        }}
      >
        <ShapeIcon
          className="w-full h-full transition-all duration-200"
          style={{
            color: shape.color,
            filter: isCurrent
              ? "drop-shadow(0 0 16px #818cf8cc)"
              : "drop-shadow(0 2px 4px rgba(0,0,0,0.08))",
          }}
          title={shape.type.charAt(0).toUpperCase() + shape.type.slice(1)}
        />
        {isCurrent && (
          <AnimatePresence>
            {/* Favorite button */}
            <motion.div
              className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleFavorite}
                className={`p-1 rounded-full ${
                  shape.isFavorite
                    ? "text-pink-500 hover:text-pink-600"
                    : "text-gray-400 dark:text-gray-500 hover:text-pink-500"
                }`}
              >
                <FaHeart size={16} />
              </button>
            </motion.div>

            {/* Resize handles */}
            {["n", "ne", "e", "se", "s", "sw", "w", "nw"].map((direction) => (
              <motion.div
                key={direction}
                className={`absolute w-4 h-4 bg-white/90 border-2 border-indigo-400 shadow rounded-full cursor-pointer z-50
                                    ${direction.includes("n") ? "top-0" : direction.includes("s") ? "bottom-0" : "top-1/2 -translate-y-1/2"}
                                    ${direction.includes("e") ? "right-0" : direction.includes("w") ? "left-0" : "left-1/2 -translate-x-1/2"}
                                    transition-all duration-150`}
                onMouseDown={(e) => handleResizeStart(e, direction)}
              />
            ))}

            {/* Animation controls */}
            <motion.div
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-xl flex items-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              ref={controlsRef}
            >
              <select
                value={shape.animation || ""}
                onChange={handleAnimationChange}
                className="h-8 text-xs bg-gray-100 dark:bg-gray-700 border-0 rounded"
              >
                <option value="">No Animation</option>
                {animationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={shape.speed}
                onChange={handleSpeedChange}
                className="h-4 w-16 accent-indigo-500 dark:accent-indigo-400"
              />

              <button
                onClick={deleteSelectedShape}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <IoTrash size={18} />
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${lightTheme ? "bg-gradient-to-br from-gray-50 to-gray-100" : "bg-gradient-to-br from-gray-900 to-gray-800"}`}
    >
      {/* Welcome Message */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className={`w-full py-3 text-center ${lightTheme ? "bg-indigo-100 text-indigo-800" : "bg-indigo-900 text-indigo-100"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              key={currentWelcomeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm md:text-base font-medium"
            >
              {welcomeMessages[currentWelcomeIndex]}
            </motion.div>
            <button
              onClick={() => setShowWelcome(false)}
              className="absolute top-2 right-3 text-sm opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        className={`p-4 flex justify-between items-center shadow-sm ${lightTheme ? "bg-white" : "bg-gray-800"}`}
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          >
            <MdDraw
              size={28}
              className={lightTheme ? "text-indigo-600" : "text-indigo-400"}
            />
          </motion.div>
          <motion.h1
            className={`text-2xl font-bold bg-gradient-to-r ${lightTheme ? "from-indigo-600 to-purple-600" : "from-indigo-400 to-purple-400"} bg-clip-text text-transparent`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Shape Editor
          </motion.h1>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? (
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
          ) : (
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Desktop Controls */}
        <motion.div
          className="hidden md:flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleThemeChange}
            className={`p-2 rounded-full transition-all duration-300 ${lightTheme ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-700 hover:bg-gray-600"}`}
          >
            {lightTheme ? <FaMoon size={16} /> : <FaSun size={16} />}
          </button>

          {history.length > 1 && (
            <div className="flex gap-1">
              <button
                onClick={undo}
                disabled={currentIndex <= 0}
                className={`p-2 rounded-md transition-all duration-200 ${
                  currentIndex <= 0
                    ? lightTheme
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 cursor-not-allowed"
                    : lightTheme
                      ? "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                      : "text-gray-200 hover:bg-gray-700 hover:text-indigo-400"
                }`}
              >
                <FaUndo size={16} />
              </button>
              <button
                onClick={redo}
                disabled={currentIndex >= history.length - 1}
                className={`p-2 rounded-md transition-all duration-200 ${
                  currentIndex >= history.length - 1
                    ? lightTheme
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 cursor-not-allowed"
                    : lightTheme
                      ? "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                      : "text-gray-200 hover:bg-gray-700 hover:text-indigo-400"
                }`}
              >
                <FaRedo size={16} />
              </button>
            </div>
          )}

          <button
            onClick={handleReset}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
              lightTheme
                ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            Reset
          </button>

          <button
            onClick={shareCanvas}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
              lightTheme
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <FaShare size={16} />
            Share
          </button>

          <button
            onClick={handleFullScreen}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
              lightTheme
                ? "bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <FaExpandArrowsAlt size={16} />
            Fullscreen
          </button>
        </motion.div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className={`md:hidden p-4 shadow-lg ${lightTheme ? "bg-white" : "bg-gray-800"}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleThemeChange}
                className={`p-2 rounded-full ${lightTheme ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                {lightTheme ? <FaMoon size={16} /> : <FaSun size={16} />}
              </button>

              {history.length > 1 && (
                <>
                  <button
                    onClick={undo}
                    disabled={currentIndex <= 0}
                    className={`p-2 rounded-md ${
                      currentIndex <= 0
                        ? lightTheme
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 cursor-not-allowed"
                        : lightTheme
                          ? "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                          : "text-gray-200 hover:bg-gray-700 hover:text-indigo-400"
                    }`}
                  >
                    <FaUndo size={16} />
                  </button>
                  <button
                    onClick={redo}
                    disabled={currentIndex >= history.length - 1}
                    className={`p-2 rounded-md ${
                      currentIndex >= history.length - 1
                        ? lightTheme
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 cursor-not-allowed"
                        : lightTheme
                          ? "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                          : "text-gray-200 hover:bg-gray-700 hover:text-indigo-400"
                    }`}
                  >
                    <FaRedo size={16} />
                  </button>
                </>
              )}

              <button
                onClick={handleReset}
                className={`px-3 py-1 rounded-lg flex items-center gap-1 text-sm ${
                  lightTheme
                    ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                    : "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
                }`}
              >
                Reset
              </button>

              <button
                onClick={shareCanvas}
                className={`px-3 py-1 rounded-lg flex items-center gap-1 text-sm ${
                  lightTheme
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                }`}
              >
                <FaShare size={14} />
                Share
              </button>

              <button
                onClick={handleFullScreen}
                className={`px-3 py-1 rounded-lg flex items-center gap-1 text-sm ${
                  lightTheme
                    ? "bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                    : "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                }`}
              >
                <FaExpandArrowsAlt size={14} />
                Full
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex flex-col flex-1 p-4 gap-4">
        <div className="flex flex-col md:flex-row gap-4 h-full">
          {/* Left Panel - All Controls */}
          <motion.div
            className={`transition-all duration-300 ${isToolsCollapsed ? "w-16" : "w-full md:w-80"} order-1 md:order-none`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ModernPanel
              lightTheme={lightTheme}
              title={isToolsCollapsed ? "" : "Shape Editor"}
            >
              {/* Collapse/Expand Button */}
              <button
                onClick={() => setIsToolsCollapsed(!isToolsCollapsed)}
                className={`absolute top-2 right-2 p-1 rounded-full ${lightTheme ? "hover:bg-gray-100" : "hover:bg-gray-700"}`}
              >
                {isToolsCollapsed ? (
                  <IoChevronForward
                    className={`h-5 w-5 ${lightTheme ? "text-gray-600" : "text-gray-300"}`}
                  />
                ) : (
                  <IoChevronUp
                    className={`h-5 w-5 ${lightTheme ? "text-gray-600" : "text-gray-300"}`}
                  />
                )}
              </button>

              {!isToolsCollapsed && (
                <>
                  <CollapsiblePanel
                    title="Create New Shape"
                    lightTheme={lightTheme}
                  >
                    <div className="space-y-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${lightTheme ? "text-gray-700" : "text-gray-300"}`}
                        >
                          Shape Type
                        </label>
                        <div className="flex gap-2">
                          {["circle", "square", "triangle"].map((type) => (
                            <motion.button
                              key={type}
                              onClick={() => handleShapeChange(type as any)}
                              className={`p-3 rounded-lg flex items-center justify-center ${
                                newShape.type === type
                                  ? lightTheme
                                    ? "bg-indigo-100 text-indigo-600"
                                    : "bg-indigo-900 text-indigo-200"
                                  : lightTheme
                                    ? "bg-gray-100 hover:bg-gray-200"
                                    : "bg-gray-700 hover:bg-gray-600"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {shapeIcons[type as keyof typeof shapeIcons]({
                                size: 20,
                              })}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${lightTheme ? "text-gray-700" : "text-gray-300"}`}
                        >
                          Color
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {colorOptions.map((color) => (
                            <motion.button
                              key={color}
                              onClick={() => handleColorChange(color)}
                              className={`w-8 h-8 rounded-full ${newShape.color === color ? "ring-2 ring-offset-2 ring-indigo-500" : ""}`}
                              style={{ backgroundColor: color }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>

                      <motion.button
                        onClick={() => {
                          const newId =
                            shapes.length > 0
                              ? Math.max(...shapes.map((s) => s.id)) + 1
                              : 1;
                          const newShapes = [
                            ...shapes,
                            {
                              ...newShape,
                              id: newId,
                              x: 100,
                              y: 100,
                              zIndex: shapes.length,
                            },
                          ];
                          setShapes(newShapes);
                          saveToHistory(newShapes);
                          setSelectedShape(newShapes[newShapes.length - 1]);
                        }}
                        className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 ${
                          lightTheme
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MdDraw size={20} />
                        Create Shape
                      </motion.button>
                    </div>
                  </CollapsiblePanel>

                  <CollapsiblePanel title="Controls" lightTheme={lightTheme}>
                    <div className="space-y-4">
                      <motion.button
                        onClick={handleAnimationPlayPause}
                        onMouseEnter={() => setIsHoveringPlay(true)}
                        onMouseLeave={() => setIsHoveringPlay(false)}
                        className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 ${
                          lightTheme
                            ? isAnimating
                              ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                              : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                            : isAnimating
                              ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
                              : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isAnimating ? (
                          <FaPause size={16} />
                        ) : (
                          <motion.div
                            animate={{ x: isHoveringPlay ? [0, 4, 0] : 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <FaPlay size={16} />
                          </motion.div>
                        )}
                        {isAnimating ? "Pause" : "Play"} Animation
                      </motion.button>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${lightTheme ? "text-gray-700" : "text-gray-300"}`}
                        >
                          Animation Speed: {animationSpeed.toFixed(1)}
                        </label>
                        <motion.div whileHover={{ scale: 1.01 }}>
                          <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={animationSpeed}
                            onChange={(e) =>
                              setAnimationSpeed(parseFloat(e.target.value))
                            }
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: lightTheme
                                ? `linear-gradient(to right, #6366f1 0%, #6366f1 ${(animationSpeed / 3) * 100}%, #e2e8f0 ${(animationSpeed / 3) * 100}%, #e2e8f0 100%)`
                                : `linear-gradient(to right, #818cf8 0%, #818cf8 ${(animationSpeed / 3) * 100}%, #334155 ${(animationSpeed / 3) * 100}%, #334155 100%)`,
                            }}
                          />
                        </motion.div>
                      </div>

                      <motion.button
                        onClick={() =>
                          setShowAdvancedSettings(!showAdvancedSettings)
                        }
                        className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                          lightTheme
                            ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            : "bg-gray-700 hover:bg-gray-600 text-white"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IoSettings size={16} />
                        {showAdvancedSettings ? "Hide" : "Show"} Advanced
                      </motion.button>

                      <AnimatePresence>
                        {showAdvancedSettings && (
                          <motion.div
                            className={`p-3 rounded-lg ${lightTheme ? "bg-gray-100" : "bg-gray-700"}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="space-y-3">
                              <div>
                                <label
                                  className={`block text-sm font-medium mb-1 ${lightTheme ? "text-gray-700" : "text-gray-300"}`}
                                >
                                  Default Width
                                </label>
                                <input
                                  type="range"
                                  min="20"
                                  max="200"
                                  value={newShape.width}
                                  onChange={(e) =>
                                    setNewShape({
                                      ...newShape,
                                      width: parseInt(e.target.value),
                                    })
                                  }
                                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                  style={{
                                    background: lightTheme
                                      ? `linear-gradient(to right, #6366f1 0%, #6366f1 ${((newShape.width - 20) / 180) * 100}%, #e2e8f0 ${((newShape.width - 20) / 180) * 100}%, #e2e8f0 100%)`
                                      : `linear-gradient(to right, #818cf8 0%, #818cf8 ${((newShape.width - 20) / 180) * 100}%, #334155 ${((newShape.width - 20) / 180) * 100}%, #334155 100%)`,
                                  }}
                                />
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Current: {newShape.width}px
                                </div>
                              </div>

                              <div>
                                <label
                                  className={`block text-sm font-medium mb-1 ${lightTheme ? "text-gray-700" : "text-gray-300"}`}
                                >
                                  Default Height
                                </label>
                                <input
                                  type="range"
                                  min="20"
                                  max="200"
                                  value={newShape.height}
                                  onChange={(e) =>
                                    setNewShape({
                                      ...newShape,
                                      height: parseInt(e.target.value),
                                    })
                                  }
                                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                  style={{
                                    background: lightTheme
                                      ? `linear-gradient(to right, #6366f1 0%, #6366f1 ${((newShape.height - 20) / 180) * 100}%, #e2e8f0 ${((newShape.height - 20) / 180) * 100}%, #e2e8f0 100%)`
                                      : `linear-gradient(to right, #818cf8 0%, #818cf8 ${((newShape.height - 20) / 180) * 100}%, #334155 ${((newShape.height - 20) / 180) * 100}%, #334155 100%)`,
                                  }}
                                />
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Current: {newShape.height}px
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CollapsiblePanel>
                </>
              )}
            </ModernPanel>
          </motion.div>

          {/* Canvas Area */}
          <div className="flex-1 relative order-3 md:order-none">
            <motion.div
              ref={canvasRef}
              className={`absolute inset-0 rounded-xl shadow-xl overflow-hidden ${
                lightTheme
                  ? "bg-gradient-to-br from-gray-50 to-gray-100"
                  : "bg-gradient-to-br from-gray-800 to-gray-900"
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {shapes.length === 0 && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div
                    className={`p-4 md:p-6 rounded-xl backdrop-blur-sm ${lightTheme ? "bg-white/80" : "bg-gray-800/80"}`}
                  >
                    <p
                      className={`text-sm md:text-lg font-medium ${lightTheme ? "text-gray-500" : "text-gray-400"}`}
                    >
                      {typeof window !== "undefined" && window.innerWidth < 768
                        ? "Tap to create a shape"
                        : "Click and drag to create a shape"}
                    </p>
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {[...shapes]
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map((shape) => renderShape(shape))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShapeEditor;
