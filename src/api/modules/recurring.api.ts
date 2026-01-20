import { api } from '@/api/client'
import { apiPaths } from '@/api/apiPaths'
import type { RecurringRead, RecurringCreate, RecurringUpdate } from '@/models/recurring'

export const recurringApi = {
  getAll: (walletId: string, params?: { active?: boolean }) =>
    api.get<RecurringRead[]>(apiPaths.wallets.recurring.getAll(walletId), params),

  create: (walletId: string, payload: RecurringCreate) =>
    api.post<RecurringRead>(apiPaths.wallets.recurring.create(walletId), payload),

  update: (walletId: string, recurringId: string, payload: RecurringUpdate) =>
    api.put<RecurringRead>(apiPaths.wallets.recurring.update(walletId, recurringId), payload),

  deactivate: (walletId: string, recurringId: string) =>
    api.delete<unknown>(apiPaths.wallets.recurring.delete(walletId, recurringId)),

  activate: (walletId: string, recurringId: string) =>
    api.put<unknown>(apiPaths.wallets.recurring.activate(walletId, recurringId)),

  apply: (walletId: string) => api.post<unknown>(apiPaths.wallets.recurring.apply(walletId)),
}
