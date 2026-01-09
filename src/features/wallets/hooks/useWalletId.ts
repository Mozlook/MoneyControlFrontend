import { useOutletContext } from 'react-router-dom'

type WalletOutletContext = { walletId: string }

export function useWalletId(): string {
  return useOutletContext<WalletOutletContext>().walletId
}
