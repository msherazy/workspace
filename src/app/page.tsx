"use client";

import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, subDays } from "date-fns";
import { Titillium_Web } from "next/font/google";

const titillium = Titillium_Web({ subsets: ["latin"], weight: ["400", "700"] });

interface MoodEntry {
  date: string;
  emotion: string;
  intensity: number;
  notes: string;
}

interface ChartData {
  date: string;
  score: number;
  emotion: string;
}

const getEmotionScore = (emotion: string): number => {
  switch (emotion) {
    case "Very Happy":
      return 5;
    case "Happy":
      return 4;
    case "Neutral":
      return 3;
    case "Sad":
      return 2;
    case "Very Sad":
      return 1;
    default:
      return 3;
  }
};

const getEmotionColor = (emotion: string): string => {
  switch (emotion) {
    case "Very Happy":
      return "#10B981";
    case "Happy":
      return "#6EE7B7";
    case "Neutral":
      return "#F59E0B";
    case "Sad":
      return "#F87171";
    case "Very Sad":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

const CustomTooltip = ({ active, payload, label }: never) => {
  if (active && payload && payload?.length) {
    const date = new Date(label);
    const formattedDate = format(date, "EEEE, MMMM d, yyyy");
    const emotion = payload[0]?.payload?.emotion;
    const score = payload[0]?.value;

    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[180px]">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getEmotionColor(emotion) }}
          />
          <span className="font-medium text-gray-900 dark:text-white">
            {emotion}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          <div>{formattedDate}</div>
          <div className="mt-1">
            <span className="font-medium text-gray-900 dark:text-white">
              {score}
            </span>
            /5 Intensity
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showAllMoods, setShowAllMoods] = useState(false);
  const [newMood, setNewMood] = useState<Omit<MoodEntry, "date">>({
    emotion: "Happy",
    intensity: 3,
    notes: "",
  });

  const emotions = ["Very Happy", "Happy", "Neutral", "Sad", "Very Sad"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];
    setMoodEntries([...moodEntries, { date: currentDate, ...newMood }]);
    setNewMood({ emotion: "Happy", intensity: 3, notes: "" });
  };

  useEffect(() => {
    setIsClient(true);
    const storedMoods = localStorage.getItem("moodEntries");
    if (storedMoods) {
      setMoodEntries(JSON.parse(storedMoods));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("moodEntries", JSON.stringify(moodEntries));
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i);
      const formattedDate = date.toISOString().split("T")[0];
      const matchingEntry = moodEntries.find(
        (entry) => entry.date === formattedDate,
      );
      if (matchingEntry) {
        return {
          date: formattedDate,
          score: getEmotionScore(matchingEntry.emotion),
          emotion: matchingEntry.emotion,
        };
      }
      return null;
    }).filter((entry) => entry !== null);
    setChartData(last30Days.reverse() as ChartData[]);
  }, [moodEntries]);

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 5) {
      setNewMood({ ...newMood, intensity: value });
    }
  };

  const handleDeleteMood = (index: number) => {
    const updatedMoods = [...moodEntries];
    updatedMoods.splice(index, 1);
    setMoodEntries(updatedMoods);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white ${titillium.className}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-teal-500/20 blur-2xl" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text tracking-tight">
              Mood Journal
            </h1>
            <div className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl text-center">
            Track your emotional journey through data visualization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 transition-all duration-300 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-100 dark:text-gray-200 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              Today&#39;s Mood
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How are you feeling today?
                </label>
                <div className="flex flex-wrap gap-2">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion}
                      type="button"
                      onClick={() => setNewMood({ ...newMood, emotion })}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
    ${
      newMood.emotion === emotion
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
    }`}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Intensity:{" "}
                  <span className="text-blue-600 font-bold">
                    {newMood.intensity}
                  </span>
                  /5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newMood.intensity}
                  onChange={handleIntensityChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Very Low</span>
                  <span>Very High</span>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={newMood.notes}
                  onChange={(e) =>
                    setNewMood({ ...newMood, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-900  text-gray-900  dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                  placeholder="What's on your mind?"
                  maxLength={250}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                Record Mood
              </button>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {isClient && chartData.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 transition-all duration-300 border border-gray-100">
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-100 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Last 30 Days
                </h2>
                <div className="h-[320px] transition-all duration-300">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          format(new Date(value), "MMM dd")
                        }
                        axisLine={{ stroke: "#e0e0e0" }}
                        tickLine={{ stroke: "#e0e0e0" }}
                        label={{
                          value: "Date",
                          position: "insideBottom",
                          offset: 0,
                          dy: 15,
                          style: { textAnchor: "middle", fill: "#6B7280" },
                        }}
                      />
                      <YAxis
                        domain={[0, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        axisLine={{ stroke: "#e0e0e0" }}
                        tickLine={{ stroke: "#e0e0e0" }}
                        tickFormatter={(value) => `${value}/5`}
                        label={{
                          value: "Mood Intensity",
                          angle: -90,
                          position: "insideLeft",
                          offset: -5,
                          style: { textAnchor: "middle", fill: "#6B7280" },
                        }}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: "#e0e0e0", strokeDasharray: "3 3" }}
                        wrapperStyle={{ zIndex: 100 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={({ cx, cy, payload }) => (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill={getEmotionColor(payload.emotion)}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        )}
                        activeDot={{
                          r: 8,
                          stroke: "#ffffff",
                          strokeWidth: 2,
                          fill: "#3B82F6",
                        }}
                        animationDuration={800}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                  Showing mood data for the last 30 days
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 transition-all duration-300 border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-100 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                Recent Entries
              </h2>

              {moodEntries.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🌞</div>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    No mood entries yet
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Track your emotions to see them displayed here
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {[...moodEntries]
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                    )
                    .slice(0, showAllMoods ? moodEntries.length : 5)
                    .map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 transition-all duration-200"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-3"
                            style={{
                              backgroundColor: getEmotionColor(entry.emotion),
                            }}
                          />
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {entry.emotion}
                            </span>
                            <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
                              {format(new Date(entry.date), "MMM dd, yyyy")}
                            </span>
                            <div className="max-w-[160px] sm:max-w-xs truncate text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">
                              {entry.notes}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
                            Intensity: {entry.intensity}/5
                          </span>
                          <button
                            onClick={() => handleDeleteMood(index)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {moodEntries.length > 5 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowAllMoods(!showAllMoods)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                  >
                    {showAllMoods
                      ? "Show Less"
                      : `Show All ${moodEntries.length} Entries`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
