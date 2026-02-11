import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import type { PriorityStats } from "../../utils/dashboardUtils";

const COLORS = {
  High: "#ef4444", // red
  Medium: "#eab308", // yellow
  Low: "#22c55e", // green
};

export default function PriorityPie({ stats }: { stats: PriorityStats }) {
  const data = [
    { name: "High", value: stats.High },
    { name: "Medium", value: stats.Medium },
    { name: "Low", value: stats.Low },
  ];

  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return (
      <div className="bg-[#121212] p-6 rounded-xl text-gray-500 text-center">
        No pending tasks for selected range
      </div>
    );
  }

  return (
    <div className="bg-[#121212] p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Pending Tasks by Priority</h3>

      <div className="flex justify-center">
        <PieChart width={320} height={320}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={COLORS[d.name as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}
