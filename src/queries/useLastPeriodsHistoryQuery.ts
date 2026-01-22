import { useQuery } from '@tanstack/react-query'
import { getTokenFromStorage } from '@/authentication/handleToken'
import { queryKeys } from '@/queries/queryKeys'
import { historyApi } from '@/api/modules'

export default function useLastPeriodsHistoryQuery(walletId: string, periods: number) {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  const periodsOk = Number.isInteger(periods) && periods >= 2 && periods <= 8

  return useQuery({
    queryKey: queryKeys.wallets.history.lastPeriods(walletId, periods),
    queryFn: () => historyApi.lastPeriods(walletId, { periods: periods }),
    enabled: hasToken && !!walletId && periodsOk,
    retry: false,
  })
}
