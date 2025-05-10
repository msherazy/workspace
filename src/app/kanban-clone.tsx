"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Simple utility function
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

// Types
type Priority = "low" | "medium" | "high";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  createdAt: Date;
  tags?: string[];
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

// Icon components (Plus, X, Search, Moon, Sun, Edit, Tag, Archive, Restore)
const PlusIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const XIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ArchiveIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="12" y2="14" />
    <line x1="12" y1="14" x2="14" y2="12" />
  </svg>
);
const RestoreIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-5" />
  </svg>
);
const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const MoonIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const SunIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const EditIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TagIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

// Basic primitives
const Button = ({
                  children,
                  onClick,
                  variant = "default",
                  size = "default",
                  className = "",
                  disabled = false,
                  ...props
                }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive" | "icon" | "success";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}) => {
  const base = "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    icon: "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700",
  };
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-2 py-1 text-xs",
    lg: "px-6 py-3 text-base",
    icon: "h-9 w-9 flex items-center justify-center",
  };
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
  return (
    <button
      className={cn(base, variants[variant], sizes[size], disabledStyles, className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({
                 value,
                 onChange,
                 placeholder,
                 className = "",
                 ...props
               }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={cn(
      "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
      className
    )}
    {...props}
  />
);

// Card + Modal
const TaskCard = ({
                    task,
                    columnId,
                    onArchive,
                    onDelete,
                    onRestore,
                    onEdit,
                    onDragStart,
                    isDarkMode,
                  }: {
  task: Task;
  columnId: string;
  onArchive: () => void;
  onDelete: () => void;
  onRestore: () => void;
  onEdit: () => void;
  onDragStart: (e: React.DragEvent, taskId: string, columnId: string) => void;
  isDarkMode: boolean;
}) => {
  // Priority styling
  const priorityColors = {
    low: isDarkMode
      ? "border-emerald-400/30 bg-emerald-400/5"
      : "border-emerald-500 bg-emerald-50/50",
    medium: isDarkMode
      ? "border-amber-400/30 bg-amber-400/5"
      : "border-amber-500 bg-amber-50/50",
    high: isDarkMode
      ? "border-rose-400/30 bg-rose-400/5"
      : "border-rose-500 bg-rose-50/50",
  };
  const priorityText = {
    low: isDarkMode
      ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20"
      : "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20",
    medium: isDarkMode
      ? "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20"
      : "bg-amber-100 text-amber-700 ring-1 ring-amber-600/20",
    high: isDarkMode
      ? "bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/20"
      : "bg-rose-100 text-rose-700 ring-1 ring-rose-600/20",
  };

  // Tag color mapping
  const tagColorMap: Record<string, { light: string; dark: string }> = {
    meetings: { light: "bg-blue-100 text-blue-700 border-blue-600", dark: "bg-blue-700/20 text-blue-100 border-blue-400" },
    research: { light: "bg-purple-100 text-purple-700 border-purple-600", dark: "bg-purple-700/20 text-purple-100 border-purple-400" },
    planning: { light: "bg-amber-100 text-amber-700 border-amber-600", dark: "bg-amber-700/20 text-amber-100 border-amber-400" },
    documentation: { light: "bg-sky-100 text-sky-700 border-sky-600", dark: "bg-sky-700/20 text-sky-100 border-sky-400" },
    important: { light: "bg-red-100 text-red-700 border-red-600", dark: "bg-red-700/20 text-red-100 border-red-400" },
    setup: { light: "bg-green-100 text-green-700 border-green-600", dark: "bg-green-700/20 text-green-100 border-green-400" },
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "p-4 mb-3 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200",
        priorityColors[task.priority],
        isDarkMode ? "bg-slate-800/50 hover:bg-slate-800" : "bg-white hover:bg-slate-50"
      )}
      draggable
      onDragStart={(e) => onDragStart(e, task.id, columnId)}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className={cn("font-medium tracking-tight", isDarkMode ? "text-slate-100" : "text-slate-900")}>
          {task.title}
        </h4>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={onEdit} className={cn(isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700")}>
            <EditIcon className="w-4 h-4" />
          </Button>

          {columnId === "done" ? (
            <Button variant="ghost" size="icon" onClick={onArchive} className={cn(isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700")}>
              <ArchiveIcon className="w-4 h-4" />
            </Button>
          ) : columnId === "archived" ? (
            <Button variant="ghost" size="icon" onClick={onRestore} className={cn(isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700")}>
              <RestoreIcon className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={onDelete} className={cn(isDarkMode ? "text-slate-400 hover:text-rose-300" : "text-slate-500 hover:text-rose-600")}>
              <XIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <p className={cn("text-sm mb-3 line-clamp-2", isDarkMode ? "text-slate-300" : "text-slate-600")}>
        {task.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {task.tags?.map((tag) => {
          const colors = tagColorMap[tag] || {
            light: "bg-white text-slate-600 border-slate-200",
            dark: "bg-slate-700/50 text-slate-300 border-slate-600",
          };
          return (
            <span
              key={tag}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border transition-colors duration-150",
                isDarkMode ? colors.dark : colors.light
              )}
            >
              <TagIcon className="w-3 h-3" />
              {tag}
            </span>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-2 text-xs">
        <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
          {task.createdAt.toLocaleDateString()}
        </span>
        <span className={cn("px-2 py-1 rounded-full text-xs uppercase tracking-wider", priorityText[task.priority])}>
          {task.priority}
        </span>
      </div>
    </motion.div>
  );
};

const Modal = ({
                 isOpen,
                 onClose,
                 title,
                 children,
               }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon />
          </Button>
        </div>
        <div className="p-4">{children}</div>
      </motion.div>
    </div>
  );
};

const TaskBoard = () => {
  // initial columns including an archived column
  const initialColumns: Column[] = [
    {
      id: "to-do",
      title: "To Do",
      tasks: [
        {
          id: "task-1",
          title: "Research project",
          description: "Research materials for upcoming project and compile findings into a report for the team",
          priority: "high",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          tags: ["research", "planning"],
        },
        {
          id: "task-2",
          title: "Plan meetings",
          description: "Schedule meetings for next week with all stakeholders to discuss project timeline",
          priority: "medium",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          tags: ["meetings"],
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: [
        {
          id: "task-3",
          title: "Draft proposal",
          description: "Create initial proposal draft with project scope, timeline, and budget estimates",
          priority: "high",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          tags: ["documentation", "important"],
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        {
          id: "task-4",
          title: "Set up workspace",
          description: "Prepare environment for project work and install necessary tools",
          priority: "low",
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          tags: ["setup"],
        },
      ],
    },
    {
      id: "archived",
      title: "Archived",
      tasks: [],
    },
  ];

  // state
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentColumn, setCurrentColumn] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    tags: "",
  });

  // load & save localStorage
  useEffect(() => {
    const saved = localStorage.getItem("taskboard-columns");
    if (saved) {
      try {
        const parsed: Column[] = JSON.parse(saved, (k, v) => (k === "createdAt" ? new Date(v) : v));
        setColumns(parsed);
      } catch {}
    }
    const dm = localStorage.getItem("taskboard-dark-mode") === "true";
    setIsDarkMode(dm);
  }, []);
  useEffect(() => {
    localStorage.setItem("taskboard-columns", JSON.stringify(columns));
  }, [columns]);
  useEffect(() => {
    localStorage.setItem("taskboard-dark-mode", isDarkMode.toString());
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // filtered view
  const filtered = columns.map((col) => ({
    ...col,
    tasks: col.tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
  }));

  // handlers
  const resetForm = () => {
    setTaskFormData({ title: "", description: "", priority: "medium", tags: "" });
    setCurrentTask(null);
    setCurrentColumn(null);
    setIsAddingTask(false);
    setIsEditingTask(false);
  };
  const handleAddTask = () => {
    if (!taskFormData.title.trim() || !currentColumn) return;
    const tags = taskFormData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const newTask: Task = { ...taskFormData, id: `task-${Date.now()}`, createdAt: new Date(), tags };
    setColumns((cols) =>
      cols.map((col) =>
        col.id === currentColumn ? { ...col, tasks: [...col.tasks, newTask] } : col
      )
    );
    resetForm();
  };
  const handleUpdateTask = () => {
    if (!taskFormData.title.trim() || !currentColumn || !currentTask) return;
    const tags = taskFormData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const updated: Task = { ...currentTask, ...taskFormData, tags };
    setColumns((cols) =>
      cols.map((col) =>
        col.id === currentColumn
          ? { ...col, tasks: col.tasks.map((t) => (t.id === currentTask.id ? updated : t)) }
          : col
      )
    );
    resetForm();
  };
  const handleRemove = (colId: string, taskId: string) => {
    setColumns((cols) =>
      cols.map((col) =>
        col.id === colId ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) } : col
      )
    );
  };
  const handleArchiveTask = (colId: string, taskId: string) => {
    let archivedTask: Task | undefined;
    setColumns((cols) =>
      cols.map((col) => {
        if (col.id === colId) {
          const task = col.tasks.find((t) => t.id === taskId);
          archivedTask = task;
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        }
        return col;
      })
    );
    if (archivedTask) {
      setColumns((cols) =>
        cols.map((col) =>
          col.id === "archived" ? { ...col, tasks: [...col.tasks, archivedTask!] } : col
        )
      );
    }
  };
  const handleRestoreTask = (taskId: string) => {
    let restored: Task | undefined;
    setColumns((cols) =>
      cols.map((col) => {
        if (col.id === "archived") {
          const task = col.tasks.find((t) => t.id === taskId);
          restored = task;
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        }
        return col;
      })
    );
    if (restored) {
      setColumns((cols) =>
        cols.map((col) =>
          col.id === "done" ? { ...col, tasks: [...col.tasks, restored!] } : col
        )
      );
    }
  };

  const handleEdit = (colId: string, taskId: string) => {
    const col = columns.find((c) => c.id === colId);
    const t = col?.tasks.find((t) => t.id === taskId);
    if (!col || !t) return;
    setCurrentColumn(colId);
    setCurrentTask(t);
    setTaskFormData({
      title: t.title,
      description: t.description,
      priority: t.priority,
      tags: t.tags?.join(", ") || "",
    });
    setIsEditingTask(true);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string, colId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceCol", colId);
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const src = e.dataTransfer.getData("sourceCol");
    if (src === targetId) return;

    let moved: Task | undefined;
    setColumns((cols) =>
      cols.map((col) => {
        if (col.id === src) {
          const t = col.tasks.find((t) => t.id === taskId);
          moved = t;
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        }
        return col;
      })
    );
    if (moved) {
      setColumns((cols) =>
        cols.map((col) =>
          col.id === targetId ? { ...col, tasks: [...col.tasks, moved!] } : col
        )
      );
    }
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    setColumns([...columns, { id: `col-${Date.now()}`, title: newColumnTitle, tasks: [] }]);
    setNewColumnTitle("");
    setIsAddingColumn(false);
  };
  const handleRemoveColumn = (colId: string) =>
    setColumns(columns.filter((c) => c.id !== colId));

  return (
    <div className={cn("min-h-screen font-sans transition-colors", isDarkMode ? "dark bg-slate-900" : "bg-slate-50")}>
      <div className="max-w-7xl mx-auto p-6">
        <header
          className={cn(
            "flex justify-between items-center mb-8 p-6 rounded-xl border shadow-sm",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700/50 backdrop-blur-sm"
              : "bg-white border-slate-200 shadow-lg"
          )}
        >
          <h1 className={cn("text-3xl font-bold tracking-tight", isDarkMode ? "text-white" : "text-slate-800")}>
            Task Board
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className={cn("w-4 h-4", isDarkMode ? "text-slate-400" : "text-slate-400")} />
              </div>
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "pl-10 w-72",
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-400 focus:border-indigo-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
                )}
              />
            </div>
            <Button
              onClick={() => setIsDarkMode(!isDarkMode)}
              variant="ghost"
              size="icon"
              className={isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"}
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </Button>
          </div>
        </header>

        <div className="flex gap-6 overflow-x-auto pb-6 scroll-snap-x snap-mandatory">
          {filtered.map((col) => (
            <motion.div
              key={col.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={cn(
                "flex-shrink-0 w-80 rounded-xl p-5 border snap-start",
                isDarkMode ? "bg-slate-800/50 border-slate-700/50 backdrop-blur-sm" : "bg-white border-slate-200 shadow-sm hover:shadow-md"
              )}
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className={cn("text-lg font-semibold tracking-tight", isDarkMode ? "text-slate-100" : "text-slate-800")}>
                  {col.title}
                </h3>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setIsAddingTask(true); setCurrentColumn(col.id); }} className={isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"}>
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                  {columns.length > 1 && col.id !== "archived" && (
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveColumn(col.id)} className={isDarkMode ? "text-slate-400 hover:text-rose-300" : "text-slate-500 hover:text-rose-600"}>
                      <XIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3 min-h-[200px]">
                <AnimatePresence>
                  {col.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      columnId={col.id}
                      onArchive={() => handleArchiveTask(col.id, task.id)}
                      onDelete={() => handleRemove(col.id, task.id)}
                      onRestore={() => handleRestoreTask(task.id)}
                      onEdit={() => handleEdit(col.id, task.id)}
                      onDragStart={handleDragStart}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </AnimatePresence>

                {col.tasks.length === 0 && (
                  <div className={cn("h-32 flex items-center justify-center text-sm border-2 border-dashed rounded-lg", isDarkMode ? "border-slate-700 text-slate-500" : "border-slate-200 text-slate-400")}>
                    No tasks yet
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Add Column Panel */}
          <div className={cn("flex-shrink-0 w-80 rounded-xl p-5 border snap-start", isDarkMode ? "bg-slate-800/50 border-slate-700/50 backdrop-blur-sm" : "bg-slate-50 border-slate-200 shadow-sm")}>
            {isAddingColumn ? (
              <div className="space-y-3">
                <Input
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Column title"
                  className={isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-slate-200 text-slate-900"}
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setIsAddingColumn(false); setNewColumnTitle(""); }} className={isDarkMode ? "border-gray-600 text-gray-300" : "border-slate-200 text-slate-600 hover:border-slate-300"}>
                    Cancel
                  </Button>
                  <Button variant="default" size="sm" onClick={handleAddColumn} disabled={!newColumnTitle.trim()}>
                    Add Column
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className={cn("flex items-center gap-2 w-full justify-center", isDarkMode ? "border-gray-600 text-gray-300" : "border-slate-200 text-slate-600 hover:border-slate-300") as string} onClick={() => setIsAddingColumn(true)}>
                <PlusIcon className="w-4 h-4" /> Add Column
              </Button>
            )}
          </div>
        </div>

        {/* Task Modals */}
        <Modal isOpen={isAddingTask || isEditingTask} onClose={resetForm} title={isAddingTask ? "Add New Task" : "Edit Task"}>
          <div className={cn("space-y-4", isDarkMode ? "text-slate-300" : "text-slate-600")}>
            <div>
              <label className={cn("block text-sm font-medium mb-1.5", isDarkMode ? "text-slate-300" : "text-slate-700")}>Title</label>
              <Input
                value={taskFormData.title}
                onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                placeholder="Task title"
                className={cn(isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500" : "")}
              />
            </div>
            <div>
              <label className={cn("block text-sm font-medium mb-1.5", isDarkMode ? "text-slate-300" : "text-slate-700")}>Description</label>
              <textarea
                value={taskFormData.description}
                onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                placeholder="Task description"
                rows={3}
                className={cn(
                  "w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                  isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500" : ""
                )}
              />
            </div>
            <div>
              <label className={cn("block text-sm font-medium mb-1.5", isDarkMode ? "text-slate-300" : "text-slate-700")}>Priority</label>
              <select
                value={taskFormData.priority}
                onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value as Priority })}
                className={cn("w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className={cn("block text-sm font-medium mb-1.5", isDarkMode ? "text-slate-300" : "text-slate-700")}>Tags (comma separated)</label>
              <Input
                value={taskFormData.tags}
                onChange={(e) => setTaskFormData({ ...taskFormData, tags: e.target.value })}
                placeholder="design, research, marketing"
                className={isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : ""}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={resetForm} className={isDarkMode ? "border-gray-600 text-gray-300" : ""}>
                Cancel
              </Button>
              <Button onClick={isAddingTask ? handleAddTask : handleUpdateTask} disabled={!taskFormData.title.trim()}>
                {isAddingTask ? "Add Task" : "Update Task"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TaskBoard;
