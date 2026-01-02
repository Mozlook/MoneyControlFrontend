import { api } from '@/api/client'
import { apiPaths } from '@/api/apiPaths'
import type { WalletMemberRead, WalletMemberCreate } from '@/models/walletMember'

export const walletMembersApi = {
  getAll: (walletId: string) =>
    api.get<WalletMemberRead[]>(apiPaths.wallets.members.getAll(walletId)),

  create: (walletId: string, payload: WalletMemberCreate) =>
    api.post<WalletMemberRead>(apiPaths.wallets.members.create(walletId), payload),
}
