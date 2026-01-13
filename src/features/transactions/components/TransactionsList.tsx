import type { TransactionRead } from '@/models/transaction'
import { TransactionCard } from './TransactionCard'

type TransactionsListProps = {
  items: TransactionRead[]
  onDelete?: (tx: TransactionRead) => void
  deleteDisabled?: boolean
}

export function TransactionsList({ items, onDelete, deleteDisabled }: TransactionsListProps) {
  return (
    <div className="mt-4 space-y-2">
      {items.map((tx) => (
        <TransactionCard key={tx.id} tx={tx} onDelete={onDelete} deleteDisabled={deleteDisabled} />
      ))}
    </div>
  )
}
