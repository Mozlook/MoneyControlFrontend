import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { productsApi } from '@/api/modules'
import { getTokenFromStorage } from '@/authentication/handleToken'
import type { ProductsWithSumParams } from '@/models/product'

export default function useProductsWithSumQuery(walletId: string, params?: ProductsWithSumParams) {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  const hasDates = !!params?.from_date || !!params?.to_date

  const normalizedParams: ProductsWithSumParams | undefined = params
    ? {
        ...params,
        current_period: params.current_period ?? (hasDates ? false : true),
      }
    : undefined
  return useQuery({
    queryKey: queryKeys.wallets.products.withSum(walletId, normalizedParams),
    queryFn: () => productsApi.getAllSum(walletId, normalizedParams),
    enabled: hasToken && !!walletId,
    retry: false,
  })
}
