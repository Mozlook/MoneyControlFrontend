import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import useWalletQuery from '@/queries/useWalletQuery'
import { Spinner, EmptyState, Button, PageHeader, notify, ConfirmModal } from '@/ui'
import { useState } from 'react'
import CreateCategoryModal from '@/features/categories/components/CreateCategoryModal'
import { Link } from 'react-router-dom'
import { routePaths } from '@/routes/routePaths'
import useCategoriesWithSumQuery from '@/queries/useCategoriesWithSumQuery'
import type { CategoryRead } from '@/models/category'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesApi } from '@/api/modules'
import ArchivedCategoriesModal from '@/features/categories/components/ArchivedCategoriesModal'

export default function WalletCategoriesPage() {
  const walletId = useWalletId()
  const categories = useCategoriesWithSumQuery(walletId)
  const walletQuery = useWalletQuery(walletId)
  const isOwner = walletQuery.data?.role === 'owner'
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null)
  const [archivedOpen, setArchivedOpen] = useState(false)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (categoryId: string) => categoriesApi.delete(walletId, categoryId),
    onSuccess: () => {
      notify.success('Category deleted')
      queryClient.invalidateQueries({ queryKey: ['wallets', walletId, 'categories'], exact: false })
      setToDelete(null)
      setConfirmOpen(false)
    },
    onError: (err) => {
      notify.fromError(err, 'Failed to delete category')
    },
  })

  function handleConfirmOpenChange(open: boolean) {
    if (deleteMutation.isPending) return
    setConfirmOpen(open)
    if (!open) setToDelete(null)
  }

  function handleAskDelete(category: CategoryRead) {
    setToDelete({ id: category.id, name: category.name })
    setConfirmOpen(true)
  }

  function handleConfirmDelete() {
    if (!toDelete) return
    deleteMutation.mutate(toDelete.id)
  }

  return (
    <div>
      <PageHeader
        title="Wallet Categories"
        actions={
          isOwner && (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setArchivedOpen(true)}>
                Archived
              </Button>
              <Button variant="primary" onClick={() => setIsAddOpen(true)}>
                Add category
              </Button>
            </div>
          )
        }
      ></PageHeader>
      <CreateCategoryModal walletId={walletId} open={isAddOpen} onOpenChange={setIsAddOpen} />
      <ConfirmModal
        title={toDelete ? `Delete category "${toDelete.name}"?` : 'Delete category?'}
        description="You can still recover this category in the future."
        open={confirmOpen}
        onOpenChange={handleConfirmOpenChange}
        onConfirm={handleConfirmDelete}
        confirmLoading={deleteMutation.isPending}
        confirmDisabled={!toDelete}
      />
      <ArchivedCategoriesModal
        walletId={walletId}
        open={archivedOpen}
        onOpenChange={setArchivedOpen}
      />

      {categories.isPending ? (
        <div className="flex justify-center py-16">
          <Spinner size="md" />
        </div>
      ) : categories.isError ? (
        <div className="py-16">
          <EmptyState
            title="Couldn't load categories"
            description={
              categories.error instanceof Error ? categories.error.message : 'Unknown error'
            }
            action={
              <Button variant="secondary" onClick={() => categories.refetch()}>
                Try again
              </Button>
            }
          />
        </div>
      ) : !categories.data || categories.data.length === 0 ? (
        <div className="py-16">
          <EmptyState
            title="No categories yet"
            action={
              isOwner && (
                <Button variant="primary" onClick={() => setIsAddOpen(true)}>
                  Add category
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="space-y-2 py-4">
          {categories.data.map((c) => (
            <Link
              key={c.id}
              to={{
                pathname: routePaths.wallets.products(walletId),
                search: `?category_id=${encodeURIComponent(c.id)}`,
              }}
              className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-3 hover:bg-slate-50"
            >
              {c.icon}
              <span>{c.name}</span>
              <span>{c.period_sum}</span>
              <Button
                variant="danger"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleAskDelete(c)
                }}
              >
                Delete
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
