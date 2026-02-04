import { useState, useEffect } from "react";
import PriorityDropdown from "./PriorityDropdown";
import RepeatDropdown from "./RepeatDropdown";
import TimeDropdown from "./TimeDropdown";
import { Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Task } from "../utils/taskUtils";
import { getTasksForDate } from "../utils/taskUtils";

/* =========================
   SORTABLE ROW
========================= */
function Row({
  task,
  updateTask,
  toggleComplete,
  deleteTask,
  addTask,
}: {
  task: Task;
  updateTask: <K extends keyof Task>(id: number, field: K, value: Task[K]) => void;
  toggleComplete: (id: number) => void;
  deleteTask: (id: number) => void;
  addTask: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-3 p-4 rounded-2xl bg-app-card hover:bg-app-dark transition"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical size={18} />
      </div>

      <input
        type="checkbox"
        className="accent-app-orange"
        checked={task.completed}
        onChange={() => toggleComplete(task.id)}
      />

      {/* TITLE */}
      <input
        value={task.title}
        placeholder="Task..."
        onKeyDown={(e) => {
          if (e.key === "Enter") addTask();
        }}
        onChange={(e) => updateTask(task.id, "title", e.target.value)}
        className={`flex-1 bg-transparent outline-none transition ${
          task.completed ? "line-through text-gray-500 opacity-60" : ""
        }`}
      />

      {/* PRIORITY */}
      <PriorityDropdown
        value={task.priority}
        onChange={(v) => updateTask(task.id, "priority", v)}
      />

      {/* TIME */}
      <div className="relative">
        <TimeDropdown
          value={task.time}
          onChange={(v) => updateTask(task.id, "time", v)}
        />
      </div>

      {/* REPEAT */}
      <RepeatDropdown
        value={task.repeat}
        onChange={(v) => updateTask(task.id, "repeat", v)}
      />

      {/* DELETE */}
      <button onClick={() => deleteTask(task.id)}>
        <Trash2 color="red" size={16} />
      </button>
    </div>
  );
}

/* =========================
   MAIN
========================= */

export default function TaskTable({ date }: { date: string }) {
  const [tasks, setTasks] = useState<Task[]>(() =>
    JSON.parse(localStorage.getItem("planner_tasks") || "[]"),
  );

  useEffect(() => {
    localStorage.setItem("planner_tasks", JSON.stringify(tasks));
  }, [tasks]);

  /* FILTER + SORT */
  const todayTasks = getTasksForDate(date, tasks).sort(
    (a, b) =>
      Number(a.completed) - Number(b.completed) ||
      (a.time || "").localeCompare(b.time || ""),
  );

  const completed = todayTasks.filter((t) => t.completed).length;
  const total = todayTasks.length;

  const sensors = useSensors(useSensor(PointerSensor));

  const getCurrentTime = () => {
  const now = new Date();
  now.setMinutes(Math.round(now.getMinutes() / 5) * 5);

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

  /* ACTIONS */
  const addTask = () => {
  setTasks((prev) => [
    ...prev,
    {
      id: Date.now(),
      title: "",
      priority: "Low",
      time: getCurrentTime(),
      completed: false,
      date,
      repeat: "none",
    },
  ]);
};

  const deleteTask = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const toggleComplete = (id: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

  const updateTask = <K extends keyof Task>(id: number, field: K, value: Task[K]) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todayTasks.findIndex((t) => t.id === active.id);
    const newIndex = todayTasks.findIndex((t) => t.id === over.id);

    const reordered = arrayMove(todayTasks, oldIndex, newIndex);
    const others = tasks.filter((t) => !todayTasks.includes(t));

    setTasks([...others, ...reordered]);
  };

  /* =========================
       UI
    ========================= */

  return (
    <div className="space-y-4">
      {/* HEADER CONTROLS */}
      <div
        className="
                flex items-center justify-between
                bg-[#121212]
                p-4 rounded-xl shadow-md"
      >
        <span className="text-sm text-gray-400">
          {completed}/{total} completed
        </span>

        <div className="flex gap-2">
          <button
            onClick={addTask}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black rounded-lg font-semibold"
          >
            + Add
          </button>

          <button
            onClick={() =>
              setTasks((prev) =>
                prev.filter((t) => !(t.date === date && t.completed)),
              )
            }
            className="px-4 py-2 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400/10"
          >
            Clear
          </button>
        </div>
      </div>

      {/* EMPTY */}
      {todayTasks.length === 0 && (
        <div className="text-center text-gray-500 py-12 bg-[#121212] rounded-xl">
          ✨ Nothing planned
        </div>
      )}

      {/* LIST */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={todayTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {todayTasks.map((task) => (
            <Row
              key={task.id}
              task={task}
              updateTask={updateTask}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
              addTask={addTask}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
