import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { productsApi } from '@/api/modules'
import { getTokenFromStorage } from '@/authentication/handleToken'

export default function useProductsWithSumQuery(walletId: string, categoryId?: string) {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  return useQuery({
    queryKey: queryKeys.wallets.products.withSum(walletId, categoryId),
    queryFn: () =>
      productsApi.getAllSum(walletId, categoryId ? { category_id: categoryId } : undefined),
    enabled: hasToken && !!walletId,
    retry: false,
  })
}
