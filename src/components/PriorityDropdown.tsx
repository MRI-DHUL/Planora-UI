import { useRef, useState, useCallback } from "react";
import { useClickOutside } from "../hooks/useClickOutside";

type Priority = "High" | "Medium" | "Low";

const priorities = [
  { label: "High", value: "High", color: "text-orange-400" },
  { label: "Medium", value: "Medium", color: "text-yellow-400" },
  { label: "Low", value: "Low", color: "text-green-400" },
] as const;

function PriorityDropdown({
  value,
  onChange,
}: {
  value: Priority;
  onChange: (v: Priority) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => {
    setOpen(false);
  }, []);

  useClickOutside<HTMLDivElement>(ref, handleClickOutside);

  const current = priorities.find((p) => p.value === value)!;

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
        <div className="absolute right-0 mt-2 w-23 rounded-xl bg-[#121212] border border-white/10 shadow-xl z-50">
          {priorities.map((p) => (
            <button
              key={p.value}
              onClick={() => {
                onChange(p.value);
                setOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-white/5 transition ${p.color}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PriorityDropdown;
