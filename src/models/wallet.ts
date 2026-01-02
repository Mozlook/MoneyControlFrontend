export type WalletCreate = {
  name: string
  currency?: string
}

export type WalletRole = 'owner' | 'member'

export type WalletRead = {
  id: string
  name: string
  currency: string
  created_at: string
  role: WalletRole
}
