import { useQuery } from '@tanstack/react-query'
import { getTokenFromStorage } from '@/authentication/handleToken'
import { productsApi } from '@/api/modules'
import { queryKeys } from '@/queries/queryKeys'

export function useArchivedProductsQuery(walletId: string, enabled: boolean) {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  return useQuery({
    queryKey: queryKeys.wallets.products.archived(walletId),
    queryFn: () => productsApi.getArchived(walletId),
    enabled: hasToken && !!walletId && enabled,
    retry: false,
  })
}
