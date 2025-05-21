"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Inter } from "next/font/google";

// Inter font setup
const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const TEAMS = [
  {
    id: 1,
    name: "Engineering",
    employees: [
      { id: 102, name: "Alex Kim", kpi: 52, salary: 90000 },
      { id: 103, name: "Ravi Patel", kpi: 43, salary: 110000 },
      { id: 104, name: "Jade Lee", kpi: 90, salary: 95000 },
    ],
  },
  {
    id: 2,
    name: "Sales",
    employees: [
      { id: 201, name: "Maria Garcia", kpi: 66, salary: 80000 },
      { id: 202, name: "Ben Turner", kpi: 39, salary: 85000 },
      { id: 203, name: "Lena Wang", kpi: 88, salary: 97000 },
    ],
  },
  {
    id: 3,
    name: "Customer Support",
    employees: [
      { id: 302, name: "Ana Souza", kpi: 61, salary: 62000 },
      { id: 303, name: "Tom Reed", kpi: 34, salary: 58000 },
      { id: 304, name: "Pooja Kumar", kpi: 83, salary: 63000 },
    ],
  },
];

function getAllEmployees(filterTeam: string, filterRole: string) {
  let emps: any[] = [];
  TEAMS.forEach((team) => {
    if (!filterTeam || team.name === filterTeam) {
      team.employees.forEach((emp) => {
        emps.push({ ...emp, team: team.name });
      });
    }
  });
  if (filterRole) {
    emps = emps.filter((e) =>
      e.name.toLowerCase().includes(filterRole.toLowerCase()),
    );
  }
  return emps;
}

const cardAnim = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0.14, duration: 0.6 },
  },
};
const rowAnim = {
  hidden: { opacity: 0, x: -18 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, type: "spring", stiffness: 60, damping: 13 },
  }),
};
const chipAnim = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 350, damping: 20 },
  },
};
const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.14, duration: 0.38 } },
};

export default function WorkforceKPIDashboard() {
  const [dark, setDark] = useState(false);
  const [filterTeam, setFilterTeam] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [layoffPct, setLayoffPct] = useState(10);

  const employees = useMemo(
    () => getAllEmployees(filterTeam, filterRole),
    [filterTeam, filterRole],
  );

  const layoffCount = Math.floor((layoffPct / 100) * employees.length);
  const sortedByKPI = [...employees].sort((a, b) => a.kpi - b.kpi);
  const laidOff = sortedByKPI.slice(0, layoffCount);
  const remaining = sortedByKPI.slice(layoffCount);

  const layoffSavings = laidOff.reduce((sum, e) => sum + e.salary, 0);
  const remainingSalaries = remaining.reduce((sum, e) => sum + e.salary, 0);

  const bg = dark
    ? "bg-[#18192A]"
    : "bg-gradient-to-br from-[#e5ecfb] to-[#f3f7fa]";
  const card = dark ? "bg-[#23243a] text-[#eef0fa]" : "bg-white text-[#21243b]";
  const border = dark ? "border-[#2c2d47]" : "border-[#d7def8]";
  const label = dark ? "text-[#b7bcd7]" : "text-[#475274]";
  const chip = dark
    ? "bg-[#383b5c] text-[#f0efff]"
    : "bg-[#e5ecfa] text-[#2c3654]";

  function KPIBar({ value }: { value: number }) {
    const color =
      value < 40
        ? "bg-red-500"
        : value < 60
          ? "bg-yellow-400"
          : value < 80
            ? "bg-blue-400"
            : "bg-green-500";
    return (
      <motion.div
        className="flex items-center"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        style={{ minWidth: 30 }}
      >
        <div className={`${color} h-3 rounded`} style={{ width: "100%" }} />
        <span className="ml-2 text-xs font-mono">{value}</span>
      </motion.div>
    );
  }

  const riskWarn =
    layoffCount > 0 && laidOff.some((e) => e.kpi > 50)
      ? "Warning: Laying off these employees may impact overall team performance."
      : "";

  return (
    <div className={`${inter.className} ${bg} min-h-screen flex flex-col`}>
      {/* Header */}
      <motion.header
        className={`w-full shadow-sm ${card} border-b ${border} px-4 sm:px-6 pt-4 pb-4`}
        variants={cardAnim}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight block">
              Workforce KPI Dashboard
            </span>
          </div>
          <motion.button
            className={`rounded-full px-3 py-1 border ${border} ${
              dark ? "hover:bg-[#2c2d47]" : "hover:bg-[#e0e8fa]"
            } transition shadow`}
            whileTap={{ scale: 0.88, rotate: -8 }}
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
          >
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: dark ? 180 : 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-block"
            >
              {dark ? "🌞" : "🌙"}
            </motion.span>
          </motion.button>
        </div>
      </motion.header>

      {/* Main content container */}
      <div className="w-full max-w-5xl mx-auto flex-1 px-3 sm:px-6 md:px-8 py-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className={`rounded-lg border ${border} px-4 py-2 ${card} shadow focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              <option value="">All Teams</option>
              {TEAMS.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Filter by name or role"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={`rounded-lg border ${border} px-4 py-2 ${card} shadow focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
          </div>
          <div className="flex flex-col items-start md:items-end">
            <label className={`${label} text-xs`}>
              Layoff: bottom {layoffPct}%
            </label>
            <input
              type="range"
              min={0}
              max={50}
              step={5}
              value={layoffPct}
              onChange={(e) => setLayoffPct(Number(e.target.value))}
              className="w-40 accent-pink-500 mt-1"
            />
          </div>
        </div>

        {/* Main content grid (2 columns on md+, 1 col on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Employee Performance */}
          <motion.section
            className={`w-full ${card} rounded-2xl p-6 shadow-lg border ${border}`}
            variants={cardAnim}
            initial="hidden"
            animate="visible"
          >
            <h2 className="font-bold text-lg mb-4">Employee Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`${label}`}>
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Team</th>
                    <th className="text-left py-2">KPI</th>
                    <th className="text-left py-2">Salary</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {sortedByKPI.map((emp, i) => {
                      const isLaidOff = laidOff.some((e) => e.id === emp.id);
                      return (
                        <motion.tr
                          key={emp.id}
                          variants={rowAnim}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          custom={i}
                          className={
                            isLaidOff
                              ? "bg-red-100 text-red-800 dark:bg-red-700/40 dark:text-red-100 font-semibold"
                              : "hover:bg-blue-100 dark:hover:bg-[#23243a] transition"
                          }
                        >
                          <td className="py-2 font-semibold">{emp.name}</td>
                          <td>{emp.team}</td>
                          <td>
                            <KPIBar value={emp.kpi} />
                          </td>
                          <td>
                            $
                            {emp.salary.toLocaleString("en-US", {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                          <td>
                            <motion.span
                              className={
                                isLaidOff
                                  ? "bg-red-500 text-white rounded px-2 py-1 text-xs font-bold shadow"
                                  : "bg-green-500 text-white rounded px-2 py-1 text-xs font-bold shadow"
                              }
                              initial={{ scale: 0.7, opacity: 0.7 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 12,
                                delay: i * 0.025,
                              }}
                            >
                              {isLaidOff ? "Laid Off" : "Retained"}
                            </motion.span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* Impact Overview */}
          <motion.section
            className={`w-full ${card} rounded-2xl p-6 shadow-lg border ${border}`}
            variants={cardAnim}
            initial="hidden"
            animate="visible"
          >
            <h2 className="font-bold text-lg mb-2">Impact Overview</h2>
            <motion.div
              className="space-y-2 mb-3"
              variants={fade}
              initial="hidden"
              animate="visible"
            >
              <div>
                <span className={label}>Total Employees:</span>{" "}
                <span className="font-bold">{employees.length}</span>
              </div>
              <div>
                <span className={label}>Laid Off:</span>{" "}
                <span className="font-bold text-red-500">{layoffCount}</span>
              </div>
              <div>
                <span className={label}>Cost Savings:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-pink-400">
                  ${layoffSavings.toLocaleString("en-US")}
                </span>
              </div>
              <div>
                <span className={label}>Remaining Salary Cost:</span>{" "}
                <span className="font-bold">
                  ${remainingSalaries.toLocaleString("en-US")}
                </span>
              </div>
              <div>
                <span className={label}>Average KPI (Remaining):</span>{" "}
                <span className="font-bold">
                  {remaining.length
                    ? (
                        remaining.reduce((sum, e) => sum + e.kpi, 0) /
                        remaining.length
                      ).toFixed(1)
                    : "-"}
                </span>
              </div>
            </motion.div>
            <hr className={border} />
            {/* Mini KPI Histogram */}
            <motion.div variants={fade} initial="hidden" animate="visible">
              <span className={label}>Performance Distribution</span>
              <div className="flex space-x-2 mt-4 h-14 justify-center">
                {[0, 20, 40, 60, 80].map((low, i) => {
                  const high = low + 20;
                  const count = employees.filter(
                    (e) => e.kpi >= low && e.kpi < high,
                  ).length;
                  const isActive =
                    layoffCount > 0 &&
                    laidOff.some((e) => e.kpi >= low && e.kpi < high);
                  return (
                    <motion.div
                      key={i}
                      className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg font-semibold text-base
                        ${
                          isActive
                            ? "bg-pink-300 text-gray-800"
                            : "bg-gray-200 text-gray-700"
                        }
                      `}
                      initial={{ scaleY: 0.2 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 160,
                        damping: 24,
                      }}
                    >
                      {low}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            {/* Warnings */}
            <AnimatePresence>
              {riskWarn && (
                <motion.div
                  className="mt-2 text-sm text-yellow-600 bg-yellow-100 dark:bg-yellow-800/40 rounded p-2"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.45 }}
                >
                  {riskWarn}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>

        {/* Recommendations */}
        <motion.div
          className={`w-full ${card} border ${border} rounded-2xl px-6 py-4 shadow-lg mb-12`}
          variants={fade}
          initial="hidden"
          animate="visible"
        >
          <div className="font-bold mb-2">Smart Recommendations</div>
          <ul className="list-disc pl-6 text-sm space-y-1">
            <li>
              Consider upskilling or transferring employees before finalizing
              layoffs.
            </li>
            <li>
              Review at-risk teams with high layoff impact to avoid critical
              skill loss.
            </li>
            <li>
              Aim for balanced retention across departments for business
              stability.
            </li>
            <li>
              If KPIs drop below a threshold, project delivery may be at risk.
            </li>
          </ul>
        </motion.div>
        <footer className="mb-6 pb-6 text-xs text-center text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Workforce KPI Dashboard | Demo
        </footer>
      </div>
    </div>
  );
}
