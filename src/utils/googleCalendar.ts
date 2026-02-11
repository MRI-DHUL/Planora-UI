export async function createGoogleEvent(
  accessToken: string,
  event: {
    summary: string;
    description?: string;
    start: string;
    end: string;
  }
) {
  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start,
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: event.end,
          timeZone: "Asia/Kolkata",
        },
      }),
    }
  );

  return response.json();
}
