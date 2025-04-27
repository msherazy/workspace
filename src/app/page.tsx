"use client";

import React, {useMemo, useState} from "react";

// Mock Data
const TEAMS = [
    {
        id: 1,
        name: "Engineering",
        employees: [
            { id: 101, name: "Sarah Lin", kpi: 78, salary: 120000 },
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
            { id: 204, name: "Ella Novak", kpi: 49, salary: 83000 },
        ],
    },
    {
        id: 3,
        name: "Customer Support",
        employees: [
            { id: 301, name: "Chris Evans", kpi: 72, salary: 60000 },
            { id: 302, name: "Ana Souza", kpi: 61, salary: 62000 },
            { id: 303, name: "Tom Reed", kpi: 34, salary: 58000 },
            { id: 304, name: "Pooja Kumar", kpi: 83, salary: 63000 },
        ],
    },
];

// Helper functions
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
            e.name.toLowerCase().includes(filterRole.toLowerCase())
        );
    }
    return emps;
}

export default function WorkforceKPIDashboard() {
    const [dark, setDark] = useState(false);
    const [filterTeam, setFilterTeam] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [layoffPct, setLayoffPct] = useState(10); // bottom X% performers

    // Get filtered employees
    const employees = useMemo(
        () => getAllEmployees(filterTeam, filterRole),
        [filterTeam, filterRole]
    );

    // Determine who gets laid off
    const layoffCount = Math.floor((layoffPct / 100) * employees.length);
    const sortedByKPI = [...employees].sort((a, b) => a.kpi - b.kpi);
    const laidOff = sortedByKPI.slice(0, layoffCount);
    const remaining = sortedByKPI.slice(layoffCount);

    // Stats
    const totalSalaries = employees.reduce((sum, e) => sum + e.salary, 0);
    const layoffSavings = laidOff.reduce((sum, e) => sum + e.salary, 0);
    const remainingSalaries = remaining.reduce((sum, e) => sum + e.salary, 0);

    // Colors for dark/light
    const bg = dark ? "bg-gray-900" : "bg-gray-100";
    const card = dark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900";
    const border = dark ? "border-gray-700" : "border-gray-200";
    const accent = dark ? "bg-pink-600" : "bg-blue-600";
    const label = dark ? "text-gray-300" : "text-gray-600";
    const chip = dark
        ? "bg-gray-700 text-gray-100"
        : "bg-gray-200 text-gray-800";

    // KPI chart bars
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
            <div className="flex items-center">
                <div
                    className={`${color} h-3 rounded transition-all`}
                    style={{ width: `${value}%`, minWidth: 20 }}
                ></div>
                <span className="ml-2 text-xs font-mono">{value}</span>
            </div>
        );
    }

    // Recommendations
    const riskWarn =
        layoffCount > 0 && laidOff.some((e) => e.kpi > 50)
            ? "Warning: Laying off these employees may impact overall team performance."
            : "";

    // Responsive
    const gridCols =
        employees.length < 8
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

    return (
        <div className={`${bg} min-h-screen transition-colors duration-300`}>
            {/* Header */}
            <header
                className={`flex items-center justify-between px-6 py-4 shadow-sm ${card}`}
            >
                <div className="flex items-center space-x-2">
          <span className="font-extrabold text-lg tracking-tight">
            Workforce KPI Dashboard
          </span>
                    <span className={`${chip} rounded-full px-2 py-0.5 text-xs ml-2`}>
            Layoff Simulation
          </span>
                </div>
                <button
                    className={`rounded-full px-3 py-1 border ${border} ${
                        dark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    } transition`}
                    onClick={() => setDark((d) => !d)}
                    aria-label="Toggle dark mode"
                >
                    {dark ? "🌞" : "🌙"}
                </button>
            </header>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 p-6">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <select
                        value={filterTeam}
                        onChange={(e) => setFilterTeam(e.target.value)}
                        className={`rounded border ${border} px-3 py-2 ${card}`}
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
                        className={`rounded border ${border} px-3 py-2 ${card}`}
                    />
                </div>
                <div className="flex flex-col items-start md:items-end">
                    <label className={`${label} text-xs`}>Layoff: bottom {layoffPct}%</label>
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

            {/* Main content */}
            <div className={`px-6 py-2 grid gap-6 ${gridCols}`}>
                {/* KPI Table */}
                <section
                    className={`col-span-2 ${card} rounded-2xl p-6 shadow border ${border}`}
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
                            {sortedByKPI.map((emp) => {
                                const isLaidOff = laidOff.some((e) => e.id === emp.id);
                                return (
                                    <tr
                                        key={emp.id}
                                        className={
                                            isLaidOff
                                                ? "bg-red-50 dark:bg-red-900/30"
                                                : "hover:bg-blue-50 dark:hover:bg-gray-700/40 transition"
                                        }
                                    >
                                        <td className="py-2 font-semibold">{emp.name}</td>
                                        <td>{emp.team}</td>
                                        <td>
                                            <KPIBar value={emp.kpi} />
                                        </td>
                                        <td>
                                            ${emp.salary.toLocaleString("en-US", {
                                            maximumFractionDigits: 0,
                                        })}
                                        </td>
                                        <td>
                                            {isLaidOff ? (
                                                <span className="bg-red-500 text-white rounded px-2 py-1 text-xs font-bold">
                            Laid Off
                          </span>
                                            ) : (
                                                <span className="bg-green-500 text-white rounded px-2 py-1 text-xs font-bold">
                            Retained
                          </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Impact + Visualization */}
                <section
                    className={`col-span-1 flex flex-col gap-4 ${card} rounded-2xl p-6 shadow border ${border}`}
                >
                    <h2 className="font-bold text-lg mb-2">Impact Overview</h2>
                    <div className="space-y-2">
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
                    </div>
                    <hr className={border} />
                    {/* Mini KPI Histogram */}
                    <div>
                        <span className={label}>Performance Distribution</span>
                        <div className="flex space-x-1 mt-2 h-14">
                            {[0, 20, 40, 60, 80].map((low, i) => {
                                const high = low + 20;
                                const count = employees.filter(
                                    (e) => e.kpi >= low && e.kpi < high
                                ).length;
                                const isActive =
                                    layoffCount > 0 &&
                                    laidOff.some((e) => e.kpi >= low && e.kpi < high);
                                return (
                                    <div
                                        key={i}
                                        className={`flex-1 flex flex-col items-center ${
                                            isActive
                                                ? "bg-red-400/60 dark:bg-red-700/60"
                                                : "bg-gray-400/20 dark:bg-gray-700/40"
                                        } rounded`}
                                    >
                                        <div
                                            className="w-4"
                                            style={{ height: 10 + count * 10 }}
                                            title={`KPI ${low}-${high - 1}: ${count}`}
                                        ></div>
                                        <span className="text-xs">{low}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Warnings */}
                    {riskWarn && (
                        <div className="mt-2 text-sm text-yellow-600 bg-yellow-100 dark:bg-yellow-800/40 rounded p-2">
                            {riskWarn}
                        </div>
                    )}
                </section>
            </div>
            {/* Recommendations */}
            <div className="p-6 pt-0 max-w-2xl mx-auto">
                <div
                    className={`${card} border ${border} rounded-2xl px-6 py-4 shadow-sm mt-8`}
                >
                    <div className="font-bold mb-2">Smart Recommendations</div>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>
                            Consider upskilling or transferring employees before finalizing layoffs.
                        </li>
                        <li>
                            Review at-risk teams with high layoff impact to avoid critical skill loss.
                        </li>
                        <li>
                            Aim for balanced retention across departments for business stability.
                        </li>
                        <li>
                            If KPIs drop below a threshold, project delivery may be at risk.
                        </li>
                    </ul>
                </div>
                <footer className="mt-10 text-xs text-center text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} Workforce KPI Dashboard | Demo
                </footer>
            </div>
        </div>
    );
}
