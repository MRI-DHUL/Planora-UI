import type { DashboardRange } from "../../types/dashboard";
import RangeFilter from "./RangeFilter";

export default function DashboardHeader({
  range,
  setRange,
}: {
  range: DashboardRange;
  setRange: (r: DashboardRange) => void;
}) {
  return (
    <div
      className="
        sticky top-0 z-40
        bg-[#0a0a0a]
        border-b border-neutral-800
        px-6 py-6
        flex items-center justify-between
      "
    >
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

      <RangeFilter range={range} setRange={setRange} />
    </div>
  );
}
