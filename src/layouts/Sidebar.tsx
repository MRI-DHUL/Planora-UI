import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path: string) =>
    `block px-3 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-orange-500 text-black font-semibold"
        : "text-gray-300 hover:bg-[#1c1c1c] hover:text-white"
    }`;

  return (
    <aside className="w-60 bg-[#121212] p-5 shadow-lg flex flex-col">
      <h2 className="text-xl font-bold text-yellow-400 mb-8">Planora</h2>

      <nav className="space-y-2 flex-1">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
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
  );
}
