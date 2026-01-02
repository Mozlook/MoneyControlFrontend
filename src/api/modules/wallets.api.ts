import { api } from '@/api/client'
import { apiPaths } from '@/api/apiPaths'
import type { WalletRead, WalletCreate } from '@/models/wallet'

export const walletsApi = {
  getAll: () => api.get<WalletRead[]>(apiPaths.wallets.getAll()),

  getById: (walletId: string) => api.get<WalletRead>(apiPaths.wallets.getById(walletId)),

  create: (payload: WalletCreate) => api.post<WalletRead>(apiPaths.wallets.create(), payload),
}
