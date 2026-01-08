import { NavLink, Navigate, Outlet, useParams } from 'react-router-dom'
import { routePaths } from '@/routes/routePaths'
import { cn, Spinner } from '@/ui'
import { WalletSwitcher } from '@/features/wallets/components/WalletSwitcher'
import { useWalletsQuery } from '@/queries/useWalletsQuery'
import { setLastWalletId } from '@/features/wallets/storage/lastWallet'
import { useEffect } from 'react'

export default function WalletLayout() {
  const { walletId } = useParams<{ walletId: string }>()
  const wallets = useWalletsQuery()

  if (!walletId) {
    return <Navigate to={routePaths.wallets.list()} replace />
  }

  useEffect(() => {
    setLastWalletId(walletId)
  }, [walletId])

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'inline-flex items-center rounded-md px-3 py-2 text-sm transition-colors',
      isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100',
    )

  return (
    <div className="w-full">
      <header className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            {wallets.isPending ? (
              <Spinner size="sm" />
            ) : wallets.isError ? (
              <span className="text-sm text-red-600">Couldn’t load wallets</span>
            ) : wallets.data ? (
              <WalletSwitcher currentWalletId={walletId} wallets={wallets.data} />
            ) : null}
          </div>
        </div>

        <nav className="flex flex-wrap gap-2">
          <NavLink to={routePaths.wallets.transactions(walletId)} className={tabClass}>
            Transactions
          </NavLink>
          <NavLink to={routePaths.wallets.categories(walletId)} className={tabClass}>
            Categories
          </NavLink>
          <NavLink to={routePaths.wallets.products(walletId)} className={tabClass}>
            Products
          </NavLink>
          <NavLink to={routePaths.wallets.recurring(walletId)} className={tabClass}>
            Recurring
          </NavLink>
          <NavLink to={routePaths.wallets.members(walletId)} className={tabClass}>
            Members
          </NavLink>
          <NavLink to={routePaths.wallets.dashboard(walletId)} className={tabClass}>
            Dashboard
          </NavLink>
          <NavLink to={routePaths.wallets.history(walletId)} className={tabClass}>
            History
          </NavLink>
        </nav>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <Outlet />
      </section>
    </div>
  )
}
