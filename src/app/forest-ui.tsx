"use client";

import { useEffect, useRef, useState } from "react";

// Constants for configuration and clarity
const MAX_ELEMENTS = 100;
const SPAWN_INTERVAL_MS = 100;
const RIPPLE_INTERVAL_MS = 100;
const SPREAD_RADIUS = 8;

const ANIMATION_CLASSES = "transition-transform duration-500 ease-out";

const ForestUI = () => {
  const [mushrooms, setMushrooms] = useState<{ x: number; y: number }[]>([]);
  const [fireflies, setFireflies] = useState<{ x: number; y: number }[]>([]);
  const [trails, setTrails] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [isHovered, setIsHovered] = useState(false);

  const cursorPos = useRef<{ x: number; y: number } | null>(null);
  const lastSpawnTime = useRef<number>(0);
  const lastRippleTime = useRef<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    cursorPos.current = { x: xPercent, y: yPercent };

    const now = Date.now();

    // Rate-limited ripple creation
    if (now - lastRippleTime.current > RIPPLE_INTERVAL_MS) {
      const rippleId = now;
      setRipples((prev) => [
        ...prev.slice(-MAX_ELEMENTS + 1),
        { id: rippleId, x: xPercent, y: yPercent },
      ]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 600);
      lastRippleTime.current = now;
    }

    // Rate-limited spawning of mushrooms, fireflies, and trail markers
    if (now - lastSpawnTime.current > SPAWN_INTERVAL_MS && cursorPos.current) {
      const offsetX = (Math.random() - 0.5) * SPREAD_RADIUS;
      const offsetY = (Math.random() - 0.5) * SPREAD_RADIUS;

      const newMushroom = { x: xPercent + offsetX, y: yPercent + offsetY };
      const newFirefly = {
        x: xPercent + offsetX + Math.random() * 3,
        y: yPercent + offsetY + Math.random() * 3,
      };

      setMushrooms((prev) => [...prev.slice(-MAX_ELEMENTS + 1), newMushroom]);
      setFireflies((prev) => [...prev.slice(-MAX_ELEMENTS + 1), newFirefly]);

      const id = now;
      setTrails((prev) => [
        ...prev.slice(-MAX_ELEMENTS + 1),
        { id, x: xPercent, y: yPercent },
      ]);
      setTimeout(() => {
        setTrails((prev) => prev.filter((t) => t.id !== id));
      }, 500);

      lastSpawnTime.current = now;
    }
  };

  useEffect(() => {
    if (!isHovered) {
      setMushrooms([]);
      setFireflies([]);
      setTrails([]);
    }
  }, [isHovered]);

  return (
    <div
      className="h-screen w-screen bg-gradient-to-b from-green-100 to-green-400 relative overflow-hidden font-sans text-gray-800 cursor-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <h1 className="text-4xl text-center font-bold pt-10">
        Welcome to the Playful Forest
      </h1>
      <p className="text-center text-lg mb-6 text-gray-700">
        Move your mouse to discover hidden forest magic!
      </p>

      {mushrooms.map((m, idx) => (
        <div
          key={`mushroom-${idx}`}
          className={`absolute w-10 h-10 bg-red-500 rounded-b-full border-4 border-white shadow-md hover:scale-110 ${ANIMATION_CLASSES}`}
          style={{ top: `${m.y}%`, left: `${m.x}%` }}
        />
      ))}

      {fireflies.map((f, idx) => (
        <div
          key={`firefly-${idx}`}
          className={`absolute w-3 h-3 bg-yellow-300 rounded-full animate-ping shadow-md opacity-80 ${ANIMATION_CLASSES}`}
          style={{ top: `${f.y}%`, left: `${f.x}%` }}
        />
      ))}

      {trails.map((t) => (
        <div
          key={`trail-${t.id}`}
          className={`absolute w-4 h-4 bg-white rounded-full opacity-50 animate-pulse ${ANIMATION_CLASSES}`}
          style={{ top: `${t.y}%`, left: `${t.x}%` }}
        />
      ))}

      {ripples.map((r) => (
        <div
          key={`ripple-${r.id}`}
          className={`absolute w-12 h-12 border-2 border-white rounded-full animate-ping opacity-30 ${ANIMATION_CLASSES}`}
          style={{
            top: `${r.y}%`,
            left: `${r.x}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-700">
        Move your mouse to see mushrooms and fireflies appear at your cursor.
      </div>
    </div>
  );
};

export default ForestUI;
