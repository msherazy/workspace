"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FiMoon, FiSun } from "react-icons/fi"
import confetti from "canvas-confetti"

type Attempt = {
    reactionTime: number
    timestamp: string
}

export default function ReactionSpeedGame() {
    const [theme, setTheme] = useState<"light" | "dark">("dark")
    const [status, setStatus] = useState<"idle" | "countdown" | "waiting" | "active" | "tooSoon">("idle")
    const [reactionStart, setReactionStart] = useState<number | null>(null)
    const [reactionTime, setReactionTime] = useState<number | null>(null)
    const [attempts, setAttempts] = useState<Attempt[]>([])
    const [countdown, setCountdown] = useState<number>(3)
    const [boxColor, setBoxColor] = useState<string>("")
    const [error, setError] = useState("")

    useEffect(() => {
        const stored = localStorage.getItem("theme")
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        const initial = stored || (prefersDark ? "dark" : "light")
        setTheme(initial as "dark" | "light")
        document.documentElement.classList.add(initial)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        document.documentElement.classList.remove(theme)
        document.documentElement.classList.add(newTheme)
        localStorage.setItem("theme", newTheme)
    }

    const startGame = () => {
        setStatus("countdown")
        setReactionTime(null)
        setError("")
        setCountdown(3)
    }

    useEffect(() => {
        if (status === "countdown") {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        setStatus("waiting")
                        const wait = Math.random() * 3000 + 1000
                        setTimeout(() => {
                            setBoxColor(`hsl(${Math.random() * 360}, 90%, 60%)`)
                            setReactionStart(Date.now())
                            setStatus("active")
                        }, wait)
                    }
                    return prev - 1
                })
            }, 1000)
        }
    }, [status])

    const handleClick = () => {
        if (status === "waiting") {
            setError("Too Soon! Wait for the box to glow.")
            setStatus("tooSoon")
            setTimeout(() => setStatus("idle"), 1500)
        } else if (status === "active" && reactionStart) {
            const time = Date.now() - reactionStart
            const newAttempt = {
                reactionTime: time,
                timestamp: new Date().toLocaleTimeString(),
            }
            const updated = [newAttempt, ...attempts].slice(0, 10)
            setAttempts(updated)
            setReactionTime(time)
            setStatus("idle")

            if (updated.length === 1 || time < Math.min(...updated.map((a) => a.reactionTime))) {
                confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } })
            }
        }
    }

    const resetGame = () => {
        setAttempts([])
        setReactionTime(null)
        setStatus("idle")
        setError("")
    }

    const average = attempts.length
        ? Math.round(attempts.reduce((acc, a) => acc + a.reactionTime, 0) / attempts.length)
        : 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white transition font-sans">
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-5xl font-extrabold tracking-tight neon-text">⚡ Reaction Arena</h1>
                    <button
                        onClick={toggleTheme}
                        className="text-2xl p-2 rounded-full hover:bg-slate-800 transition"
                    >
                        {theme === "dark" ? <FiSun /> : <FiMoon />}
                    </button>
                </div>

                <div className="bg-black bg-opacity-30 rounded-xl p-8 shadow-inner backdrop-blur-md border border-slate-700 mb-10 text-center space-y-6">
                    {status === "idle" && (
                        <>
                            <p className="text-lg text-slate-400">Get ready to test your reflexes.</p>
                            <button
                                onClick={startGame}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold tracking-wide transition"
                            >
                                Start Game
                            </button>
                        </>
                    )}

                    {status === "countdown" && (
                        <motion.h2
                            className="text-6xl font-extrabold text-indigo-400 animate-pulse"
                            key={countdown}
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1.1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {countdown}
                        </motion.h2>
                    )}

                    {status === "waiting" && (
                        <motion.div className="h-52 rounded-lg border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-xl font-medium text-slate-400">
                            Wait for the glow...
                        </motion.div>
                    )}

                    {status === "active" && (
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleClick}
                            style={{
                                backgroundColor: boxColor,
                                boxShadow: `0 0 20px 5px ${boxColor}`,
                            }}
                            className="h-52 rounded-lg flex items-center justify-center text-3xl font-bold text-white cursor-pointer transition-all duration-200"
                        >
                            CLICK NOW!
                        </motion.div>
                    )}

                    {status === "tooSoon" && (
                        <motion.div className="text-red-500 font-semibold animate-pulse">{error}</motion.div>
                    )}
                </div>

                {reactionTime !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-6 text-center"
                    >
                        <h2 className="text-3xl font-bold">
                            ⚡ Your Speed: <span className="text-indigo-300">{reactionTime} ms</span>
                        </h2>
                    </motion.div>
                )}

                {attempts.length > 0 && (
                    <motion.div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl border border-slate-700 p-6 shadow-inner space-y-4">
                        <h2 className="text-xl font-bold border-b border-slate-700 pb-2">🏆 Leaderboard</h2>
                        <p className="text-sm text-slate-400">
                            Avg Speed: {average} ms | Attempts: {attempts.length}
                        </p>
                        {attempts.map((a, i) => (
                            <div
                                key={i}
                                className="flex justify-between items-center bg-slate-800 rounded-lg px-4 py-2 border border-slate-700"
                            >
                                <div>
                                    <span className="text-indigo-300 font-semibold">{a.reactionTime} ms</span>
                                    <span className="text-xs text-slate-400 ml-2">{a.timestamp}</span>
                                </div>
                                <div className="text-2xl">
                                    {i === 0 && "🥇"}
                                    {i === 1 && "🥈"}
                                    {i === 2 && "🥉"}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {attempts.length > 0 && (
                    <div className="mt-10 flex justify-center gap-4">
                        <button
                            onClick={startGame}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            Play Again
                        </button>
                        <button
                            onClick={resetGame}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Reset
                        </button>
                    </div>
                )}
            </div>

            <style jsx global>{`
        .neon-text {
          text-shadow: 0 0 8px #8be9fd, 0 0 16px #8be9fd, 0 0 24px #8be9fd;
        }
      `}</style>
        </div>
    )
}