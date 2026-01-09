import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { productsApi } from '@/api/modules'
import { getTokenFromStorage } from '@/authentication/handleToken'

export default function useProductsQuery(walletId: string, categoryId: string | undefined) {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  return useQuery({
    queryKey: queryKeys.wallets.products.all(walletId, categoryId),
    queryFn: () => productsApi.getAll(walletId, { category_id: categoryId }),
    enabled: hasToken && !!walletId,
    retry: false,
  })
}
