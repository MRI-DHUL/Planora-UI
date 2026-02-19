import { X } from "lucide-react";

export default function SettingsModal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        className="bg-[#121212] w-full max-w-xl 
               max-h-[80vh] 
               rounded-xl border border-neutral-800 
               relative flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer transition"
        >
          <X size={20} />
        </button>

        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
