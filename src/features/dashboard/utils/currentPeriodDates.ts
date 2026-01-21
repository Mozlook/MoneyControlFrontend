export function currentPeriodDates(billingDay: number, now: Date = new Date()) {
  if (!Number.isInteger(billingDay) || billingDay < 1 || billingDay > 28) {
    throw new Error('billingDay must be an integer in range 1..28')
  }

  const today = now.getDate()
  const monthOffset = today < billingDay ? -1 : 0

  const start = new Date(now.getFullYear(), now.getMonth() + monthOffset, billingDay)

  const end = new Date(start.getFullYear(), start.getMonth() + 1, billingDay - 1)

  return {
    startDate: toYmd(start),
    endDate: toYmd(end),
  }
}

function toYmd(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
