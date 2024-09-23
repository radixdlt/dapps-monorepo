export const fullDateFormatter = (date: Date | string): string => {
  const d = new Date(date)

  const dateFormatted = d.toLocaleDateString('default', {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const timeFormatted = d.toLocaleTimeString('default', {
    timeZone: 'UTC',
  })

  return `${dateFormatted}, ${timeFormatted}`
}
