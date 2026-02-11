import type { DashboardRange } from "../../types/dashboard";

export default function RangeFilter({
  range,
  setRange,
}: {
  range: DashboardRange;
  setRange: (r: DashboardRange) => void;
}) {
  return (
    <div className="flex gap-2">
      {(["today", "week", "month"] as DashboardRange[]).map((r) => (
        <button
          key={r}
          onClick={() => setRange(r)}
          className={`px-4 py-1.5 rounded-lg transition ${
            range === r
              ? "bg-orange-500 text-black font-semibold"
              : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          }`}
        >
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </button>
      ))}
    </div>
  );
}
