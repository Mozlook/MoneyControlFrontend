import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { routePaths } from '@/routes/routePaths'
import { cn, EmptyState, Spinner, Button } from '@/ui'
import { WalletSwitcher } from '@/features/wallets/components/WalletSwitcher'
import { useWalletsQuery } from '@/queries/useWalletsQuery'
import { setLastWalletId } from '@/features/wallets/storage/lastWallet'
import { useEffect } from 'react'
import useWalletQuery from '@/queries/useWalletQuery'
type WalletLayoutInnerProps = {
  walletId: string
}
export default function WalletLayoutInner({ walletId }: WalletLayoutInnerProps) {
  const navigate = useNavigate()
  const wallets = useWalletsQuery()
  const walletQuery = useWalletQuery(walletId)

  useEffect(() => {
    if (walletQuery.isSuccess) setLastWalletId(walletId)
  }, [walletId, walletQuery.isSuccess])

  if (walletQuery.isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (walletQuery.isError) {
    const err = walletQuery.error
    const httpStatus =
      typeof (err as any)?.status === 'number' ? ((err as any).status as number) : undefined

    let title = "Couldn't fetch wallet"
    if (httpStatus === 403) {
      title = "You don't have access to this wallet"
    }
    if (httpStatus === 404) {
      title = "Wallet doesn't exist"
    }
    return (
      <div className="p-6">
        <EmptyState
          title={title}
          description={err instanceof Error ? err.message : undefined}
          action={
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => walletQuery.refetch()}>
                Try again
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate(routePaths.wallets.list(), { replace: true })}
              >
                Back to wallets
              </Button>
            </div>
          }
        />
      </div>
    )
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
        <Outlet context={{ walletId }} />
      </section>
    </div>
  )
}
