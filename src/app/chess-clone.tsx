"use client";

import {useEffect, useState} from "react";
import {Chess, Color, PieceSymbol, Square} from "chess.js";
import {AnimatePresence, motion} from "framer-motion";
import {Quicksand} from "next/font/google";
import {Award, Clock, History, Moon, RotateCcw, Sun} from "lucide-react";

const quicksand = Quicksand({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
});

const pieceUnicode = (piece: { type: PieceSymbol; color: Color }) => {
    const map: Record<Color, Record<PieceSymbol, string>> = {
        w: {
            p: "♙",
            r: "♖",
            n: "♘",
            b: "♗",
            q: "♕",
            k: "♔",
        },
        b: {
            p: "♟",
            r: "♜",
            n: "♞",
            b: "♝",
            q: "♛",
            k: "♚",
        },
    };
    return map[piece.color][piece.type];
};

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const Game = () => {
    const [game, setGame] = useState(new Chess());
    const [board, setBoard] = useState<ReturnType<typeof game.board>>(game.board());
    const [from, setFrom] = useState<Square | null>(null);
    const [status, setStatus] = useState("");
    const [captured, setCaptured] = useState<{ type: PieceSymbol; color: Color }[]>([]);
    const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
    const [darkMode, setDarkMode] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [moveCount, setMoveCount] = useState(0);
    const [highlightSquares, setHighlightSquares] = useState<Square[]>([]);
    const [whiteTime, setWhiteTime] = useState(300); // 5 minutes in seconds
    const [blackTime, setBlackTime] = useState(300);
    const [timerActive, setTimerActive] = useState(false);
    const [moveHistory, setMoveHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        updateBoard();
        updateStatus();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timerActive && !gameOver) {
            interval = setInterval(() => {
                if (game.turn() === "w") {
                    setWhiteTime(prev => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            setGameOver(true);
                            setStatus("Black wins on time!");
                            return 0;
                        }
                        return prev - 1;
                    });
                } else {
                    setBlackTime(prev => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            setGameOver(true);
                            setStatus("White wins on time!");
                            return 0;
                        }
                        return prev - 1;
                    });
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timerActive, game.turn(), gameOver]);

    const updateBoard = () => {
        setBoard(game.board());
        const history = game.history({ verbose: true });

        if (history.length > 0) {
            const lastMoveData = history[history.length - 1];
            setLastMove({
                from: lastMoveData.from as Square,
                to: lastMoveData.to as Square,
            });
        }

        const capturedPieces = history
            .filter((m) => m.captured)
            .map((m) => ({
                type: m.captured as PieceSymbol,
                color: m.color === "w" ? "b" : ("w" as Color),
            }));
        setCaptured(capturedPieces);
        setMoveCount(Math.floor(history.length / 2) + 1);

        // Update move history
        const newMoveHistory = [];
        for (let i = 0; i < history.length; i += 2) {
            const whiteMove = history[i];
            const blackMove = history[i + 1];
            const moveNumber = Math.floor(i / 2) + 1;
            newMoveHistory.push(
                `${moveNumber}. ${whiteMove.san}${blackMove ? ` ${blackMove.san}` : ""}`
            );
        }
        setMoveHistory(newMoveHistory);
    };

    const updateStatus = () => {
        if (game.isGameOver()) {
            setGameOver(true);
            setTimerActive(false);
            if (game.isCheckmate()) {
                setStatus(`Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins 🏆`);
            } else if (game.isDraw()) {
                setStatus("Draw!");
            } else if (game.isStalemate()) {
                setStatus("Stalemate!");
            } else if (game.isThreefoldRepetition()) {
                setStatus("Draw by repetition!");
            } else if (game.isInsufficientMaterial()) {
                setStatus("Draw by insufficient material!");
            }
        } else {
            setStatus(`${game.turn() === "w" ? "White" : "Black"} to move`);
        }
    };

    const showLegalMoves = (square: Square) => {
        const moves = game.moves({
            square: square,
            verbose: true,
        });
        const squares = moves.map((move) => move.to as Square);
        setHighlightSquares(squares);
    };

    const handleClick = (row: number, col: number) => {
        if (gameOver) return;

        const files = "abcdefgh";
        const square = (files[col] + (8 - row)) as Square;
        const piece = game.get(square);

        if (!from) {
            if (piece && piece.color === game.turn()) {
                setFrom(square);
                showLegalMoves(square);
            }
        } else {
            const moves = game.moves({
                square: from,
                verbose: true,
            });
            const targetMove = moves.find((m) => m.to === square);
            const isLegal = Boolean(targetMove);

            if (isLegal) {
                if (!timerActive) setTimerActive(true);
                game.move({ from, to: square, promotion: "q" });
                updateBoard();
                updateStatus();
                setTimeout(() => computerMove(), 500);
            }
            setFrom(null);
            setHighlightSquares([]);
        }
    };

    const computerMove = () => {
        if (game.isGameOver()) return;
        const moves = game.moves({ verbose: true });
        const move = moves[Math.floor(Math.random() * moves.length)];
        if (move) {
            game.move(move);
            updateBoard();
            updateStatus();
        }
    };

    const resetGame = () => {
        const newGame = new Chess();
        setGame(newGame);
        setBoard(newGame.board());
        setFrom(null);
        setCaptured([]);
        setLastMove(null);
        setStatus("White to move");
        setGameOver(false);
        setMoveCount(0);
        setHighlightSquares([]);
        setWhiteTime(300);
        setBlackTime(300);
        setTimerActive(false);
        setMoveHistory([]);
        setShowHistory(false);
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const toggleHistory = () => {
        setShowHistory(!showHistory);
    };

    const isSquareInLastMove = (row: number, col: number): boolean => {
        if (!lastMove) return false;
        const files = "abcdefgh";
        const square = (files[col] + (8 - row)) as Square;
        return lastMove.from === square || lastMove.to === square;
    };

    const isHighlightedSquare = (row: number, col: number): boolean => {
        const files = "abcdefgh";
        const square = (files[col] + (8 - row)) as Square;
        return highlightSquares.includes(square);
    };

    const getSquareColor = (row: number, col: number) => {
        const isWhiteSquare = (row + col) % 2 === 0;

        if (from === (("abcdefgh"[col] + (8 - row)) as Square)) {
            return darkMode ? "bg-indigo-500" : "bg-blue-500";
        }

        if (isHighlightedSquare(row, col)) {
            return darkMode ? "bg-indigo-400/40" : "bg-blue-300/40";
        }

        if (isSquareInLastMove(row, col)) {
            return darkMode ? "bg-violet-500/50" : "bg-blue-400/50";
        }

        return isWhiteSquare
            ? darkMode
                ? "bg-zinc-800"
                : "bg-slate-200"
            : darkMode
                ? "bg-zinc-900"
                : "bg-slate-400";
    };

    return (
        <div
            className={`${
                quicksand.className
            } min-h-screen flex flex-col items-center justify-center px-4 py-10 transition-colors duration-500 ${
                darkMode
                    ? "bg-gradient-to-br from-black via-zinc-900 to-black text-white"
                    : "bg-gradient-to-br from-slate-50 via-white to-blue-50 text-gray-800"
            }`}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-4xl mx-auto"
            >
                <div className="w-full flex flex-col md:flex-row md:items-start items-center justify-between gap-8">
                    <div className="flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex justify-between items-center mb-6"
                        >
                            <h1
                                className={`text-4xl md:text-5xl font-bold tracking-tight ${
                                    darkMode
                                        ? "bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-500"
                                        : "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"
                                } bg-clip-text text-transparent`}
                            >
                                QUANTUM CHESS
                            </h1>

                            <div className="flex gap-2">
                                <motion.button
                                    onClick={toggleTheme}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-3 rounded-full cursor-pointer ${
                                        darkMode
                                            ? "bg-zinc-800 text-yellow-300 hover:bg-zinc-700 hover:text-yellow-200"
                                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                    } transition-colors shadow-lg`}
                                >
                                    {darkMode ? (
                                        <Sun size={22} className="animate-pulse" />
                                    ) : (
                                        <Moon size={22} />
                                    )}
                                </motion.button>
                                <motion.button
                                    onClick={toggleHistory}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-3 rounded-full cursor-pointer ${
                                        darkMode
                                            ? "bg-zinc-800 text-indigo-300 hover:bg-zinc-700 hover:text-indigo-200"
                                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                    } transition-colors shadow-lg`}
                                >
                                    <History size={22} />
                                </motion.button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className={`mb-6 p-4 rounded-lg ${
                                darkMode
                                    ? "bg-zinc-800/50 backdrop-blur-md border border-zinc-700/50"
                                    : "bg-white/70 backdrop-blur-md border border-slate-200"
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div
                                        className={`text-sm ${
                                            darkMode ? "text-zinc-400" : "text-slate-500"
                                        }`}
                                    >
                                        Game Status
                                    </div>
                                    <div
                                        className={`text-xl font-semibold ${
                                            gameOver
                                                ? darkMode
                                                    ? "text-indigo-300"
                                                    : "text-indigo-600"
                                                : darkMode
                                                    ? "text-white"
                                                    : "text-slate-800"
                                        }`}
                                    >
                                        {status}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div
                                        className={`text-sm ${
                                            darkMode ? "text-zinc-400" : "text-slate-500"
                                        }`}
                                    >
                                        Move
                                    </div>
                                    <div
                                        className={`text-xl font-semibold ${
                                            darkMode ? "text-white" : "text-slate-800"
                                        }`}
                                    >
                                        {moveCount}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center gap-2">
                                <div
                                    className={`text-sm ${
                                        darkMode ? "text-zinc-400" : "text-slate-500"
                                    }`}
                                >
                                    Captured:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    <AnimatePresence>
                                        {captured.map((p, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.3 }}
                                                className={`text-xl ${
                                                    p.color === "w"
                                                        ? "text-amber-500"
                                                        : darkMode
                                                            ? "text-indigo-300"
                                                            : "text-indigo-800"
                                                }`}
                                            >
                                                {pieceUnicode(p)}
                                            </motion.span>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div
                                    className={`p-3 rounded-lg ${
                                        darkMode ? "bg-zinc-700/50" : "bg-blue-50"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div
                                            className={`w-3 h-3 rounded-full ${
                                                game.turn() === "w" && !gameOver
                                                    ? darkMode
                                                        ? "bg-yellow-400 animate-pulse"
                                                        : "bg-yellow-500 animate-pulse"
                                                    : darkMode
                                                        ? "bg-zinc-500"
                                                        : "bg-slate-300"
                                            }`}
                                        />
                                        <div
                                            className={`text-sm ${
                                                darkMode ? "text-zinc-300" : "text-slate-600"
                                            }`}
                                        >
                                            White
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock
                                            size={16}
                                            className={
                                                darkMode ? "text-zinc-400" : "text-slate-500"
                                            }
                                        />
                                        <div
                                            className={`font-mono font-bold ${
                                                game.turn() === "w" && !gameOver
                                                    ? darkMode
                                                        ? "text-yellow-300"
                                                        : "text-yellow-600"
                                                    : darkMode
                                                        ? "text-zinc-300"
                                                        : "text-slate-600"
                                            }`}
                                        >
                                            {formatTime(whiteTime)}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`p-3 rounded-lg ${
                                        darkMode ? "bg-zinc-700/50" : "bg-blue-50"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div
                                            className={`w-3 h-3 rounded-full ${
                                                game.turn() === "b" && !gameOver
                                                    ? darkMode
                                                        ? "bg-indigo-400 animate-pulse"
                                                        : "bg-indigo-600 animate-pulse"
                                                    : darkMode
                                                        ? "bg-zinc-500"
                                                        : "bg-slate-300"
                                            }`}
                                        />
                                        <div
                                            className={`text-sm ${
                                                darkMode ? "text-zinc-300" : "text-slate-600"
                                            }`}
                                        >
                                            Black
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock
                                            size={16}
                                            className={
                                                darkMode ? "text-zinc-400" : "text-slate-500"
                                            }
                                        />
                                        <div
                                            className={`font-mono font-bold ${
                                                game.turn() === "b" && !gameOver
                                                    ? darkMode
                                                        ? "text-indigo-300"
                                                        : "text-indigo-600"
                                                    : darkMode
                                                        ? "text-zinc-300"
                                                        : "text-slate-600"
                                            }`}
                                        >
                                            {formatTime(blackTime)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.button
                            onClick={resetGame}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg cursor-pointer mb-6 ${
                                darkMode
                                    ? "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
                                    : "bg-white hover:bg-slate-100 border border-slate-200"
                            } transition-colors shadow-lg`}
                        >
                            <RotateCcw size={18} />
                            <span className="font-medium">New Game</span>
                        </motion.button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="md:ml-auto flex flex-col items-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className={`grid grid-cols-8 ${
                                darkMode
                                    ? "shadow-[0_0_50px_rgba(79,70,229,0.3)] border border-indigo-500/30"
                                    : "shadow-[0_0_30px_rgba(59,130,246,0.2)] border border-blue-200"
                            } rounded-xl overflow-hidden`}
                        >
                            {board.map((row, rowIndex) =>
                                row.map((square, colIndex) => (
                                    <motion.button
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => handleClick(rowIndex, colIndex)}
                                        className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center text-2xl cursor-pointer sm:text-3xl font-bold transition-all duration-200 ${getSquareColor(
                                            rowIndex,
                                            colIndex
                                        )}`}
                                    >
                                        {square && (
                                            <motion.span
                                                initial={
                                                    lastMove &&
                                                    lastMove.to ===
                                                    ((`abcdefgh`[colIndex] + (8 - rowIndex)) as Square)
                                                        ? { scale: 1.5, opacity: 0 }
                                                        : {}
                                                }
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className={`${
                                                    square.color === "w"
                                                        ? "text-amber-500"
                                                        : darkMode
                                                            ? "text-indigo-300"
                                                            : "text-indigo-900"
                                                } text-shadow-lg`}
                                            >
                                                {pieceUnicode(square)}
                                            </motion.span>
                                        )}
                                    </motion.button>
                                ))
                            )}
                        </motion.div>

                        {gameOver && (
                            <motion.div
                                className="mt-6 flex flex-col items-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                <motion.div
                                    className={`inline-flex items-center px-5 py-3 rounded-full mb-4 ${
                                        darkMode
                                            ? "bg-indigo-600 text-white"
                                            : "bg-indigo-100 text-indigo-800"
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Award
                                        className={`mr-2 ${
                                            darkMode ? "text-indigo-300" : "text-indigo-600"
                                        }`}
                                    />
                                    <span className="font-semibold">{status}</span>
                                </motion.div>

                                <motion.button
                                    onClick={resetGame}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full cursor-pointer
                  ${
                                        darkMode
                                            ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white"
                                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                                    } shadow-lg`}
                                >
                                    <RotateCcw size={18} />
                                    <span className="font-medium">Play Again</span>
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            {/* Move History Panel */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed bottom-0 left-0 right-0 w-full max-w-4xl mx-auto p-4 rounded-t-xl shadow-lg ${
                            darkMode
                                ? "bg-zinc-800 border-t border-zinc-700"
                                : "bg-white border-t border-slate-200"
                        }`}
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h3
                                className={`font-semibold ${
                                    darkMode ? "text-zinc-200" : "text-slate-700"
                                }`}
                            >
                                Move History
                            </h3>
                            <button
                                onClick={toggleHistory}
                                className={`p-2 rounded-full ${
                                    darkMode
                                        ? "hover:bg-zinc-700 text-zinc-300"
                                        : "hover:bg-slate-100 text-slate-500"
                                }`}
                            >
                                ✕
                            </button>
                        </div>
                        <div
                            className={`max-h-60 overflow-y-auto p-2 rounded ${
                                darkMode ? "bg-zinc-900" : "bg-slate-100"
                            }`}
                        >
                            {moveHistory.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                    {moveHistory.map((move, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-2 rounded text-center font-mono ${
                                                darkMode ? "bg-zinc-800" : "bg-white"
                                            }`}
                                        >
                                            {move}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div
                                    className={`text-center py-4 ${
                                        darkMode ? "text-zinc-400" : "text-slate-500"
                                    }`}
                                >
                                    No moves yet
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className={`mt-8 text-xs ${
                    darkMode ? "text-zinc-500" : "text-slate-400"
                }`}
            >
                <div className="flex items-center gap-1">
                    <span>QUANTUM CHESS</span>
                    <span className={darkMode ? "text-indigo-400" : "text-blue-500"}>
            •
          </span>
                    <span>ULTRA EDITION</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Game;