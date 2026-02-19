import type { SmartInsight } from "../dashboardUtils";

export default function SmartAttentionPanel({
  insights,
}: {
  insights: SmartInsight[];
}) {
  if (insights.length === 0) {
    return (
      <div className="bg-[#121212] p-6 rounded-xl text-green-500 font-semibold">
        🎉 Everything looks under control!
      </div>
    );
  }

  const getColor = (type: string) => {
    if (type === "high") return "text-yellow-400";
    if (type === "overdue") return "text-red-500";
    return "text-purple-400";
  };

  const getLabel = (type: string) => {
    if (type === "high") return "High Priority";
    if (type === "overdue") return "Overdue";
    return "Stale Task";
  };

  return (
    <div className="bg-[#121212] p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">
        ⚠ Needs Attention ({insights.length})
      </h3>

      <div className="space-y-3">
        {insights.slice(0, 5).map((item) => (
          <div
            key={`${item.id}-${item.type}`}
            className="flex justify-between border-b border-neutral-800 pb-2"
          >
            <div>
              <div className="font-medium truncate">
                {item.title || "Untitled Task"}
              </div>
              <div className={`text-xs ${getColor(item.type)}`}>
                {getLabel(item.type)}
              </div>
            </div>

            <div className="text-xs text-gray-500">
              {item.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
