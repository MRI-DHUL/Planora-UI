import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasksByDate, isTaskOverdue, isTaskCompletedOnDate } from "../utils/taskUtils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthCalendar() {
  const navigate = useNavigate();
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startPadding = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="px-3 py-1 rounded bg-neutral-800 text-white"
        >
          ←
        </button>

        <h2 className="text-lg font-semibold">
          {new Date(year, month).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          onClick={nextMonth}
          className="px-3 py-1 rounded bg-neutral-800 text-white"
        >
          →
        </button>
      </div>

      {/* WEEKDAYS */}
      <div className="grid grid-cols-7 text-sm mb-2 text-neutral-400">
        {DAYS.map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-2">
        {/* Padding */}
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateKey = `${year}-${String(month + 1).padStart(
            2,
            "0",
          )}-${String(day).padStart(2, "0")}`;

          const tasks = getTasksByDate(dateKey);

          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div
              key={dateKey}
              onClick={() => navigate(`/daily/${dateKey}`)}
              className={`min-h-[110px] rounded-xl border p-2 cursor-pointer transition
                ${isToday ? "border-orange-500" : "border-neutral-700"}
                hover:bg-neutral-800`}
            >
              {/* DATE */}
              <div className="text-sm font-medium mb-1">{day}</div>

              {/* TASKS (READ-ONLY) */}
              <div className="space-y-1">
                {tasks.slice(0, 2).map((task) => {
                  const isTruncated = task.title.length > 5;
                  const shortTitle = isTruncated
                    ? task.title.slice(0, 5)
                    : task.title;

                  return (
                    <div
                      key={task.id}
                      className={`text-[11px] font-medium rounded px-1 py-0.5 truncate
                      ${
                        isTaskCompletedOnDate(task, dateKey)
                          ? "bg-green-600 text-black"
                          : isTaskOverdue(task.date, task.time, isTaskCompletedOnDate(task, dateKey))
                            ? "bg-red-800 text-white"
                            : "bg-neutral-700 text-white"
                      }`}
                    >
                      {shortTitle}
                      {isTruncated && "..."}
                    </div>
                  );
                })}

                {tasks.length > 2 && (
                  <div className="text-[11px] text-neutral-400">
                    +{tasks.length - 2} tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
