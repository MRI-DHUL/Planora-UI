/* =================================
   TYPES — ALWAYS EXPLICIT
================================= */

export type Repeat = "none" | "daily" | "weekly"

export type Task = {
  id: number
  title: string
  priority: "High" | "Medium" | "Low"
  time: string
  completed: boolean
  date: string // YYYY-MM-DD
  repeat: Repeat
}

/* =================================
   STORAGE HELPERS
================================= */

const STORAGE_KEY = "planner_tasks"

export const getAllTasks = (): Task[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

export const saveAllTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

/* =================================
   CORE LOGIC — SINGLE SOURCE OF TRUTH
   (USED BY DAILY + MONTHLY)
================================= */

export const getTasksForDate = (date: string, tasks: Task[]): Task[] => {
  const current = new Date(date)
  current.setHours(0, 0, 0, 0)

  return tasks.filter(t => {
    const start = new Date(t.date)
    start.setHours(0, 0, 0, 0)

    if (current < start) return false

    // Exact date
    if (t.date === date) return true

    // Daily repeat → from start date onwards
    if (t.repeat === "daily") return true

    // Weekly repeat → same weekday, from start date onwards
    if (t.repeat === "weekly") {
      return start.getDay() === current.getDay()
    }

    return false
  })
}

/* =================================
   MONTHLY VIEW HELPERS
================================= */

/**
 * Used by MonthCalendar
 * Pulls tasks from storage + applies repeat rules
 */
export const getTasksByDate = (date: string): Task[] => {
  const tasks = getAllTasks()
  return getTasksForDate(date, tasks)
}

/**
 * Used for badges / counts if needed later
 */
export const getTaskCountByDate = (date: string): number => {
  return getTasksByDate(date).length
}


export const isTaskOverdue = (
  taskDate: string,
  taskTime: string,
  completed: boolean
): boolean => {
  if (completed) return false
  if (!taskTime) return false

  const today = new Date()
  const taskDateTime = new Date(`${taskDate}T${taskTime}`)

  // Only today should be considered overdue
  const todayISO = today.toISOString().split("T")[0]
  if (taskDate !== todayISO) return false

  return taskDateTime < today
}
