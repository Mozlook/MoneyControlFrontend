import type { CategoryRead } from './category'

export type ProductImportance = 'important' | 'necessary' | 'unnecessary'

export type ProductCreate = {
  name: string
  category_id: string
  importance: ProductImportance
}

export type ProductRead = {
  id: string
  name: string
  importance: ProductImportance
  created_at: string
  category: CategoryRead
}

export type ProductReadSum = ProductRead & {
  period_sum: string
}

export type ProductLite = {
  id: string
  name: string
  importance: ProductImportance
}
