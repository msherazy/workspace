"use client";

import { useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiMoon, FiSun } from "react-icons/fi";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const initialTasks = [
  { id: "1", title: "Design wireframes", status: "todo", priority: "high", project: "Client A" },
  { id: "2", title: "Fix API bug", status: "inprogress", priority: "medium", project: "Client B" },
  { id: "3", title: "Deploy landing page", status: "done", priority: "low", project: "Client A" },
];

const statuses = ["todo", "inprogress", "done"];

const statusLabels = {
  todo: "📝 To Do",
  inprogress: "🚧 In Progress",
  done: "✅ Done",
};

const priorities = {
  high: "border-l-4 border-red-500",
  medium: "border-l-4 border-amber-400",
  low: "border-l-4 border-green-500",
};

function TaskCard({ task, isDragging = false }: { task: any, isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const isUrgent = task.priority === "high";
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={isDragging ? undefined : style}
      className={`rounded-md px-4 py-3 shadow bg-white text-black flex flex-col gap-1 ${priorities[task.priority]} transition-transform duration-200 ease-in-out ${isDragging ? "opacity-70 scale-[1.01]" : "hover:scale-[1.01] cursor-pointer"}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm flex items-center gap-1">
          {isUrgent && <span className="text-red-500">⚠️</span>}
          {task.title}
        </h3>
        <span className="text-xs text-zinc-500">{task.project}</span>
      </div>
    </div>
  );
}

function TaskCardPreview({ task }: { task: any }) {
  return (
    <div
      className={`rounded-md px-4 py-3 shadow bg-white text-black flex flex-col gap-1 ${priorities[task.priority]}`}
      style={{ width: "100%" }}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm flex items-center gap-1">
          {task.priority === "high" && <span className="text-red-500">⚠️</span>}
          {task.title}
        </h3>
        <span className="text-xs text-zinc-500">{task.project}</span>
      </div>
    </div>
  );
}

function TaskColumnDroppable({ status, children, isTargetColumn, darkMode }: { status: string, children: React.ReactNode, isTargetColumn: boolean, darkMode: boolean }) {
  const { setNodeRef } = useDroppable({
    id: status
  });

  return (
    <div
      ref={setNodeRef}
      id={status}
      className={`rounded-xl border p-5 transition-all duration-200 shadow-sm
        ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'}
        ${isTargetColumn ? 'ring-2 ring-blue-500 ring-opacity-70' : ''}`}
    >
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [darkMode, setDarkMode] = useState(true);
  const [projectFilter, setProjectFilter] = useState("All");
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [targetColumn, setTargetColumn] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const filteredTasks = tasks.filter((t) => projectFilter === "All" || t.project === projectFilter);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = String(active.id);
    const task = tasks.find(t => t.id === taskId);
    if (task) setActiveTask(task);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    
    const overId = String(over.id);
    
    // Check if we're directly over a column/status
    if (statuses.includes(overId)) {
      setActiveStatus(overId);
      setTargetColumn(overId);
      return;
    }
    
    // Otherwise, we're over a task
    const overTask = tasks.find(t => t.id === overId);
    if (overTask) {
      setActiveStatus(overTask.status);
      setTargetColumn(overTask.status);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    
    const taskId = String(active.id);
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const overId = String(over.id);
    let newStatus = task.status;
    
    // If dropped directly on a status column
    if (statuses.includes(overId)) {
      newStatus = overId;
    } 
    // If dropped on another task
    else {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (task.status !== newStatus) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }

    setActiveStatus(null);
    setActiveTask(null);
    setTargetColumn(null);
  };

  const onDragCancel = () => {
    setActiveTask(null);
    setActiveStatus(null);
    setTargetColumn(null);
  };

  return (
    <div className={`${darkMode ? "dark bg-zinc-900 text-white" : "bg-zinc-100 text-black"} min-h-screen transition-colors p-6 ${inter.className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Workflow Dashboard</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className={`px-3 py-2 border rounded-full text-sm font-medium transition ${darkMode ? 'border-zinc-700' : 'border-gray-300'} hover:bg-zinc-200 dark:hover:bg-zinc-800`}
          >
            {darkMode ? <FiSun className="inline-block" /> : <FiMoon className="inline-block" />}
          </button>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <label className="font-medium">Filter by Project:</label>
          <select
            onChange={(e) => setProjectFilter(e.target.value)}
            className={`ml-2 border px-3 py-2 rounded-md text-sm ${darkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-black'}`}
            value={projectFilter}
          >
            <option>All</option>
            <option>Client A</option>
            <option>Client B</option>
          </select>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {statuses.map((status) => {
              const columnTasks = filteredTasks.filter((task) => task.status === status);
              const isTargetColumn = targetColumn === status;
              
              return (
                <TaskColumnDroppable 
                  key={status} 
                  status={status}
                  isTargetColumn={isTargetColumn}
                  darkMode={darkMode}
                >
                  <h2 className="font-semibold text-lg mb-3 flex justify-between items-center">
                    {statusLabels[status]} <span className="text-xs font-normal text-zinc-500">{columnTasks.length} tasks</span>
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
          <DragOverlay>{activeTask ? <TaskCardPreview task={activeTask} /> : null}</DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
