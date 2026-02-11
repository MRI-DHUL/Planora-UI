import { useEffect } from "react";
import { useTaskStore } from "../store/taskStore";
import { Outlet, Link, useLocation } from "react-router-dom";
import RangeFilter from "../components/dashboard/RangeFilter";

export default function MainLayout() {
  const loadTasks = useTaskStore((s) => s.loadTasks);
  const range = useTaskStore((s) => s.dashboardRange);
  const setRange = useTaskStore((s) => s.setDashboardRange);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const location = useLocation();
  const isDashboard = location.pathname === "/";

  const linkClass = (path: string) =>
    `block px-3 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-orange-500 text-black font-semibold"
        : "text-gray-300 hover:bg-[#1c1c1c] hover:text-white"
    }`;

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-60 bg-[#121212] p-5 shadow-lg flex flex-col">
        <h2 className="text-xl font-bold text-yellow-400 mb-8">Planner</h2>

        <nav className="space-y-2 flex-1">
          <Link to="/" className={linkClass("/")}>
            Dashboard
          </Link>
          <Link to="/daily" className={linkClass("/daily")}>
            Daily
          </Link>
          <Link to="/monthly" className={linkClass("/monthly")}>
            Monthly
          </Link>
        </nav>
      </aside>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* GLOBAL STICKY TOP BAR */}
        <div className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-neutral-800 px-6 py-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {isDashboard
              ? "Dashboard"
              : location.pathname.includes("daily")
                ? "Daily Planner"
                : "Monthly Planner"}
          </h1>

          {isDashboard && <RangeFilter range={range} setRange={setRange} />}
        </div>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
