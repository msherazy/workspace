"use client";
import { useEffect, useRef, useState } from "react";
import { Calendar, Check, Moon, Save, Sun, Trash2, X } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Define types
type Activity = {
  id: string;
  name: string;
  startTime: number; // In minutes from midnight
  duration: number; // In minutes
  color: string;
};

type Reminder = {
  id: string;
  activityId: string;
  time: number; // In minutes before activity starts
};

type Schedule = {
  id: string;
  name: string;
  activities: Activity[];
  reminders: Reminder[];
};

const DEFAULT_ACTIVITIES: Activity[] = [
  { id: "1", name: "Sleep", startTime: 0, duration: 480, color: "#3498db" },
  {
    id: "2",
    name: "Breakfast",
    startTime: 480,
    duration: 30,
    color: "#e67e22",
  },
  { id: "3", name: "Study", startTime: 510, duration: 180, color: "#9b59b6" },
  { id: "4", name: "Lunch", startTime: 690, duration: 60, color: "#e67e22" },
  { id: "5", name: "Exercise", startTime: 750, duration: 60, color: "#2ecc71" },
  { id: "6", name: "Study", startTime: 810, duration: 180, color: "#9b59b6" },
  { id: "7", name: "Dinner", startTime: 990, duration: 60, color: "#e67e22" },
  { id: "8", name: "Relax", startTime: 1050, duration: 150, color: "#f1c40f" },
  { id: "9", name: "Sleep", startTime: 1200, duration: 240, color: "#3498db" },
];

const DEFAULT_REMINDERS: Reminder[] = [
  { id: "1", activityId: "2", time: 15 },
  { id: "2", activityId: "3", time: 30 },
  { id: "3", activityId: "4", time: 15 },
];

const DEFAULT_SCHEDULE: Schedule = {
  id: "default",
  name: "Default Schedule",
  activities: DEFAULT_ACTIVITIES,
  reminders: DEFAULT_REMINDERS,
};

const ACTIVITY_TYPES = [
  { name: "Sleep", color: "#3498db", icon: "💤" },
  { name: "Study", color: "#9b59b6", icon: "📚" },
  { name: "Class", color: "#1abc9c", icon: "👨‍🏫" },
  { name: "Exercise", color: "#2ecc71", icon: "🏃" },
  { name: "Meal", color: "#e67e22", icon: "🍽️" },
  { name: "Relax", color: "#f1c40f", icon: "🎮" },
  { name: "Social", color: "#e74c3c", icon: "👥" },
  { name: "Work", color: "#34495e", icon: "💼" },
  { name: "Other", color: "#95a5a6", icon: "📌" },
];

// Helper functions
const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  const period = hours < 12 ? "AM" : "PM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;
};

const minutesToAngle = (minutes: number): number => {
  // Convert minutes to angle (360 degrees represents 24 hours)
  return (minutes / 1440) * 360;
};

const angleToMinutes = (angle: number): number => {
  // Convert angle to minutes (normalize angle to 0-360 range)
  const normalizedAngle = ((angle % 360) + 360) % 360;
  return Math.round((normalizedAngle / 360) * 1440);
};

// Main component
export default function StudentPlanner() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentSchedule, setCurrentSchedule] =
    useState<Schedule>(DEFAULT_SCHEDULE);
  const [savedSchedules, setSavedSchedules] = useState<Schedule[]>([
    DEFAULT_SCHEDULE,
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  const [isEditingActivity, setIsEditingActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showReminders, setShowReminders] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const clockRef = useRef<SVGSVGElement>(null);

  // Effect to load saved data and theme preference
  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      // Default to user's system preference
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDarkMode(prefersDarkMode);
    }

    // Load saved schedules
    const savedSchedulesData = localStorage.getItem("savedSchedules");
    if (savedSchedulesData) {
      try {
        const parsedSchedules = JSON.parse(savedSchedulesData);
        setSavedSchedules(parsedSchedules);
        // Set current schedule to the first saved schedule
        setCurrentSchedule(parsedSchedules[0]);
      } catch (error) {
        console.error("Error loading saved schedules:", error);
      }
    }
  }, []);

  // Effect to update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Effect to save theme preference
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Effect to save schedules
  useEffect(() => {
    localStorage.setItem("savedSchedules", JSON.stringify(savedSchedules));
  }, [savedSchedules]);

  // Handle drag and drop with touch support
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  const handleDragStart = (activity: Activity, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedActivity(activity);
    setIsDragging(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });

    // Add event listeners for drag and drop outside the SVG
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleDragEnd);
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging || !selectedActivity || !clockRef.current) return;

    e.preventDefault();
    // Handle dragging logic here if needed
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !selectedActivity || !clockRef.current) return;

    e.preventDefault();
    // Handle touch dragging logic here if needed
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !selectedActivity || !clockRef.current) return;

    setIsDragging(false);

    // Get event coordinates
    let clientX, clientY;
    if ("touches" in e) {
      // Touch event
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate angle based on drop position
    const angle =
      Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90;
    const normalizedAngle = ((angle % 360) + 360) % 360;

    const minutes = angleToMinutes(normalizedAngle);

    // Snap to nearest 15-minute interval
    const snappedMinutes = Math.round(minutes / 15) * 15;

    // Update activity start time
    const updatedActivities = currentSchedule.activities.map((activity) => {
      if (activity.id === selectedActivity.id) {
        return {
          ...activity,
          startTime: snappedMinutes % 1440, // Ensure we stay within 24 hours
        };
      }
      return activity;
    });

    setCurrentSchedule({
      ...currentSchedule,
      activities: updatedActivities,
    });

    setSelectedActivity(null);

    // Remove event listeners
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleDragEnd);
  };

  const handleClockClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!clockRef.current || selectedActivity || isDragging) return;

    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate angle based on click position
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Calculate distance from center to determine if click is within the clock
    const distance = Math.sqrt(
      Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2),
    );
    if (distance > centerX) return; // Click outside the clock

    const angle =
      Math.atan2(clickY - centerY, clickX - centerX) * (180 / Math.PI) + 90;
    const normalizedAngle = ((angle % 360) + 360) % 360;

    const minutes = angleToMinutes(normalizedAngle);
    // Snap to nearest 15-minute interval
    const snappedMinutes = Math.round(minutes / 15) * 15;

    // Open activity editor at this time
    const newActivity: Activity = {
      id: Date.now().toString(),
      name: "New Activity",
      startTime: snappedMinutes % 1440,
      duration: 60, // Default 1 hour
      color: "#95a5a6",
    };

    setEditingActivity(newActivity);
    setIsEditingActivity(true);
  };

  const handleDrop = (e: React.MouseEvent<SVGSVGElement>) => {
    // This is now handled by handleDragEnd
  };

  const handleActivityClick = (activity: Activity) => {
    setEditingActivity({ ...activity });
    setIsEditingActivity(true);
  };

  const saveActivity = () => {
    if (!editingActivity) return;

    let updatedActivities: Activity[];

    if (currentSchedule.activities.some((a) => a.id === editingActivity.id)) {
      // Update existing activity
      updatedActivities = currentSchedule.activities.map((activity) => {
        if (activity.id === editingActivity.id) {
          return editingActivity;
        }
        return activity;
      });
    } else {
      // Add new activity
      updatedActivities = [...currentSchedule.activities, editingActivity];
    }

    setCurrentSchedule({
      ...currentSchedule,
      activities: updatedActivities,
    });

    setIsEditingActivity(false);
    setEditingActivity(null);
  };

  const deleteActivity = () => {
    if (!editingActivity) return;

    const updatedActivities = currentSchedule.activities.filter(
      (activity) => activity.id !== editingActivity.id,
    );

    setCurrentSchedule({
      ...currentSchedule,
      activities: updatedActivities,
    });

    setIsEditingActivity(false);
    setEditingActivity(null);
  };

  const saveSchedule = () => {
    // Check if we're updating an existing schedule or creating a new one
    const existingScheduleIndex = savedSchedules.findIndex(
      (schedule) => schedule.id === currentSchedule.id,
    );

    if (existingScheduleIndex >= 0) {
      // Update existing schedule
      const updatedSchedules = [...savedSchedules];
      updatedSchedules[existingScheduleIndex] = currentSchedule;
      setSavedSchedules(updatedSchedules);
    } else {
      // Create new schedule
      const newSchedule = {
        ...currentSchedule,
        id: Date.now().toString(),
      };
      setSavedSchedules([...savedSchedules, newSchedule]);
      setCurrentSchedule(newSchedule);
    }
  };

  const createNewSchedule = () => {
    const newEmptySchedule: Schedule = {
      id: Date.now().toString(),
      name: "New Schedule",
      activities: [],
      reminders: [],
    };

    setCurrentSchedule(newEmptySchedule);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Calculate current time indicator position
  const currentTimeAngle = minutesToAngle(
    currentTime.getHours() * 60 + currentTime.getMinutes(),
  );

  // Define colors based on theme
  // Tuxedo scheduler color palette for light mode
  const backgroundColor = isDarkMode ? "#1a1a1a" : "#ffffff";
  const textColor = isDarkMode ? "#ffffff" : "#202020";
  const clockFaceColor = isDarkMode ? "#262626" : "#f8f8f8";
  const clockBorderColor = isDarkMode ? "#444444" : "#e0e0e0";
  const timeMarkerColor = isDarkMode ? "#555555" : "#b0b0b0";

  // Tuxedo scheduler accent colors
  const primaryAccent = isDarkMode ? "#4299e1" : "#3855b3"; // Blue
  const successAccent = isDarkMode ? "#2ecc71" : "#10b981"; // Green
  const warningAccent = isDarkMode ? "#f1c40f" : "#f59e0b"; // Amber
  const dangerAccent = isDarkMode ? "#e74c3c" : "#ef4444"; // Red
  const infoAccent = isDarkMode ? "#3498db" : "#3b82f6"; // Light blue

  const displayNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Function to handle saving schedule with notification
  const handleSaveSchedule = () => {
    saveSchedule();
    displayNotification(
      `Schedule "${currentSchedule.name}" saved successfully!`,
    );
  };

  return (
    <div
      className={`${inter.className} flex flex-col items-center min-h-screen w-full`}
      style={{ backgroundColor, color: textColor }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center w-full p-4 shadow-sm"
        style={{ backgroundColor: isDarkMode ? "#262626" : "#f8f8f8" }}
      >
        <h1 className="text-2xl font-bold">Student Planner</h1>
        <div className="flex gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-opacity-20 transition-colors"
            style={{
              backgroundColor: isDarkMode
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
              color: textColor,
            }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button
            onClick={() => setShowReminders(!showReminders)}
            className="p-2 rounded-full hover:bg-opacity-20 transition-colors"
            style={{
              backgroundColor: isDarkMode
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
              color: textColor,
            }}
            title="Manage Schedules"
          >
            <Calendar size={24} />
          </button>
          <button
            onClick={handleSaveSchedule}
            className="p-2 rounded-full hover:bg-opacity-20 transition-colors"
            style={{
              backgroundColor: isDarkMode
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
              color: textColor,
            }}
            title="Save Current Schedule"
          >
            <Save size={24} />
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {showNotification && (
        <div
          className="fixed top-4 right-4 p-3 rounded-lg shadow-lg"
          style={{
            backgroundColor: successAccent,
            color: "white",
            zIndex: 50,
            transition: "all 0.3s ease-in-out",
            opacity: showNotification ? 1 : 0,
          }}
        >
          <div className="flex items-center gap-2">
            <Check size={20} />
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* Main content - horizontal layout for desktop, column for mobile */}
      <div className="w-full max-w-7xl px-4 flex flex-col md:flex-row md:items-start md:gap-8 justify-center">
        {/* Clock - fills left side on desktop */}
        <div className="md:flex-1 relative flex justify-center items-center mt-8 mb-4 p-4">
          <svg
            ref={clockRef}
            viewBox="-10 -10 260 260"
            onClick={handleClockClick}
            onMouseUp={handleDrop}
            className="w-full max-w-[400px] md:max-w-full aspect-square"
          >
            {/* Clock face */}
            <circle
              cx="120"
              cy="120"
              r="110"
              fill={clockFaceColor}
              stroke={clockBorderColor}
              strokeWidth="2"
            />

            {/* Activities - render activities first (behind time markers) */}
            {currentSchedule.activities.map((activity) => {
              const startAngle = minutesToAngle(activity.startTime) - 90;
              const endAngle = startAngle + (activity.duration / 1440) * 360;

              const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

              const startX = 120 + 85 * Math.cos(startAngle * (Math.PI / 180));
              const startY = 120 + 85 * Math.sin(startAngle * (Math.PI / 180));

              const endX = 120 + 85 * Math.cos(endAngle * (Math.PI / 180));
              const endY = 120 + 85 * Math.sin(endAngle * (Math.PI / 180));

              const midAngle = (startAngle + endAngle) / 2;
              const labelX = 120 + 60 * Math.cos(midAngle * (Math.PI / 180));
              const labelY = 120 + 60 * Math.sin(midAngle * (Math.PI / 180));

              return (
                <g
                  key={activity.id}
                  onMouseDown={(e) => handleDragStart(activity, e)}
                  onClick={(e) => {
                    if (!isDragging) {
                      e.stopPropagation();
                      handleActivityClick(activity);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <path
                    d={`M 120 120 L ${startX} ${startY} A 85 85 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                    fill={activity.color}
                    stroke="#ffffff"
                    strokeWidth="1"
                    opacity="0.8"
                  />
                  {activity.duration >= 60 && (
                    <text
                      x={labelX}
                      y={labelY}
                      fontSize="8"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      style={{ pointerEvents: "none" }}
                    >
                      {activity.name}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Time markers - render on top of activities */}
            <circle
              cx="120"
              cy="120"
              r="95"
              fill="none"
              stroke={timeMarkerColor}
              strokeWidth="1"
              strokeDasharray="2,2"
            />

            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 15 - 90) * (Math.PI / 180);
              const x1 = 120 + 95 * Math.cos(angle);
              const y1 = 120 + 95 * Math.sin(angle);
              const x2 = 120 + 105 * Math.cos(angle);
              const y2 = 120 + 105 * Math.sin(angle);

              // Create a small white background for the time text to improve readability
              const textX = 120 + 115 * Math.cos(angle);
              const textY = 120 + 115 * Math.sin(angle);

              return (
                <g key={i}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={timeMarkerColor}
                    strokeWidth="1"
                  />
                  <circle
                    cx={textX}
                    cy={textY}
                    r="10"
                    fill={clockFaceColor}
                    stroke="none"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fontSize="5"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={textColor}
                  >
                    {i === 0
                      ? "12 AM"
                      : i === 12
                        ? "12 PM"
                        : i > 12
                          ? `${i - 12} PM`
                          : `${i} AM`}
                  </text>
                </g>
              );
            })}

            {/* Current time indicator */}
            <line
              x1="120"
              y1="120"
              x2={
                120 + 110 * Math.cos((currentTimeAngle - 90) * (Math.PI / 180))
              }
              y2={
                120 + 110 * Math.sin((currentTimeAngle - 90) * (Math.PI / 180))
              }
              stroke="#ff0000"
              strokeWidth="2"
              strokeDasharray="2,2"
            />
            <circle
              cx={
                120 + 110 * Math.cos((currentTimeAngle - 90) * (Math.PI / 180))
              }
              cy={
                120 + 110 * Math.sin((currentTimeAngle - 90) * (Math.PI / 180))
              }
              r="4"
              fill="#ff0000"
            />
          </svg>
        </div>

        {/* Right sidebar with activity info */}
        <div className="md:flex-1 md:max-w-md flex flex-col md:mt-8">
          {/* Instructions Banner */}
          <div
            className="w-full p-4 mb-4 rounded-lg"
            style={{
              backgroundColor: isDarkMode
                ? "rgba(45, 55, 72, 0.5)"
                : "rgba(240, 245, 255, 0.8)",
              borderLeft: `4px solid ${primaryAccent}`,
            }}
          >
            <div className="flex items-start gap-3">
              <div>
                <h3 className="font-bold text-sm mb-1">Quick Tips:</h3>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>Click on the clock to add a new activity</li>
                  <li>Click on an activity to edit it</li>
                  <li>Drag activities to move them to a new time</li>
                  <li>Use the calendar icon to manage your schedules</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Activity Legend */}
          <div
            className="w-full p-4 mb-8 rounded-lg shadow-md flex-grow"
            style={{
              backgroundColor: isDarkMode ? "rgba(26, 32, 44, 0.8)" : "white",
            }}
          >
            <h2 className="text-lg font-bold mb-2">Today's Activities</h2>
            <div className="flex flex-col gap-2 max-h-[calc(100vh-300px)] md:max-h-[600px] overflow-y-auto">
              {currentSchedule.activities
                .sort((a, b) => a.startTime - b.startTime)
                .map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center p-3 rounded cursor-pointer shadow-sm"
                    style={{
                      backgroundColor: isDarkMode
                        ? `${activity.color}22`
                        : `${activity.color}15`,
                      borderLeft: `4px solid ${activity.color}`,
                    }}
                    onClick={() => handleActivityClick(activity)}
                  >
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: activity.color }}
                    />
                    <span className="flex-grow font-medium">
                      {activity.name}
                    </span>
                    <span className="text-sm whitespace-nowrap">
                      {formatTime(activity.startTime)} -{" "}
                      {formatTime(
                        (activity.startTime + activity.duration) % 1440,
                      )}
                    </span>
                  </div>
                ))}

              {currentSchedule.activities.length === 0 && (
                <div className="text-center py-6 text-gray-500 italic">
                  No activities added yet. Click on the clock to add your first
                  activity!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Editor Modal */}
      {isEditingActivity && editingActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className="rounded-xl p-6 w-full max-w-md"
            style={{
              backgroundColor: isDarkMode ? "#262626" : "#ffffff",
              border: `1px solid ${isDarkMode ? "#444444" : "#e0e0e0"}`,
              boxShadow: isDarkMode
                ? "0 4px 20px rgba(0,0,0,0.3)"
                : "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            {/* Header */}
            <div
              className="flex justify-between items-center mb-6 pb-4 border-b"
              style={{ borderColor: isDarkMode ? "#444444" : "#e0e0e0" }}
            >
              <h2
                className="text-xl font-semibold"
                style={{ color: primaryAccent }}
              >
                {editingActivity.id === "new"
                  ? "Add Activity"
                  : "Edit Activity"}
              </h2>
              <button
                onClick={() => setIsEditingActivity(false)}
                className="p-1 rounded-full hover:bg-opacity-10"
                style={{
                  color: textColor,
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <div className="space-y-6">
              {/* Activity Name */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textColor }}
                >
                  Activity Name
                </label>
                <input
                  type="text"
                  value={editingActivity.name}
                  onChange={(e) =>
                    setEditingActivity({
                      ...editingActivity,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-lg border text-sm"
                  style={{
                    backgroundColor: isDarkMode ? "#333333" : "#f8f8f8",
                    color: textColor,
                    borderColor: isDarkMode ? "#444444" : "#e0e0e0",
                  }}
                  placeholder="Enter activity name"
                />
              </div>

              {/* Time & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: textColor }}
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={`${Math.floor(editingActivity.startTime / 60)
                      .toString()
                      .padStart(
                        2,
                        "0",
                      )}:${(editingActivity.startTime % 60).toString().padStart(2, "0")}`}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value
                        .split(":")
                        .map(Number);
                      setEditingActivity({
                        ...editingActivity,
                        startTime: hours * 60 + minutes,
                      });
                    }}
                    className="w-full p-3 rounded-lg border text-sm"
                    style={{
                      backgroundColor: isDarkMode ? "#333333" : "#f8f8f8",
                      color: textColor,
                      borderColor: isDarkMode ? "#444444" : "#e0e0e0",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: textColor }}
                  >
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={editingActivity.duration}
                    onChange={(e) =>
                      setEditingActivity({
                        ...editingActivity,
                        duration: parseInt(e.target.value) || 0,
                      })
                    }
                    min="15"
                    step="15"
                    className="w-full p-3 rounded-lg border text-sm"
                    style={{
                      backgroundColor: isDarkMode ? "#333333" : "#f8f8f8",
                      color: textColor,
                      borderColor: isDarkMode ? "#444444" : "#e0e0e0",
                    }}
                  />
                </div>
              </div>

              {/* Activity Type */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textColor }}
                >
                  Activity Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {ACTIVITY_TYPES.map((type) => (
                    <button
                      key={type.name}
                      onClick={() =>
                        setEditingActivity({
                          ...editingActivity,
                          color: type.color,
                          name:
                            editingActivity.name === "New Activity"
                              ? type.name
                              : editingActivity.name,
                        })
                      }
                      className="flex flex-col items-center p-3 rounded-lg transition-all"
                      style={{
                        backgroundColor:
                          editingActivity.color === type.color
                            ? isDarkMode
                              ? `${type.color}33`
                              : `${type.color}15`
                            : isDarkMode
                              ? "#333333"
                              : "#f8f8f8",
                        border:
                          editingActivity.color === type.color
                            ? `2px solid ${type.color}`
                            : `1px solid ${isDarkMode ? "#444444" : "#e0e0e0"}`,
                        transform:
                          editingActivity.color === type.color
                            ? "scale(1.02)"
                            : "scale(1)",
                        color: textColor,
                      }}
                      title={type.name}
                    >
                      <span className="text-xl mb-1">{type.icon}</span>
                      <span className="text-xs font-medium">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="flex justify-between pt-4 border-t"
                style={{ borderColor: isDarkMode ? "#444444" : "#e0e0e0" }}
              >
                {editingActivity.id !== "new" && (
                  <button
                    onClick={deleteActivity}
                    className="px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                    style={{
                      backgroundColor: isDarkMode
                        ? dangerAccent
                        : `${dangerAccent}15`,
                      color: isDarkMode ? "white" : dangerAccent,
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
                <button
                  onClick={saveActivity}
                  className="px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 ml-auto transition-colors"
                  style={{
                    backgroundColor: successAccent,
                    color: "white",
                  }}
                >
                  <Save size={16} />
                  Save Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reminders Panel */}
      {showReminders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className="rounded-lg p-6 w-full max-w-md md:max-w-lg"
            style={{ backgroundColor }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Schedules & Reminders</h2>
              <button onClick={() => setShowReminders(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:flex-1">
                <label className="block mb-1">Schedule Name</label>
                <input
                  type="text"
                  value={currentSchedule.name}
                  onChange={(e) =>
                    setCurrentSchedule({
                      ...currentSchedule,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded border"
                  style={{
                    backgroundColor: isDarkMode ? "#333" : "#f8f8f8",
                    color: textColor,
                  }}
                />

                <div className="flex justify-between mt-6">
                  <button
                    onClick={createNewSchedule}
                    className="px-4 py-2 rounded"
                    style={{
                      backgroundColor: isDarkMode ? "#444" : "#e0e0e0",
                      color: textColor,
                    }}
                  >
                    New Schedule
                  </button>
                  <button
                    onClick={saveSchedule}
                    className="px-4 py-2 rounded text-white"
                    style={{ backgroundColor: successAccent }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="md:flex-1">
                <label className="block mb-1">Saved Schedules</label>
                <div
                  className="flex flex-col gap-2 max-h-60 overflow-y-auto border rounded p-2"
                  style={{ backgroundColor: isDarkMode ? "#222" : "#f8f8f8" }}
                >
                  {savedSchedules.map((schedule) => (
                    <button
                      key={schedule.id}
                      onClick={() => setCurrentSchedule(schedule)}
                      className="text-left p-2 rounded hover:bg-opacity-10 hover:bg-white"
                      style={{
                        backgroundColor:
                          schedule.id === currentSchedule.id
                            ? isDarkMode
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(56, 85, 179, 0.1)"
                            : "transparent",
                        borderLeft:
                          schedule.id === currentSchedule.id
                            ? `3px solid ${primaryAccent}`
                            : "3px solid transparent",
                      }}
                    >
                      {schedule.name}
                    </button>
                  ))}

                  {savedSchedules.length === 0 && (
                    <div className="text-center py-3 text-gray-500 italic">
                      No saved schedules yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
