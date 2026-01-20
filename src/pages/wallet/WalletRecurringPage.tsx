import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import useWalletQuery from '@/queries/useWalletQuery'
import { Spinner, EmptyState, Button, PageHeader, ConfirmModal, notify } from '@/ui'
import { useRecurringQuery } from '@/queries/useRecurringQuery'
import { useState } from 'react'
import CreateRecurringModal from '@/features/recurring/components/CreateRecurringModal'
import RecurringTransactionsItem from '@/features/recurring/components/RecurringTransactionsItem'
import type { RecurringRead } from '@/models/recurring'
import EditRecurringModal from '@/features/recurring/components/EditRecurringModal'
import { recurringApi } from '@/api/modules'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'

export default function WalletRecurringPage() {
  const walletId = useWalletId()
  const walletQuery = useWalletQuery(walletId)
  const recurring = useRecurringQuery(walletId)
  const isOwner = walletQuery.data?.role === 'owner'

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [editing, setEditing] = useState<RecurringRead | null>(null)
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)

  const [deactivating, setDeactivating] = useState<RecurringRead | null>(null)

  const queryClient = useQueryClient()
  const deactivateMutation = useMutation({
    mutationFn: (recurringId: string) => recurringApi.deactivate(walletId, recurringId),
    onSuccess: () => {
      notify.success('Recurring transaction deactivated')
      setDeactivating(null)
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.recurring.root(walletId) })
    },
    onError: (err) => {
      notify.fromError(err)
    },
  })

  function onEdit(item: RecurringRead) {
    setEditing(item)
    setIsEditOpen(true)
  }
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
      {editing && (
        <EditRecurringModal
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          walletId={walletId}
          item={editing}
        />
      )}
      <ConfirmModal
        open={!!deactivating}
        onOpenChange={() => setDeactivating(null)}
        title={deactivating ? `Refund transaction ${deactivating.id} ` : 'Refund transaction?'}
        description="This will create a new refund transaction with opposite amount."
        confirmText="Refund"
        confirmVariant="danger"
        confirmLoading={deactivateMutation.isPending}
        confirmDisabled={!deactivating}
        onConfirm={() => {
          if (!deactivating) return
          deactivateMutation.mutate(deactivating.id)
        }}
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
            <RecurringTransactionsItem
              key={r.id}
              item={r}
              showActions={isOwner}
              onEdit={() => onEdit(r)}
              setDeactivating={setDeactivating}
            />
          ))}
        </div>
      )}
    </div>
  )
}
