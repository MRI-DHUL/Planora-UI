/* ALWAYS export types explicitly */

export type Repeat = 'none' | 'daily' | 'weekly'

export type Task = {
  id: number
  title: string
  priority: 'High' | 'Medium' | 'Low'
  time: string
  completed: boolean
  date: string
  repeat: Repeat
}

/* =================================
   CORE LOGIC — SINGLE SOURCE OF TRUTH
================================= */
export const getTasksForDate = (date: string, tasks: Task[]) => {
  return tasks.filter(t => {
    if (t.date === date) return true

    if (t.repeat === 'daily') return true

    if (t.repeat === 'weekly') {
      const taskDay = new Date(t.date).getDay()
      const currentDay = new Date(date).getDay()
      return taskDay === currentDay
    }

    return false
  })
}
