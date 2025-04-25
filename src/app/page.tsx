"use client";

import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

// Theme Toggle Button
const ThemeToggle = () => {
  const [dark, setDark] = useState(
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="ml-2 rounded-full border px-3 py-1 text-sm font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow"
      aria-label="Toggle Dark Mode"
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
};

// Mock data generation function
const generateMockData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data: any[] = [];

  for (let week = 0; week < 4; week++) {
    const weekData = days.map((day) => ({
      day,
      week,
      mood: Math.floor(Math.random() * 5) + 1,
      activity: Math.floor(Math.random() * 10000),
      sleep: +(Math.random() * 3 + 5).toFixed(1),
      stress: Math.floor(Math.random() * 5) + 1,
      water: Math.floor(Math.random() * 8) + 2,
    }));
    data.push(weekData);
  }
  return data;
};

const allData = generateMockData();

const MoodIcon = ({ value }: { value: number }) => {
  const icons: Record<number, string> = {
    1: "😭",
    2: "😞",
    3: "😐",
    4: "😊",
    5: "😁",
  };
  return <span className="text-xl md:text-2xl">{icons[value]}</span>;
};

const HealthDashboard = () => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [filteredData, setFilteredData] = useState(allData[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFilteredData(allData[selectedWeek]);
      setIsLoading(false);
    }, 200);
  }, [selectedWeek]);

  const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeek(Number(e.target.value));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 md:p-8 transition-colors">
      <div className="max-w-5xl mx-auto">
        {/* Header + Theme Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
            Health & Wellness Dashboard
          </h1>
          <ThemeToggle />
        </div>

        {/* Week Selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 gap-2">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Weekly Overview
          </h2>
          <select
            value={selectedWeek}
            onChange={handleWeekChange}
            className="w-full md:w-auto bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100 py-2 px-4 rounded leading-tight focus:outline-none focus:border-blue-500"
          >
            <option value={0}>Week 1</option>
            <option value={1}>Week 2</option>
            <option value={2}>Week 3</option>
            <option value={3}>Week 4</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-700 dark:text-gray-200 font-medium">
                Avg. Mood
              </h3>
              <span className="text-2xl">
                {filteredData &&
                  (
                    filteredData.reduce(
                      (acc: number, curr: any) => acc + curr.mood,
                      0
                    ) / filteredData.length
                  ).toFixed(1)}
              </span>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-700 dark:text-gray-200 font-medium">
                Avg. Sleep
              </h3>
              <span className="text-2xl">
                {filteredData &&
                  (
                    filteredData.reduce(
                      (acc: number, curr: any) => acc + curr.sleep,
                      0
                    ) / filteredData.length
                  ).toFixed(1)}{" "}
                hrs
              </span>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-700 dark:text-gray-200 font-medium">
                Avg. Activity
              </h3>
              <span className="text-2xl">
                {filteredData &&
                  Math.round(
                    filteredData.reduce(
                      (acc: number, curr: any) => acc + curr.activity,
                      0
                    ) / filteredData.length
                  ).toLocaleString()}{" "}
                steps
              </span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
              Mood Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
              Sleep Duration
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 9]} />
                  <Tooltip />
                  <Bar dataKey="sleep" name="Hours" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
            Daily Activity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis
                  label={{
                    value: "Steps",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Bar dataKey="activity" name="Steps" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Day
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Mood
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Activity (steps)
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sleep (hrs)
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Water (glasses)
              </th>
            </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData.map((dayData: any, index: number) => (
              <tr key={index}>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {dayData.day}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <MoodIcon value={dayData.mood} />
                    <span>{dayData.mood}/5</span>
                  </div>
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {dayData.activity.toLocaleString()}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {dayData.sleep}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {dayData.water}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HealthDashboard;
