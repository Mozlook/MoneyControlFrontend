import { NavLink, Navigate, Outlet, useParams } from 'react-router-dom'
import { routePaths } from '@/routes/routePaths'
import { cn } from '@/ui'

export default function WalletLayout() {
  const { walletId } = useParams<{ walletId: string }>()

  if (!walletId) {
    return <Navigate to={routePaths.wallets.list()} replace />
  }

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
            <h1 className="text-lg font-semibold text-slate-900">Wallet</h1>
            <p className="text-sm text-slate-600">ID: {walletId}</p>
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
