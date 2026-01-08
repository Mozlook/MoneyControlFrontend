import { useState } from 'react'
import { Link } from 'react-router-dom'
import { routePaths } from '@/routes/routePaths'
import { useWalletsQuery } from '@/queries/useWalletsQuery'
import { Button, EmptyState, PageHeader, Spinner } from '@/ui'
import CreateWalletModal from '@/features/wallets/components/CreateWalletModal'

export default function WalletsPage() {
  const walletsQuery = useWalletsQuery()

  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="p-6">
      <PageHeader
        title="Wallets"
        actions={
          <Button variant="primary" onClick={() => setCreateOpen(true)}>
            Create wallet
          </Button>
        }
      />

      {/* Modal */}
      <CreateWalletModal open={createOpen} onOpenChange={setCreateOpen} />

      {/* Body */}
      <div className="mt-6">
        {walletsQuery.isPending ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : walletsQuery.isError ? (
          <div className="py-16">
            <EmptyState
              title="Couldn't fetch wallets"
              description={
                walletsQuery.error instanceof Error ? walletsQuery.error.message : 'Unknown error'
              }
              action={
                <Button variant="secondary" onClick={() => walletsQuery.refetch()}>
                  Try again
                </Button>
              }
            />
          </div>
        ) : !walletsQuery.data || walletsQuery.data.length === 0 ? (
          <div className="py-16">
            <EmptyState
              title="You have no wallets yet"
              description="Create your first wallet to start tracking spending."
              action={
                <Button variant="primary" onClick={() => setCreateOpen(true)}>
                  Create wallet
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-3">
            {walletsQuery.data.map((wallet) => (
              <Link
                key={wallet.id}
                to={routePaths.wallets.base(wallet.id)}
                className="rounded-lg border border-slate-200 bg-white p-4 transition hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-base font-medium text-slate-900">
                      {wallet.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">Currency: {wallet.currency}</div>
                  </div>

                  <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {wallet.role}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
