export type PeriodTotalRead = {
  period_start: string
  period_end: string
  total: number
}

export type LastPeriodsHistoryRead = {
  currency: string
  periods: PeriodTotalRead[]
}
