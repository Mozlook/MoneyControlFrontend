import type { SummaryRange } from './summary'

export type CategoryCreate = {
  name: string
  color?: string
  icon?: string
}

export type CategoryRead = {
  id: string
  name: string
  color: string | null
  icon: string | null
  created_at: string
}

export type CategoryReadSum = CategoryRead & {
  period_sum: string
}

export type CategoriesWithSumParams = SummaryRange & {
  include_empty?: boolean
}
