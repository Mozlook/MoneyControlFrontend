import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/api/modules'
import { queryKeys } from '@/queries/queryKeys'
import {
  Button,
  ConfirmModal,
  EmptyState,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Spinner,
  notify,
} from '@/ui'
import { useArchivedProductsQuery } from '@/queries/useArchivedProductsQuery'

type ArchivedCategoriesModalProps = {
  walletId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ArchivedProductModal({
  walletId,
  open,
  onOpenChange,
}: ArchivedCategoriesModalProps) {
  const queryClient = useQueryClient()

  const archivedQuery = useArchivedProductsQuery(walletId, open)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toHardDelete, setToHardDelete] = useState<{ id: string; name: string } | null>(null)

  const hardDeleteMutation = useMutation({
    mutationFn: (productsId: string) => productsApi.hardDelete(walletId, productsId),
    onSuccess: () => {
      notify.success('Product permanently deleted')

      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.products.all(walletId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.products.archived(walletId) })

      setToHardDelete(null)
      setConfirmOpen(false)
    },
    onError: (err) => {
      notify.fromError(err, 'Failed to hard delete product')
    },
  })

  function askHardDelete(category: { id: string; name: string }) {
    setToHardDelete({ id: category.id, name: category.name })
    setConfirmOpen(true)
  }

  function handleConfirmOpenChange(nextOpen: boolean) {
    if (hardDeleteMutation.isPending) return
    setConfirmOpen(nextOpen)
    if (!nextOpen) setToHardDelete(null)
  }

  function handleConfirmHardDelete() {
    if (!toHardDelete) return
    hardDeleteMutation.mutate(toHardDelete.id)
  }

  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Archived categories</ModalTitle>
          </ModalHeader>

          {archivedQuery.isPending ? (
            <div className="flex justify-center py-10">
              <Spinner size="md" />
            </div>
          ) : archivedQuery.isError ? (
            <div className="py-6">
              <EmptyState
                title="Couldn't load archived categories"
                description={
                  archivedQuery.error instanceof Error
                    ? archivedQuery.error.message
                    : 'Unknown error'
                }
                action={
                  <Button variant="secondary" onClick={() => archivedQuery.refetch()}>
                    Try again
                  </Button>
                }
              />
            </div>
          ) : !archivedQuery.data || archivedQuery.data.length === 0 ? (
            <div className="py-6">
              <EmptyState title="Trash is empty" description="No archived categories." />
            </div>
          ) : (
            <div className="space-y-2 py-2">
              {archivedQuery.data.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white p-3"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-600">Soft-deleted</div>
                  </div>

                  <Button variant="danger" size="sm" onClick={() => askHardDelete(c)}>
                    Hard delete
                  </Button>
                </div>
              ))}
            </div>
          )}

          <ModalFooter>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={handleConfirmOpenChange}
        title={toHardDelete ? `Hard delete "${toHardDelete.name}"?` : 'Hard delete category?'}
        description="This cannot be undone."
        confirmText="Delete permanently"
        confirmVariant="danger"
        confirmLoading={hardDeleteMutation.isPending}
        confirmDisabled={!toHardDelete}
        onConfirm={handleConfirmHardDelete}
      />
    </>
  )
}
