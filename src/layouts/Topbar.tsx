import { useLocation } from "react-router-dom";
import { useTaskStore } from "../features/tasks/taskStore";
import RangeFilter from "../features/dashboard/components/RangeFilter";

export default function Topbar() {
  const location = useLocation();
  const range = useTaskStore((s) => s.dashboardRange);
  const setRange = useTaskStore((s) => s.setDashboardRange);

  const getTitle = () => {
    if (location.pathname.includes("dashboard")) return "Dashboard";
    if (location.pathname.includes("daily")) return "Daily Planner";
    if (location.pathname.includes("monthly")) return "Monthly Planner";
    if (location.pathname.includes("settings")) return "Settings";
    return "";
  };

  const isDashboard = location.pathname.includes("dashboard");

  return (
    <div className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-neutral-800 px-6 py-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold">{getTitle()}</h1>

      {isDashboard && (
        <RangeFilter range={range} setRange={setRange} />
      )}
    </div>
  );
}
