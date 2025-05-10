"use client";

import {useEffect, useRef, useState} from "react";
import {MdDraw} from "react-icons/md";
import {IoEllipse, IoSettings, IoSquare, IoTrash, IoTriangle} from "react-icons/io5";
import {FaExpandArrowsAlt, FaHeart, FaMoon, FaPause, FaPlay, FaRedo, FaShare, FaSun, FaUndo} from "react-icons/fa";
import {AnimatePresence, motion} from "framer-motion";

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

const IndexPage = () => {
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

  const canvasRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedShape && canvasRef.current && !canvasRef.current.contains(event.target as Node)) {
        setSelectedShape(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedShape]);

  const saveToHistory = (newShapes: Shape[]) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newShapes);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (currentIndex > 0) {
      const previousShapes = history[currentIndex - 1];
      setShapes(previousShapes);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      const nextShapes = history[currentIndex + 1];
      setShapes(nextShapes);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    // Check if we clicked on controls
    if (controlsRef.current && controlsRef.current.contains(event.target as Node)) {
      return;
    }

    if (event.button === 0) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const clickedShape = shapes.find(shape => {
        return x >= shape.x && x <= shape.x + shape.width &&
            y >= shape.y && y <= shape.y + shape.height;
      });

      if (clickedShape) {
        setSelectedShape(clickedShape);
        setIsDraggingShape(true);
        setDragOffset({
          x: x - clickedShape.x,
          y: y - clickedShape.y
        });
        return;
      }

      const newId = shapes.length > 0 ? Math.max(...shapes.map(s => s.id)) + 1 : 1;
      const newShapes = [
        ...shapes,
        {
          ...newShape,
          id: newId,
          x,
          y,
          width: newShape.width,
          height: newShape.height,
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
    if (!isDraggingShape && !isDrawing) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    if (isDraggingShape && selectedShape) {
      const updatedShapes = shapes.map(shape =>
          shape.id === selectedShape.id
              ? {
                ...shape,
                x: currentX - dragOffset.x,
                y: currentY - dragOffset.y
              }
              : shape
      );
      setShapes(updatedShapes);
    } else if (isDrawing && selectedShape && startPoint) {
      const width = Math.abs(currentX - startPoint.x);
      const height = Math.abs(currentY - startPoint.y);
      const x = Math.min(currentX, startPoint.x);
      const y = Math.min(currentY, startPoint.y);

      const updatedShapes = shapes.map(shape =>
          shape.id === selectedShape.id
              ? { ...shape, x, y, width, height }
              : shape
      );
      setShapes(updatedShapes);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsDraggingShape(false);
    setStartPoint(null);
  };

  const handleShapeChange = (type: "circle" | "square" | "triangle") => {
    setNewShape({ ...newShape, type });
  };

  const handleColorChange = (color: string) => {
    setNewShape({ ...newShape, color });
    if (selectedShape) {
      const updatedShapes = shapes.map(shape =>
          shape.id === selectedShape.id ? { ...shape, color } : shape
      );
      setShapes(updatedShapes);
      saveToHistory(updatedShapes);
    }
  };

  const handleAnimationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const animation = event.target.value as "bounce" | "pulse" | "spin" | undefined;

    if (selectedShape) {
      const updatedShape = { ...selectedShape, animation: animation };
      const updatedShapes = shapes.map(shape =>
          shape.id === selectedShape.id ? updatedShape : shape
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
      const updatedShapes = shapes.map(shape =>
          shape.id === selectedShape.id ? { ...shape, speed } : shape
      );
      setShapes(updatedShapes);
      saveToHistory(updatedShapes);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedShape) {
      const updatedShapes = shapes.map(shape =>
          shape.id === selectedShape.id
              ? { ...shape, isFavorite: !shape.isFavorite }
              : shape
      );
      setShapes(updatedShapes);
      saveToHistory(updatedShapes);
    }
  };

  const deleteSelectedShape = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedShape) {
      const updatedShapes = shapes.filter(shape => shape.id !== selectedShape.id);
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
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = canvasRef.current!.clientWidth;
      canvas.height = canvasRef.current!.clientHeight;

      if (lightTheme) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      shapes.forEach((shape) => {
        ctx.save();
        ctx.translate(shape.x + shape.width / 2, shape.y + shape.height / 2);
        ctx.rotate((shape.rotation * Math.PI) / 180);
        ctx.fillStyle = shape.color;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;

        if (shape.type === "circle") {
          ctx.beginPath();
          ctx.ellipse(0, 0, shape.width / 2, shape.height / 2, 0, 0, 2 * Math.PI);
          ctx.fill();
        } else if (shape.type === "square") {
          ctx.fillRect(-shape.width / 2, -shape.height / 2, shape.width, shape.height);
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

      const dataUrl = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();

      if (navigator.canShare && navigator.canShare({ files: [blob] })) {
        await navigator.share({
          files: [new File([blob], 'canvas.png', { type: 'image/png' })],
          title: 'Shape Editor Artwork',
          text: 'Created with Shape Editor',
        });
      } else if (navigator.share) {
        await navigator.share({
          title: 'Shape Editor Artwork',
          text: 'Created with Shape Editor',
          url: window.location.href,
        });
      } else {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'shape-artwork.png';
        a.click();
      }
    } catch (error) {
      console.error('Error sharing canvas:', error);
    }
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const animate = () => {
      if (!isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const updatedShapes = shapes.map((shape) => {
        if (!shape.animation) return shape;

        let x = shape.x;
        let y = shape.y;
        let rotation = shape.rotation;

        if (shape.animation === "bounce") {
          const speed = shape.speed * animationSpeed * 2;
          x += Math.sin(Date.now() / (1000 / speed)) * 2;
          y += Math.cos(Date.now() / (1000 / speed)) * 2;
        } else if (shape.animation === "pulse") {
          const scale = 1 + Math.sin(Date.now() / (1000 / (shape.speed * animationSpeed))) * 0.2;
          x -= (scale - 1) * shape.width / 2;
          y -= (scale - 1) * shape.height / 2;
          rotation += (shape.speed * animationSpeed) / 10;
        } else if (shape.animation === "spin") {
          rotation += shape.speed * animationSpeed;
        }

        return { ...shape, x, y, rotation };
      });

      setShapes(updatedShapes);
      saveToHistory(updatedShapes);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [shapes, isAnimating, animationSpeed]);

  const renderShape = (shape: Shape) => {
    const ShapeIcon = shapeIcons[shape.type];
    const isCurrent = selectedShape?.id === shape.id;

    return (
        <motion.div
            key={shape.id}
            className={`absolute group ${isCurrent ? "z-10" : "z-0"}`}
            style={{
              left: shape.x,
              top: shape.y,
              width: shape.width,
              height: shape.height,
              transform: `rotate(${shape.rotation}deg)`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedShape(shape);
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: isCurrent ? 1.1 : 1,
              opacity: 1,
              boxShadow: isCurrent ? "0 0 0 3px rgba(99, 102, 241, 0.8)" : "none"
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              scale: { duration: 0.2 }
            }}
            whileHover={{ scale: isCurrent ? 1.1 : 1.05 }}
        >
          <ShapeIcon
              className="w-full h-full transition-all duration-200"
              style={{
                color: shape.color,
                filter: isCurrent ?
                    "drop-shadow(0 0 12px rgba(99, 102, 241, 0.6))" :
                    "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
              }}
          />

          {isCurrent && (
              <AnimatePresence>
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
                      className={`p-1 rounded-full ${shape.isFavorite
                          ? "text-pink-500 hover:text-pink-600"
                          : "text-gray-400 dark:text-gray-500 hover:text-pink-500"}`}
                  >
                    <FaHeart size={16} />
                  </button>
                </motion.div>

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
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${lightTheme ? "bg-gradient-to-br from-gray-50 to-gray-100" : "bg-gradient-to-br from-gray-900 to-gray-800"}`}>
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
              <MdDraw size={28} className={lightTheme ? "text-indigo-600" : "text-indigo-400"} />
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

          <motion.div
              className="flex gap-2"
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
                      className={`p-2 rounded-md transition-all duration-200 ${currentIndex <= 0
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
                      className={`p-2 rounded-md transition-all duration-200 ${currentIndex >= history.length - 1
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
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${lightTheme
                    ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"}`}
            >
              Reset
            </button>

            <button
                onClick={shareCanvas}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${lightTheme
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"}`}
            >
              <FaShare size={16} />
              Share
            </button>

            <button
                onClick={handleFullScreen}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${lightTheme
                    ? "bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl"}`}
            >
              <FaExpandArrowsAlt size={16} />
              Fullscreen
            </button>
          </motion.div>
        </motion.header>

        <main className="flex flex-col flex-1 p-4 gap-4">
          <div className="flex flex-col md:flex-row gap-4 h-full">
            <motion.div
                className={`p-6 rounded-xl shadow-lg w-full md:w-72 ${lightTheme ? "bg-white" : "bg-gray-800"}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
              <h2 className={`text-lg font-bold mb-4 ${lightTheme ? "text-gray-800" : "text-white"}`}>
                Create New Shape
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${lightTheme ? "text-gray-700" : "text-gray-300"}`}>
                    Shape Type
                  </label>
                  <div className="flex gap-2">
                    {["circle", "square", "triangle"].map((type) => (
                        <motion.button
                            key={type}
                            onClick={() => handleShapeChange(type as any)}
                            className={`p-3 rounded-lg flex items-center justify-center ${newShape.type === type
                                ? lightTheme
                                    ? "bg-indigo-100 text-indigo-600"
                                    : "bg-indigo-900 text-indigo-200"
                                : lightTheme
                                    ? "bg-gray-100 hover:bg-gray-200"
                                    : "bg-gray-700 hover:bg-gray-600"}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                          {shapeIcons[type as keyof typeof shapeIcons]({ size: 20 })}
                        </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${lightTheme ? "text-gray-700" : "text-gray-300"}`}>
                    Color
                  </label>
                  <motion.div
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                  >
                    <input
                        type="color"
                        value={newShape.color}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-full h-10 rounded-lg border-0 cursor-pointer shadow-md"
                    />
                  </motion.div>
                </div>

                <motion.button
                    onClick={() => {
                      const newId = shapes.length > 0 ? Math.max(...shapes.map(s => s.id)) + 1 : 1;
                      const newShapes = [
                        ...shapes,
                        {
                          ...newShape,
                          id: newId,
                          x: 100,
                          y: 100,
                        },
                      ];
                      setShapes(newShapes);
                      saveToHistory(newShapes);
                      setSelectedShape(newShapes[newShapes.length - 1]);
                    }}
                    className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 ${lightTheme
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                  <MdDraw size={20} />
                  Create Shape
                </motion.button>
              </div>
            </motion.div>

            <div className="flex-1 relative">
              <motion.div
                  ref={canvasRef}
                  className={`absolute inset-0 rounded-xl shadow-xl overflow-hidden ${lightTheme
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
                      <div className={`p-6 rounded-xl backdrop-blur-sm ${lightTheme ? "bg-white/80" : "bg-gray-800/80"}`}>
                        <p className={`text-lg font-medium ${lightTheme ? "text-gray-500" : "text-gray-400"}`}>
                          Click and drag to create a shape
                        </p>
                      </div>
                    </motion.div>
                )}

                {shapes.map((shape) => renderShape(shape))}
              </motion.div>
            </div>

            <motion.div
                className={`p-6 rounded-xl shadow-lg w-full md:w-72 ${lightTheme ? "bg-white" : "bg-gray-800"}`}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
              <h2 className={`text-lg font-bold mb-4 ${lightTheme ? "text-gray-800" : "text-white"}`}>
                Controls
              </h2>

              <div className="space-y-4">
                <motion.button
                    onClick={handleAnimationPlayPause}
                    onMouseEnter={() => setIsHoveringPlay(true)}
                    onMouseLeave={() => setIsHoveringPlay(false)}
                    className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 ${lightTheme
                        ? isAnimating
                            ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                            : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                        : isAnimating
                            ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
                            : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"}`}
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
                  <label className={`block text-sm font-medium mb-2 ${lightTheme ? "text-gray-700" : "text-gray-300"}`}>
                    Animation Speed: {animationSpeed.toFixed(1)}
                  </label>
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: lightTheme
                              ? `linear-gradient(to right, #6366f1 0%, #6366f1 ${(animationSpeed / 3) * 100}%, #e2e8f0 ${(animationSpeed / 3) * 100}%, #e2e8f0 100%)`
                              : `linear-gradient(to right, #818cf8 0%, #818cf8 ${(animationSpeed / 3) * 100}%, #334155 ${(animationSpeed / 3) * 100}%, #334155 100%)`
                        }}
                    />
                  </motion.div>
                </div>

                <motion.button
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${lightTheme
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        : "bg-gray-700 hover:bg-gray-600 text-white"}`}
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
                            <label className={`block text-sm font-medium mb-1 ${lightTheme ? "text-gray-700" : "text-gray-300"}`}>
                              Default Width
                            </label>
                            <input
                                type="range"
                                min="20"
                                max="200"
                                value={newShape.width}
                                onChange={(e) => setNewShape({ ...newShape, width: parseInt(e.target.value) })}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                style={{
                                  background: lightTheme
                                      ? `linear-gradient(to right, #6366f1 0%, #6366f1 ${((newShape.width - 20) / 180) * 100}%, #e2e8f0 ${((newShape.width - 20) / 180) * 100}%, #e2e8f0 100%)`
                                      : `linear-gradient(to right, #818cf8 0%, #818cf8 ${((newShape.width - 20) / 180) * 100}%, #334155 ${((newShape.width - 20) / 180) * 100}%, #334155 100%)`
                                }}
                            />
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Current: {newShape.width}px
                            </div>
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-1 ${lightTheme ? "text-gray-700" : "text-gray-300"}`}>
                              Default Height
                            </label>
                            <input
                                type="range"
                                min="20"
                                max="200"
                                value={newShape.height}
                                onChange={(e) => setNewShape({ ...newShape, height: parseInt(e.target.value) })}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                style={{
                                  background: lightTheme
                                      ? `linear-gradient(to right, #6366f1 0%, #6366f1 ${((newShape.height - 20) / 180) * 100}%, #e2e8f0 ${((newShape.height - 20) / 180) * 100}%, #e2e8f0 100%)`
                                      : `linear-gradient(to right, #818cf8 0%, #818cf8 ${((newShape.height - 20) / 180) * 100}%, #334155 ${((newShape.height - 20) / 180) * 100}%, #334155 100%)`
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
            </motion.div>
          </div>
        </main>
      </div>
  );
};

export default IndexPage;