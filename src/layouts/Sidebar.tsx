import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
      location.pathname.startsWith(path)
        ? "bg-orange-500 text-black font-semibold"
        : "text-gray-300 hover:bg-[#1c1c1c] hover:text-white"
    }`;

  return (
    <aside className="w-60 bg-[#121212] p-5 shadow-lg flex flex-col">
      <h2 className="text-xl font-bold text-yellow-400 mb-8">
        Planora
      </h2>

      {/* Main Navigation */}
      <nav className="space-y-2 flex-1">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link to="/daily" className={linkClass("/daily")}>
          <CalendarDays size={18} />
          Daily
        </Link>

        <Link to="/monthly" className={linkClass("/monthly")}>
          <Calendar size={18} />
          Monthly
        </Link>
      </nav>

      {/* Bottom Section */}
      <div className="pt-4 border-t border-neutral-800">
        <Link to="/settings" className={linkClass("/settings")}>
          <Settings size={18} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
