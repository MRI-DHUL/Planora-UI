import { useRef, useState, useCallback } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";

const times = Array.from({ length: 24 }, (_, h) =>
  ["00", "30"].map((m) => {
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const period = h < 12 ? "AM" : "PM";

    return {
      value: `${String(h).padStart(2, "0")}:${m}`,
      label: `${hour12}:${m} ${period}`,
    };
  }),
).flat();

function TimeDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => {
    setOpen(false);
  }, []);

  useClickOutside<HTMLDivElement>(ref, handleClickOutside);

  const format12Hour = (time: string) => {
    if (!time) return "";

    const [h, m] = time.split(":").map(Number);
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const period = h < 12 ? "AM" : "PM";

    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
          bg-[#1a1a1a] border border-white/10
          transition
          ${value ? "text-blue-400" : "text-gray-500"}
        `}
      >
        {value ? format12Hour(value) : "Time"}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-28 max-h-48 overflow-y-auto text-sm
                        rounded-xl bg-[#1a1a1a] border border-white/10
                        shadow-xl z-50"
        >
          {times.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                onChange(t.value);
                setOpen(false);
              }}
              className={`
                w-full px-3 py-2 text-left
                hover:bg-white/5 transition
                ${
                  t.value === value
                    ? "bg-orange-500/20 text-orange-400 font-semibold"
                    : "text-blue-400"
                }
                `}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TimeDropdown;
