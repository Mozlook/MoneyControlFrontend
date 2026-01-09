import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import useWalletQuery from '@/queries/useWalletQuery'
import { Spinner, EmptyState, Button, PageHeader } from '@/ui'
import { useState } from 'react'
import useProductsQuery from '@/queries/useProductsQuery'
import CreateCategoryModal from '@/features/categories/components/CreateCategoryModal'
import { Link, useSearchParams } from 'react-router-dom'
import { routePaths } from '@/routes/routePaths'

export default function WalletProductsPage() {
  const walletId = useWalletId()
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('category_id') ?? undefined
  const products = useProductsQuery(walletId, categoryId)
  const walletQuery = useWalletQuery(walletId)
  const isOwner = walletQuery.data?.role === 'owner'
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
  return (
    <div>
      <PageHeader
        title="Wallet Categories"
        actions={
          isOwner && (
            <Button variant="primary" onClick={() => setIsAddOpen(true)}>
              Add category
            </Button>
          )
        }
      ></PageHeader>
      <CreateCategoryModal walletId={walletId} open={isAddOpen} onOpenChange={setIsAddOpen} />
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
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
