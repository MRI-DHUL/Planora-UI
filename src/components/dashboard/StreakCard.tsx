import { Flame, Gauge } from "lucide-react";

export default function StreakCard({
  current,
  longest,
  score,
}: {
  current: number;
  longest: number;
  score: number;
}) {
  const getScoreColor = () => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-400";
    return "text-red-500";
  };

  return (
    <div className="bg-[#121212] p-6 rounded-xl border border-neutral-800 shadow-lg flex flex-col gap-6">
      {/* Streak Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Flame size={20} className="text-orange-500" />
          Streak Tracker
        </h3>

        <div className="grid grid-cols-2 gap-8 mt-4 py-4">
          {/* Current Streak */}
          <div>
            <div className="text-3xl font-bold text-orange-500">
              {current} Day{current !== 1 && "s"}
            </div>
            <div className="text-sm text-gray-400">Current Streak</div>
          </div>

          {/* Longest Streak */}
          <div>
            <div className="text-2xl font-semibold text-green-500">
              {longest}
            </div>
            <div className="text-sm text-gray-400">Longest Streak</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-800" />

      {/* Performance Section */}
      <div>
        <h3 className="text-lg text-gray-400 mb-2 flex items-center gap-2">
          <Gauge size={18} className="text-blue-400" />
          Performance Score
        </h3>

        <div className={`text-5xl font-bold ${getScoreColor()}`}>{score}%</div>

        <p className="text-sm text-gray-500 mt-2">
          Based on completed tasks in selected range
        </p>
      </div>
    </div>
  );
}
