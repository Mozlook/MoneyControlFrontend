import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { categoriesApi } from '@/api/modules'
import { getTokenFromStorage } from '@/authentication/handleToken'

export default function useCategoriesQuery(walletId: string) {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  return useQuery({
    queryKey: queryKeys.wallets.categories.all(walletId),
    queryFn: () => categoriesApi.getAll(walletId),
    enabled: hasToken && !!walletId,
    retry: false,
  })
}
