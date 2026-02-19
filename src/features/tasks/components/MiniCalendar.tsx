import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function MiniCalendar({
  value,
  onChange,
}: {
  value: string;
  onChange: (d: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const [viewDate, setViewDate] = useState(() => new Date(value));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewDate(new Date(value));
  }, [value]);

  /* --------------------------
     CLOSE ON OUTSIDE CLICK
  ---------------------------*/
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const goMonth = (offset: number) => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + offset);
    setViewDate(d);
  };

  return (
    <div ref={containerRef} className="relative cursor-pointer">
      {/* BUTTON */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-2 rounded-lg bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white"
      >
        <Calendar size={18} />
      </button>

      {/* POPUP */}
      {open && (
        <div
          className="
            absolute right-0 mt-2 z-50
            w-72 p-4 rounded-xl
            bg-[#121212] shadow-2xl border border-gray-800 
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => goMonth(-1)}
              className="p-1 rounded hover:bg-[#2a2a2a]"
            >
              <ChevronLeft size={16} />
            </button>

            <h3 className="text-yellow-400 font-semibold text-sm">
              {viewDate.toLocaleString("default", { month: "long" })} {year}
            </h3>

            <button
              onClick={() => goMonth(1)}
              className="p-1 rounded hover:bg-[#2a2a2a]"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* WEEK LABELS */}
          <div className="grid grid-cols-7 gap-1 text-xs text-gray-400 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={`week-${i}`} className="text-center">
                {d}
              </span>
            ))}
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 gap-1">
            {Array(firstDay)
              .fill(0)
              .map((_, i) => (
                <div key={`empty-${year}-${month}-${i}`} />
              ))}

            {days.map((d) => {
              const iso = `${year}-${String(month + 1).padStart(
                2,
                "0"
              )}-${String(d).padStart(2, "0")}`;

              const selected = iso === value;

              return (
                <button
                  key={`day-${year}-${month}-${d}`}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  className={`
                    p-2 rounded text-sm transition
                    ${
                      selected
                        ? "bg-orange-500 text-black font-semibold"
                        : "hover:bg-[#2a2a2a] text-white"
                    }
                  `}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
