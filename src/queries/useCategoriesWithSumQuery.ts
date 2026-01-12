import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { categoriesApi } from '@/api/modules'
import { getTokenFromStorage } from '@/authentication/handleToken'
import type { CategoriesWithSumParams } from '@/models/category'

export default function useCategoriesWithSumQuery(
  walletId: string,
  params?: CategoriesWithSumParams,
) {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  const hasDates = !!params?.from_date || !!params?.to_date

  const normalizedParams: CategoriesWithSumParams | undefined = params
    ? {
        ...params,
        current_period: params.current_period ?? (hasDates ? false : true),
      }
    : undefined

  return useQuery({
    queryKey: queryKeys.wallets.categories.withSum(walletId, normalizedParams),
    queryFn: () => categoriesApi.getAllSum(walletId, normalizedParams),
    enabled: hasToken && !!walletId,
    retry: false,
  })
}
