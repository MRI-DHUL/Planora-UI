/* =================================
   TYPES — ALWAYS EXPLICIT
================================= */

export type Repeat = "none" | "daily" | "weekly";

export type Task = {
  id: number;
  title: string;
  priority: "High" | "Medium" | "Low";
  time: string;
  completedDates: string[]; // per-day completion
  date: string; // start date YYYY-MM-DD
  repeat: Repeat;
};

/* =================================
   STORAGE HELPERS
================================= */

const STORAGE_KEY = "planner_tasks";

export const getAllTasks = (): Task[] => {
  try {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    // Ensure stored is an array
    if (!Array.isArray(stored)) {
      return [];
    }

    // Normalize old tasks
    return stored.map((t: any) => ({
      ...t,
      completedDates: Array.isArray(t.completedDates)
        ? t.completedDates
        : [],
    }));
  } catch {
    return [];
  }
};

export const saveAllTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

/* =================================
   CORE LOGIC — SINGLE SOURCE OF TRUTH
================================= */

export const getTasksForDate = (
  date: string,
  tasks: Task[]
): Task[] => {
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);

  return tasks.filter((t) => {
    const start = new Date(t.date);
    start.setHours(0, 0, 0, 0);

    // ❌ Never show before start date
    if (current < start) return false;

    // Exact date
    if (t.date === date) return true;

    // Daily repeat
    if (t.repeat === "daily") return true;

    // Weekly repeat (same weekday)
    if (t.repeat === "weekly") {
      return start.getDay() === current.getDay();
    }

    return false;
  });
};

/* =================================
   MONTHLY VIEW HELPERS
================================= */

/**
 * Used by MonthCalendar
 * Pulls tasks from storage + applies repeat rules
 */
export const getTasksByDate = (date: string): Task[] => {
  const tasks = getAllTasks();
  return getTasksForDate(date, tasks);
};

/* =================================
   COMPLETION (PER DAY)
================================= */

export const isTaskCompletedOnDate = (
  task: Task,
  date: string
): boolean => {
  return Array.isArray(task.completedDates)
    ? task.completedDates.includes(date)
    : false;
};

export const toggleTaskCompletionForDate = (
  task: Task,
  date: string
): Task => {
  const completed = isTaskCompletedOnDate(task, date);

  return {
    ...task,
    completedDates: completed
      ? task.completedDates.filter((d) => d !== date)
      : [...task.completedDates, date],
  };
};

/* =================================
   OVERDUE — FINAL & CORRECT
================================= */

/**
 * A task is overdue if:
 * - Not completed for that date
 * - Has a time
 * - date + time < now
 *
 * Works for yesterday, today, and any past date.
 */
export const isTaskOverdue = (
  task: Task,
  date: string
): boolean => {
  // Completed for this date → never overdue
  if (isTaskCompletedOnDate(task, date)) return false;

  // No time → cannot be overdue
  if (!task.time) return false;

  const taskDateTime = new Date(`${date}T${task.time}`);
  const now = new Date();

  return taskDateTime < now;
};
