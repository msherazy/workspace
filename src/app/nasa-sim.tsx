"use client";

import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FiActivity, FiCloud, FiMapPin, FiMoon, FiSun } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 text-teal-200 p-2 rounded shadow">
        <p className="text-sm">{`Time: ${label}`}</p>
        <p className="text-sm">{`Temperature: ${payload[0].value} °K`}</p>
      </div>
    );
  }
  return null;
};

// Temperature Simulation Function
const simulateTemperature = (distance: number, atmosphere: number, surface: string) => {
  const surfaceFactors = {
    ocean: 0.8,
    forest: 0.9,
    desert: 1.1,
  };
  const baseTemp = 300 / distance;
  const adjusted = baseTemp * (1 + atmosphere * 0.05) * surfaceFactors[surface];
  return Math.round(adjusted);
};

const PlanetSim = () => {
  const [distance, setDistance] = useState(1);
  const [atmosphere, setAtmosphere] = useState(1);
  const [surface, setSurface] = useState("ocean");
  const [darkMode, setDarkMode] = useState(true);
  const [simulate, setSimulate] = useState(false);
  const [runCount, setRunCount] = useState(1);

  const temperature = simulateTemperature(distance, atmosphere, surface);
  const data = Array.from({ length: 10 }, (_, i) => ({
    time: `T+${i}s`,
    temperature: Number((temperature + Math.sin(i) * 1.2).toFixed(2)),
  }));

  const handleSimulation = () => {
    setSimulate(true);
    setRunCount(runCount + 1);
  };

  return (
    <div
      className={`${
        darkMode ? "dark bg-black text-gray-200" : "bg-white text-gray-900"
      } font-mono min-h-screen transition-all`}
    >
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold tracking-widest">NASA Planet simulating Console</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 border rounded-full transition ${
            darkMode
              ? "border-gray-600 hover:bg-gray-800 hover:ring-2 hover:ring-teal-400 text-yellow-300"
              : "border-gray-300 hover:bg-gray-100 hover:ring-2 hover:ring-teal-400 text-gray-700"
          }`}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

      </div>

      <div className="grid md:grid-cols-5 gap-8 px-6 py-8">
        {/* Control Panel */}
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-6 uppercase text-teal-400 tracking-wide">
            Control Interface
          </h2>

          <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-300 flex items-center gap-2">
              <FiMapPin /> Distance from Star (AU)
              <span className="ml-2 text-xs text-gray-400">(closer = hotter)</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full accent-teal-400"
            />
            <p className="mt-1 text-xs text-teal-300">Current: {distance} AU</p>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-300 flex items-center gap-2">
              <FiCloud /> Atmosphere Thickness
              <span className="ml-2 text-xs text-gray-400">(more = higher greenhouse effect)</span>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={atmosphere}
              onChange={(e) => setAtmosphere(Number(e.target.value))}
              className="w-full accent-teal-400"
            />
            <p className="mt-1 text-xs text-teal-300">Current: {atmosphere}</p>
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-sm text-gray-300 flex items-center gap-2">
              <FiActivity /> Surface Type
              <span className="ml-2 text-xs text-gray-400">(affects heat absorption)</span>
            </label>
            <select
              value={surface}
              onChange={(e) => setSurface(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 text-teal-200 p-2 rounded shadow"
            >
              <option value="ocean">Ocean</option>
              <option value="forest">Forest</option>
              <option value="desert">Desert</option>
            </select>
          </div>

          <button
            onClick={handleSimulation}
            className="w-full bg-teal-500 hover:bg-teal-600 text-black font-bold py-2 rounded"
          >
            Run Simulation
          </button>
        </div>

        {/* Output Panel */}
        <div className="md:col-span-3 bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold uppercase text-teal-400 tracking-wide">
              Telemetry Feed
            </h2>
            {simulate && (
              <span className="text-sm text-teal-200">Simulation #{runCount}</span>
            )}
          </div>

          <AnimatePresence>
            {simulate ? (
              <motion.div
                key="telemetry"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="text-5xl font-bold text-center mb-6 text-teal-300"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {temperature} °K
                </motion.div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="time" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#00f2ff"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            ) : (
              <motion.p
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500"
              >
                Awaiting simulation input...
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PlanetSim;