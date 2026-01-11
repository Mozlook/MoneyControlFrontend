export type PeriodRangeParams = {
  current_period?: boolean
  from_date?: string // 'YYYY-MM-DD'
  to_date?: string // 'YYYY-MM-DD'
}

export type CategoriesWithSumParams = PeriodRangeParams & {
  include_empty?: boolean
}
