import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import useWalletQuery from '@/queries/useWalletQuery'
import { Spinner, EmptyState, Button, PageHeader, ConfirmModal } from '@/ui'
import { useState } from 'react'
import CreateProductModal from '@/features/products/components/CreateProductModal'
import { useSearchParams } from 'react-router-dom'
import useProductsWithSumQuery from '@/queries/useProductsWithSumQuery'
import { useMutation } from '@tanstack/react-query'

export default function WalletProductsPage() {
  const walletId = useWalletId()
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('category_id') ?? undefined
  const products = useProductsWithSumQuery(walletId, { category_id: categoryId })
  const walletQuery = useWalletQuery(walletId)
  const isOwner = walletQuery.data?.role === 'owner'
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)

  deleteMutation = useMutation()
  return (
    <div>
      <PageHeader
        title="Wallet Products"
        actions={
          isOwner && (
            <Button variant="primary" onClick={() => setIsAddOpen(true)}>
              Add product
            </Button>
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
        title="Delete Product?"
        description="You can still recover this product in the future."
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      ></ConfirmModal>
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
            <div key={p.id}>
              {p.name} <span>{p.importance}</span> <span>{p.period_sum}</span>
              <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
