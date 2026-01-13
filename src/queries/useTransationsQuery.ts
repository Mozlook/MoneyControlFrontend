import { useQuery } from '@tanstack/react-query'
import { getTokenFromStorage } from '@/authentication/handleToken'
import { queryKeys } from '@/queries/queryKeys'
import { transactionsApi } from '@/api/modules'
import type { TransactionsGetAllParams } from '@/models/transaction'

export function useTransactionsQuery(walletId: string, params?: TransactionsGetAllParams) {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  const hasDates = !!params?.from_date || !!params?.to_date

  const normalized: TransactionsGetAllParams = params
    ? {
        ...params,
        current_period: params.current_period ?? (hasDates ? false : true),
      }
    : { current_period: true }

  return useQuery({
    queryKey: queryKeys.wallets.transactions.all(walletId, normalized),
    queryFn: () => transactionsApi.getAll(walletId, normalized),
    enabled: hasToken && !!walletId,
    retry: false,
  })
}
