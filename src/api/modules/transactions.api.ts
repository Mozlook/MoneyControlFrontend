import { api } from '@/api/client'
import { apiPaths } from '@/api/apiPaths'
import type { TransactionRead, TransactionCreate, TransactionsQuery } from '@/models/transaction'

export const transactionsApi = {
  getAll: (walletId: string, params?: TransactionsQuery) =>
    api.get<TransactionRead[]>(apiPaths.wallets.transactions.getAll(walletId), params),

  create: (walletId: string, payload: TransactionCreate) =>
    api.post<TransactionRead>(apiPaths.wallets.transactions.create(walletId), payload),

  refund: (walletId: string, transactionId: string) =>
    api.post<TransactionRead>(apiPaths.wallets.transactions.refund(walletId, transactionId)),

  delete: (walletId: string, transactionId: string) =>
    api.delete<unknown>(apiPaths.wallets.transactions.delete(walletId, transactionId)),

  exportCsv: (walletId: string, params?: TransactionsQuery & { format?: 'csv' }) =>
    api.download<Blob>(apiPaths.wallets.transactions.export(walletId), {
      format: 'csv',
      ...params,
    }),
}
