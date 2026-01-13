import { useMemo } from 'react'
import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import type { TransactionsGetAllParams } from '@/models/transaction'
import { useTransactionsQuery } from '@/queries/useTransationsQuery'
import { Spinner, EmptyState, Button, PageHeader } from '@/ui'
import { TransactionsList } from '@/features/transactions/components/TransactionsList'

export default function WalletTransactionsPage() {
  const walletId = useWalletId()

  const params: TransactionsGetAllParams = { current_period: true }

  const transactionsQuery = useTransactionsQuery(walletId, params)
  const items = transactionsQuery.data ?? []

  const sorted = useMemo(() => {
    return [...items].sort(
      (a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime(),
    )
  }, [items])

  return (
    <div>
      <PageHeader
        title="Transactions"
        actions={
          <div className="flex gap-2">
            <Button variant="primary" disabled>
              Add transaction
            </Button>
            <Button variant="secondary" disabled>
              Export CSV
            </Button>
          </div>
        }
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
          <EmptyState
            title="No transactions yet"
            description="Add your first transaction to start tracking spending."
            action={
              <Button variant="primary" disabled>
                Add transaction
              </Button>
            }
          />
        </div>
      ) : (
        <TransactionsList items={sorted} deleteDisabled={true} />
      )}
    </div>
  )
}
