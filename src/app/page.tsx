// Final full fixed version

"use client";

import React, { useEffect, useState } from "react";
import { FiActivity, FiDollarSign, FiMoon, FiShoppingCart, FiSun, FiUsers } from "react-icons/fi";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Poppins } from "next/font/google";

// Set up Poppins font
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const salesData = [
  { name: 'Jan', sales: 4000, target: 3500 },
  { name: 'Feb', sales: 3000, target: 3200 },
  { name: 'Mar', sales: 5000, target: 4800 },
  { name: 'Apr', sales: 4500, target: 4200 },
  { name: 'May', sales: 6000, target: 5500 },
  { name: 'Jun', sales: 5500, target: 5800 },
];

const customerData = [
  { name: 'New', value: 400, color: '#8884d8' },
  { name: 'Returning', value: 300, color: '#82ca9d' },
  { name: 'Inactive', value: 300, color: '#ffc658' },
];

const salesDistribution = [
  { name: 'Online', value: 350, color: '#8884d8' },
  { name: 'In-Store', value: 250, color: '#82ca9d' },
  { name: 'Wholesale', value: 150, color: '#ffc658' },
];

const Dashboard = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className={`${poppins.className} bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen text-gray-900 dark:text-gray-100`}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Sales Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm md:text-base">Comprehensive overview of sales performance and customer metrics</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDark(!dark)}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {dark ? <FiSun /> : <FiMoon />}
            </button>
            <button className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors">
              Share Report
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors">
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: <FiShoppingCart />, label: "Total Sales", value: "$28,450", colorFrom: "indigo-600", colorTo: "violet-600" },
            { icon: <FiUsers />, label: "Active Customers", value: "1,245", colorFrom: "teal-600", colorTo: "emerald-600" },
            { icon: <FiDollarSign />, label: "Avg. Order Value", value: "$2,150", colorFrom: "amber-600", colorTo: "orange-600" },
            { icon: <FiActivity />, label: "Conversion Rate", value: "4.2%", colorFrom: "rose-600", colorTo: "pink-600" }
          ].map((card, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-full bg-opacity-20 bg-indigo-100 dark:bg-indigo-900">
                  {card.icon}
                </div>
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-1">{card.label}</h3>
              <p className={`text-3xl font-bold bg-gradient-to-r from-${card.colorFrom} to-${card.colorTo} bg-clip-text text-transparent`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl">
            <h2 className="text-lg font-semibold mb-6">Sales Performance</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl">
            <h2 className="text-lg font-semibold mb-6">Customer Distribution</h2>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  label
                  dataKey="value"
                  nameKey="name"
                >
                  {customerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl">
            <h2 className="text-lg font-semibold mb-6">Sales Channel Distribution</h2>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={salesDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  label
                  dataKey="value"
                  nameKey="name"
                >
                  {salesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl">
            <h2 className="text-lg font-semibold mb-6">Regional Sales Performance</h2>
            <div className="space-y-6">
              {[
                { region: 'North America', value: 55 },
                { region: 'Europe', value: 40 },
                { region: 'Asia Pacific', value: 30 },
                { region: 'Other Regions', value: 10 }
              ].map((region, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{region.region}</span>
                    <span className="font-semibold">{region.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-600 h-2 rounded-full"
                      style={{ width: `${region.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
