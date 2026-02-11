import { useNavigate, useParams } from "react-router-dom";
import TaskTable from "../components/TaskTable";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import MiniCalendar from "../components/MiniCalendar";
import GoogleConnect from "../components/Google/GoogleConnect";

const todayISO = () => new Date().toISOString().split("T")[0];

export default function Daily() {
  const navigate = useNavigate();
  const { date } = useParams<{ date: string }>();

  const selectedDate = date ?? todayISO();

  const navigateToDate = (newDate: string) => {
    navigate(`/daily/${newDate}`);
  };

  const changeDay = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    navigateToDate(d.toISOString().split("T")[0]);
  };

  const formatLabel = (dateStr: string) => {
    const today = new Date();
    const target = new Date(dateStr);

    const cleanToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const cleanTarget = new Date(
      target.getFullYear(),
      target.getMonth(),
      target.getDate(),
    );

    const diff =
      (cleanTarget.getTime() - cleanToday.getTime()) / (1000 * 60 * 60 * 24);

    const formattedDate = target.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    if (diff === 0) return `Today (${formattedDate})`;
    if (diff === -1) return `Yesterday (${formattedDate})`;
    if (diff === 1) return `Tomorrow (${formattedDate})`;

    return target.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 bg-black p-2">
      <div className="flex items-center justify-between bg-[#121212] p-4 rounded-2xl shadow-lg">
        <h1 className="text-xl font-semibold text-yellow-400">
          {formatLabel(selectedDate)}
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDay(-1)}
            className="p-2 rounded-lg bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => navigateToDate(todayISO())}
            className="p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-semibold"
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={() => changeDay(1)}
            className="p-2 rounded-lg bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white"
          >
            <ChevronRight size={18} />
          </button>

          <label className="relative p-2 rounded-lg bg-[#1c1c1c] hover:bg-[#2a2a2a] cursor-pointer text-white">
            <MiniCalendar value={selectedDate} onChange={navigateToDate} />
          </label>
        </div>
      </div>

      <GoogleConnect />
      <TaskTable date={selectedDate} />
    </div>
  );
}
