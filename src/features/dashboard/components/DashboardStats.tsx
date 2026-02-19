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
  const hasData = stats.total > 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Stat title="Total Tasks" value={stats.total} muted={!hasData} />
      <Stat
        title="Completed"
        value={stats.completed}
        color="green"
        muted={!hasData}
      />
      <Stat
        title="Pending"
        value={stats.pending}
        color="yellow"
        muted={!hasData}
      />
      <Stat
        title="Overdue"
        value={stats.overdue}
        color="red"
        muted={!hasData}
      />
    </div>
  );
}

function Stat({
  title,
  value,
  color,
  muted,
}: {
  title: string;
  value: number;
  color?: "green" | "yellow" | "red";
  muted?: boolean;
}) {
  const map = {
    green: "text-green-500",
    yellow: "text-yellow-400",
    red: "text-red-500",
  };

  return (
    <div className="bg-[#121212] p-4 rounded-xl border border-neutral-800">
      <div className="text-sm text-gray-400">{title}</div>
      <div
        className={`text-2xl font-bold ${
          muted ? "text-gray-600" : color ? map[color] : "text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
