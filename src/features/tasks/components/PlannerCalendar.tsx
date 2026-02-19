import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import googleCalendarPlugin from '@fullcalendar/google-calendar'

export default function PlannerCalendar() {
  return (
    <div className="bg-[#121212] rounded-2xl p-4 shadow-lg">

      <FullCalendar
        plugins={[dayGridPlugin, googleCalendarPlugin]}
        initialView="dayGridMonth"
        height="auto"

        googleCalendarApiKey="YOUR_API_KEY"

        events={{
          googleCalendarId: 'primary'
        }}

        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}

        themeSystem="standard"
      />
    </div>
  )
}
