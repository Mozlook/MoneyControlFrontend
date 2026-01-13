import { useQuery } from '@tanstack/react-query'
import { getTokenFromStorage } from '@/authentication/handleToken'
import { categoriesApi } from '@/api/modules'
import { queryKeys } from '@/queries/queryKeys'

export function useArchivedCategoriesQuery(walletId: string, enabled: boolean) {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  return useQuery({
    queryKey: queryKeys.wallets.categories.archived(walletId),
    queryFn: () => categoriesApi.getArchived(walletId),
    enabled: hasToken && !!walletId && enabled,
    retry: false,
  })
}
