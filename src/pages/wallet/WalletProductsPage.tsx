import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import useWalletQuery from '@/queries/useWalletQuery'
import { Spinner, EmptyState, Button, PageHeader, ConfirmModal, notify } from '@/ui'
import { useState } from 'react'
import CreateProductModal from '@/features/products/components/CreateProductModal'
import { useSearchParams } from 'react-router-dom'
import useProductsWithSumQuery from '@/queries/useProductsWithSumQuery'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/api/modules'
import type { ProductRead } from '@/models/product'
import ArchivedProductModal from '@/features/products/components/ArchivedProductsModal'
import ProductWithSumListItem from '@/features/products/components/PRoductsWithSumListItem'
import { queryKeys } from '@/queries/queryKeys'

export default function WalletProductsPage() {
  const walletId = useWalletId()
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('category_id') ?? undefined
  const products = useProductsWithSumQuery(walletId, { category_id: categoryId })
  const walletQuery = useWalletQuery(walletId)
  const isOwner = walletQuery.data?.role === 'owner'
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null)
  const [archivedOpen, setArchivedOpen] = useState(false)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => productsApi.delete(walletId, productId),
    onSuccess: () => {
      notify.success('Product deleted')
      queryClient.invalidateQueries({
        queryKey: queryKeys.wallets.products.root(walletId),
        exact: false,
      })
      setToDelete(null)
      setConfirmOpen(false)
    },
    onError: (err) => {
      notify.fromError(err, 'Failed to delete product')
    },
  })

  function handleConfirmOpenChange(open: boolean) {
    if (deleteMutation.isPending) return
    setConfirmOpen(open)
    if (!open) setToDelete(null)
  }

  function handleAskDelete(product: ProductRead) {
    setToDelete({ id: product.id, name: product.name })
    setConfirmOpen(true)
  }

  function handleConfirmDelete() {
    if (!toDelete) return
    deleteMutation.mutate(toDelete.id)
  }
  return (
    <div>
      <PageHeader
        title="Wallet Products"
        actions={
          isOwner && (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setArchivedOpen(true)}>
                Archived
              </Button>
              <Button variant="primary" onClick={() => setIsAddOpen(true)}>
                Add product
              </Button>
            </div>
          )
        }
      ></PageHeader>
      <CreateProductModal
        initialCategoryId={categoryId}
        walletId={walletId}
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
      />
      <ConfirmModal
        title={toDelete ? `Delete product "${toDelete.name}"?` : 'Delete product?'}
        description="You can still recover this product in the future."
        open={confirmOpen}
        onOpenChange={handleConfirmOpenChange}
        onConfirm={handleConfirmDelete}
        confirmLoading={deleteMutation.isPending}
        confirmDisabled={!toDelete}
      />
      <ArchivedProductModal
        walletId={walletId}
        open={archivedOpen}
        onOpenChange={setArchivedOpen}
      />
      {products.isPending ? (
        <div className="flex justify-center py-16">
          <Spinner size="md" />
        </div>
      ) : products.isError ? (
        <div className="py-16">
          <EmptyState
            title="Couldn't load products"
            description={products.error instanceof Error ? products.error.message : 'Unknown error'}
            action={
              <Button variant="secondary" onClick={() => products.refetch()}>
                Try again
              </Button>
            }
          />
        </div>
      ) : !products.data || products.data.length === 0 ? (
        <div className="py-16">
          <EmptyState
            title="No products yet"
            action={
              isOwner && (
                <Button variant="primary" onClick={() => setIsAddOpen(true)}>
                  Add product
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="space-y-2 py-4">
          {products.data.map((p) => (
            <ProductWithSumListItem
              key={p.id}
              walletId={walletId}
              product={p}
              currency={walletQuery.data?.currency}
              canManage={isOwner}
              disabled={deleteMutation.isPending}
              onDelete={handleAskDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
