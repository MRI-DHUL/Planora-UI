import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  onClick: () => void;
}

export default function SettingsCard({ icon: Icon, title, description, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="aspect-square bg-[#121212] border border-neutral-800 
                 rounded-2xl flex flex-col items-center justify-center 
                 gap-4 hover:border-orange-500 hover:scale-[1.03] 
                 transition-all duration-200 cursor-pointer"
    >
      <Icon size={42} className="text-orange-500" strokeWidth={1.5} />

      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
