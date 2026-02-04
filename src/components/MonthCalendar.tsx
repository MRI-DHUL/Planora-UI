import { useNavigate } from 'react-router-dom'
import type { Task } from '../utils/taskUtils'
import { getTasksForDate } from '../utils/taskUtils'

export default function MonthCalendar() {
  const navigate = useNavigate()

  const tasks: Task[] = JSON.parse(
    localStorage.getItem('planner_tasks') || '[]'
  )

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const totalDays = new Date(year, month + 1, 0).getDate()

  const toISO = (d: number) =>
    new Date(year, month, d).toISOString().split('T')[0]

  return (
    <div className="grid grid-cols-7 gap-3">
      {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
        const iso = toISO(day)
        const count = getTasksForDate(iso, tasks).length

        return (
          <div
            key={day}
            onClick={() => navigate(`/daily?date=${iso}`)}
            className="cursor-pointer rounded-xl bg-gray-800 p-3 h-24 flex flex-col justify-between hover:bg-gray-700"
          >
            <span>{day}</span>

            {count > 0 && (
              <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">
                {count}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
