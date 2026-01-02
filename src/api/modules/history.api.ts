import { api } from '@/api/client'
import { apiPaths } from '@/api/apiPaths'
import type { LastPeriodsHistoryRead } from '@/models/history'

export const historyApi = {
  lastPeriods: (walletId: string, params?: { periods?: number }) =>
    api.get<LastPeriodsHistoryRead>(apiPaths.wallets.history.lastPeriods(walletId), params),
}
