import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { summaryApi } from '@/api/modules'
import { getTokenFromStorage } from '@/authentication/handleToken'
import type { SummaryRange } from '@/models/summary'

export default function useCategoriesProductsQuery(walletId: string, params: SummaryRange) {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  const hasValidRange =
    params.current_period === true ||
    (!!params.from_date && !!params.to_date && params.from_date <= params.to_date)

  return useQuery({
    queryKey: queryKeys.wallets.summary.categoriesProducts(walletId, params),
    queryFn: () => summaryApi.categoriesProducts(walletId, params),
    enabled: hasToken && !!walletId && hasValidRange,
    retry: false,
  })
}
