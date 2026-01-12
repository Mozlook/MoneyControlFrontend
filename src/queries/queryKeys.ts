import type { CategoriesWithSumParams } from '@/models/category'
import type { ProductsWithSumParams } from '@/models/product'

export const queryKeys = {
  me: ['me'] as const,

  wallets: {
    all: ['wallets'] as const,
    byId: (walletId: string) => ['wallets', walletId] as const,
    members: {
      all: (walletId: string) => ['wallets', walletId, 'members'] as const,
    },
    categories: {
      all: (walletId: string) => ['wallets', walletId, 'categories'] as const,
      withSum: (walletId: string, params?: CategoriesWithSumParams) =>
        ['wallets', walletId, 'categories', 'with-sum', params ?? null] as const,
    },
    products: {
      all: (walletId: string, categoryId?: string) =>
        ['wallets', walletId, 'products', { categoryId: categoryId ?? null }] as const,
      withSum: (walletId: string, params?: ProductsWithSumParams) =>
        ['wallets', walletId, 'products', 'with-sum', params ?? null] as const,
    },
  },
} as const
