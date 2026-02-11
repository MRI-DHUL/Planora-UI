import MonthCalendar from "../components/MonthCalendar";

export default function Monthly() {
  return (
    <div className="space-y-6 bg-black p-2">
      <div className="bg-[#121212] p-4 rounded-2xl shadow-lg">
        <MonthCalendar />
      </div>
    </div>
  );
}
