"use client";

import { useState } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiMoon, FiSun } from "react-icons/fi";
import { motion } from "framer-motion";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const initialTasks = [
  { id: "1", title: "Design wireframes", status: "todo", priority: "high", project: "Client A", description: "Create low-fidelity wireframes for onboarding flow" },
  { id: "2", title: "Fix API bug", status: "inprogress", priority: "medium", project: "Client B", description: "Resolve 500 error on user login endpoint" },
  { id: "3", title: "Deploy landing page", status: "done", priority: "low", project: "Client A", description: "Push final version to production" },
  { id: "4", title: "Security audit", status: "todo", priority: "high", project: "Client B", description: "Evaluate third-party dependencies for vulnerabilities" },
  { id: "5", title: "Database optimization", status: "todo", priority: "high", project: "Client C", description: "Index frequently queried fields" },
  { id: "6", title: "Update documentation", status: "inprogress", priority: "medium", project: "Client A", description: "Revise API documentation with new endpoints" },
  { id: "7", title: "User testing", status: "todo", priority: "high", project: "Client B", description: "Conduct usability tests with 5 participants" },
  { id: "8", title: "Refactor CSS", status: "inprogress", priority: "low", project: "Client C", description: "Convert to Tailwind utility classes" },
  { id: "9", title: "Implement analytics", status: "done", priority: "medium", project: "Client A", description: "Add Google Analytics tracking code" },
  { id: "10", title: "Performance audit", status: "done", priority: "high", project: "Client B", description: "Optimize page load time and Core Web Vitals" },
  { id: "11", title: "Setup CI/CD", status: "inprogress", priority: "high", project: "Client C", description: "Configure GitHub Actions workflow" },
  { id: "12", title: "Mobile responsiveness", status: "todo", priority: "medium", project: "Client A", description: "Fix layout issues on small devices" }
];

const statuses = ["todo", "inprogress", "done"];
const projects = ["All", "Client A", "Client B", "Client C"];

const statusLabels = {
  todo: "📝 To Do",
  inprogress: "🚧 In Progress",
  done: "✅ Done",
};

const priorities = {
  high: "border-l-4 border-red-500",
  medium: "border-l-4 border-yellow-400",
  low: "border-l-4 border-green-500",
};

function TaskCard({ task, isDragging = false }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isUrgent = task.priority === "high";

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={isDragging ? undefined : style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className={`rounded-md px-4 py-3 shadow bg-white text-black flex flex-col gap-1 ${priorities[task.priority]} transition-transform duration-200 ease-in-out ${isDragging ? "opacity-70 scale-[1.01]" : "hover:scale-[1.01] cursor-pointer"}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm flex items-center gap-1">
          {isUrgent && <span className="text-red-500">⚠️</span>}
          {task.title}
        </h3>
        <span className="text-xs text-zinc-500 font-medium">{task.project}</span>
      </div>
      {task.description && (
        <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}
    </motion.div>
  );
}

function TaskColumnDroppable({ status, children, isTargetColumn, darkMode }) {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div
      ref={setNodeRef}
      id={status}
      className={`rounded-xl border p-5 transition-all duration-200 shadow-sm ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'} ${isTargetColumn ? 'ring-2 ring-blue-500 ring-opacity-70' : ''}`}
    >
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [darkMode, setDarkMode] = useState(true);
  const [projectFilter, setProjectFilter] = useState("All");
  const [activeStatus, setActiveStatus] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [targetColumn, setTargetColumn] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const filteredTasks = tasks.filter(t => projectFilter === "All" || t.project === projectFilter);

  const onDragStart = (event) => {
    const task = tasks.find(t => t.id === String(event.active.id));
    if (task) setActiveTask(task);
  };

  const onDragOver = (event) => {
    const overId = String(event.over?.id);
    if (!overId) return;
    const overTask = tasks.find(t => t.id === overId);
    const newStatus = overTask?.status || (statuses.includes(overId) ? overId : null);
    if (newStatus) {
      setActiveStatus(newStatus);
      setTargetColumn(newStatus);
    }
  };

  const onDragEnd = (event) => {
    const taskId = String(event.active.id);
    const task = tasks.find(t => t.id === taskId);
    if (!task || !event.over) return;

    const overId = String(event.over.id);
    const newStatus = statuses.includes(overId) ? overId : tasks.find(t => t.id === overId)?.status || task.status;
    if (task.status !== newStatus) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }
    setActiveStatus(null);
    setActiveTask(null);
    setTargetColumn(null);
  };

  return (
    <div className={`${darkMode ? "dark bg-zinc-900 text-white" : "bg-zinc-100 text-black"} min-h-screen transition-colors flex ${inter.className}`}>
      <aside className={`w-full md:w-64 p-6 border-r ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-gray-200'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
          Projects
        </h2>

        <ul className="space-y-1 mb-6">
          {projects.map((proj) => (
            <li key={proj}>
              <button
                onClick={() => setProjectFilter(proj)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition ${
                  projectFilter === proj
                    ? 'bg-blue-500 text-white'
                    : darkMode
                      ? 'text-zinc-300 hover:bg-zinc-700'
                      : 'text-zinc-700 hover:bg-blue-50'
                }`}
              >
                {proj}
              </button>
            </li>
          ))}
        </ul>
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-600">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-2 mt-4 px-3 py-2 rounded-md text-sm font-medium transition ${
              darkMode
                ? 'bg-zinc-700 text-white hover:bg-zinc-600'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-gray-300'
            }`}
          >
            {darkMode ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
            Toggle Theme
          </button>
        </div>
      </aside>


      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6">Workflow Dashboard</h1>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={() => {
            setActiveTask(null);
            setActiveStatus(null);
            setTargetColumn(null);
          }}
        >
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {statuses.map((status) => {
              const columnTasks = filteredTasks.filter((task) => task.status === status);
              return (
                <TaskColumnDroppable key={status} status={status} isTargetColumn={targetColumn === status} darkMode={darkMode}>
                  <h2 className="font-semibold text-lg mb-3 flex justify-between items-center">
                    {statusLabels[status]} <span className="text-sm font-medium text-zinc-800 dark:text-zinc-300 ml-2">{columnTasks.length} tasks</span>
                  </h2>
                  <SortableContext items={columnTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4 min-h-[120px]">
                      {columnTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </div>
                  </SortableContext>
                </TaskColumnDroppable>
              );
            })}
          </div>
          <DragOverlay>{activeTask ? <TaskCard task={activeTask} isDragging /> : null}</DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}

