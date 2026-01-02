import type { CategoryRead } from './category'
import type { ProductLite } from './product'

export type RecurringCreate = {
  category_id: string
  product_id?: string
  amount_base: number
  currency_base: string
  description?: string
}

export type RecurringRead = {
  id: string
  wallet_id: string
  category: CategoryRead
  product: ProductLite | null
  amount_base: number
  currency_base: string
  active: boolean
  description: string | null
  created_at: string
  updated_at: string
  last_applied_at: string | null
}

export type RecurringUpdate = {
  category_id?: string
  product_id?: string | null
  amount_base?: number
  currency_base?: string
  description?: string | null
}
