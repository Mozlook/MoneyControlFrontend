import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import useWalletQuery from '@/queries/useWalletQuery'
import { Spinner, EmptyState, Button, PageHeader } from '@/ui'
import { useRecurringQuery } from '@/queries/useRecurringQuery'
import { useState } from 'react'
import CreateRecurringModal from '@/features/recurring/components/CreateRecurringModal'

export default function WalletRecurringPage() {
  const walletId = useWalletId()
  const walletQuery = useWalletQuery(walletId)
  const recurring = useRecurringQuery(walletId)
  const isOwner = walletQuery.data?.role === 'owner'

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)

  return (
    <div>
      <PageHeader
        title="Wallet Recurring"
        actions={
          isOwner && (
            <div className="flex gap-2">
              <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
                Add recurring transaction
              </Button>
            </div>
          )
        }
      ></PageHeader>
      <CreateRecurringModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        walletId={walletId}
      />

      {recurring.isPending ? (
        <div className="flex justify-center py-16">
          <Spinner size="md" />
        </div>
      ) : recurring.isError ? (
        <div className="py-16">
          <EmptyState
            title="Couldn't load recurring"
            description={
              recurring.error instanceof Error ? recurring.error.message : 'Unknown error'
            }
            action={
              <Button variant="secondary" onClick={() => recurring.refetch()}>
                Try again
              </Button>
            }
          />
        </div>
      ) : !recurring.data || recurring.data.length === 0 ? (
        <div className="py-16">
          <EmptyState
            title="No recurring transactions yet"
            action={
              isOwner && (
                <Button variant="primary" disabled>
                  Add recurring transaction
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="space-y-2 py-4">
          {recurring.data.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-3 hover:bg-slate-50"
            >
              <span>{r.category.name}</span>
              <span>{r.product?.name}</span>
              <Button variant="danger" disabled>
                Deactivate
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
