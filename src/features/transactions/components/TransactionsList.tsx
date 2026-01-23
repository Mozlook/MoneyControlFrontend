import type { TransactionRead } from '@/models/transaction'
import { TransactionCard } from './TransactionCard'
import { useMemo } from 'react'

type TransactionsListProps = {
  items: TransactionRead[]
  onRefund?: (tx: TransactionRead) => void
}

export function TransactionsList({ items, onRefund }: TransactionsListProps) {
  const refundedOriginalIds = useMemo(() => {
    const s = new Set<string>()
    for (const tx of items) {
      if (tx.refund_of_transaction_id) s.add(tx.refund_of_transaction_id)
    }
    return s
  }, [items])

  return (
    <div className="mt-4 space-y-2 sm:space-y-3">
      {items.map((tx) => (
        <TransactionCard
          key={tx.id}
          tx={tx}
          onRefund={onRefund}
          alreadyRefunded={refundedOriginalIds.has(tx.id)}
        />
      ))}
    </div>
  )
}
