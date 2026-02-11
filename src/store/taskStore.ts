import { create } from "zustand";
import type { Task } from "../utils/taskUtils";
import { toggleTaskCompletionForDate } from "../utils/taskUtils";
import type { DashboardRange } from "../types/dashboard";

const STORAGE_KEY = "planner_tasks";

type TaskState = {
  tasks: Task[];

  /* Global Dashboard Filter */
  dashboardRange: DashboardRange;
  setDashboardRange: (range: DashboardRange) => void;

  loadTasks: () => void;

  addTask: (task: Task) => void;
  updateTask: <K extends keyof Task>(
    id: number,
    field: K,
    value: Task[K],
  ) => void;
  deleteTask: (id: number) => void;

  toggleCompleteForDate: (id: number, date: string) => void;
  reorderTasks: (tasks: Task[]) => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],

  /* Dashboard Filter (Global UI State) */
  dashboardRange: "week",
  setDashboardRange: (range) => set({ dashboardRange: range }),

  /* Load once on app start */
  loadTasks: () => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (!Array.isArray(stored)) {
      set({ tasks: [] });
      return;
    }

    const normalized = stored.map((t: any) => ({
      ...t,
      completedDates: Array.isArray(t.completedDates) ? t.completedDates : [],
    }));

    set({ tasks: normalized });
  },

  addTask: (task) =>
    set((state) => {
      const updated = [...state.tasks, task];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { tasks: updated };
    }),

  updateTask: (id, field, value) =>
    set((state) => {
      const updated = state.tasks.map((t) =>
        t.id === id ? { ...t, [field]: value } : t,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { tasks: updated };
    }),

  deleteTask: (id) =>
    set((state) => {
      const updated = state.tasks.filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { tasks: updated };
    }),

  toggleCompleteForDate: (id, date) =>
    set((state) => {
      const updated = state.tasks.map((t) =>
        t.id === id ? toggleTaskCompletionForDate(t, date) : t,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { tasks: updated };
    }),

  reorderTasks: (tasks) =>
    set(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return { tasks };
    }),
}));
