"use client";
import {useEffect, useState} from "react";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {animate, AnimatePresence, motion, useMotionValue, useSpring, useTransform} from "framer-motion";
import {FaDollarSign, FaSync} from "react-icons/fa";
import {BsMoonStars, BsSun} from "react-icons/bs";

// --- Mock Data (90 days) ---
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

// --- Animated Number using Framer Motion ---
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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [range, setRange] = useState(rangeOptions[1]);
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState<"USD" | "AED">("USD");
  const [converted, setConverted] = useState<number | null>(null);

  // Mobile header sticky
  useEffect(() => {
    document.documentElement.className = theme === "dark" ? "dark" : "";
  }, [theme]);

  // Chart data based on range
  const chartData = mockRates.slice(-range.days);
  const latestRate = chartData[chartData.length - 1]?.rate || 3.6725;

  // Conversion handler
  const handleConvert = () => {
    if (!amount || isNaN(Number(amount))) return setConverted(null);
    if (from === "USD") setConverted(Number(amount) * latestRate);
    else setConverted(Number(amount) / latestRate);
  };

  // Theme handler
  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  // For glassmorphism background
  const cardStyle = `rounded-3xl px-5 py-8 md:p-10 shadow-2xl border border-gray-100 dark:border-gray-700 
    bg-white/60 dark:bg-[#23263a]/80 backdrop-blur-2xl transition-all`;

  return (
      <div className={`${isDark ? "bg-gradient-to-bl from-[#16182a] via-[#20294f] to-[#222932] text-white" : "bg-gradient-to-bl from-[#f8fafc] via-[#e9f3fd] to-[#f6fff8] text-slate-900"} min-h-screen font-poppins transition-colors duration-300`}>
        {/* Sticky Header */}
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="sticky top-0 z-40 bg-transparent px-4 py-5 md:px-10 flex justify-between items-center"
        >
          <div className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <FaDollarSign className="text-lime-400 drop-shadow-lg" />
            <span>USD/AED Explorer</span>
          </div>
          <button
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="rounded-full border border-gray-200 dark:border-gray-700 p-3 transition hover:scale-110 bg-white/60 dark:bg-[#20283a]/70"
          >
            {isDark ? <BsSun className="text-yellow-300 text-xl" /> : <BsMoonStars className="text-indigo-700 text-xl" />}
          </button>
        </motion.header>

        {/* Chart Card */}
        <motion.section
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.75, type: "spring" }}
            className={`max-w-xl mx-auto mt-3 md:mt-10 ${cardStyle}`}
        >
          {/* Chart Header + Tabs */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-3 gap-2 md:gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tight bg-gradient-to-r from-sky-500 via-cyan-400 to-lime-400 bg-clip-text text-transparent drop-shadow-lg">
                USD to AED Exchange Rate
              </h2>
              <span className="text-sm opacity-80 font-semibold">Animated time-series chart</span>
            </div>
            <div className="flex gap-2 justify-center mt-2">
              {rangeOptions.map(opt => (
                  <motion.button
                      key={opt.label}
                      className={`px-5 py-2 rounded-full font-bold text-base transition-all shadow-sm
                  ${range.label === opt.label
                          ? "bg-gradient-to-r from-blue-400 via-cyan-400 to-lime-400 text-white shadow-xl scale-110"
                          : "bg-gray-100 dark:bg-[#2a3045] text-gray-700 dark:text-gray-100 hover:bg-blue-400 hover:text-white"}
                `}
                      style={{ minWidth: 64 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setRange(opt)}
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
                className="h-72 md:h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="usdChart" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#0ea5e9" />
                      <stop offset="60%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke={isDark ? "#334155" : "#e5e7eb"} />
                  <XAxis
                      dataKey="date"
                      tick={{ fontSize: 13, fontWeight: 700 }}
                      tickFormatter={d => d.slice(5)}
                      axisLine={false}
                      tickLine={false}
                  />
                  <YAxis
                      dataKey="rate"
                      domain={["dataMin-0.01", "dataMax+0.01"]}
                      tick={{ fontSize: 13, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                  />
                  <Tooltip
                      contentStyle={{
                        background: isDark ? "#23263a" : "#fff",
                        borderRadius: 12,
                        border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
                        color: isDark ? "#fff" : "#1e293b",
                        fontSize: 15,
                        boxShadow: "0 8px 24px #0ea5e980",
                      }}
                      formatter={value => [`${value} AED`, "Rate"]}
                      labelFormatter={label => `Date: ${label}`}
                      cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
                  />
                  <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="url(#usdChart)"
                      strokeWidth={4}
                      dot={{ r: 5, fill: "#ffe156", stroke: "#0ea5e9", strokeWidth: 3, filter: "drop-shadow(0 2px 8px #67e8f9)" }}
                      activeDot={{ r: 10, fill: "#fff", stroke: "#0ea5e9", strokeWidth: 6, filter: "drop-shadow(0 4px 16px #3b82f6)" }}
                      isAnimationActive={true}
                      animationDuration={900}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* Currency Converter Card */}
        <motion.section
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className={`max-w-xl mx-auto mt-7 md:mt-12 mb-4 md:mb-8 ${cardStyle}`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
            <h3 className="text-xl md:text-2xl font-extrabold flex items-center gap-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-lime-400 bg-clip-text text-transparent drop-shadow-lg">
              <FaSync className="inline text-blue-400" /> Currency Converter
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
              className="flex flex-col md:flex-row gap-3 md:gap-4"
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
                className="w-full md:w-auto px-6 py-3 mt-2 md:mt-0 rounded-2xl bg-gradient-to-r from-blue-500 via-green-400 to-cyan-400 shadow-lg hover:from-blue-700 hover:to-green-600 font-bold text-lg text-white transition-all"
                whileHover={{ scale: 1.05, boxShadow: "0px 6px 16px 0px #0ea5e9b0" }}
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
                >
                  <AnimatedNumber value={Number(converted)} /> {from === "USD" ? "AED" : "USD"}
                  <div className="mt-2 font-medium text-base text-gray-700 dark:text-gray-200">{amount} {from} = <AnimatedNumber value={Number(converted)} /> {from === "USD" ? "AED" : "USD"}</div>
                </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Footer */}
        <footer className="mt-10 pb-7 text-center text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} USD/AED Explorer — Demo with Mock Data
        </footer>
      </div>
  );
}
