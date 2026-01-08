import type { WalletRead } from '@/models/wallet'
import { Select } from '@/ui'
type WalletSwitcherProps = {
  currentWalletId: string
  wallets: WalletRead[]
}
export function WalletSwitcher({ currentWalletId, wallets }: WalletSwitcherProps) {
  const currentWallet = wallets.find((wallet) => wallet.id === currentWalletId)
  return (
    <div>
      <Select value={currentWallet?.name}>
        {wallets.map((wallet) => (
          <option>{wallet.name}</option>
        ))}
      </Select>
    </div>
  )
}
