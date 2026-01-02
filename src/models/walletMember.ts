import type { WalletRole } from '@/models/wallet'

export type WalletMemberRead = {
  user_id: string
  email: string
  display_name: string | null
  role: WalletRole
}

export type WalletMemberCreate =
  | { email: string; user_id?: never }
  | { user_id: string; email?: never }
