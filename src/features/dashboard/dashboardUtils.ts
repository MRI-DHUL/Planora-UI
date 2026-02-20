import type { Task } from "../tasks/task.types";
import {
  getTasksForDate,
  isTaskOverdue,
  isTaskCompletedOnDate,
} from "../tasks/taskUtils";
import type { DashboardRange } from "../dashboard/dashboard.types";

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
      date: date.slice(5),
      completed,
      overdue,
    };
  });
};

export function getStreakStats(tasks: Task[]) {
  const completedDates = new Set<string>();

  tasks.forEach((task) => {
    task.completedDates?.forEach((date) => {
      completedDates.add(date);
    });
  });

  if (completedDates.size === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const format = (d: Date) => d.toISOString().split("T")[0];

  const sorted = Array.from(completedDates).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayISO = format(today);
  const yesterdayISO = format(yesterday);

  const latestCompleted = sorted[0];

  if (latestCompleted !== todayISO && latestCompleted !== yesterdayISO) {
    return { currentStreak: 0, longestStreak: calculateLongest(sorted) };
  }

  let currentStreak = 0;
  const checkDate = new Date(latestCompleted);

  while (true) {
    const iso = format(checkDate);

    if (completedDates.has(iso)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak: calculateLongest(sorted),
  };
}

function calculateLongest(sorted: string[]) {
  let longest = 0;
  let temp = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);

    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      temp++;
    } else {
      longest = Math.max(longest, temp);
      temp = 1;
    }
  }

  return Math.max(longest, temp);
}

export const getSmartInsights = (tasks: Task[]): SmartInsight[] => {
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];

  const insights: SmartInsight[] = [];

  tasks.forEach((task) => {
    const taskDate = new Date(task.date);
    const taskISO = task.date;

    const isCompleted = isTaskCompletedOnDate(task, todayISO);

    // High priority not completed
    if (task.priority === "High" && !isCompleted) {
      insights.push({
        id: task.id,
        title: task.title,
        type: "high",
        date: taskISO,
      });
    }

    // Overdue more than 2 days
    const diffDays =
      (today.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays >= 2 && isTaskOverdue(task, taskISO)) {
      insights.push({
        id: task.id,
        title: task.title,
        type: "overdue",
        date: taskISO,
      });
    }

    // Stale task (created 7+ days ago, never completed)
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
