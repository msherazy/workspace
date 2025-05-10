"use client";

import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import {
  FiActivity,
  FiArrowDownRight,
  FiArrowUpRight,
  FiDollarSign,
  FiMoon,
  FiShoppingCart,
  FiSun,
  FiUsers
} from "react-icons/fi";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
// Theme context setup
const ThemeContext = React.createContext({
  theme: "light",
  toggleTheme: () => {},
});

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = saved || (prefersDark ? "dark" : "light");
    setTheme(current);
    document.documentElement.classList.toggle("dark", current === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

interface StatItemProps {
  title: string;
  value: string;
  change: number;
  positive?: boolean;
}

interface ChartData {
  name: string;
  sales: number;
  profit: number;
}

const StatItem: React.FC<StatItemProps> = ({ title, value, change, positive = true }) => (
<div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-start space-x-4 transition-all duration-300 hover:shadow-md">
    <div className={`p-3 rounded-lg ${title === 'Total Sales' ? 'bg-emerald-50 text-emerald-500' :
      title === 'Total Profit' ? 'bg-teal-50 text-teal-500' :
        title === 'Conversion Rate' ? 'bg-sky-50 text-sky-500' : 'bg-indigo-50 text-indigo-500'}`}>
      {title === 'Total Sales' ? <FiShoppingCart size={20} /> :
        title === 'Total Profit' ? <FiDollarSign size={20} /> :
          title === 'Conversion Rate' ? <FiActivity size={20} /> : <FiUsers size={20} />}
    </div>
    <div>
      <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">{title}</p>
      <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2 font-mono tracking-tight">{value}</p>
      <div className={`flex items-center mt-2 text-sm ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {positive ? <FiArrowUpRight size={16} className="mr-1" /> : <FiArrowDownRight size={16} className="mr-1" />}
        <span>{Math.abs(change)}%</span>
        <span className="ml-2 text-gray-500">vs last period</span>
      </div>
    </div>
  </div>
);

const salesData: ChartData[] = [
  { name: 'Jan', sales: 2400, profit: 1200 },
  { name: 'Feb', sales: 3200, profit: 1500 },
  { name: 'Mar', sales: 2800, profit: 1400 },
  { name: 'Apr', sales: 3600, profit: 1800 },
  { name: 'May', sales: 3400, profit: 1700 },
  { name: 'Jun', sales: 4000, profit: 2000 },
];

const Dashboard: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [, setWindowWidth] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerClass = `max-w-7xl mx-auto p-8 transition-all duration-300 ${mounted ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Head>
        <title>Modern Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className={`bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-10 ${mounted ? 'animate-fadeInDown' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gradient-to-r from-sky-500 to-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-md">
                <FiActivity className="text-white w-6 h-6" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white  tracking-tight">Modern Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 hidden md:block">Business analytics and reporting</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm">
                <FiShoppingCart className="text-gray-600 dark:text-gray-300 w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm">
                <FiUsers className="text-gray-600 dark:text-gray-300 w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm">
                <FiDollarSign className="text-gray-600 dark:text-gray-300 w-5 h-5" />
              </button>

              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                {theme === 'light' ? (
                  <FiMoon className="text-gray-600 dark:text-gray-300 w-5 h-5" />
                ) : (
                  <FiSun className="text-yellow-400 w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>


      <main className={containerClass}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="inline-flex self-start bg-white border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'overview'
                  ? 'text-white bg-gradient-to-r from-sky-500 to-indigo-600 shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'analytics'
                  ? 'text-white bg-gradient-to-r from-sky-500 to-indigo-600 shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Analytics
            </button>
          </div>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <button className="px-4 py-2.5 bg-white border text-gray-900 border-gray-200 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
              Last 30 days
            </button>
            <button className="px-4 py-2.5 bg-white dark:text-gray-900 border border-gray-200 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
              This Quarter
            </button>
            <button className="px-4 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all">
              Download Report
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatItem title="Total Sales" value="$24,780" change={12} positive={true} />
              <StatItem title="Total Profit" value="$8,230" change={8} positive={true} />
              <StatItem title="Conversion Rate" value="3.2%" change={-5} positive={false} />
              <StatItem title="Active Customers" value="1,450" change={15} positive={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Analytics</h2>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-sky-50 text-sky-500 rounded-lg text-xs font-medium hover:bg-sky-100 transition-colors">
                      Weekly
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                      Monthly
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                      Yearly
                    </button>
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.34}/>
                          <stop offset="75%" stopColor="#0ea5e9" stopOpacity={0.12}/>
                          <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.34}/>
                          <stop offset="75%" stopColor="#14b8a6" stopOpacity={0.12}/>
                          <stop offset="100%" stopColor="#14b8a6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dx={-10}
                        tickFormatter={(value) => `$${value/1000}k`}
                      />
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                          color: theme === 'dark' ? '#f9fafb' : '#1f2937',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                          border: 'none',
                          padding: '16px'
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                        labelFormatter={(label: string) => (
                          <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                        )}
                      />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#0ea5e9"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorSales)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }}
                        dot={{ r: 4, strokeWidth: 0, fill: '#0ea5e9' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="#14b8a6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorProfit)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#14b8a6' }}
                        dot={{ r: 4, strokeWidth: 0, fill: '#14b8a6' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Products</h2>
                <div className="space-y-4">
                  {[
                    { name: 'Premium Subscription', sales: 4200, percent: 34 },
                    { name: 'Enterprise Plan', sales: 3800, percent: 28 },
                    { name: 'Basic Membership', sales: 2400, percent: 22 },
                    { name: 'Add-on Services', sales: 1800, percent: 16 },
                  ].map((product, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{product.name}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">${product.sales}</span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-100 dark:bg-gray-700">
                        <div
                          style={{ width: `${product.percent}%` }}
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                            index === 0 ? 'bg-gradient-to-r from-sky-500 to-indigo-500' :
                              index === 1 ? 'bg-gradient-to-r from-teal-500 to-emerald-500' :
                                index === 2 ? 'bg-gradient-to-r from-sky-500 to-teal-500' :
                                  'bg-gradient-to-r from-indigo-500 to-sky-500'
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest transactions and events</p>
                </div>
                <button className="px-4 py-2 bg-sky-50 text-sky-500 rounded-lg text-sm font-medium hover:bg-sky-100 transition-colors self-start md:self-auto">
                  View All Activity
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    { id: 'INV001', customer: 'John Doe', amount: 1200, status: 'Completed', date: '2023-06-15', color: 'bg-emerald-50 text-emerald-700' },
                    { id: 'INV002', customer: 'Jane Smith', amount: 800, status: 'Pending', date: '2023-06-14', color: 'bg-amber-50 text-amber-700' },
                    { id: 'INV003', customer: 'Mike Johnson', amount: 1500, status: 'Completed', date: '2023-06-13', color: 'bg-emerald-50 text-emerald-700' },
                    { id: 'INV004', customer: 'Sarah Williams', amount: 500, status: 'Failed', date: '2023-06-12', color: 'bg-rose-50 text-rose-700' },
                  ].map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                        ${transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${transaction.color}`}>
                            {transaction.status}
                          </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                        {transaction.date}
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm ...">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Analytics Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-6 rounded-xl text-white shadow-md hover:shadow-lg transition-all duration-300">
                  <h3 className="text-sm font-medium uppercase tracking-wider mb-3">Total Revenue</h3>
                  <p className="text-3xl font-extrabold mb-2">$42,560</p>
                  <p className="text-sm text-indigo-100 mb-4">+12% from last quarter</p>
                  <div className="flex items-center text-sm text-white">
                    <FiArrowUpRight size={16} className="mr-1" />
                    <span>18% increase in sales</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 rounded-xl text-white shadow-md hover:shadow-lg transition-all duration-300">
                  <h3 className="text-sm font-medium uppercase tracking-wider mb-3">Active Customers</h3>
                  <p className="text-3xl font-extrabold mb-2">2,450</p>
                  <p className="text-sm text-emerald-100 mb-4">+8% from last quarter</p>
                  <div className="flex items-center text-sm text-white">
                    <FiArrowUpRight size={16} className="mr-1" />
                    <span>12% increase in subscriptions</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Performance Metrics</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer Acquisition</span>
                    <span className="text-sm font-bold text-sky-500">+25%</span>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-100">
                    <div
                      style={{ width: '25%' }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-sky-500 to-indigo-500"
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Retention Rate</span>
                    <span className="text-sm font-bold text-teal-500">+18%</span>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-100">
                    <div
                      style={{ width: '18%' }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-teal-500 to-emerald-500"
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average Order Value</span>
                    <span className="text-sm font-bold text-sky-500">+22%</span>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-100">
                    <div
                      style={{ width: '22%' }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-sky-500 to-teal-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className={`bg-white border-t dark:bg-gray-800 dark:border-gray-800 border-gray-100 darkmt-16 py-8 ${mounted ? 'animate-fadeInUp delay-300' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center">
              <FiActivity className="text-sky-500 w-5 h-5 mr-2" />
              <span className="text-sm font-medium text-gray-500 dark:text-white">© 2025 Modern Dashboard. All rights reserved.</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-sky-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-sky-500 transition-colors">Terms</a>
              <a href="#" className="hover:text-sky-500 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.5s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <Dashboard />
  </ThemeProvider>
);

export default App;
