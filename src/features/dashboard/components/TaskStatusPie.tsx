import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#22c55e", "#eab308", "#ef4444"];

export default function TaskStatusPie({
  stats,
}: {
  stats: {
    completed: number;
    pending: number;
    overdue: number;
    total: number;
  };
}) {
  if (stats.total === 0) {
    return (
      <div className="bg-[#121212] p-6 rounded-xl text-gray-500 text-center">
        No data for selected range
      </div>
    );
  }

  const data = [
    { name: "Completed", value: stats.completed },
    { name: "Pending", value: stats.pending },
    { name: "Overdue", value: stats.overdue },
  ];

  return (
    <div className="bg-[#121212] p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Tasks Status</h3>

      <div className="flex justify-center">
        <PieChart width={340} height={340}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={3}
            dataKey="value"
          >
            {COLORS.map((c, i) => (
              <Cell key={i} fill={c} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}
