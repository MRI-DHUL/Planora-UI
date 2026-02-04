import { Outlet, Link, useLocation } from 'react-router-dom'

export default function MainLayout() {
  const location = useLocation()

  const linkClass = (path: string) =>
    `block px-3 py-2 rounded-lg transition ${
      location.pathname === path
        ? 'bg-orange-500 text-black font-semibold'
        : 'text-gray-300 hover:bg-[#1c1c1c] hover:text-white'
    }`

  return (
    <div className="flex h-screen bg-black text-white">

      {/* Sidebar */}
      <aside className="w-60 bg-[#121212] p-5 shadow-lg">

        {/* Title */}
        <h2 className="text-xl font-bold text-yellow-400 mb-8">
          Planner
        </h2>

        {/* Nav */}
        <nav className="space-y-2">
          <Link to="/" className={linkClass('/')}>Dashboard</Link>
          <Link to="/daily" className={linkClass('/daily')}>Daily</Link>
          <Link to="/monthly" className={linkClass('/monthly')}>Monthly</Link>
        </nav>

      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto bg-black">
        <Outlet />
      </main>

    </div>
  )
}
