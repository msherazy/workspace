"use client";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

// Color palettes for light and dark mode
const PALETTE = {
  light: {
    background: "#fef8f2",
    card: "#fae2cb",
    cardShadow: "#f1af6d",
    primary: "#a53860",
    accent: "#da627d",
    accentSoft: "#e9a1b0",
    text: "#502c07",
    secondaryText: "#661829",
    gridOn: "#a53860",
    gridOnIcon: "#ffe3e3",
    gridOff: "#fdf1e5",
    gridOffIcon: "#a53860",
    button: "#da627d",
    buttonText: "#fff",
    gridBorder: "#cd3052",
    solutionBg: "#a53860",
    solutionText: "#fff",
  },
  dark: {
    background: "#2a1421",
    card: "#3a2230",
    cardShadow: "#4e2641",
    primary: "#ffa5ab",
    accent: "#f1af6d",
    accentSoft: "#ffb6ba",
    text: "#ffe3e3",
    secondaryText: "#ffc8cc",
    gridOn: "#ffa5ab",
    gridOnIcon: "#3a2230",
    gridOff: "#3a2230",
    gridOffIcon: "#ffa5ab",
    button: "#f1af6d",
    buttonText: "#3a2230",
    gridBorder: "#ff505b",
    solutionBg: "#ffe3e3",
    solutionText: "#a53860",
  },
};

interface LightGrid {
  id: number;
  isActive: boolean;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  level: number;
  timestamp: number;
}

interface LevelConfig {
  gridSize: number;
  initialActiveLights: number;
  maxMoves: number;
}

const LEVELS: LevelConfig[] = [
  { gridSize: 3, initialActiveLights: 3, maxMoves: 5 },
  { gridSize: 4, initialActiveLights: 4, maxMoves: 7 },
  { gridSize: 5, initialActiveLights: 6, maxMoves: 10 },
  { gridSize: 6, initialActiveLights: 8, maxMoves: 14 },
  { gridSize: 7, initialActiveLights: 10, maxMoves: 18 },
];

const DEFAULT_NAME = "Anonymous";
const LEADERBOARD_STORAGE_KEY = "lightsOutLeaderboard";

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "mock1",
    name: "Alex",
    score: 340,
    level: 4,
    timestamp: Date.now() - 120000,
  },
  {
    id: "mock2",
    name: "Sam",
    score: 300,
    level: 3,
    timestamp: Date.now() - 80000,
  },
  {
    id: "mock3",
    name: "Jamie",
    score: 250,
    level: 3,
    timestamp: Date.now() - 50000,
  },
];

// Utils
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

const generateGrid = (size: number, initialActive: number): LightGrid[] => {
  const totalCells = size * size;
  const activeCells = new Set<number>();
  while (activeCells.size < initialActive) {
    const randomPos = Math.floor(Math.random() * totalCells);
    activeCells.add(randomPos);
  }
  return Array.from({ length: totalCells }, (_, index) => ({
    id: index,
    isActive: activeCells.has(index),
  }));
};

const getAdjacentCells = (index: number, size: number): number[] => {
  const x = Math.floor(index / size);
  const y = index % size;
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  return directions
    .map(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      return newX >= 0 && newX < size && newY >= 0 && newY < size
        ? newX * size + newY
        : null;
    })
    .filter((i): i is number => i !== null);
};

const isGridSolved = (grid: LightGrid[]) => !grid.some((cell) => cell.isActive);

export default function Home() {
  // Theme state and persistence
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("lightsOutTheme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("lightsOutTheme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const colors = PALETTE[theme];

  // Responsive
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Game state
  const [levelConfig, setLevelConfig] = useState<LevelConfig>(LEVELS[0]);
  const [grid, setGrid] = useState<LightGrid[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [solved, setSolved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState(DEFAULT_NAME);
  const [showIntro, setShowIntro] = useState(true);
  const [showLevelTransition, setShowLevelTransition] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [newHighScore, setNewHighScore] = useState(false);
  const [levelScore, setLevelScore] = useState(0);

  // Leaderboard: load and save
  useEffect(() => {
    const stored = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (stored) {
      try {
        setLeaderboard(JSON.parse(stored));
      } catch {
        setLeaderboard([]);
      }
    }
  }, []);

  const saveScore = (name: string, score: number, level: number) => {
    const newEntry: LeaderboardEntry = {
      id: generateId(),
      name,
      score,
      level,
      timestamp: Date.now(),
    };
    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setLeaderboard(updated);
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
  };

  // Grid init
  const initializeGrid = useCallback(() => {
    setGrid(
      generateGrid(levelConfig.gridSize, levelConfig.initialActiveLights),
    );
    setMoves(0);
    setSolved(false);
  }, [levelConfig]);

  useEffect(() => {
    if (!showIntro && !showLevelTransition) {
      initializeGrid();
    }
  }, [levelConfig, showIntro, showLevelTransition, initializeGrid]);

  // Solve check
  useEffect(() => {
    if (grid.length > 0 && !solved && isGridSolved(grid)) {
      setSolved(true);
      setShowConfetti(true);
      setNewHighScore(false);

      const newLevelScore = calculateScore(moves, levelConfig.gridSize);
      setLevelScore(newLevelScore);
      const newScore = score + newLevelScore;
      setScore(newScore);

      if (
        leaderboard.length < 10 ||
        newScore > leaderboard[leaderboard.length - 1]?.score
      ) {
        setNewHighScore(true);
        setShowNameInput(true);
      }

      setTimeout(() => {
        if (!showNameInput) setShowLevelTransition(true);
        setShowConfetti(false);
      }, 2500);
    }
  }, [
    grid,
    solved,
    moves,
    score,
    levelConfig.maxMoves,
    leaderboard,
    showNameInput,
  ]);

  const calculateScore = (movesMade: number, gridSize: number) => {
    const baseScore = 100;
    const perfectMoves = Math.ceil((gridSize * gridSize) / 2);
    const efficiency = Math.max(
      0,
      1 - (movesMade - perfectMoves) / (perfectMoves * 2),
    );
    return Math.round(baseScore * efficiency);
  };

  const toggleCell = (index: number) => {
    if (solved) return;
    const newGrid = [...grid];
    const cellsToToggle = [
      index,
      ...getAdjacentCells(index, levelConfig.gridSize),
    ];
    cellsToToggle.forEach((cellIndex) => {
      if (cellIndex >= 0 && cellIndex < newGrid.length) {
        newGrid[cellIndex].isActive = !newGrid[cellIndex].isActive;
      }
    });
    setGrid(newGrid);
    setMoves((prev) => prev + 1);
  };

  // Game event handlers
  const handleStartGame = () => {
    setShowIntro(false);
    initializeGrid();
  };

  const handleNextLevel = () => {
    setShowLevelTransition(false);
    setSolved(false);
    const idx = LEVELS.findIndex((l) => l.gridSize === levelConfig.gridSize);
    const nextIdx = idx + 1;
    if (nextIdx < LEVELS.length) {
      setLevelConfig(LEVELS[nextIdx]);
      setLevel((prev) => prev + 1);
      setMoves(0);
      initializeGrid();
    } else {
      setShowIntro(true);
      setLevel(1);
      setScore(0);
      setLevelConfig(LEVELS[0]);
    }
  };

  const handleNameSubmit = () => {
    if (!playerName.trim()) return;
    saveScore(playerName, score, level);
    setShowNameInput(false);
    setSolved(false);
    setShowLevelTransition(true);
  };

  // Accessibility: use an icon for ON/OFF, with ARIA
  const LightIcon = ({
    on,
    theme,
  }: {
    on: boolean;
    theme: "light" | "dark";
  }) =>
    on ? (
      <svg
        aria-label="Light is on"
        width="32"
        height="32"
        fill="none"
        viewBox="0 0 32 32"
      >
        <circle
          cx="16"
          cy="16"
          r="14"
          fill={PALETTE[theme].gridOnIcon}
          stroke={PALETTE[theme].gridOn}
          strokeWidth="3"
        />
        <rect
          x="14"
          y="8"
          width="4"
          height="10"
          rx="2"
          fill={PALETTE[theme].gridOn}
        />
      </svg>
    ) : (
      <svg
        aria-label="Light is off"
        width="32"
        height="32"
        fill="none"
        viewBox="0 0 32 32"
      >
        <circle
          cx="16"
          cy="16"
          r="14"
          fill={PALETTE[theme].gridOff}
          stroke={PALETTE[theme].gridBorder}
          strokeWidth="3"
        />
        <rect
          x="14"
          y="8"
          width="4"
          height="10"
          rx="2"
          fill={PALETTE[theme].gridBorder}
          opacity={0.35}
        />
      </svg>
    );

  const renderCell = (cell: LightGrid) => {
    const row = Math.floor(cell.id / levelConfig.gridSize);
    const col = cell.id % levelConfig.gridSize;
    const isTopRow = row === 0;
    const isBottomRow = row === levelConfig.gridSize - 1;
    const isLeftCol = col === 0;
    const isRightCol = col === levelConfig.gridSize - 1;
    return (
      <motion.div
        key={cell.id}
        onClick={() => toggleCell(cell.id)}
        whileTap={{ scale: 0.93 }}
        style={{
          background: cell.isActive ? colors.gridOn : colors.gridOff,
          border: `2.5px solid ${colors.gridBorder}`,
          borderRadius:
            isTopRow && isLeftCol
              ? "18px 0 0 0"
              : isTopRow && isRightCol
                ? "0 18px 0 0"
                : isBottomRow && isLeftCol
                  ? "0 0 0 18px"
                  : isBottomRow && isRightCol
                    ? "0 0 18px 0"
                    : "12px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 48,
          transition: "background 0.15s, border 0.15s",
        }}
        aria-label={cell.isActive ? "Light is on" : "Light is off"}
      >
        <LightIcon on={cell.isActive} theme={theme} />
      </motion.div>
    );
  };

  const renderGrid = () => (
    <div
      className="grid gap-2 p-5 rounded-xl shadow-xl"
      style={{
        background: colors.card,
        boxShadow: `0 8px 24px ${colors.cardShadow}`,
        gridTemplateColumns: `repeat(${levelConfig.gridSize}, minmax(36px, 1fr))`,
        display: "grid",
      }}
    >
      {grid.map(renderCell)}
    </div>
  );

  // Top-right theme toggle: show only on desktop
  const renderThemeToggle = () =>
    !isMobile ? (
      <div
        style={{
          position: "fixed",
          top: 24,
          right: 36,
          zIndex: 100,
        }}
      >
        <button
          aria-label={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          style={{
            background: theme === "dark" ? colors.card : colors.primary,
            color: theme === "dark" ? colors.primary : colors.card,
            fontWeight: 600,
            borderRadius: "999px",
            fontSize: "1rem",
            border: "none",
            padding: "0.52rem 1.35rem",
            boxShadow: `0 1px 8px ${colors.cardShadow}`,
            marginLeft: 8,
            cursor: "pointer",
          }}
        >
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
      </div>
    ) : null;

  // Bottom nav, only for mobile
  const renderBottomNav = () => (
    <motion.div
      className="fixed bottom-4 transform -translate-x-1/2 backdrop-blur-md p-2 rounded-full shadow-lg flex gap-2 z-50"
      style={{
        background: `${colors.card}a0`,
        boxShadow: `0 10px 25px -5px ${colors.cardShadow}`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <motion.button
        aria-label="Home"
        onClick={() => setShowIntro(true)}
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: colors.primary,
          color: colors.buttonText,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M3 12l9-9 9 9v7a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-3H9v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7z"
            stroke={colors.buttonText}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>
      <motion.button
        aria-label="Theme"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: theme === "dark" ? colors.button : colors.primary,
          color: colors.buttonText,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </motion.button>
    </motion.div>
  );

  const renderIntro = () => (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ background: colors.background }}
    >
      <motion.div
        className="p-8 rounded-2xl shadow-2xl text-center max-w-md"
        style={{
          background: colors.card,
          boxShadow: `0 18px 30px -10px ${colors.cardShadow}`,
        }}
        initial={{ scale: 0.93, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <motion.h1
          className="text-5xl font-bold mb-6"
          style={{
            color: colors.primary,
            fontFamily: "Playfair Display, serif",
          }}
        >
          Lights Out
        </motion.h1>
        <motion.p
          className="text-lg mb-7"
          style={{
            color: colors.secondaryText,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Turn off all the lights in as few moves as possible. Can you top the
          leaderboard?
        </motion.p>
        <motion.button
          onClick={handleStartGame}
          className="font-bold py-3 px-8 rounded-xl"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.accentSoft})`,
            color: colors.buttonText,
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.18rem",
            boxShadow: `0 2px 8px ${colors.cardShadow}`,
            border: "none",
            cursor: "pointer",
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
        >
          Start Game
        </motion.button>
      </motion.div>
    </motion.div>
  );

  const renderLevelTransition = () => (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ background: colors.background }}
    >
      <motion.div
        className="p-8 rounded-2xl shadow-2xl text-center max-w-md"
        style={{
          background: colors.card,
          boxShadow: `0 18px 30px -10px ${colors.cardShadow}`,
        }}
        initial={{ scale: 0.93, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl font-bold mb-5"
          style={{
            color: colors.primary,
            fontFamily: "Playfair Display, serif",
          }}
        >
          {newHighScore ? "New Record" : "Level Complete"}
        </motion.h2>
        <motion.div className="mb-5">
          <p
            className="text-lg"
            style={{
              color: colors.secondaryText,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Level {level} Complete
          </p>
          <p
            className="text-2xl font-bold mb-3"
            style={{
              color: colors.primary,
              fontFamily: "Playfair Display, serif",
            }}
          >
            Score: {score}
          </p>
          <p
            className="text-lg"
            style={{
              color: colors.secondaryText,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            You solved it in {moves} moves and earned {levelScore} points
          </p>
        </motion.div>
        <motion.button
          onClick={handleNextLevel}
          className="font-bold py-3 px-8 rounded-xl"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.accentSoft})`,
            color: colors.buttonText,
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.18rem",
            boxShadow: `0 2px 8px ${colors.cardShadow}`,
            border: "none",
            cursor: "pointer",
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
        >
          {level === LEVELS.length ? "Finish" : "Next Level"}
        </motion.button>
      </motion.div>
    </motion.div>
  );

  const renderNameInput = () => (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ background: colors.background }}
    >
      <motion.div
        className="p-8 rounded-2xl shadow-2xl text-center max-w-md"
        style={{
          background: colors.card,
          boxShadow: `0 18px 30px -10px ${colors.cardShadow}`,
        }}
        initial={{ scale: 0.93, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl font-bold mb-6"
          style={{
            color: colors.primary,
            fontFamily: "Playfair Display, serif",
          }}
        >
          New High Score
        </motion.h2>
        <motion.div className="mb-6 text-left">
          <label
            htmlFor="playerName"
            className="block text-sm font-medium mb-2"
            style={{
              color: colors.primary,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Enter your name for the leaderboard:
          </label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border"
            style={{
              background: colors.background,
              borderColor: colors.accentSoft,
              color: colors.primary,
              fontFamily: "Montserrat, sans-serif",
            }}
            placeholder="Your name"
            autoFocus
          />
        </motion.div>
        <motion.button
          onClick={handleNameSubmit}
          className="font-bold py-3 px-8 rounded-xl"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.accentSoft})`,
            color: colors.buttonText,
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.18rem",
            boxShadow: `0 2px 8px ${colors.cardShadow}`,
            border: "none",
            cursor: playerName.trim() ? "pointer" : "not-allowed",
            opacity: playerName.trim() ? 1 : 0.7,
          }}
          whileHover={{ scale: playerName.trim() ? 1.06 : 1 }}
          whileTap={{ scale: playerName.trim() ? 0.94 : 1 }}
          disabled={!playerName.trim()}
        >
          Save Score
        </motion.button>
      </motion.div>
    </motion.div>
  );

  const renderGame = () => (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ background: colors.background }}
    >
      <motion.div
        className="p-8 rounded-2xl shadow-2xl text-center max-w-md w-full"
        style={{
          background: colors.card,
          boxShadow: `0 18px 30px -10px ${colors.cardShadow}`,
        }}
        initial={{ scale: 0.93, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-5">
          <div>
            <p
              className="text-sm font-medium uppercase"
              style={{
                color: colors.primary,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Level {level}
            </p>
            <p
              className="text-xl font-bold"
              style={{
                color: colors.secondaryText,
                fontFamily: "Playfair Display, serif",
              }}
            >
              Score: {score}
            </p>
          </div>
          <div>
            <p
              className="text-sm font-medium uppercase"
              style={{
                color: colors.primary,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Moves
            </p>
            <p
              className="text-xl font-bold"
              style={{
                color: colors.secondaryText,
                fontFamily: "Playfair Display, serif",
              }}
            >
              {moves}
            </p>
          </div>
        </div>
        <div className="mb-6">{renderGrid()}</div>
        <div className="flex justify-between items-center">
          <motion.button
            aria-label="Quit"
            onClick={() => setShowIntro(true)}
            className="py-2 px-4 rounded-xl font-medium"
            style={{
              background: "none",
              color: colors.primary,
              fontFamily: "Montserrat, sans-serif",
              border: "none",
              cursor: "pointer",
            }}
            whileHover={{ scale: 1.07, color: colors.accent }}
          >
            Quit
          </motion.button>
          <div
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{
              background: colors.solutionBg,
              color: colors.solutionText,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {solved ? "Solved" : "Find a solution"}
          </div>
          <motion.button
            aria-label="Reset"
            onClick={initializeGrid}
            className="py-2 px-4 rounded-xl font-medium"
            style={{
              background: "none",
              color: colors.primary,
              fontFamily: "Montserrat, sans-serif",
              border: "none",
              cursor: "pointer",
            }}
            whileHover={{ scale: 1.07, color: colors.accent }}
          >
            Reset
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderLeaderboard = () => {
    const leaderboardToShow =
      leaderboard.length === 0 ? MOCK_LEADERBOARD : leaderboard;
    return (
      <motion.div
        className="p-6 rounded-2xl shadow-xl mb-8 w-full"
        style={{
          background: colors.card,
          boxShadow: `0 10px 25px -5px ${colors.cardShadow}`,
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          className="text-2xl font-bold mb-4"
          style={{
            color: colors.primary,
            fontFamily: "Playfair Display, serif",
          }}
        >
          Top 10 Scores
        </h2>
        <div className="space-y-2">
          {leaderboardToShow.map((entry, index) => (
            <motion.div
              key={entry.id || index}
              className="flex justify-between items-center p-3 rounded-xl"
              style={{
                background: `${colors.accentSoft}50`,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3"
                  style={{
                    background: colors.background,
                    color: colors.primary,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {index + 1}
                </span>
                <span
                  className="font-medium truncate max-w-[100px]"
                  style={{
                    color: colors.text,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {entry.name}
                </span>
              </div>
              <div className="text-right">
                <p
                  className="text-lg font-bold"
                  style={{
                    color: colors.primary,
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  {entry.score}
                </p>
                <p
                  className="text-xs"
                  style={{
                    color: colors.secondaryText,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Level {entry.level}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderInfoPanel = () => (
    <motion.div
      className="p-6 rounded-2xl shadow-xl w-full"
      style={{
        background: colors.card,
        boxShadow: `0 10px 25px -5px ${colors.cardShadow}`,
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2
        className="text-2xl font-bold mb-4"
        style={{
          color: colors.primary,
          fontFamily: "Playfair Display, serif",
        }}
      >
        How to Play
      </h2>
      <div className="space-y-4">
        {[
          // Steps as array for DRY code
          "Click any light to toggle it and its adjacent lights.",
          "Try to turn off all lights in as few moves as possible.",
          "Complete levels to earn points and climb the leaderboard.",
        ].map((text, i) => (
          <motion.div
            className="flex items-center"
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3"
              style={{
                background: colors.background,
                color: colors.primary,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {i + 1}
            </div>
            <p
              className="leading-relaxed"
              style={{
                color: colors.secondaryText,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {text}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderGameScreen = () => {
    if (showIntro) return renderIntro();
    if (showLevelTransition) return renderLevelTransition();
    if (showNameInput) return renderNameInput();
    return renderGame();
  };

  // --- Layouts for Desktop and Mobile ---
  const renderDesktopView = () => (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{ background: colors.background }}
    >
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">{renderLeaderboard()}</div>
          <div className="col-span-1 flex flex-col items-center">
            {renderGameScreen()}
          </div>
          <div className="col-span-1">{renderInfoPanel()}</div>
        </div>
      </div>
      {renderThemeToggle()} {/* Only desktop */}
    </div>
  );

  const renderMobileView = () => (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{ background: colors.background }}
    >
      <div className="w-full max-w-md">
        {renderGameScreen()}
        <div className="mt-6 space-y-6">
          {renderLeaderboard()}
          {renderInfoPanel()}
        </div>
      </div>
      {renderBottomNav()} {/* Only mobile */}
    </div>
  );

  // --- Main render ---
  return (
    <main style={{ background: colors.background, minHeight: "100vh" }}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Montserrat:wght@300;400;500;700&display=swap");
        body {
          font-family: "Montserrat", sans-serif;
          margin: 0;
          padding: 0;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Playfair Display", serif;
        }
      `}</style>
      {isMobile ? renderMobileView() : renderDesktopView()}
      {/* Simple confetti effect */}
      {showConfetti && (
        <div
          style={{
            position: "fixed",
            pointerEvents: "none",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
            background: "transparent",
            animation: "fadeout 2.2s linear",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  margin: 2,
                  background: [
                    colors.primary,
                    colors.accent,
                    colors.accentSoft,
                    colors.gridOn,
                    colors.gridOff,
                  ][i % 5],
                  opacity: 0.65 + Math.random() * 0.35,
                  animation: `fall 2s linear ${i * 0.02}s`,
                }}
              />
            ))}
          </div>
          <style>{`
            @keyframes fall {
              0% { transform: translateY(-60px) scale(1) rotate(0deg); }
              80% { transform: translateY(60vh) scale(1.4) rotate(120deg);}
              100% { transform: translateY(100vh) scale(0.85) rotate(200deg);}
            }
            @keyframes fadeout {
              0% { opacity: 1; }
              100% { opacity: 0; }
            }
          `}</style>
        </div>
      )}
    </main>
  );
}
