import type { CategoryRead } from './category'
import type { ProductLite } from './product'
export type SummaryRange = {
  current_period?: boolean
  from_date?: string
  to_date?: string
}

type MoneyAmount = number

export type ProductWithSumRead = {
  product: ProductLite
  product_sum: MoneyAmount
}

export type CategoriesWithProductsSummaryRead = {
  category: CategoryRead
  category_sum: MoneyAmount
  no_product_sum: MoneyAmount
  products: ProductWithSumRead[]
}

export type SummaryCategoriesProducts = {
  currency: string
  period_start: string
  period_end: string
  total: MoneyAmount
  categories: CategoriesWithProductsSummaryRead[]
}

export type SummaryImportance = {
  currency: string
  period_start: string
  period_end: string
  total: MoneyAmount
  necessary: MoneyAmount
  important: MoneyAmount
  unnecessary: MoneyAmount
  unassigned: MoneyAmount
}
