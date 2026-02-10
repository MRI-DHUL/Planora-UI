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
import {
  getAllTasks,
  saveAllTasks,
  getTasksForDate,
  isTaskOverdue,
  isTaskCompletedOnDate,
  toggleTaskCompletionForDate,
} from "../utils/taskUtils";

function Row({
  task,
  date,
  updateTask,
  toggleComplete,
  deleteTask,
  addTask,
}: {
  task: Task;
  date: string;
  updateTask: <K extends keyof Task>(
    id: number,
    field: K,
    value: Task[K],
  ) => void;
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
        checked={isTaskCompletedOnDate(task, date)}
        onChange={() => toggleComplete(task.id)}
      />

      <div className="relative group flex-1">
        {/* OVERDUE BADGE (ABOVE NAME) */}
        {isTaskOverdue(task, date) && (
          <span
            className="
              pointer-events-none
              absolute left-0 -top-6
              opacity-0 scale-95
              transition-all duration-150
              group-hover:opacity-100 group-hover:scale-100
            "
          >
            <span
              className="
                inline-flex items-center rounded-full
                bg-red-600/20 text-red-500
                px-2 py-0.5 text-[10px] font-semibold
                border border-red-600/40
                shadow-lg
              "
            >
              Overdue
            </span>
          </span>
        )}

        {/* TASK TITLE */}
        <input
          value={task.title}
          placeholder="Task..."
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
          onChange={(e) => updateTask(task.id, "title", e.target.value)}
          className={`w-full bg-transparent outline-none transition
      ${
        isTaskCompletedOnDate(task, date)
          ? "line-through text-gray-500 opacity-60"
          : isTaskOverdue(task, date)
            ? "text-red-500 font-semibold"
            : ""
      }`}
        />
      </div>

      <PriorityDropdown
        value={task.priority}
        onChange={(v) => updateTask(task.id, "priority", v)}
      />

      <div className="relative">
        <TimeDropdown
          value={task.time}
          onChange={(v) => updateTask(task.id, "time", v)}
        />
      </div>

      <RepeatDropdown
        value={task.repeat}
        onChange={(v) => updateTask(task.id, "repeat", v)}
      />

      <button onClick={() => deleteTask(task.id)}>
        <Trash2 color="red" size={16} />
      </button>
    </div>
  );
}

export default function TaskTable({ date }: { date: string }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = getAllTasks();
    return stored.map((t) => ({
      ...t,
      completedDates: Array.isArray(t.completedDates) ? t.completedDates : [],
    }));
  });

  useEffect(() => {
    saveAllTasks(tasks);
  }, [tasks]);

  const todayTasks = getTasksForDate(date, tasks).sort(
    (a, b) =>
      Number(isTaskCompletedOnDate(a, date)) -
        Number(isTaskCompletedOnDate(b, date)) ||
      (a.time || "").localeCompare(b.time || ""),
  );

  const completed = todayTasks.filter((t) =>
    isTaskCompletedOnDate(t, date),
  ).length;

  const total = todayTasks.length;

  const sensors = useSensors(useSensor(PointerSensor));

  const getCurrentTime = () => {
    const now = new Date();
    now.setMinutes(Math.round(now.getMinutes() / 5) * 5);

    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  const addTask = () => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        priority: "Low",
        time: getCurrentTime(),
        date,
        repeat: "none",
        completedDates: [],
      },
    ]);
  };

  const deleteTask = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const toggleComplete = (id: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? toggleTaskCompletionForDate(t, date) : t)),
    );

  const updateTask = <K extends keyof Task>(
    id: number,
    field: K,
    value: Task[K],
  ) =>
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

  return (
    <div className="space-y-4">
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
                prev.filter((t) => !isTaskCompletedOnDate(t, date)),
              )
            }
            className="px-4 py-2 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400/10"
          >
            Clear
          </button>
        </div>
      </div>

      {todayTasks.length === 0 && (
        <div className="text-center text-gray-500 py-12 bg-[#121212] rounded-xl">
          ✨ Nothing planned
        </div>
      )}

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
              date={date}
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
