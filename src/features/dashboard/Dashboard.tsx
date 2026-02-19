import { useMemo } from "react";
import { useTaskStore } from "../tasks/taskStore";
import {
  getTasksForDate,
  isTaskCompletedOnDate,
  isTaskOverdue,
} from "../tasks/taskUtils";
import {
  getPriorityStats,
  getProductivityTrend,
  getStreakStats,
  getSmartInsights,
  getPerformanceScore,
} from "./dashboardUtils";

import SmartAttentionPanel from "./components/SmartAttentionPanel";
import StreakCard from "./components/StreakCard";
import ProductivityTrend from "./components/ProductivityTrend";
import DashboardStats from "./components/DashboardStats";
import TaskStatusPie from "./components/TaskStatusPie";
import PriorityPie from "./components/PriorityPie";

const todayISO = () => new Date().toISOString().split("T")[0];

export default function Dashboard() {
  const tasks = useTaskStore((s) => s.tasks);
  const range = useTaskStore((s) => s.dashboardRange);

  console.log("Dashboard range:", range);

  const priorityStats = useMemo(
    () => getPriorityStats(tasks, range),
    [tasks, range],
  );

  const productivityTrend = useMemo(
    () => getProductivityTrend(tasks, range),
    [tasks, range],
  );

  const streakStats = useMemo(() => getStreakStats(tasks), [tasks]);

  const smartInsights = useMemo(() => getSmartInsights(tasks), [tasks]);

  const stats = useMemo(() => {
    const now = new Date();
    const dates: string[] = [];

    if (range === "today") {
      dates.push(todayISO());
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

    let completed = 0;
    let overdue = 0;
    let pending = 0;

    dates.forEach((date) => {
      const dayTasks = getTasksForDate(date, tasks);

      dayTasks.forEach((task) => {
        if (isTaskCompletedOnDate(task, date)) {
          completed++;
        } else if (isTaskOverdue(task, date)) {
          overdue++;
        } else {
          pending++;
        }
      });
    });

    return {
      completed,
      overdue,
      pending,
      total: completed + overdue + pending,
    };
  }, [tasks, range]);

  const performanceScore = getPerformanceScore(stats.completed, stats.total);

  const noData = stats.total === 0;

  return (
    <div className="space-y-8">
      {noData && (
        <div className="bg-[#121212] p-6 rounded-xl text-gray-500 text-center">
          No tasks found for selected range. Start adding tasks to see
          analytics.
        </div>
      )}

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StreakCard
          current={streakStats.currentStreak}
          longest={streakStats.longestStreak}
          score={performanceScore}
        />

        <TaskStatusPie stats={stats} />
      </div>

      <SmartAttentionPanel insights={smartInsights} />

      <PriorityPie stats={priorityStats} />

      <ProductivityTrend data={productivityTrend} />
    </div>
  );
}
