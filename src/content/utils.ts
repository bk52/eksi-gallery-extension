export const dateTimeConverter = (dateStr: string): Date => {
  const [date, time] = dateStr.split(" ")
  const [day, month, year] = date.split(".").map((item) => parseInt(item))
  const [hour, minute] = time.split(":").map((item) => parseInt(item))
  return new Date(year, month - 1, day, hour, minute)
}
