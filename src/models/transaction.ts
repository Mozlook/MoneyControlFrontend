import type { CategoryRead } from './category'
import type { ProductLite } from './product'

export type TransactionsQuery = {
  current_period?: boolean
  from_date?: string
  to_date?: string
  category_id?: string
  product_id?: string
}

export type TransactionCreate = {
  category_id: string
  product_id: string
  amount: number
  currency: string
}

export type TransactionRead = {
  id: string
  wallet_id: string
  user_id: string
  refund_of_transaction_id: string | null
  type: string
  amount_base: number
  currency_base: string
  amount_original?: number
  currency_original?: string
  fx_rate?: number
  occurred_at: string
  created_at: string
  category: CategoryRead
  product: ProductLite | null
}

export type TransactionsGetAllParams = {
  current_period?: boolean
  from_date?: string // YYYY-MM-DD
  to_date?: string // YYYY-MM-DD
  category_id?: string
  product_id?: string
}
