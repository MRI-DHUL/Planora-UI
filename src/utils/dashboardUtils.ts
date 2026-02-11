import type { Task } from "./taskUtils";
import {
  getTasksForDate,
  isTaskOverdue,
  isTaskCompletedOnDate,
} from "./taskUtils";
import type { DashboardRange } from "../types/dashboard";

export type PriorityStats = {
  High: number;
  Medium: number;
  Low: number;
};

export type SmartInsight = {
  id: number;
  title: string;
  type: "high" | "overdue" | "stale";
  date: string;
};

export const getDatesForRange = (range: DashboardRange): string[] => {
  const now = new Date();
  const dates: string[] = [];

  if (range === "today") {
    dates.push(now.toISOString().split("T")[0]);
  }

  if (range === "week") {
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
  }

  if (range === "month") {
    const y = now.getFullYear();
    const m = now.getMonth();
    const days = new Date(y, m + 1, 0).getDate();

    for (let d = 1; d <= days; d++) {
      dates.push(
        `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      );
    }
  }

  return dates;
};

export const getPriorityStats = (
  tasks: Task[],
  range: DashboardRange,
): PriorityStats => {
  const now = new Date();
  const dates: string[] = [];

  if (range === "today") {
    dates.push(now.toISOString().split("T")[0]);
  }

  if (range === "week") {
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
  }

  if (range === "month") {
    const y = now.getFullYear();
    const m = now.getMonth();
    const days = new Date(y, m + 1, 0).getDate();

    for (let d = 1; d <= days; d++) {
      dates.push(
        `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      );
    }
  }

  const allTasks = dates.flatMap((date) => getTasksForDate(date, tasks));

  return {
    High: allTasks.filter((t) => t.priority === "High").length,
    Medium: allTasks.filter((t) => t.priority === "Medium").length,
    Low: allTasks.filter((t) => t.priority === "Low").length,
  };
};

export type OverdueTrendPoint = {
  date: string;
  overdue: number;
};

export const getProductivityTrend = (tasks: Task[], range: DashboardRange) => {
  const now = new Date();
  const dates: string[] = [];

  if (range === "today") {
    dates.push(now.toISOString().split("T")[0]);
  }

  if (range === "week") {
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
  }

  if (range === "month") {
    const y = now.getFullYear();
    const m = now.getMonth();
    const days = new Date(y, m + 1, 0).getDate();

    for (let d = 1; d <= days; d++) {
      dates.push(
        `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      );
    }
  }

  return dates.map((date) => {
    const dayTasks = getTasksForDate(date, tasks);

    const completed = dayTasks.filter((task) =>
      isTaskCompletedOnDate(task, date),
    ).length;

    const overdue = dayTasks.filter((task) => isTaskOverdue(task, date)).length;

    return {
      date: date.slice(5), // MM-DD
      completed,
      overdue,
    };
  });
};

export const getStreakStats = (tasks: Task[]) => {
  const today = new Date();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // We check last 365 days max
  for (let i = 365; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    const dayTasks = getTasksForDate(dateStr, tasks);

    const completedCount = dayTasks.filter((task) =>
      isTaskCompletedOnDate(task, dateStr),
    ).length;

    if (completedCount > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }

    // Current streak = from today backwards
    if (i === 0) {
      let j = 0;
      while (true) {
        const checkDate = new Date();
        checkDate.setDate(today.getDate() - j);
        const checkStr = checkDate.toISOString().split("T")[0];

        const checkTasks = getTasksForDate(checkStr, tasks);

        const completed = checkTasks.filter((task) =>
          isTaskCompletedOnDate(task, checkStr),
        ).length;

        if (completed > 0) {
          currentStreak++;
          j++;
        } else {
          break;
        }
      }
    }
  }

  return {
    currentStreak,
    longestStreak,
  };
};

export const getSmartInsights = (tasks: Task[]): SmartInsight[] => {
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];

  const insights: SmartInsight[] = [];

  tasks.forEach((task) => {
    const taskDate = new Date(task.date);
    const taskISO = task.date;

    const isCompleted = isTaskCompletedOnDate(task, todayISO);

    // 1️⃣ High priority not completed
    if (task.priority === "High" && !isCompleted) {
      insights.push({
        id: task.id,
        title: task.title,
        type: "high",
        date: taskISO,
      });
    }

    // 2️⃣ Overdue more than 2 days
    const diffDays =
      (today.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays >= 2 && isTaskOverdue(taskISO, todayISO)) {
      insights.push({
        id: task.id,
        title: task.title,
        type: "overdue",
        date: taskISO,
      });
    }

    // 3️⃣ Stale task (created 7+ days ago, never completed)
    if (diffDays >= 7 && task.completedDates.length === 0) {
      insights.push({
        id: task.id,
        title: task.title,
        type: "stale",
        date: taskISO,
      });
    }
  });

  return insights;
};

export const getPerformanceScore = (completed: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};
