import { api } from '@/api/client'
import { apiPaths } from '@/api/apiPaths'
import type { CategoryRead, CategoryCreate, CategoryReadSum } from '@/models/category'
import type { CategoriesWithSumParams } from '@/models/hookParams'

export const categoriesApi = {
  getAll: (walletId: string) =>
    api.get<CategoryRead[]>(apiPaths.wallets.categories.getAll(walletId)),

  getAllSum: (walletId: string, params?: CategoriesWithSumParams) =>
    api.get<CategoryReadSum[]>(apiPaths.wallets.categories.getAllSum(walletId), params),

  create: (walletId: string, payload: CategoryCreate) =>
    api.post<CategoryRead>(apiPaths.wallets.categories.create(walletId), payload),

  delete: (walletId: string, categoryId: string) =>
    api.delete<unknown>(apiPaths.wallets.categories.delete(walletId, categoryId)),

  hardDelete: (walletId: string, categoryId: string) =>
    api.delete<unknown>(apiPaths.wallets.categories.hardDelete(walletId, categoryId)),
}
