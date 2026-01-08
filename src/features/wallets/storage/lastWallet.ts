const KEY = 'moneycontrol.lastWalletId'

export const getLastWalletId = (): string | null => localStorage.getItem(KEY)
export const setLastWalletId = (id: string): void => localStorage.setItem(KEY, id)
export const clearLastWalletId = (): void => localStorage.removeItem(KEY)
