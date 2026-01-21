export function currentPeriodDates(billingDay: number, now: Date = new Date()) {
  if (!Number.isInteger(billingDay) || billingDay < 1 || billingDay > 28) {
    throw new Error('billingDay must be an integer in range 1..28')
  }

  const today = now.getDate()
  const monthOffset = today < billingDay ? -1 : 0

  const start = new Date(now.getFullYear(), now.getMonth() + monthOffset, billingDay)

  const end = new Date(start.getFullYear(), start.getMonth() + 1, billingDay - 1)

  return {
    startDate: start,
    endDate: end,
  }
}
