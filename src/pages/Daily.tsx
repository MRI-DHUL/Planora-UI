import { useState } from 'react'
import TaskTable from '../components/TaskTable'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import MiniCalendar from '../components/MiniCalendar'

const todayISO = () => new Date().toISOString().split('T')[0]

export default function Daily() {
    const [selectedDate, setSelectedDate] = useState(todayISO())

    const changeDay = (offset: number) => {
        const d = new Date(selectedDate)
        d.setDate(d.getDate() + offset)
        setSelectedDate(d.toISOString().split('T')[0])
    }

    const formatLabel = (dateStr: string) => {
        const today = new Date()
        const target = new Date(dateStr)

        const cleanToday = new Date(today.setHours(0, 0, 0, 0))
        const cleanTarget = new Date(target.setHours(0, 0, 0, 0))

        const diff =
            (cleanTarget.getTime() - cleanToday.getTime()) /
            (1000 * 60 * 60 * 24)

        const formattedDate = target.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })

        if (diff === 0) return `Today (${formattedDate})`
        if (diff === -1) return `Yesterday (${formattedDate})`
        if (diff === 1) return `Tomorrow (${formattedDate})`

        return target.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="space-y-6 bg-black p-2">

            {/* HEADER */}
            <div className="flex items-center justify-between bg-[#121212] p-4 rounded-2xl shadow-lg">

                {/* Title */}
                <h1 className="text-xl font-semibold text-yellow-400">
                    {formatLabel(selectedDate)}
                </h1>

                {/* ICON CONTROLS */}
                <div className="flex items-center gap-2">

                    {/* Previous */}
                    <button
                        onClick={() => changeDay(-1)}
                        className="p-2 rounded-lg bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {/* Today (Primary → Orange) */}
                    <button
                        onClick={() => setSelectedDate(todayISO())}
                        className="p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-semibold"
                    >
                        <RotateCcw size={16} />
                    </button>

                    {/* Next */}
                    <button
                        onClick={() => changeDay(1)}
                        className="p-2 rounded-lg bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white"
                    >
                        <ChevronRight size={18} />
                    </button>

                    {/* Date Picker */}
                    <label className="relative p-2 rounded-lg bg-[#1c1c1c] hover:bg-[#2a2a2a] cursor-pointer text-white">
                        <MiniCalendar
                            value={selectedDate}
                            onChange={setSelectedDate}
                        />
                    </label>

                </div>
            </div>

            {/* TASK LIST */}
            <TaskTable date={selectedDate} />

        </div>
    )
}
