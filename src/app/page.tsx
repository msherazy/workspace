"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FiCheckCircle, FiMoon, FiSun } from "react-icons/fi";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// ===== TYPES =====

/**
 * Interface for productivity data
 */
interface ProductivityData {
  day: string;
  minutes: number;
}

// ===== CONSTANTS =====

// Daily goal in minutes
const DAILY_GOAL = 120;

// Mock weekly data for productivity chart
const MOCK_WEEKLY_DATA: ProductivityData[] = [
  { day: "Mon", minutes: 80 },
  { day: "Tue", minutes: 40 },
  { day: "Wed", minutes: 60 },
  { day: "Thu", minutes: 90 },
  { day: "Fri", minutes: 70 },
  { day: "Sat", minutes: 30 },
  { day: "Sun", minutes: 50 }
];

// ===== SERVICE FUNCTIONS =====

/**
 * Fetches the user's weekly productivity data
 * In a real app, this would call an API endpoint
 */
async function fetchWeeklyProductivity(): Promise<ProductivityData[]> {
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_WEEKLY_DATA);
    }, 1000);
  });
}

// ===== COMPONENT: FOCUS TIMER =====

interface FocusTimerProps {
  minutesFocused: number;
  setMinutesFocused: Dispatch<SetStateAction<number>>;
  theme: string | undefined;
}

/**
 * FocusTimer component - Displays a circular progress bar to visualize
 * the user's daily focus time and allows adding new focus sessions
 */
function FocusTimer({ minutesFocused, setMinutesFocused, theme }: FocusTimerProps) {
  // Calculate percentage of daily goal completed
  const percentComplete = Math.min(100, (minutesFocused / DAILY_GOAL) * 100);
  
  return (
    <section className="bg-blue-50 dark:bg-blue-900/40 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl border border-blue-100 dark:border-blue-800">
      <h2 className="text-xl font-semibold mb-4">Today's Focus Timer</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 max-w-[60%]">
          {/* Progress Ring */}
          <div className="w-28 h-28 flex items-center justify-center">
            <div className="w-full h-full">
              <CircularProgressbar
                value={percentComplete}
                text={`${minutesFocused}m`}
                styles={buildStyles({
                  // Colors - adapts to current theme
                  pathColor: theme === "dark" ? "#60a5fa" : "#3b82f6",
                  textColor: theme === "dark" ? "#60a5fa" : "#3b82f6",
                  trailColor: theme === "dark" ? "#1e3a8a30" : "#dbeafe",
                  // Styling
                  rotation: 0.25,
                  strokeLinecap: 'round',
                  textSize: '22px',
                  pathTransition: 'stroke-dashoffset 0.5s ease 0s',
                })}
              />
            </div>
          </div>
          
          {/* Progress details */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">{percentComplete.toFixed(0)}%</span> of daily goal
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Target: {DAILY_GOAL} minutes
            </p>
          </div>
        </div>
        
        {/* Add focus session button */}
        <button
          onClick={() => setMinutesFocused(prev => prev + 25)}
          className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-1 ml-4"
        >
          +25m Session
        </button>
      </div>
    </section>
  );
}

// ===== COMPONENT: GOAL TRACKER =====

interface GoalTrackerProps {
  theme: string | undefined;
}

/**
 * GoalTracker component - Allows users to create and track their daily goals
 */
function GoalTracker({ theme }: GoalTrackerProps) {
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState("");

  // Add a new goal to the list
  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals(prev => [...prev, newGoal.trim()]);
      setNewGoal("");
    }
  };

  return (
    <section className="bg-green-50 dark:bg-green-900/40 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl border border-green-100 dark:border-green-800">
      <h2 className="text-xl font-semibold mb-4">My Goals for Today</h2>
      
      {/* Goal input form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter a goal"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          onKeyDown={(e) => e.key === 'Enter' && addGoal()}
        />
        <button
          onClick={addGoal}
          className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
        >
          Add
        </button>
      </div>
      
      {/* Goals list */}
      <ul className="space-y-3">
        {goals.map((goal, i) => (
          <li key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/30 transition-all">
            <FiCheckCircle className="text-green-500 text-xl" />
            <span className="font-medium">{goal}</span>
          </li>
        ))}
        {goals.length === 0 && (
          <li className="text-gray-500 italic p-2">No goals added yet. Add some to track your progress!</li>
        )}
      </ul>
    </section>
  );
}

// ===== COMPONENT: PRODUCTIVITY CHART =====

interface ProductivityChartProps {
  weeklyData: ProductivityData[];
  loading: boolean;
  theme: string | undefined;
}

/**
 * ProductivityChart component - Visualizes the user's weekly productivity 
 * with a line chart showing minutes focused per day
 */
function ProductivityChart({ weeklyData, loading, theme }: ProductivityChartProps) {
  // Use real data if available, otherwise fall back to mock data
  const chartData = weeklyData.length > 0 ? weeklyData : MOCK_WEEKLY_DATA;

  return (
    <section className="bg-purple-50 dark:bg-purple-900/40 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl border border-purple-100 dark:border-purple-800">
      <h2 className="text-xl font-semibold mb-4">Weekly Productivity</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-[300px] text-purple-500">
          Loading productivity data...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
            <XAxis 
              dataKey="day" 
              stroke={theme === "dark" ? "#a78bfa" : "#8b5cf6"} 
            />
            <YAxis 
              stroke={theme === "dark" ? "#a78bfa" : "#8b5cf6"} 
              label={{ 
                value: 'Minutes', 
                angle: -90, 
                position: 'insideLeft',
                style: { textFill: theme === "dark" ? "#a78bfa" : "#8b5cf6" }
              }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: theme === "dark" ? "#1e1b4b" : "#f5f3ff", 
                border: "none", 
                borderRadius: "8px", 
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" 
              }}
              labelStyle={{ 
                color: theme === "dark" ? "#e9d5ff" : "#4c1d95", 
                fontWeight: "bold" 
              }}
            />
            <Line
              type="monotone"
              dataKey="minutes"
              stroke={theme === "dark" ? "#a78bfa" : "#8b5cf6"}
              strokeWidth={3}
              dot={{ fill: theme === "dark" ? "#a78bfa" : "#8b5cf6", r: 6 }}
              activeDot={{ r: 8, fill: theme === "dark" ? "#c4b5fd" : "#7c3aed" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}

// ===== MAIN DASHBOARD COMPONENT =====

/**
 * Main dashboard content with theme support
 */
function DashboardContent() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [minutesFocused, setMinutesFocused] = useState(0);
  const [weeklyData, setWeeklyData] = useState<ProductivityData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load fonts and ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
    
    // Add Inter font to document
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
    document.body.style.fontFamily = "'Inter', sans-serif";
    
    // Clean up function
    return () => {
      document.head.removeChild(fontLink);
    };
  }, []);
  
  // Fetch weekly productivity data
  useEffect(() => {
    const loadWeeklyData = async () => {
      try {
        // In a real app, this would fetch from an API
        const data = await fetchWeeklyProductivity();
        setWeeklyData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch weekly productivity data:", error);
        setLoading(false);
      }
    };
    
    loadWeeklyData();
  }, []);

  // Toggle theme between light and dark
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // Don't render until component is mounted (prevents hydration issues with theme)
  if (!mounted) return null;

  return (
    <main className="min-h-screen px-4 py-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header with title and theme toggle */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Focus Dashboard
          </h1>
          <button
            aria-label="Toggle Theme"
            onClick={toggleTheme}
            className="text-2xl p-2 rounded-full border border-gray-400 dark:border-gray-600 transition-all duration-200 hover:scale-110 hover:shadow-md"
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>
        </div>

        {/* Focus Timer Component */}
        <FocusTimer 
          minutesFocused={minutesFocused} 
          setMinutesFocused={setMinutesFocused} 
          theme={theme} 
        />

        {/* Goal Tracker Component */}
        <GoalTracker theme={theme} />

        {/* Productivity Chart Component */}
        <ProductivityChart 
          weeklyData={weeklyData} 
          loading={loading} 
          theme={theme} 
        />
      </div>
    </main>
  );
}

// ===== ROOT COMPONENT =====

/**
 * Root component that wraps the dashboard with theme provider
 */
export default function FocusDashboard() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <DashboardContent />
    </ThemeProvider>
  );
}