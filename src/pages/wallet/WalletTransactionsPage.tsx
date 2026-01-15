import { useMemo, useState } from 'react'
import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import { useTransactionsQuery } from '@/queries/useTransationsQuery'
import { Spinner, EmptyState, Button, PageHeader } from '@/ui'
import { useTransactionsFilters } from '@/features/transactions/hooks/useTransactionsFilter'
import { TransactionsFiltersBar } from '@/features/transactions/components/TransactionsFiltersBar'
import { TransactionsList } from '@/features/transactions/components/TransactionsList'
import CreateTransactionModal from '@/features/transactions/components/CreateTransactionModal'

export default function WalletTransactionsPage() {
  const walletId = useWalletId()

  const filtersState = useTransactionsFilters()
  const transactionsQuery = useTransactionsQuery(walletId, filtersState.apiParams)

  const items = transactionsQuery.data ?? []

  const sorted = useMemo(() => {
    return [...items].sort(
      (a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime(),
    )
  }, [items])
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)

  const initialCategoryId = filtersState.apiParams.category_id
  const initialProductId = filtersState.apiParams.product_id

  return (
    <div>
      <PageHeader
        title="Transactions"
        actions={
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
              Add transaction
            </Button>
            <Button variant="secondary" disabled>
              Export CSV
            </Button>
          </div>
        }
      />
      <CreateTransactionModal
        walletId={walletId}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        initialCategoryId={initialCategoryId}
        initialProductId={initialProductId}
      />
      <TransactionsFiltersBar
        walletId={walletId}
        state={filtersState}
        isFetching={transactionsQuery.isFetching}
      />

      {transactionsQuery.isPending ? (
        <div className="flex justify-center py-16">
          <Spinner size="md" />
        </div>
      ) : transactionsQuery.isError ? (
        <div className="py-16">
          <EmptyState
            title="Couldn't load transactions"
            description={
              transactionsQuery.error instanceof Error
                ? transactionsQuery.error.message
                : 'Unknown error'
            }
            action={
              <Button variant="secondary" onClick={() => transactionsQuery.refetch()}>
                Try again
              </Button>
            }
          />
        </div>
      ) : sorted.length === 0 ? (
        <div className="py-16">
          <EmptyState title="No transactions yet" />
        </div>
      ) : (
        <TransactionsList items={sorted} deleteDisabled />
      )}
    </div>
  )
}
