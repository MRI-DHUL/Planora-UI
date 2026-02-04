import { useRef, useState, useCallback } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import type { Repeat } from "../utils/taskUtils";

const repeats = [
  { label: "None", value: "none", color: "text-gray-400" },
  { label: "Daily", value: "daily", color: "text-blue-400" },
  { label: "Weekly", value: "weekly", color: "text-purple-400" },
] as const;

function RepeatDropdown({
  value,
  onChange,
}: {
  value: Repeat;
  onChange: (v: Repeat) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => {
    setOpen(false);
  }, []);

  useClickOutside<HTMLDivElement>(ref, handleClickOutside);

  const current = repeats.find((r) => r.value === value)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
          bg-[#1a1a1a] border border-white/10
          transition ${current.color}
        `}
      >
        {current.label}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-24 rounded-xl bg-[#121212] border border-white/10 shadow-xl z-50">
          {repeats.map((r) => (
            <button
              key={r.value}
              onClick={() => {
                onChange(r.value);
                setOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-white/5 transition ${r.color}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default RepeatDropdown;