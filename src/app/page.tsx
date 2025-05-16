"use client";

import { useState, useEffect } from "react";
import { FiBook, FiPlus, FiFilter, FiSun, FiMoon, FiChevronDown, FiMoreVertical, FiTrash2, FiEdit2, FiStar, FiAward } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Inter, Poppins } from 'next/font/google';
import React from "react";

// Load modern fonts
const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ['latin'] });

interface Book {
    title: string;
    author: string;
    pages: number;
    genre: string;
    status: "in-progress" | "finished" | "upcoming";
    favorite: boolean;
    rating?: number;
    review?: string;
    startedAt?: string;
    finishedAt?: string;
    id: string;
    coverImage?: string;
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: "FiBook" | "FiPlus" | "FiFilter";
    highlight?: boolean;
}

interface BookCardProps {
    book: Book;
    index: number;
    onUpdateBook: (id: string, updates: Partial<Book>) => void;
    onDeleteBook: (id: string) => void;
}

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddBook: (book: Book) => void;
}

interface UpdateBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book;
    onUpdateBook: (id: string, updates: Partial<Book>) => void;
}

interface DeleteBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book;
    onDeleteBook: (id: string) => void;
}

interface ShareBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book;
}

interface BookModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const getRandomCoverImage = () => {
    const colors = [
        "bg-gradient-to-br from-violet-500/10 to-violet-600/10 dark:from-violet-400/20 dark:to-violet-500/20",
        "bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 dark:from-emerald-400/20 dark:to-emerald-500/20",
        "bg-gradient-to-br from-amber-500/10 to-amber-600/10 dark:from-amber-400/20 dark:to-amber-500/20",
        "bg-gradient-to-br from-rose-500/10 to-rose-600/10 dark:from-rose-400/20 dark:to-rose-500/20",
        "bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-400/20 dark:to-blue-500/20"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

const ReadingTracker = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string>("all");
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isBookModalOpen, setIsBookModalOpen] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortOption] = useState<"title" | "author" | "progress" | "rating">("title");
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [isClient, setIsClient] = useState<boolean>(false);
    const [timeRange, setTimeRange] = useState<"week" | "month">("week");

    useEffect(() => {
        setIsClient(true);

        // Check for stored theme or OS preference
        const storedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        let themeToUse: boolean;

        if (storedTheme === "dark") {
            themeToUse = true;
        } else if (storedTheme === "light") {
            themeToUse = false;
        } else {
            themeToUse = prefersDark;
        }

        setIsDarkMode(themeToUse);
        document.documentElement.classList.toggle("dark", themeToUse);

        // Listen for OS-level changes only if user hasn't set a preference
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem("theme")) {
                setIsDarkMode(e.matches);
                document.documentElement.classList.toggle("dark", e.matches);
            }
        };
        mediaQuery.addEventListener("change", handleChange);

        const storedBooks = localStorage.getItem("books");
        if (storedBooks) {
            const parsedBooks: Book[] = JSON.parse(storedBooks).map((book: Book) => ({
                ...book,
                id: book.id || generateId(),
                coverImage: book.coverImage || getRandomCoverImage()
            }));
            setBooks(sortBooks(parsedBooks, sortOption));
        }
        setIsLoading(false);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        document.documentElement.classList.toggle("dark", newTheme);
        localStorage.setItem("theme", newTheme ? "dark" : "light");
    };

    const updateBook = (id: string, updates: Partial<Book>) => {
        const updatedBooks = books.map((book) => {
            if (book.id === id) {
                const updatedBook = { ...book, ...updates };
                if (updates.status === "finished" && !updatedBook.finishedAt) {
                    updatedBook.finishedAt = new Date().toISOString();
                }
                return updatedBook;
            }
            return book;
        });
        setBooks(sortBooks(updatedBooks, sortOption));
    };

    const deleteBook = (id: string) => {
        setBooks(books.filter((book) => book.id !== id));
    };

    const filterByGenre = (genre: string) => {
        setSelectedGenre(genre);
        setFilteredBooks(genre === "all" ? books : books.filter((book) => book.genre === genre));
    };

    const sortBooks = (bookList: Book[], option: "title" | "author" | "progress" | "rating") => {
        const sorted = [...bookList];
        switch (option) {
            case "title": return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case "author": return sorted.sort((a, b) => a.author.localeCompare(b.author));
            case "progress": return sorted.sort((a, b) => {
                const aProgress = a.status === "finished" ? 100 : (a.pages / 500) * 100;
                const bProgress = b.status === "finished" ? 100 : (b.pages / 500) * 100;
                return bProgress - aProgress;
            });
            case "rating": return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            default: return sorted;
        }
    };

    useEffect(() => {
        localStorage.setItem("books", JSON.stringify(books));
        filterByGenre(selectedGenre);
    }, [books]);

    const getReadingStats = () => [
        {
            label: "Read This Year",
            value: books.filter((book) => book.status === "finished").length,
            icon: "FiBook",
            highlight: true,
        },
        {
            label: "Currently Reading",
            value: books.filter((book) => book.status === "in-progress").length,
            icon: "FiPlus",
        },
        {
            label: "Next Up",
            value: books.filter((book) => book.status === "upcoming").length,
            icon: "FiFilter",
        },
    ];

    const getPagesPerDay = () => {
        const days = timeRange === "week" ? 7 : 30;
        return Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split("T")[0];
        }).reverse().map((date) => ({
            date: new Date(date).toLocaleDateString("en-US", {
                weekday: timeRange === "week" ? "short" : undefined,
                month: timeRange === "month" ? "short" : undefined,
                day: "numeric"
            }),
            pages: books
                .filter((book) => book.status === "finished" && book.finishedAt?.startsWith(date))
                .reduce((sum, book) => sum + book.pages, 0),
        }));
    };

    const getUniqueGenres = () => ["all", ...Array.from(new Set(books.map((book) => book.genre)))];

    const handleAddBook = (newBook: Book) => {
        const bookWithCover = { ...newBook, coverImage: getRandomCoverImage() };
        setBooks(sortBooks([...books, bookWithCover], sortOption));
        setIsAddModalOpen(false);
    };

    const StatCard = ({ label, value, icon, highlight = false }: StatCardProps) => {
        const Icon = icon === "FiBook" ? FiBook : icon === "FiPlus" ? FiPlus : FiFilter;
        return (
            <div className={`flex flex-col p-6 rounded-2xl transition-all duration-300 shadow-sm ${
                highlight
                    ? "bg-gradient-to-br from-violet-600 to-violet-500 text-white"
                    : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            }`}>
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className={`text-sm font-medium mb-1 ${highlight ? "text-violet-100" : "text-gray-500 dark:text-gray-400"}`}>{label}</p>
                        <p className={`text-3xl font-bold ${highlight ? "text-white" : "text-gray-900 dark:text-white"}`}>
                            {value}
                        </p>
                    </div>
                    <div className={`p-3 rounded-xl ${
                        highlight
                            ? "bg-white/20 text-white"
                            : "bg-violet-100/50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                    }`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
            </div>
        );
    };

    const BookCard = ({ book }: BookCardProps) => {
        const getProgressColor = () => {
            if (book.status === "finished") return "bg-gradient-to-r from-emerald-500 to-emerald-600";
            if (book.status === "in-progress") return "bg-gradient-to-r from-violet-500 to-violet-600";
            return "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700";
        };

        const getProgressPercent = () => book.status === "finished" ? 100 : (book.pages / 500) * 100;

        const getStatusBadge = () => {
            if (book.status === "finished") return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                    <FiAward className="w-3.5 h-3.5" /> Finished
                </span>
            );
            if (book.status === "in-progress") return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300">
                    <FiBook className="w-3.5 h-3.5" /> In Progress
                </span>
            );
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                    <FiPlus className="w-3.5 h-3.5" /> Upcoming
                </span>
            );
        };

        return (
            <div className={`group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
                viewMode === "grid" ? "flex flex-col" : "flex items-center p-4 gap-4 hover:-translate-y-0.5"
            }`}>
                {viewMode === "grid" && (
                    <div className="relative w-full pt-[150%]">
                        <div className={`absolute inset-0 ${book.coverImage} flex items-center justify-center`}>
                            <span className="text-5xl font-bold bg-gradient-to-br from-violet-600 to-violet-400 bg-clip-text text-transparent">
                                {book.title.charAt(0)}
                            </span>
                            <div className="absolute top-3 right-3 z-10">
                                <button
                                    onClick={() => { setSelectedBook(book); setIsUpdateModalOpen(true); }}
                                    className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-violet-500/20 dark:hover:bg-violet-400/20 transition-colors shadow-sm"
                                >
                                    <FiEdit2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                </button>
                            </div>
                            {book.favorite && (
                                <div className="absolute top-3 left-3 z-10">
                                    <FiStar className="w-5 h-5 text-amber-400 fill-current drop-shadow-sm" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className={viewMode === "grid" ? "p-5 space-y-4" : "flex-1 space-y-3"}>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{book.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{book.author}</p>
                        {viewMode === "grid" && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    selectedGenre === book.genre
                                        ? "bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                }`}>
                                    {book.genre}
                                </span>
                                {getStatusBadge()}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Progress</div>
                            <div className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                                {getProgressPercent().toFixed(0)}%
                            </div>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${getProgressColor()} transition-all duration-500 ease-out`}
                                style={{ width: `${getProgressPercent()}%` }}
                            />
                        </div>
                    </div>
                </div>

                {viewMode === "list" && (
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            selectedGenre === book.genre
                                ? "bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                        }`}>
                            {book.genre}
                        </span>
                        {getStatusBadge()}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => { setSelectedBook(book); setIsUpdateModalOpen(true); }}
                                className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-violet-500/20 dark:hover:bg-violet-400/20 transition-colors shadow-sm"
                            >
                                <FiEdit2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                            </button>
                            <button
                                onClick={() => { setSelectedBook(book); setIsDeleteModalOpen(true); }}
                                className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-red-500/20 dark:hover:bg-red-400/20 transition-colors shadow-sm"
                            >
                                <FiTrash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const AddBookModal = ({ isOpen, onClose, onAddBook }: AddBookModalProps) => {
        const [title, setTitle] = useState<string>("");
        const [author, setAuthor] = useState<string>("");
        const [pages, setPages] = useState<number>(0);
        const [genre, setGenre] = useState<string>("");
        const [status, setStatus] = useState<"in-progress" | "finished" | "upcoming">("upcoming");
        const [startDate, setStartDate] = useState<string>("");
        const [finishDate, setFinishDate] = useState<string>("");
        const [rating, setRating] = useState<number | undefined>(undefined);
        const [review, setReview] = useState<string>("");
        const [favorite, setFavorite] = useState<boolean>(false);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (!title || !author || !genre) return;

            const newBook: Book = {
                id: generateId(),
                title,
                author,
                pages,
                genre,
                status,
                favorite,
                rating,
                review: review || undefined,
                startedAt: startDate || undefined,
                finishedAt: status === "finished" ? (finishDate || new Date().toISOString()) : undefined
            };
            onAddBook(newBook);
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className={`text-xl font-semibold text-gray-900 dark:text-white ${poppins.className}`}>Add New Book</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                &times;
                            </button>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                            <input
                                type="text"
                                id="title"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author *</label>
                            <input
                                type="text"
                                id="author"
                                required
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="pages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pages</label>
                            <input
                                type="number"
                                id="pages"
                                value={pages}
                                onChange={(e) => setPages(parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genre *</label>
                            <input
                                type="text"
                                id="genre"
                                required
                                value={genre}
                                onChange={(e) => setGenre(e.target.value.toLowerCase())}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                                placeholder="fiction, non-fiction, etc."
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as "in-progress" | "finished" | "upcoming")}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="in-progress">In Progress</option>
                                <option value="finished">Finished</option>
                            </select>
                        </div>

                        {(status === "in-progress" || status === "finished") && (
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Started Reading
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                        )}

                        {status === "finished" && (
                            <>
                                <div>
                                    <label htmlFor="finishDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Finished Reading
                                    </label>
                                    <input
                                        type="date"
                                        id="finishDate"
                                        value={finishDate}
                                        onChange={(e) => setFinishDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating (1-5)</label>
                                    <div className="flex items-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <FiStar
                                                    className={`w-6 h-6 ${rating && star <= rating ? "text-amber-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="review" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Review</label>
                                    <textarea
                                        id="review"
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="favorite"
                                checked={favorite}
                                onChange={(e) => setFavorite(e.target.checked)}
                                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                            />
                            <label htmlFor="favorite" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Mark as favorite
                            </label>
                        </div>

                        <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!title || !author || !genre}
                                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-50"
                            >
                                Add Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const UpdateBookModal = ({ isOpen, onClose, book, onUpdateBook }: UpdateBookModalProps) => {
        const [title, setTitle] = useState<string>(book.title);
        const [author, setAuthor] = useState<string>(book.author);
        const [pages, setPages] = useState<number>(book.pages);
        const [genre, setGenre] = useState<string>(book.genre);
        const [status, setStatus] = useState<"in-progress" | "finished" | "upcoming">(book.status);
        const [startDate, setStartDate] = useState<string>(book.startedAt || "");
        const [finishDate, setFinishDate] = useState<string>(book.finishedAt || "");
        const [rating, setRating] = useState<number | undefined>(book.rating);
        const [review, setReview] = useState<string>(book.review || "");
        const [favorite, setFavorite] = useState<boolean>(book.favorite);

        useEffect(() => {
            setTitle(book.title);
            setAuthor(book.author);
            setPages(book.pages);
            setGenre(book.genre);
            setStatus(book.status);
            setStartDate(book.startedAt || "");
            setFinishDate(book.finishedAt || "");
            setRating(book.rating);
            setReview(book.review || "");
            setFavorite(book.favorite);
        }, [book]);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (!title || !author || !genre) return;

            const updates: Partial<Book> = {
                title,
                author,
                pages,
                genre,
                status,
                favorite,
                rating,
                review: review || undefined,
                startedAt: startDate || undefined,
                finishedAt: status === "finished" ? (finishDate || new Date().toISOString()) : undefined
            };
            onUpdateBook(book.id, updates);
            onClose();
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className={`text-xl font-semibold text-gray-900 dark:text-white ${poppins.className}`}>Edit Book</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                &times;
                            </button>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                            <input
                                type="text"
                                id="title"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author *</label>
                            <input
                                type="text"
                                id="author"
                                required
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="pages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pages</label>
                            <input
                                type="number"
                                id="pages"
                                value={pages}
                                onChange={(e) => setPages(parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genre *</label>
                            <input
                                type="text"
                                id="genre"
                                required
                                value={genre}
                                onChange={(e) => setGenre(e.target.value.toLowerCase())}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as "in-progress" | "finished" | "upcoming")}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="in-progress">In Progress</option>
                                <option value="finished">Finished</option>
                            </select>
                        </div>

                        {(status === "in-progress" || status === "finished") && (
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Started Reading
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                        )}

                        {status === "finished" && (
                            <>
                                <div>
                                    <label htmlFor="finishDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Finished Reading
                                    </label>
                                    <input
                                        type="date"
                                        id="finishDate"
                                        value={finishDate}
                                        onChange={(e) => setFinishDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating (1-5)</label>
                                    <div className="flex items-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <FiStar
                                                    className={`w-6 h-6 ${rating && star <= rating ? "text-amber-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="review" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Review</label>
                                    <textarea
                                        id="review"
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="favorite"
                                checked={favorite}
                                onChange={(e) => setFavorite(e.target.checked)}
                                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                            />
                            <label htmlFor="favorite" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Mark as favorite
                            </label>
                        </div>

                        <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!title || !author || !genre}
                                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-50"
                            >
                                Update Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const DeleteBookModal = ({ isOpen, onClose, book, onDeleteBook }: DeleteBookModalProps) => {
        if (!isOpen) return null;

        const handleDelete = () => {
            onDeleteBook(book.id);
            onClose();
        };

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className={`text-xl font-semibold text-gray-900 dark:text-white ${poppins.className}`}>Delete Book</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                &times;
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Are you sure you want to delete <span className="font-semibold">{book.title}</span> by {book.author}? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ShareBookModal = ({ isOpen, onClose, book }: ShareBookModalProps) => {
        const [copied, setCopied] = useState<boolean>(false);

        const shareText = `I ${book.status === "finished" ? "read" : book.status === "in-progress" ? "am reading" : "plan to read"} "${book.title}" by ${book.author}. ${book.rating ? `I rated it ${book.rating}/5 stars.` : ""} ${book.review ? `My thoughts: "${book.review}"` : ""} #ReadingTracker`;

        const copyToClipboard = () => {
            navigator.clipboard.writeText(shareText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };

        const shareOptions = [
            { name: "Twitter", icon: "Twitter", color: "bg-blue-400", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}` },
            { name: "Facebook", icon: "Facebook", color: "bg-blue-600", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}` },
            { name: "Email", icon: "Email", color: "bg-gray-500", url: `mailto:?subject=Book Recommendation: ${book.title}&body=${encodeURIComponent(shareText)}` }
        ];

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className={`text-xl font-semibold text-gray-900 dark:text-white ${poppins.className}`}>Share &#34;{book.title}&#34;</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                &times;
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Share Text</label>
                            <textarea
                                readOnly
                                value={shareText}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                                rows={4}
                            />
                            <button
                                onClick={copyToClipboard}
                                className="mt-2 px-3 py-1.5 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                            >
                                {copied ? "Copied!" : "Copy to clipboard"}
                            </button>
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Share on:</p>
                            <div className="flex gap-3">
                                {shareOptions.map((option) => (
                                    <a
                                        key={option.name}
                                        href={option.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center justify-center w-full py-2 rounded-lg text-white ${option.color}`}
                                    >
                                        {option.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const BookModal = ({ isOpen, onClose, book }: BookModalProps) => {
        if (!isOpen) return null;

        const getProgressPercent = () => book.status === "finished" ? 100 : (book.pages / 500) * 100;

        const getProgressColor = () => {
            if (book.status === "finished") return "bg-gradient-to-r from-emerald-500 to-emerald-600";
            if (book.status === "in-progress") return "bg-gradient-to-r from-violet-500 to-violet-600";
            return "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700";
        };

        const formatDate = (dateString?: string) => {
            if (!dateString) return "Not set";
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        };

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className={`text-xl font-semibold text-gray-900 dark:text-white ${poppins.className}`}>{book.title}</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                &times;
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex mb-6">
                            <div className="w-1/3 mr-4">
                                <div className={`aspect-[2/3] rounded-lg ${book.coverImage} flex items-center justify-center`}>
                                    <span className="text-5xl font-bold bg-gradient-to-br from-violet-600 to-violet-400 bg-clip-text text-transparent">
                                        {book.title.charAt(0)}
                                    </span>
                                </div>
                            </div>
                            <div className="w-2/3 space-y-2">
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Author:</span> {book.author}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Genre:</span> {book.genre}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Pages:</span> {book.pages}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Status:</span> {book.status.charAt(0).toUpperCase() + book.status.slice(1).replace("-", " ")}
                                </p>
                                <div className="space-y-1">
                                    <p className="text-gray-700 dark:text-gray-300 text-sm flex justify-between">
                                        <span className="font-semibold">Progress:</span>
                                        <span>{getProgressPercent().toFixed(0)}%</span>
                                    </p>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className={`h-full ${getProgressColor()}`} style={{ width: `${getProgressPercent()}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {(book.startedAt || book.finishedAt) && (
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reading Dates</h3>
                                    {book.startedAt && (
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-semibold">Started:</span> {formatDate(book.startedAt)}
                                        </p>
                                    )}
                                    {book.finishedAt && (
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-semibold">Finished:</span> {formatDate(book.finishedAt)}
                                        </p>
                                    )}
                                </div>
                            )}

                            {book.rating !== undefined && (
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rating</h3>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FiStar
                                                key={star}
                                                className={`w-5 h-5 ${star <= book.rating! ? "text-amber-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
                                            />
                                        ))}
                                        <span className="ml-2 text-gray-700 dark:text-gray-300">{book.rating}/5</span>
                                    </div>
                                </div>
                            )}

                            {book.review && (
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Review</h3>
                                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        &#34;{book.review}&#34;
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => { onClose(); setSelectedBook(book); setIsUpdateModalOpen(true); }}
                                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!isClient) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 to-violet-100 dark:from-gray-900 dark:to-violet-950 flex items-center justify-center">
                <div className="text-xl font-bold mb-4">Loading Reading Tracker</div>
                <div className="w-16 h-16 border-4 border-violet-500/30 dark:border-violet-400/30 border-t-violet-500 dark:border-t-violet-400 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br from-violet-50 to-white dark:from-gray-950 dark:to-gray-900 ${inter.className}`}>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div className="relative">
                        <h1 className={`text-4xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent ${poppins.className}`}>
                            Reading Tracker
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold shadow-sm hover:shadow-md transition-all"
                        >
                            <FiPlus className="w-5 h-5" /> Add New Book
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/90 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors shadow-sm"
                        >
                            {isDarkMode
                                ? <FiSun className="w-5 h-5 text-amber-400" />
                                : <FiMoon className="w-5 h-5 text-violet-600" />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {getReadingStats().map((stat, index) => (
                        <StatCard key={index} {...stat}></StatCard>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-lg font-semibold text-gray-900 dark:text-white ${poppins.className}`}>
                                Pages Read This {timeRange === "week" ? "Week" : "Month"}
                            </h2>
                            <div className="flex bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
                                <button
                                    onClick={() => setTimeRange("week")}
                                    className={`px-4 py-1.5 text-sm ${timeRange === "week" ? "bg-violet-600 text-white" : "text-gray-600 dark:text-gray-400"}`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setTimeRange("month")}
                                    className={`px-4 py-1.5 text-sm ${timeRange === "month" ? "bg-violet-600 text-white" : "text-gray-600 dark:text-gray-400"}`}
                                >
                                    Month
                                </button>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getPagesPerDay()}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} opacity={0.1} />
                                    <XAxis
                                        dataKey="date"
                                        stroke={isDarkMode ? "#d1d5db" : "#374151"}
                                        tick={{ fill: isDarkMode ? "#d1d5db" : "#374151", fontSize: 12 }}
                                    />
                                    <YAxis
                                        stroke={isDarkMode ? "#d1d5db" : "#374151"}
                                        tick={{ fill: isDarkMode ? "#d1d5db" : "#374151", fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDarkMode ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)",
                                            borderColor: isDarkMode ? "#4b5563" : "#e5e7eb",
                                            borderRadius: "0.5rem",
                                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                                        }}
                                        itemStyle={{ color: isDarkMode ? "#f3f4f6" : "#111827" }}
                                        labelStyle={{ color: isDarkMode ? "#f3f4f6" : "#111827", fontWeight: "bold" }}
                                        formatter={(value) => [`${value} pages`, "Pages Read"]}
                                    />
                                    <Bar
                                        dataKey="pages"
                                        fill="url(#colorGradient)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <defs>
                                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={isDarkMode ? "#a78bfa" : "#8b5cf6"} />
                                            <stop offset="100%" stopColor={isDarkMode ? "#8b5cf6" : "#7c3aed"} />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className={`text-lg font-semibold mb-6 text-gray-900 dark:text-white ${poppins.className}`}>Reading Goal</h2>
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle
                                        className="text-gray-200 dark:text-gray-700 stroke-current"
                                        strokeWidth="10"
                                        fill="transparent"
                                        r="40"
                                        cx="50"
                                        cy="50"
                                    />
                                    <circle
                                        className="text-violet-500 dark:text-violet-400 stroke-current"
                                        strokeWidth="10"
                                        strokeDasharray={`${(books.filter(b => b.status === "finished").length / 10) * 251} 251`}
                                        strokeLinecap="round"
                                        fill="transparent"
                                        r="40"
                                        cx="50"
                                        cy="50"
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {books.filter(b => b.status === "finished").length}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">/ 10 books</p>
                                </div>
                            </div>
                            <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
                                You&#39;ve finished {books.filter(b => b.status === "finished").length} books this year!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <h2 className={`text-xl font-semibold text-gray-900 dark:text-white ${poppins.className}`}>Your Bookshelf</h2>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 ${viewMode === "grid" ? "bg-violet-600 text-white" : "text-gray-600 dark:text-gray-400"}`}
                            >
                                <FiBook className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 ${viewMode === "list" ? "bg-violet-600 text-white" : "text-gray-600 dark:text-gray-400"}`}
                            >
                                <FiMoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm border border-gray-200 dark:border-gray-600"
                            >
                                <FiFilter className="w-4 h-4" /> Filter <FiChevronDown className="w-4 h-4" />
                            </button>
                            {isFilterOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                                    <div className="py-1">
                                        {getUniqueGenres().map((genre) => (
                                            <button
                                                key={genre}
                                                onClick={() => { filterByGenre(genre); setIsFilterOpen(false); }}
                                                className={`w-full text-left px-4 py-2 text-sm ${
                                                    selectedGenre === genre
                                                        ? "bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300"
                                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                {genre.charAt(0).toUpperCase() + genre.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm animate-pulse border border-gray-100 dark:border-gray-700">
                                <div className="flex flex-col space-y-3">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredBooks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 bg-violet-100/80 dark:bg-violet-500/20 rounded-full flex items-center justify-center mb-4">
                            <FiBook className="w-10 h-10 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No books found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                            {selectedGenre === "all"
                                ? "You haven't added any books yet. Start by adding a new book!"
                                : `You don't have any books in the "${selectedGenre}" genre yet.`}
                        </p>
                        <button onClick={() => setIsAddModalOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-sm hover:shadow-md transition-all">
                            <FiPlus className="w-5 h-5" /> Add New Book
                        </button>
                    </div>
                ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${viewMode === "list" ? "xl:grid-cols-1" : "xl:grid-cols-2"} gap-5`}>
                        {filteredBooks.map((book, index) => (
                            <BookCard key={book.id} book={book} index={index} onUpdateBook={updateBook} onDeleteBook={deleteBook} />
                        ))}
                    </div>
                )}

                {/* Modals */}
                {isAddModalOpen && (
                    <AddBookModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        onAddBook={handleAddBook}
                    />
                )}
                {isUpdateModalOpen && selectedBook && (
                    <UpdateBookModal
                        isOpen={isUpdateModalOpen}
                        onClose={() => setIsUpdateModalOpen(false)}
                        book={selectedBook}
                        onUpdateBook={updateBook}
                    />
                )}
                {isDeleteModalOpen && selectedBook && (
                    <DeleteBookModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        book={selectedBook}
                        onDeleteBook={deleteBook}
                    />
                )}
                {isShareModalOpen && selectedBook && (
                    <ShareBookModal
                        isOpen={isShareModalOpen}
                        onClose={() => setIsShareModalOpen(false)}
                        book={selectedBook}
                    />
                )}
                {isBookModalOpen && selectedBook && (
                    <BookModal
                        isOpen={isBookModalOpen}
                        onClose={() => setIsBookModalOpen(false)}
                        book={selectedBook}
                    />
                )}
            </div>
        </div>
    );
};

export default ReadingTracker;