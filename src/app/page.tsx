"use client";

import {useEffect, useState} from 'react';

const ForestUI = () => {
  const [mushrooms, setMushrooms] = useState<{ x: number; y: number }[]>([]);
  const [fireflies, setFireflies] = useState<{ x: number; y: number }[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      interval = setInterval(() => {
        setMushrooms((prev) => [
          ...prev,
          { x: Math.random() * 90 + 5, y: Math.random() * 90 + 5 },
        ]);
        setFireflies((prev) => [
          ...prev,
          { x: Math.random() * 90 + 5, y: Math.random() * 90 + 5 },
        ]);
      }, 600);
    } else {
      setMushrooms([]);
      setFireflies([]);
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
      <div
          // Soft forest-themed gradient background for a natural look
          className="h-screen w-screen bg-gradient-to-b from-green-100 to-green-400 relative overflow-hidden font-sans text-gray-800"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
      >
        <h1 className="text-4xl text-center font-bold pt-10">Welcome to the Playful Forest</h1>
        <p className="text-center text-lg mb-6 text-gray-600">Hover around to discover hidden forest magic!</p>

        {mushrooms.map((m, idx) => (
            <div
                key={`mushroom-${idx}`}
                // Red cap with white border to resemble a playful mushroom
                className="absolute w-10 h-10 bg-red-500 rounded-b-full border-4 border-white shadow-md transition-transform duration-500 ease-out hover:scale-110"
                style={{ top: `${m.y}%`, left: `${m.x}%` }}
            />
        ))}

        {fireflies.map((f, idx) => (
            <div
                key={`firefly-${idx}`}
                // Gentle yellow glow with animation for a firefly effect
                className="absolute w-3 h-3 bg-yellow-300 rounded-full animate-ping shadow-md opacity-80"
                style={{ top: `${f.y}%`, left: `${f.x}%` }}
            />
        ))}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
          Move your mouse to see mushrooms and fireflies come to life.
        </div>
      </div>
  );
};

export default ForestUI;
