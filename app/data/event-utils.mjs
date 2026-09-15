export function partitionEvents(events, now) {
  const isPast = event => Date.parse(event.endDate ?? event.date) <= now
  return {
    upcoming: events.filter(event => !isPast(event)).sort((a, b) => Date.parse(a.date) - Date.parse(b.date)),
    past: events.filter(isPast).sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
  }
}
