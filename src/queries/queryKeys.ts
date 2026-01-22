import type { CategoriesWithSumParams } from '@/models/category'
import type { ProductsWithSumParams } from '@/models/product'
import type { RecurringParams } from '@/models/recurring'
import type { SummaryRange } from '@/models/summary'
import type { TransactionsGetAllParams } from '@/models/transaction'

export const queryKeys = {
  me: ['me'] as const,
  settings: ['me', 'settings'] as const,

  wallets: {
    all: ['wallets'] as const,
    byId: (walletId: string) => ['wallets', walletId] as const,
    members: {
      all: (walletId: string) => ['wallets', walletId, 'members'] as const,
    },
    categories: {
      root: (walletId: string) => ['wallets', walletId, 'categories'] as const,
      all: (walletId: string) => ['wallets', walletId, 'categories'] as const,
      withSum: (walletId: string, params?: CategoriesWithSumParams) =>
        ['wallets', walletId, 'categories', 'with-sum', params ?? null] as const,
      archived: (walletId: string) => ['wallets', walletId, 'categories', 'archived'] as const,
    },

    products: {
      root: (walletId: string) => ['wallets', walletId, 'products'] as const,
      all: (walletId: string, categoryId?: string) =>
        ['wallets', walletId, 'products', { categoryId: categoryId ?? null }] as const,
      withSum: (walletId: string, params?: ProductsWithSumParams) =>
        ['wallets', walletId, 'products', 'with-sum', params ?? null] as const,
      archived: (walletId: string) => ['wallets', walletId, 'products', 'archived'] as const,
    },
    transactions: {
      root: (walletId: string) => ['wallets', walletId, 'transactions'] as const,

      all: (walletId: string, params?: TransactionsGetAllParams) =>
        ['wallets', walletId, 'transactions', params ?? null] as const,
    },
    recurring: {
      root: (walletId: string) => ['wallets', walletId, 'recurring'] as const,
      all: (walletId: string, params?: RecurringParams) =>
        ['wallets', walletId, 'recurring', params ?? null] as const,
    },
    summary: {
      root: (walletId: string) => ['wallets', walletId, 'summary'] as const,
      byImportance: (walletId: string, params: SummaryRange) =>
        ['wallets', walletId, 'summary', 'importance', params] as const,
      categoriesProducts: (walletId: string, params: SummaryRange) =>
        ['wallets', walletId, 'summary', 'categoriesProducts', params] as const,
    },
  },
} as const
