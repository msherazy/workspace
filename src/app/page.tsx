"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";

// SVG Fantasy Elements
const GARDEN_ITEMS = [
    {
        type: "mushroom",
        label: "",
        svg: (color: string, size: number) => (
            <svg width={size} height={size} viewBox="0 0 64 64">
                <ellipse cx="32" cy="40" rx="16" ry="8" fill="#fff" />
                <ellipse cx="32" cy="32" rx="24" ry="14" fill={color} />
                <ellipse cx="24" cy="30" rx="3" ry="2" fill="#fff" />
                <ellipse cx="40" cy="28" rx="3" ry="2" fill="#fff" />
                <ellipse cx="32" cy="36" rx="2" ry="1" fill="#fff" />
                <rect x="26" y="40" width="12" height="14" rx="6" fill="#e2c69a" />
            </svg>
        ),
        defaultColor: "#D978F6",
    },
    {
        type: "butterfly",
        label: "",
        svg: (color: string, size: number) => (
            <svg width={size} height={size} viewBox="0 0 64 64">
                <ellipse cx="20" cy="32" rx="16" ry="12" fill={color} opacity="0.8" />
                <ellipse cx="44" cy="32" rx="16" ry="12" fill={color} opacity="0.6" />
                <rect x="29" y="25" width="6" height="16" rx="3" fill="#222" />
                <ellipse cx="32" cy="23" rx="4" ry="3" fill="#222" />
                <ellipse cx="30" cy="20" rx="1" ry="3" fill="#444" />
                <ellipse cx="34" cy="20" rx="1" ry="3" fill="#444" />
            </svg>
        ),
        defaultColor: "#62D9FB",
    },
    {
        type: "tree",
        label: "",
        svg: (color: string, size: number) => (
            <svg width={size} height={size} viewBox="0 0 64 64">
                <ellipse cx="32" cy="30" rx="18" ry="14" fill={color} />
                <ellipse cx="22" cy="38" rx="10" ry="8" fill={color} opacity="0.85" />
                <ellipse cx="44" cy="38" rx="10" ry="8" fill={color} opacity="0.85" />
                <rect x="28" y="44" width="8" height="14" rx="3" fill="#B8926A" />
            </svg>
        ),
        defaultColor: "#73E89C",
    },
    {
        type: "star",
        label: "",
        svg: (color: string, size: number) => (
            <svg width={size} height={size} viewBox="0 0 64 64">
                <polygon
                    points="32,8 39,27 60,27 42,39 48,58 32,47 16,58 22,39 4,27 25,27"
                    fill={color}
                />
            </svg>
        ),
        defaultColor: "#FFDE59",
    },
];

type GardenItemType = typeof GARDEN_ITEMS[number]["type"];

interface GardenElement {
    id: number;
    type: GardenItemType;
    color: string;
    size: number;
    x: number;
    y: number;
    isSelected: boolean;
}

export default function GardenPage() {
    const [garden, setGarden] = useState<GardenElement[]>([]);
    const [selectedItem, setSelectedItem] = useState<GardenItemType>("mushroom");
    const [color, setColor] = useState<string>(GARDEN_ITEMS[0].defaultColor);
    const [size, setSize] = useState<number>(70);
    const [mode, setMode] = useState<"day" | "night">("night");
    const [dragId, setDragId] = useState<number | null>(null);
    const gardenRef = useRef<HTMLDivElement>(null);
    const nextId = useRef<number>(1);

    function handleCanvasClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (e.target !== gardenRef.current) return;
        const rect = gardenRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setGarden([
            ...garden,
            {
                id: nextId.current++,
                type: selectedItem,
                color,
                size,
                x,
                y,
                isSelected: false,
            },
        ]);
    }

    function handleElementMouseDown(id: number) {
        setDragId(id);
        setGarden((prev) =>
            prev.map((el) =>
                el.id === id
                    ? { ...el, isSelected: true }
                    : { ...el, isSelected: false }
            )
        );
    }

    function handleCanvasMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (dragId === null) return;
        const rect = gardenRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setGarden((prev) =>
            prev.map((el) =>
                el.id === dragId ? { ...el, x, y } : el
            )
        );
    }

    function handleCanvasMouseUp() {
        setDragId(null);
        setGarden((prev) =>
            prev.map((el) =>
                el.isSelected ? { ...el, isSelected: false } : el
            )
        );
    }

    function updateSelected(prop: Partial<Pick<GardenElement, "color" | "size">>) {
        setGarden((prev) =>
            prev.map((el) =>
                el.isSelected ? { ...el, ...prop } : el
            )
        );
    }

    function clearGarden() {
        setGarden([]);
    }

    async function saveImage() {
        if (!gardenRef.current) return;
        const dataUrl = await toPng(gardenRef.current, { cacheBust: true });
        const link = document.createElement("a");
        link.download = "my-garden.png";
        link.href = dataUrl;
        link.click();
    }

    // Modern gradient backgrounds (animated)
    const gradientDay =
        "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)";
    const gradientNight =
        "linear-gradient(120deg, #35327a 0%, #6d53a1 100%)";

    // Floating particles for background magic
    const particles = Array.from({ length: 8 }, (_, i) => ({
        left: `${10 + i * 11}%`,
        top: `${15 + (i % 3) * 22}%`,
        size: 80 + Math.random() * 40,
        opacity: 0.20 + Math.random() * 0.14,
        color: `hsl(${180 + i * 24},70%,70%)`,
        animation: `float${i % 4}`,
    }));

    return (
        <main
            className="min-h-screen w-full flex flex-col items-center justify-center font-sans"
            style={{
                background: mode === "day" ? gradientDay : gradientNight,
                position: "relative",
                overflow: "hidden",
                transition: "background 0.9s cubic-bezier(.85,.17,.61,1.03)",
            }}
        >
            {/* Animated background particles */}
            {particles.map((p, idx) => (
                <div
                    key={idx}
                    style={{
                        position: "absolute",
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        background: `radial-gradient(circle at 60% 40%, ${p.color} 60%, transparent 100%)`,
                        borderRadius: "50%",
                        opacity: p.opacity,
                        pointerEvents: "none",
                        filter: "blur(2px)",
                        animation: `${p.animation} 8s ease-in-out infinite alternate`,
                        zIndex: 1,
                    }}
                />
            ))}
            {/* Animation keyframes for floating */}
            <style>
                {`
          @keyframes float0 { 0%{transform:translateY(0)} 100%{transform:translateY(-18px)} }
          @keyframes float1 { 0%{transform:translateY(0)} 100%{transform:translateY(22px)} }
          @keyframes float2 { 0%{transform:translateY(0)} 100%{transform:translateY(-12px)} }
          @keyframes float3 { 0%{transform:translateY(0)} 100%{transform:translateY(12px)} }
          @keyframes butterfly-fly {
            0% { transform: translateY(0) scale(1.06) rotate(-4deg);}
            100% { transform: translateY(-12px) scale(1.12) rotate(3deg);}
          }
          @keyframes star-twinkle {
            0% { opacity: 0.8; }
            100% { opacity: 1; filter: blur(1.5px);}
          }
        `}
            </style>
            {/* Header */}
            <div
                className="pt-12 pb-4 text-5xl font-extrabold tracking-tight"
                style={{
                    color: mode === "day" ? "#402F60" : "#f3f0ff",
                    textShadow: mode === "night"
                        ? "0 2px 20px #281f40"
                        : "0 1px 12px #e8defa",
                    letterSpacing: "1px",
                    zIndex: 10,
                    fontFamily: "inherit",
                }}
            >
                Magical Garden Creator
            </div>
            {/* Glassy Top Controls */}
            <div
                className="flex flex-wrap items-center justify-between w-full max-w-4xl px-8 py-5 mb-8 rounded-3xl"
                style={{
                    background: "rgba(255,255,255,0.78)",
                    border: "2.5px solid #d6d0fa",
                    boxShadow: "0 10px 42px 0 #b7b7f388, 0 2px 8px #d2c5f7",
                    backdropFilter: "blur(22px)",
                    gap: "1.2rem",
                    zIndex: 12,
                }}
            >
                {/* Shape Selectors */}
                <div className="flex items-center gap-4">
                    {GARDEN_ITEMS.map((item) => (
                        <button
                            key={item.type}
                            className={`flex flex-col items-center rounded-full border-2 shadow-lg transition-all duration-200
                ${selectedItem === item.type
                                ? "border-[#8057e4] bg-white scale-110 ring-4 ring-[#8057e4]"
                                : "border-[#e0d7ff] bg-white/90"
                            }`}
                            style={{
                                width: 62,
                                height: 62,
                                margin: 2,
                                justifyContent: "center",
                                boxShadow: "0 2px 12px 1px #c1b5ee66",
                            }}
                            title={`Add a ${item.label}`}
                            onClick={() => {
                                setSelectedItem(item.type);
                                setColor(item.defaultColor);
                                setSize(70);
                            }}
                        >
                            <span className="p-1 flex items-center justify-center">{item.svg(item.defaultColor, 30)}</span>
                            <span className="text-[0.8rem] mt-1 font-medium" style={{ color: selectedItem === item.type ? "#8057e4" : "#8e82af" }}>{item.label}</span>
                        </button>
                    ))}
                </div>
                {/* Color and Size pickers */}
                <div className="flex items-center gap-4 ml-2">
                    <label className="flex items-center gap-2">
                        <span style={{ color: "#4a43e4", fontWeight: 600 }}>Color</span>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-8 h-8 rounded-full border-2 border-[#8057e4] bg-white shadow"
                        />
                    </label>
                    <label className="flex items-center gap-2">
                        <span style={{ color: "#4a43e4", fontWeight: 600 }}>Size</span>
                        <input
                            type="range"
                            min={40}
                            max={120}
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            className="accent-[#4a43e4] border border-[#d5d2ff] rounded h-2"
                        />
                    </label>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-3 ml-4">
                    <button
                        className="px-5 py-2 rounded-full font-semibold shadow-lg bg-gradient-to-r from-[#c471f5] to-[#fa71cd] text-white hover:scale-105 hover:brightness-110 transition-all"
                        onClick={clearGarden}
                    >
                        Clear Garden
                    </button>
                    <button
                        className="px-5 py-2 rounded-full font-semibold shadow-lg bg-gradient-to-r from-[#43cea2] to-[#185a9d] text-white hover:scale-105 hover:brightness-110 transition-all"
                        onClick={saveImage}
                    >
                        Save Image
                    </button>
                    <button
                        className="px-5 py-2 rounded-full font-semibold shadow-lg bg-gradient-to-r from-[#7f53ac] to-[#647dee] text-white hover:scale-105 hover:brightness-110 transition-all"
                        onClick={() => setMode(mode === "day" ? "night" : "day")}
                    >
                        {mode === "day" ? "Switch to Night" : "Switch to Day"}
                    </button>
                </div>
            </div>
            {/* Canvas Area */}
            <div
                className="flex-1 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative"
                ref={gardenRef}
                style={{
                    minHeight: 520,
                    cursor: dragId ? "grabbing" : "crosshair",
                    background:
                        mode === "day"
                            ? "linear-gradient(180deg, #f2ebff 70%, #b8e0fc 100%)"
                            : "linear-gradient(180deg, #332b5c 60%, #342356 100%)",
                    border: "6px solid #f6ebff",
                    marginBottom: 32,
                    transition: "background 0.8s cubic-bezier(.85,.17,.61,1.03)",
                    zIndex: 20,
                }}
                onMouseDown={handleCanvasMouseUp}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onClick={handleCanvasClick}
                tabIndex={0}
                aria-label="Magical Garden Canvas"
            >
                {garden.map((item) => {
                    const ItemSVG =
                        GARDEN_ITEMS.find((g) => g.type === item.type)?.svg ??
                        (() => null);
                    return (
                        <div
                            key={item.id}
                            style={{
                                position: "absolute",
                                left: item.x - item.size / 2,
                                top: item.y - item.size / 2,
                                width: item.size,
                                height: item.size,
                                zIndex: item.isSelected ? 10 : 2,
                                boxShadow: item.isSelected
                                    ? "0 0 22px 10px #fff1ff, 0 0 32px 8px #c8bbfa"
                                    : "0 2px 12px 2px #d0c3ff22",
                                borderRadius: "50%",
                                cursor: "pointer",
                                outline: item.isSelected
                                    ? "3px solid #8057e4"
                                    : "1.5px solid #ede6f7",
                                transition:
                                    "outline 0.18s, box-shadow 0.18s, transform 0.18s cubic-bezier(.8,.2,.6,1.2)",
                                userSelect: "none",
                                background: "rgba(255,255,255,0.08)",
                                backdropFilter: "blur(2px)",
                            }}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                handleElementMouseDown(item.id);
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setGarden((prev) =>
                                    prev.map((el) =>
                                        el.id === item.id
                                            ? { ...el, isSelected: !el.isSelected }
                                            : { ...el, isSelected: false }
                                    )
                                );
                            }}
                            tabIndex={0}
                            aria-label={item.type}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    transition: "transform 0.32s",
                                    transform: item.isSelected
                                        ? "scale(1.15) rotate(-2deg)"
                                        : "scale(1)",
                                    filter:
                                        mode === "night"
                                            ? "drop-shadow(0 0 14px #d1bbffbb)"
                                            : undefined,
                                    animation:
                                        item.type === "butterfly"
                                            ? "butterfly-fly 2.2s ease-in-out infinite alternate"
                                            : item.type === "star"
                                                ? "star-twinkle 1.1s ease-in-out infinite alternate"
                                                : undefined,
                                }}
                            >
                                {ItemSVG(item.color, item.size)}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Editor Panel for Selected */}
            {garden.some((el) => el.isSelected) && (
                <div
                    className="z-50 fixed left-1/2 bottom-7 -translate-x-1/2 flex items-center gap-6 px-8 py-4 bg-white/90 rounded-xl shadow-2xl border border-[#e2d9ff]"
                    style={{
                        backdropFilter: "blur(14px)",
                    }}
                >
          <span
              className="font-bold text-base"
              style={{ color: "#6c47a6", marginRight: 10 }}
          >
            Edit Selection
          </span>
                    <input
                        type="color"
                        value={garden.find((el) => el.isSelected)?.color || "#ffffff"}
                        onChange={(e) => updateSelected({ color: e.target.value })}
                        className="w-9 h-9 rounded-full border-2 border-[#8057e4] bg-white shadow"
                        title="Edit Color"
                    />
                    <input
                        type="range"
                        min={40}
                        max={120}
                        value={garden.find((el) => el.isSelected)?.size || 70}
                        onChange={(e) => updateSelected({ size: Number(e.target.value) })}
                        title="Edit Size"
                        className="mx-2 accent-[#8057e4] border border-[#d5d2ff] rounded h-2"
                    />
                    <button
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-[#ff85a2] to-[#fa7ba0] text-white font-semibold shadow-lg hover:scale-105 transition-all"
                        onClick={() => {
                            setGarden((prev) => prev.filter((el) => !el.isSelected));
                        }}
                    >
                        Remove
                    </button>
                </div>
            )}
            {/* Font import */}
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
        html {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
        </main>
    );
}