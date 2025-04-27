"use client";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { animate, AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaDollarSign, FaSync } from "react-icons/fa";
import { BsMoonStars, BsSun } from "react-icons/bs";

const COLORS = {
  navy: "#1F2937",
  cardLight: "#F3F4F6",
  blue: "#2563EB",
  cyan: "#06B6D4",
  green: "#22C55E",
  purple: "#8B5CF6",
  yellow: "#FFD166",
  dark: "#181B26",
  light: "#F7FAFC",
};

const mockRates = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (89 - i));
  return {
    date: date.toISOString().slice(0, 10),
    rate: +(3.65 + Math.sin(i / 9) * 0.025 + Math.random() * 0.01).toFixed(4),
  };
});

const rangeOptions = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 120, damping: 14 });
  const rounded = useTransform(spring, (latest) => Number(latest).toFixed(2));
  useEffect(() => {
    animate(motionValue, value, { duration: 0.6 });
  }, [value, motionValue]);
  return <motion.span>{rounded}</motion.span>;
}

export default function Home() {
  // Only light or dark (no system)
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // On mount: read localStorage, else system, else light
  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      document.documentElement.className = stored === "dark" ? "dark" : "";
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.className = "dark";
    } else {
      setTheme("light");
      document.documentElement.className = "";
    }
  }, []);

  // When theme changes
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.className = theme === "dark" ? "dark" : "";
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const isDark = theme === "dark";

  // UI state
  const [range, setRange] = useState(rangeOptions[1]);
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState<"USD" | "AED">("USD");
  const [converted, setConverted] = useState<number | null>(null);

  const chartData = mockRates.slice(-range.days);
  const latestRate = chartData[chartData.length - 1]?.rate || 3.6725;

  const handleConvert = () => {
    if (!amount || isNaN(Number(amount))) return setConverted(null);
    if (from === "USD") setConverted(Number(amount) * latestRate);
    else setConverted(Number(amount) / latestRate);
  };

  // Card style for all screens (mx-4 on mobile, mx-8 on sm+, mx-auto on md+)
  const cardStyle = `
    rounded-3xl max-w-xl w-full mx-4 sm:mx-8 md:mx-auto my-3 px-4 py-6 md:px-8 md:py-10
    shadow-xl border border-gray-200 dark:border-gray-800
    bg-white/70 dark:bg-[#23263a]/85 backdrop-blur-xl
    transition-all
  `;

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-[#181B26]" />;

  return (
    <div className={`
      ${isDark
      ? "bg-gradient-to-br from-[#161b26] via-[#23263a] to-[#0a1625] text-white"
      : "bg-gradient-to-br from-[#F7FAFC] via-[#E3F0FC] to-[#ECFFF4] text-slate-900"}
      min-h-screen font-poppins transition-colors duration-300 flex flex-col items-center
    `}>
      {/* Sticky Header - now NO background color */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="w-full max-w-xl mx-auto px-4 pt-6 flex justify-between items-center sticky top-0 z-50"
        style={{ minHeight: 64 }}
      >
        <div className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
             style={{ letterSpacing: "0.01em" }}>
          <FaDollarSign style={{ color: COLORS.green, textShadow: "0 0 6px #22C55E99" }} />
          <span className="drop-shadow-md">USD/AED Explorer</span>
        </div>
        <button
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="rounded-full border border-gray-200 dark:border-gray-700 p-3 transition hover:scale-110 bg-white/70 dark:bg-[#23263a]/60"
        >
          {isDark
            ? <BsSun className="text-yellow-400 text-xl" />
            : <BsMoonStars className="text-[#8B5CF6] text-xl" />}
        </button>
      </motion.header>

      <main className="w-full flex flex-col items-center pt-4 md:pt-8">
        {/* Chart Card */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.7, type: "spring" }}
          className={cardStyle}
        >
          <div className="flex flex-col items-start gap-1 mb-4">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tight"
                style={{
                  background: `linear-gradient(90deg, ${COLORS.blue} 0%, ${COLORS.cyan} 40%, ${COLORS.green} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
            >
              USD to AED Exchange Rate
            </h2>
            <span className="text-sm opacity-80 font-semibold" style={{ color: isDark ? COLORS.yellow : COLORS.purple }}>Animated time-series chart</span>
            <div className="flex gap-2 mt-3 w-full">
              {rangeOptions.map(opt => (
                <motion.button
                  key={opt.label}
                  className={`
                    flex-1 px-0 py-2 rounded-full font-bold text-base transition-all
                    ${range.label === opt.label
                    ? "bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-lg scale-105"
                    : "bg-gray-100 dark:bg-[#1F2937] text-gray-800 dark:text-gray-100 hover:bg-blue-50 hover:text-blue-600"}
                  `}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRange(opt)}
                  style={{ minWidth: 64 }}
                >
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Chart Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={range.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="h-60 md:h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="usdChart" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor={COLORS.blue} />
                      <stop offset="50%" stopColor={COLORS.cyan} />
                      <stop offset="100%" stopColor={COLORS.green} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke={isDark ? "#334155" : "#e5e7eb"} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 13, fontWeight: 700, fill: isDark ? COLORS.yellow : COLORS.navy }}
                    tickFormatter={d => d.slice(5)}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="rate"
                    domain={["dataMin-0.01", "dataMax+0.01"]}
                    tickFormatter={v => v.toFixed(4)}
                    tick={{ fontSize: 13, fontWeight: 700, fill: isDark ? COLORS.yellow : COLORS.navy }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? "#23263a" : "#fff",
                      borderRadius: 12,
                      border: isDark ? `1px solid ${COLORS.purple}` : `1px solid ${COLORS.blue}`,
                      color: isDark ? COLORS.yellow : COLORS.navy,
                      fontSize: 15,
                      boxShadow: `0 4px 16px ${COLORS.blue}40`,
                    }}
                    formatter={value => [`${value} AED`, "Rate"]}
                    labelFormatter={label => `Date: ${label}`}
                    cursor={{ stroke: COLORS.cyan, strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="url(#usdChart)"
                    strokeWidth={4}
                    dot={{ r: 5, fill: COLORS.yellow, stroke: COLORS.blue, strokeWidth: 3, filter: "drop-shadow(0 2px 8px #22d3ee99)" }}
                    activeDot={{ r: 9, fill: "#fff", stroke: COLORS.cyan, strokeWidth: 5, filter: `drop-shadow(0 4px 16px ${COLORS.green})` }}
                    isAnimationActive={true}
                    animationDuration={900}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* Converter Card */}
        <motion.section
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          className={cardStyle}
        >
          <div className="flex flex-col gap-2 mb-3">
            <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2"
                style={{
                  background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.purple})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
              <FaSync className="inline text-[#06B6D4]" /> Currency Converter
            </h3>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
              Latest rate: <span className="font-mono text-lg">{latestRate}</span> <span className="opacity-60">AED/USD</span>
            </span>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleConvert();
            }}
            className="flex flex-col gap-3"
          >
            <input
              type="number"
              min="0"
              inputMode="decimal"
              step="0.01"
              required
              placeholder={from === "USD" ? "USD Amount" : "AED Amount"}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23263a] focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg font-semibold shadow-inner"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <select
              value={from}
              onChange={e => {
                setFrom(e.target.value as "USD" | "AED");
                setConverted(null);
                setAmount("");
              }}
              className="rounded-xl px-3 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#181b26] text-base font-semibold shadow"
            >
              <option value="USD">USD to AED</option>
              <option value="AED">AED to USD</option>
            </select>
            <motion.button
              type="submit"
              className="w-full px-6 py-3 mt-2 rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#22C55E] shadow-lg hover:from-blue-700 hover:to-green-600 font-bold text-lg text-white transition-all"
              whileHover={{ scale: 1.05, boxShadow: "0px 6px 16px 0px #06b6d460" }}
              whileTap={{ scale: 0.98 }}
            >
              Convert
            </motion.button>
          </form>
          <AnimatePresence>
            {converted !== null && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4 }}
                className="mt-5 text-xl font-extrabold text-blue-700 dark:text-cyan-300 text-center"
                style={{ color: isDark ? COLORS.cyan : COLORS.blue }}
              >
                <AnimatedNumber value={Number(converted)} /> {from === "USD" ? "AED" : "USD"}
                <div className="mt-2 font-medium text-base text-gray-700 dark:text-gray-200">{amount} {from} = <AnimatedNumber value={Number(converted)} /> {from === "USD" ? "AED" : "USD"}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>

      <footer className="mt-8 pb-6 text-center text-xs text-gray-400 dark:text-gray-500 w-full">
        © {new Date().getFullYear()} USD/AED Explorer — Demo with Mock Data
      </footer>
    </div>
  );
}
