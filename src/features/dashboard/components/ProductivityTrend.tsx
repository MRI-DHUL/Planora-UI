import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ProductivityTrend({
  data,
}: {
  data: {
    date: string;
    completed: number;
    overdue: number;
  }[];
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#121212] p-6 rounded-xl text-gray-500 text-center">
        No productivity data available for selected range
      </div>
    );
  }

  return (
    <div className="bg-[#121212] p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Productivity Trend</h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#333" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" allowDecimals={false} />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="completed"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Completed"
            />

            <Line
              type="monotone"
              dataKey="overdue"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Overdue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
