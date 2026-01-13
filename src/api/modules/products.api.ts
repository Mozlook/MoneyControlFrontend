import { api } from '@/api/client'
import { apiPaths } from '@/api/apiPaths'
import type {
  ProductRead,
  ProductCreate,
  ProductReadSum,
  ProductsWithSumParams,
} from '@/models/product'

export const productsApi = {
  getAll: (walletId: string, params?: { category_id?: string }) =>
    api.get<ProductRead[]>(apiPaths.wallets.products.getAll(walletId), params),

  getAllSum: (walletId: string, params?: ProductsWithSumParams) =>
    api.get<ProductReadSum[]>(apiPaths.wallets.products.getAllSum(walletId), params),

  getArchived: (walletId: string) =>
    api.get<ProductRead[]>(apiPaths.wallets.products.getAll(walletId), { deleted: true }),

  create: (walletId: string, payload: ProductCreate) =>
    api.post<ProductRead>(apiPaths.wallets.products.create(walletId), payload),

  delete: (walletId: string, productsId: string) =>
    api.delete<unknown>(apiPaths.wallets.products.delete(walletId, productsId)),

  hardDelete: (walletId: string, productsId: string) =>
    api.delete<unknown>(apiPaths.wallets.products.hardDelete(walletId, productsId)),
}
