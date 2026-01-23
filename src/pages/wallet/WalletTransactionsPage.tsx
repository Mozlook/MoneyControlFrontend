import { useMemo, useState } from 'react'
import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import { useTransactionsQuery } from '@/queries/useTransationsQuery'
import { Spinner, EmptyState, Button, PageHeader, ConfirmModal, notify } from '@/ui'
import { useTransactionsFilters } from '@/features/transactions/hooks/useTransactionsFilter'
import { TransactionsFiltersBar } from '@/features/transactions/components/TransactionsFiltersBar'
import { TransactionsList } from '@/features/transactions/components/TransactionsList'
import CreateTransactionModal from '@/features/transactions/components/CreateTransactionModal'
import type { TransactionRead } from '@/models/transaction'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionsApi } from '@/api/modules'
import { queryKeys } from '@/queries/queryKeys'
import { downloadBlob } from '@/features/transactions/utils/download'

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
  const [isRefundOpen, setIsRefundOpen] = useState<boolean>(false)

  const [toRefund, setToRefund] = useState<TransactionRead | null>(null)
  const initialCategoryId = filtersState.apiParams.category_id
  const initialProductId = filtersState.apiParams.product_id

  const queryClient = useQueryClient()
  const refundMutation = useMutation({
    mutationFn: (transactionId: string) => transactionsApi.refund(walletId, transactionId),
    onSuccess: () => {
      notify.success('Transaction refunded')
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.categories.root(walletId) })
      queryClient.invalidateQueries({
        queryKey: queryKeys.wallets.transactions.root(walletId),
      })

      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.products.root(walletId) })
      setToRefund(null)
      setIsRefundOpen(false)
    },
    onError: (err) => {
      notify.fromError(err, 'Failed to refund transaction')
    },
  })

  const exportMutation = useMutation({
    mutationFn: (walletId: string) => transactionsApi.exportCsv(walletId, filtersState.apiParams),
    onSuccess: (blob) => {
      downloadBlob(blob, `transactions-${new Date().toISOString().slice(0, 10)}.csv`)
    },
    onError: (err) => notify.fromError(err, 'Export failed'),
  })

  function handleAskRefund(transaction: TransactionRead) {
    setToRefund(transaction)
    setIsRefundOpen(true)
  }

  function handleRefund(transactionId: string) {
    refundMutation.mutate(transactionId)
  }

  function handleRefundOpenChange(open: boolean) {
    if (refundMutation.isPending) return
    setIsRefundOpen(open)
    if (!open) setToRefund(null)
  }
  return (
    <div>
      <PageHeader
        title="Transactions"
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              variant="primary"
              className="w-full sm:w-auto"
              onClick={() => setIsCreateOpen(true)}
            >
              Add transaction
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => exportMutation.mutate(walletId)}
              disabled={exportMutation.isPending}
              loading={exportMutation.isPending}
            >
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
        <TransactionsList items={sorted} onRefund={handleAskRefund} />
      )}
      <ConfirmModal
        open={isRefundOpen}
        onOpenChange={handleRefundOpenChange}
        title={
          toRefund
            ? `Refund transaction ${toRefund.amount_base} ${toRefund.currency_base}?`
            : 'Refund transaction?'
        }
        description="This will create a new refund transaction with opposite amount."
        confirmText="Refund"
        confirmVariant="danger"
        confirmLoading={refundMutation.isPending}
        confirmDisabled={!toRefund}
        onConfirm={() => {
          if (!toRefund) return
          handleRefund(toRefund.id)
        }}
      />
    </div>
  )
}
