import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { walletMembersApi } from '@/api/modules'
import { getTokenFromStorage } from '@/authentication/handleToken'

export default function useWalletMembersQuery(walletId: string) {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  return useQuery({
    queryKey: queryKeys.wallets.members.all(walletId),
    queryFn: () => walletMembersApi.getAll(walletId),
    enabled: hasToken && !!walletId,
    retry: false,
  })
}
