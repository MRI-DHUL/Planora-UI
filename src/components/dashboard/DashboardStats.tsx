export default function DashboardStats({
  stats,
}: {
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Stat title="Total Tasks" value={stats.total} />
      <Stat title="Completed" value={stats.completed} color="green" />
      <Stat title="Pending" value={stats.pending} color="yellow" />
      <Stat title="Overdue" value={stats.overdue} color="red" />
    </div>
  );
}

function Stat({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color?: "green" | "yellow" | "red";
}) {
  const map = {
    green: "text-green-500",
    yellow: "text-yellow-400",
    red: "text-red-500",
  };

  return (
    <div className="bg-[#121212] p-4 rounded-xl">
      <div className="text-sm text-gray-400">{title}</div>
      <div className={`text-2xl font-bold ${color ? map[color] : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}
