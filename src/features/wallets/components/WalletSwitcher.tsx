import type { WalletRead } from '@/models/wallet'
import { Select } from '@/ui'
import { setLastWalletId } from '../storage/lastWallet'
import { useLocation, useNavigate } from 'react-router-dom'
import { routePaths } from '@/routes/routePaths'
type WalletSwitcherProps = {
  currentWalletId: string
  wallets: WalletRead[]
}
export function WalletSwitcher({ currentWalletId, wallets }: WalletSwitcherProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function handleChange(newWalletId: string) {
    if (!newWalletId || newWalletId === currentWalletId) return
    setLastWalletId(newWalletId)

    const from = `/wallets/${currentWalletId}`
    const to = `/wallets/${newWalletId}`

    const nextPath = pathname.startsWith(from)
      ? pathname.replace(from, to)
      : routePaths.wallets.transactions(newWalletId)

    navigate(nextPath)
  }
  return (
    <Select value={currentWalletId} onChange={(e) => handleChange(e.target.value)}>
      {wallets.map((w) => (
        <option key={w.id} value={w.id}>
          {w.name} ({w.currency})
        </option>
      ))}
    </Select>
  )
}
