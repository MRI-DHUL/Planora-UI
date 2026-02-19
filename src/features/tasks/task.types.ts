export type Repeat = "none" | "daily" | "weekly";

export type Task = {
  id: number;
  title: string;
  priority: "High" | "Medium" | "Low";
  time: string;
  completedDates: string[];
  date: string;
  repeat: Repeat;
};
