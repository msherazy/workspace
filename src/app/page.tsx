"use client";

import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { FiFolder, FiImage, FiMoon, FiRotateCw, FiSave, FiSun, FiTrash2 } from "react-icons/fi";
import { FaRegNoteSticky } from "react-icons/fa6";

// Helper to clamp values (keep within bounds)
const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(val, max));

const Board = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    setBackgroundColor(darkMode ? "#23272F" : "#ffffff");
  }, [darkMode]);

  // Add sticky note
  const addNote = () => {
    const newNote = {
      id: Date.now(),
      type: "note",
      x: 40,
      y: 100,
      width: 220,
      height: 120,
      rotation: 0,
      color: darkMode ? "#facc15" : "#fde68a",
      text: "Double click to edit me!",
      zIndex: elements.length + 1,
      textColor: darkMode ? "#23272F" : "#222",
    };
    setElements([...elements, newNote]);
  };

  // Add image
  const addImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const newImage = {
        id: Date.now(),
        type: "image",
        x: 40,
        y: 100,
        width: 200,
        height: 200,
        rotation: 0,
        src: event.target?.result,
        zIndex: elements.length + 1,
      };
      setElements([...elements, newImage]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Select element
  const selectElement = (id: number, e: any) => {
    e.stopPropagation();
    setSelectedElement(id);
  };

  // Drag (mouse and touch)
  const handleDrag = (id: number, startEvent: any, isTouch = false) => {
    const element = elements.find((el) => el.id === id);
    if (!element) return;

    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    const startX = isTouch
      ? startEvent.touches[0].clientX
      : startEvent.clientX;
    const startY = isTouch
      ? startEvent.touches[0].clientY
      : startEvent.clientY;
    const origX = element.x;
    const origY = element.y;

    const move = (moveEvent: any) => {
      const clientX = isTouch
        ? moveEvent.touches[0].clientX
        : moveEvent.clientX;
      const clientY = isTouch
        ? moveEvent.touches[0].clientY
        : moveEvent.clientY;

      const dx = clientX - startX;
      const dy = clientY - startY;

      // Board bounds
      const maxLeft = boardRect.width - element.width;
      const maxTop = boardRect.height - element.height;
      const newX = clamp(origX + dx, 0, maxLeft > 0 ? maxLeft : 0);
      const newY = clamp(origY + dy, 0, maxTop > 0 ? maxTop : 0);

      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, x: newX, y: newY } : el))
      );
    };

    const up = () => {
      if (isTouch) {
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", up);
      } else {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      }
    };

    if (isTouch) {
      window.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("touchend", up);
    } else {
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    }
  };

  // Resize element (mouse only)
  const handleResize = (id: number, e: any, corner: string) => {
    const element = elements.find((el) => el.id === id);
    if (!element) return;

    let startX = e.clientX;
    let startY = e.clientY;

    const move = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      startX = moveEvent.clientX;
      startY = moveEvent.clientY;

      setElements((prev) =>
        prev.map((el) => {
          if (el.id === id) {
            let newWidth = el.width;
            let newHeight = el.height;
            let newX = el.x;
            let newY = el.y;

            if (corner.includes("e")) newWidth += dx;
            if (corner.includes("s")) newHeight += dy;
            if (corner.includes("w")) {
              newWidth -= dx;
              newX += dx;
            }
            if (corner.includes("n")) {
              newHeight -= dy;
              newY += dy;
            }
            return {
              ...el,
              width: Math.max(50, newWidth),
              height: Math.max(50, newHeight),
              x: newX,
              y: newY,
            };
          }
          return el;
        })
      );
    };

    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    e.stopPropagation();
  };

  // Rotate element (mouse only)
  const handleRotate = (id: number, e: any) => {
    const element = elements.find((el) => el.id === id);
    if (!element) return;
    const boardRect = boardRef.current?.getBoundingClientRect()!;
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;

    const move = (moveEvent: MouseEvent) => {
      const angle =
        (Math.atan2(
            moveEvent.clientY - boardRect.top - centerY,
            moveEvent.clientX - boardRect.left - centerX
          ) *
          180) /
        Math.PI;
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, rotation: angle } : el))
      );
    };

    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    e.stopPropagation();
  };

  // Edit sticky note
  const handleTextEdit = (id: number, e: any) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, text: e.target.value } : el))
    );
  };

  // Delete selected
  const deleteSelected = () => {
    if (selectedElement != null) {
      setElements((prev) => prev.filter((el) => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  // Save/load/clear board
  const saveBoard = () => {
    const boardState = { backgroundColor, elements };
    localStorage.setItem("boardState", JSON.stringify(boardState));
    setNotification("Board saved successfully!");
    setTimeout(() => setNotification(null), 3000); // Auto-hide after 3 seconds
  };
  const loadBoard = () => {
    const savedState = localStorage.getItem("boardState");
    if (savedState) {
      const { backgroundColor, elements } = JSON.parse(savedState);
      setBackgroundColor(backgroundColor);
      setElements(elements);
    }
  };
  const clearBoard = () => {
    if (confirm("Are you sure you want to clear the board?")) {
      setElements([]);
      setSelectedElement(null);
    }
  };

  // Board background click
  const handleBackgroundClick = () => {
    setSelectedElement(null);
    setShowColorPicker(false);
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        darkMode ? "bg-[#23272F] text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Toolbar */}
      <div
        className={`flex justify-between items-center p-4 ${
          darkMode ? "bg-[#23272F]" : "bg-white"
        } shadow-md`}
      >
        <div className="flex space-x-4 items-center"> {/* Added items-center for alignment */}
          {/* Sticky Note */}
          <div className="relative group">
            <button
              onClick={addNote}
              className="p-2 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-600"
            >
              <FaRegNoteSticky size={22} />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max opacity-0 group-hover:opacity-100 pointer-events-none transition bg-gray-900 text-white text-xs rounded px-2 py-1 z-50">
              Add Sticky Note
            </span>
          </div>

          {/* Image */}
          <div className="relative group">
            <label
              className={`p-2 rounded-md ${
                darkMode ? "hover:bg-blue-700 bg-blue-800" : "hover:bg-blue-200 bg-blue-100"
              } cursor-pointer`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={addImage}
                className="hidden"
              />
              <FiImage size={22} />
            </label>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max opacity-0 group-hover:opacity-100 pointer-events-none transition bg-gray-900 text-white text-xs rounded px-2 py-1 z-50">
              Add Image
            </span>
          </div>

          {/* Board Color */}
          <div className="relative group">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded-md hover:bg-green-100 dark:hover:bg-green-800"
            >
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor }}
              />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max opacity-0 group-hover:opacity-100 pointer-events-none transition bg-gray-900 text-white text-xs rounded px-2 py-1 z-50">
              Board Background Color
            </span>
            {showColorPicker && (
              <div className="absolute left-4 mt-10 z-50">
                <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-4"> {/* Adjusted spacing for better alignment */}
          {/* Save */}
          <div className="relative group">
            <button
              onClick={saveBoard}
              className="p-2 rounded-md hover:bg-green-200 dark:hover:bg-green-900"
            >
              <FiSave size={22} />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max opacity-0 group-hover:opacity-100 pointer-events-none transition bg-gray-900 text-white text-xs rounded px-2 py-1 z-50">
              Save Board
            </span>
          </div>
          {/* Load */}
          <div className="relative group">
            <button
              onClick={loadBoard}
              className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800"
            >
              <FiFolder size={22} />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max opacity-0 group-hover:opacity-100 pointer-events-none transition bg-gray-900 text-white text-xs rounded px-2 py-1 z-50">
              Load Board
            </span>
          </div>
          {/* Clear */}
          <div className="relative group">
            <button
              onClick={clearBoard}
              className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-700"
            >
              <FiTrash2 size={22} />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max opacity-0 group-hover:opacity-100 pointer-events-none transition bg-gray-900 text-white text-xs rounded px-2 py-1 z-50">
              Clear Board
            </span>
          </div>
          {/* Light/Dark Mode */}
          <div className="relative group">
            <button
              onClick={() => setDarkMode((v) => !v)}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max opacity-0 group-hover:opacity-100 pointer-events-none transition bg-gray-900 text-white text-xs rounded px-2 py-1 z-50">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md ${
            darkMode ? "bg-green-800 text-white" : "bg-green-200 text-green-800"
          }`}
        >
          {notification}
        </div>
      )}

      {/* Board */}
      <div
        ref={boardRef}
        className="flex-1 relative overflow-auto"
        style={{ backgroundColor, transition: "background 0.3s" }}
        onClick={handleBackgroundClick}
      >
        {/* Empty state */}
        {elements.length === 0 && (
          <div className="absolute left-1/2 top-32 transform -translate-x-1/2 text-gray-400 text-lg">
            The board is empty. Click above to add your first note or image!
          </div>
        )}

        {elements.map((element) => {
          const isSelected = selectedElement === element.id;
          return (
            <div
              key={element.id}
              className={`absolute shadow rounded transition-all duration-150 ${
                isSelected ? "ring-2 ring-blue-400 z-30" : "z-10"
              }`}
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                transform: `rotate(${element.rotation || 0}deg)`,
                zIndex: element.zIndex,
                cursor: isSelected ? "move" : "pointer",
                background: element.type === "note" ? element.color : "none",
                color: element.textColor || "#222",
                userSelect: "none",
                touchAction: "none",
              }}
              onClick={(e) => selectElement(element.id, e)}
              onMouseDown={(e) => {
                if (e.button === 0) {
                  e.stopPropagation();
                  handleDrag(element.id, e, false);
                }
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                handleDrag(element.id, e, true);
              }}
            >
              {element.type === "note" && (
                <div
                  className="w-full h-full p-2 overflow-auto"
                  style={{ backgroundColor: element.color, color: element.textColor || "#222" }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    const textarea = document.createElement("textarea");
                    textarea.value = element.text;
                    textarea.className = "w-full h-full p-2";
                    textarea.style.backgroundColor = element.color;
                    textarea.style.color = element.textColor || "#222";
                    textarea.onblur = (e) => {
                      handleTextEdit(element.id, e);
                      e.target.parentNode.innerHTML = e.target.value;
                    };
                    e.target.innerHTML = "";
                    e.target.appendChild(textarea);
                    textarea.focus();
                  }}
                >
                  {element.text}
                </div>
              )}
              {element.type === "image" && (
                <img
                  src={element.src}
                  alt="Board image"
                  className="w-full h-full object-contain rounded"
                  draggable={false}
                  style={{ pointerEvents: "none" }}
                />
              )}

              {isSelected && (
                <>
                  {/* Resize handles (mouse only for now) */}
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -top-1.5 -left-1.5 cursor-nw-resize"
                       onMouseDown={(e) => handleResize(element.id, e, "nw")}
                  />
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -top-1.5 -right-1.5 cursor-ne-resize"
                       onMouseDown={(e) => handleResize(element.id, e, "ne")}
                  />
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -bottom-1.5 -left-1.5 cursor-sw-resize"
                       onMouseDown={(e) => handleResize(element.id, e, "sw")}
                  />
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -bottom-1.5 -right-1.5 cursor-se-resize"
                       onMouseDown={(e) => handleResize(element.id, e, "se")}
                  />
                  {/* Rotate handle (mouse only for now) */}
                  <div
                    className="absolute w-5 h-5 flex items-center justify-center bg-green-500 rounded-full top-1/2 -right-7 cursor-pointer"
                    onMouseDown={(e) => handleRotate(element.id, e)}
                  >
                    <FiRotateCw size={16} color="#fff" />
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Delete button for selected elements */}
        {selectedElement && (
          <button
            className="absolute top-4 right-4 p-2 rounded-md bg-red-500 text-white hover:bg-red-600 z-40"
            onClick={deleteSelected}
            title="Delete"
          >
            <FiTrash2 size={22} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Board;

