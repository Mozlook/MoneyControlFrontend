import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { walletsApi } from '@/api/modules'
import { getTokenFromStorage } from '@/authentication/handleToken'

export default function useWalletQuery(walletId: string) {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  return useQuery({
    queryKey: queryKeys.wallets.byId(walletId),
    queryFn: () => walletsApi.getById(walletId),
    enabled: hasToken && !!walletId,
    retry: false,
  })
}
