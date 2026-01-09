import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import useWalletQuery from '@/queries/useWalletQuery'
import { Spinner, EmptyState, Button, PageHeader } from '@/ui'
import AddMemberModal from '@/features/walletMembers/components/AddMemberModal'
import { useState } from 'react'
import useCategoriesQuery from '@/queries/useCategoriesQuery'

export default function WalletCategoriesPage() {
  const walletId = useWalletId()
  const categories = useCategoriesQuery(walletId)
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
      <AddMemberModal walletId={walletId} open={isAddOpen} onOpenChange={setIsAddOpen} />
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
        <div className="space-y-2">
          {categories.data.map((c) => (
            <div key={c.id} className="flex">
              {c.icon}
              {c.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
