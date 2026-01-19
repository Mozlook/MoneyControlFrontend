import { useQuery } from '@tanstack/react-query'
import { getTokenFromStorage } from '@/authentication/handleToken'
import { recurringApi } from '@/api/modules'
import { queryKeys } from '@/queries/queryKeys'
import type { RecurringParams } from '@/models/recurring'

export function useRecurringQuery(walletId: string, params?: RecurringParams) {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  return useQuery({
    queryKey: queryKeys.wallets.recurring.all(walletId, params),
    queryFn: () => recurringApi.getAll(walletId, params),
    enabled: hasToken && !!walletId,
    retry: false,
  })
}
