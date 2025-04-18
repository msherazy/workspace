"use client";

import {useCallback, useEffect, useMemo, useState} from 'react';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import {FaChartBar, FaWater} from 'react-icons/fa';
import {GiFarmTractor} from 'react-icons/gi';

// Data type for each crop data point.
interface CropDataPoint {
    name: string;
    [key: string]: number | string;
}

// Types for tooltip payload items.
interface PayloadItem {
    name: string;
    value: number;
    color?: string;
}

// Props for our custom tooltip component.
interface CustomTooltipProps {
    active?: boolean;
    payload?: PayloadItem[];
    label?: string;
}

// CustomTooltip component to display chart details.
// This component leverages proper types instead of using `any`.
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 border border-gray-200 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                <p className="font-bold">{label}</p>
                {payload.map((item, index) => (
                    <p key={index} style={{ color: item.color }}>
                        {item.name}: {new Intl.NumberFormat('en-US').format(item.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// API service for crop data.
// NOTE: Replace the simulated API call below with a real API call in production.
const cropDataService = {
    async getCropData(): Promise<CropDataPoint[]> {
        try {
            // Simulate API delay for demonstration purposes.
            await new Promise(resolve => setTimeout(resolve, 500));
            return [
                { name: 'Week 1', wheat: 100, corn: 200, water: 500, fertilizer: 100 },
                { name: 'Week 2', wheat: 120, corn: 250, water: 600, fertilizer: 120 },
                { name: 'Week 3', wheat: 150, corn: 300, water: 700, fertilizer: 150 },
                { name: 'Week 4', wheat: 180, corn: 350, water: 800, fertilizer: 180 },
            ];
        } catch (error) {
            console.error('Error fetching crop data:', error);
            throw error;
        }
    }
};

/*
  createTheme:
  Returns an object that centralizes Tailwind CSS class strings
  for theming (dark/light mode). This helps maintain consistent styling.
*/
const createTheme = (darkMode: boolean) => ({
    background: darkMode ? 'bg-slate-900' : 'bg-slate-50',
    text: {
        primary: darkMode ? 'text-slate-100' : 'text-slate-900',
        secondary: darkMode ? 'text-slate-300' : 'text-slate-600',
        tertiary: darkMode ? 'text-slate-400' : 'text-slate-500'
    },
    card: {
        container: darkMode ? 'bg-slate-800 shadow-md' : 'bg-white shadow',
        hover: darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50',
    },
    button: {
        primary: darkMode
            ? 'bg-blue-700 hover:bg-blue-600 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            : 'bg-blue-200 hover:bg-blue-300 text-slate-800 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50',
    },
    input: {
        select: darkMode
            ? 'bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-blue-500'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-blue-400',
    },
    chart: {
        bg: darkMode ? 'bg-slate-800' : 'bg-slate-100',
        stroke: darkMode ? '#ddd' : '#333',
        grid: darkMode ? '#555' : '#ccc',
    },
    transition: 'transition-colors duration-300',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
});

/*
  Dashboard Component:
  Main component that:
    - Fetches crop data (using a simulated API call, ready to be swapped with a real call)
    - Dynamically generates crop options
    - Handles dark mode toggling
    - Calculates summary metrics using useMemo to optimize performance
*/
const Dashboard = () => {
    const [cropData, setCropData] = useState<CropDataPoint[]>([]);
    const [cropOptions, setCropOptions] = useState<string[]>([]);
    // Initialize selectedCrop with 'none' to have a default fallback.
    const [selectedCrop, setSelectedCrop] = useState<string>('none');
    const [darkMode, setDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Memoize the theme object to avoid unnecessary recalculations.
    const theme = useMemo(() => createTheme(darkMode), [darkMode]);

    // useCallback optimizes fetchData by memoizing the function.
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await cropDataService.getCropData();
            setCropData(data);
            if (data.length > 0) {
                const keys = Object.keys(data[0]);
                // Derive crop options by filtering out non-crop keys.
                const crops = keys.filter(
                    key => key !== 'name' && key !== 'water' && key !== 'fertilizer'
                );
                setCropOptions(crops);
                // If no crops are available, set a fallback value.
                if (crops.length > 0) {
                    setSelectedCrop(crops[0]);
                } else {
                    setSelectedCrop('none');
                }
            }
        } catch (err) {
            setError('Failed to load crop data. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Retrieve dark mode preference from localStorage or system settings.
        const storedDarkMode = localStorage.getItem('darkMode');
        if (storedDarkMode !== null) {
            setDarkMode(storedDarkMode === 'true');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDarkMode(prefersDark);
        }
        fetchData();
    }, [fetchData]);

    const handleDarkModeToggle = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', String(newDarkMode));
    };

    const handleCropChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCrop(event.target.value);
    };

    // Compute summary metrics using useMemo for performance.
    // Explains that we're summing the numeric values from our dataset.
    const summaryMetrics = useMemo(() => {
        const totalYield = cropData.reduce((sum, week) => sum + (Number(week[selectedCrop]) || 0), 0);
        const totalWater = cropData.reduce((sum, week) => sum + (Number(week.water) || 0), 0);
        const totalFertilizer = cropData.reduce((sum, week) => sum + (Number(week.fertilizer) || 0), 0);
        return { totalYield, totalWater, totalFertilizer };
    }, [cropData, selectedCrop]);

    // Loading state with an accessible message.
    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme.background}`}>
                <div role="status" aria-live="polite" className={`flex flex-col items-center ${theme.text.primary}`}>
                    <svg className="animate-spin h-12 w-12 mb-4" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-lg">Loading dashboard data...</span>
                    <span className="text-sm mt-2">Please wait while we retrieve your information.</span>
                </div>
            </div>
        );
    }

    // Error state with a Retry button that calls fetchData.
    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${theme.background}`}>
                <div role="alert" aria-live="assertive" className="p-6 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md max-w-md w-full">
                    <h2 className="font-bold text-xl mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Error Loading Data
                    </h2>
                    <p className="mb-4">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={fetchData}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => (window.location.href = '/dashboard/help')}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Get Help
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main dashboard UI rendering.
    return (
        <div className={`${theme.background} min-h-screen font-sans ${theme.transition}`}>
            {/* Header */}
            <header className={`py-8 px-6 mb-10 border-b border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center ${theme.transition}`}>
                <div>
                    <h1 className={`text-4xl font-extrabold ${theme.text.primary}`}>Crop Dashboard</h1>
                    <p className={`mt-2 text-lg ${theme.text.secondary}`}>
                        Monitor your farm's performance at a glance.
                    </p>
                </div>
                <button
                    onClick={handleDarkModeToggle}
                    aria-label={`Switch to ${darkMode ? 'Light' : 'Dark'} Mode`}
                    className={`mt-4 sm:mt-0 px-4 py-2 rounded-md ${theme.transition} ${theme.button.primary} ${theme.focus}`}
                >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4" aria-label="Dashboard Content">
                {/* Summary Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10" aria-label="Performance Summary">
                    <div className="sr-only" id="performance-summary-heading">Performance Summary</div>
                    <div
                        className={`p-4 shadow rounded-lg flex items-center ${theme.transition} ${theme.card.container} ${theme.card.hover}`}
                        role="region"
                        aria-labelledby="crop-yield-heading"
                    >
                        <GiFarmTractor className="text-4xl text-green-500 mr-4" aria-hidden="true" />
                        <div>
                            <h2 id="crop-yield-heading" className={`text-sm ${theme.text.tertiary}`}>
                                Total {selectedCrop && selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} Yield
                            </h2>
                            <p className={`text-2xl font-semibold ${theme.text.primary}`}>
                                {new Intl.NumberFormat('en-US').format(summaryMetrics.totalYield)}
                            </p>
                        </div>
                    </div>
                    <div
                        className={`p-4 shadow rounded-lg flex items-center ${theme.transition} ${theme.card.container} ${theme.card.hover}`}
                        role="region"
                        aria-labelledby="water-usage-summary-heading"
                    >
                        <FaWater className="text-4xl text-blue-500 mr-4" aria-hidden="true" />
                        <div>
                            <h2 id="water-usage-summary-heading" className={`text-sm ${theme.text.tertiary}`}>
                                Total Water Usage
                            </h2>
                            <p className={`text-2xl font-semibold ${theme.text.primary}`}>
                                {new Intl.NumberFormat('en-US').format(summaryMetrics.totalWater)}
                            </p>
                        </div>
                    </div>
                    <div
                        className={`p-4 shadow rounded-lg flex items-center ${theme.transition} ${theme.card.container} ${theme.card.hover}`}
                        role="region"
                        aria-labelledby="fertilizer-usage-summary-heading"
                    >
                        <FaChartBar className="text-4xl text-purple-500 mr-4" aria-hidden="true" />
                        <div>
                            <h2 id="fertilizer-usage-summary-heading" className={`text-sm ${theme.text.tertiary}`}>
                                Total Fertilizer Usage
                            </h2>
                            <p className={`text-2xl font-semibold ${theme.text.primary}`}>
                                {new Intl.NumberFormat('en-US').format(summaryMetrics.totalFertilizer)}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Crop Output Section */}
                <section className="mb-10" aria-labelledby="crop-output-heading">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                        <h2 id="crop-output-heading" className={`text-3xl font-bold ${theme.text.primary}`}>
                            Crop Output
                        </h2>
                        <div className="mt-4 sm:mt-0 flex items-center">
                            <label htmlFor="crop-select" className={`mr-2 ${theme.text.secondary}`}>
                                Select Crop:
                            </label>
                            <select
                                id="crop-select"
                                value={selectedCrop}
                                onChange={handleCropChange}
                                className={`px-4 py-2 rounded-md ${theme.transition} ${theme.input.select} ${theme.focus}`}
                                aria-describedby="crop-select-help"
                            >
                                {cropOptions.length > 0 ? (
                                    cropOptions.map(crop => (
                                        <option key={crop} value={crop}>
                                            {crop.charAt(0).toUpperCase() + crop.slice(1)}
                                        </option>
                                    ))
                                ) : (
                                    <option value="none">No crops available</option>
                                )}
                            </select>
                            <span id="crop-select-help" className="sr-only">
                Select a crop to view its yield data in the chart below.
              </span>
                        </div>
                    </div>
                    <div
                        className={`w-full h-96 rounded-lg shadow p-4 ${theme.transition} ${theme.chart.bg}`}
                        aria-label={`${selectedCrop} yield chart`}
                        role="img"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={cropData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" stroke={theme.chart.stroke} tick={{ fill: theme.chart.stroke }} />
                                <YAxis stroke={theme.chart.stroke} tick={{ fill: theme.chart.stroke }} />
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey={selectedCrop}
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                    name={selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="sr-only" aria-live="polite">
                            Chart showing {selectedCrop} yield over time:{' '}
                            {cropData.map(week => `${week.name}: ${week[selectedCrop]} units. `)}
                        </div>
                    </div>
                </section>

                {/* Water and Fertilizer Usage Section */}
                <section className="mb-10" aria-labelledby="resource-usage-heading">
                    <h2 id="resource-usage-heading" className={`text-3xl font-bold mb-6 ${theme.text.primary}`}>
                        Water and Fertilizer Usage
                    </h2>
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div
                            className={`flex-1 p-4 rounded-lg shadow ${theme.transition} ${theme.card.container}`}
                            aria-labelledby="water-usage-heading"
                        >
                            <h3 id="water-usage-heading" className={`text-2xl font-semibold mb-2 ${theme.text.primary}`}>
                                Water Usage
                            </h3>
                            <div className="w-full h-60" aria-label="Water usage chart">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={cropData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                        <XAxis dataKey="name" stroke={theme.chart.stroke} />
                                        <YAxis stroke={theme.chart.stroke} />
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="water" stroke="#8884d8" strokeWidth={2} name="Water" />
                                    </LineChart>
                                </ResponsiveContainer>
                                <div className="sr-only" aria-live="polite">
                                    Chart showing water usage over time:{' '}
                                    {cropData.map(week => `${week.name}: ${week.water} units. `)}
                                </div>
                            </div>
                        </div>
                        <div
                            className={`flex-1 p-4 rounded-lg shadow ${theme.transition} ${theme.card.container}`}
                            aria-labelledby="fertilizer-usage-heading"
                        >
                            <h3 id="fertilizer-usage-heading" className={`text-2xl font-semibold mb-2 ${theme.text.primary}`}>
                                Fertilizer Usage
                            </h3>
                            <div className="w-full h-60" aria-label="Fertilizer usage chart">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={cropData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                        <XAxis dataKey="name" stroke={theme.chart.stroke} />
                                        <YAxis stroke={theme.chart.stroke} />
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="fertilizer" stroke="#ff7300" strokeWidth={2} name="Fertilizer" />
                                    </LineChart>
                                </ResponsiveContainer>
                                <div className="sr-only" aria-live="polite">
                                    Chart showing fertilizer usage over time:{' '}
                                    {cropData.map(week => `${week.name}: ${week.fertilizer} units. `)}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className={`py-6 text-center text-sm ${theme.transition} ${theme.text.tertiary} border-t border-slate-200 dark:border-slate-800`} role="contentinfo">
                <div className="container mx-auto px-4">
                    <p>&copy; {new Date().getFullYear()} Farm Dashboard. All rights reserved.</p>
                    <div className="mt-2 flex justify-center space-x-4">
                        <a href="/privacy" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                            Privacy Policy
                        </a>
                        <a href="/terms" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                            Terms of Service
                        </a>
                        <a href="/accessibility" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                            Accessibility
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;