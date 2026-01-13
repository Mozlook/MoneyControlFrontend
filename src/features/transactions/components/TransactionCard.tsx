import type { TransactionRead } from '@/models/transaction'
import { Button } from '@/ui'
import { formatDateTime, formatMoney } from '../utils/format'

type TransactionCardProps = {
  tx: TransactionRead
  onDelete?: (tx: TransactionRead) => void
  deleteDisabled?: boolean
}

export function TransactionCard({ tx, onDelete, deleteDisabled = true }: TransactionCardProps) {
  const subtitleParts = [
    tx.product ? `Product: ${tx.product.name}` : 'No product',
    `Date: ${formatDateTime(tx.occurred_at)}`,
  ]

  return (
    <div className="flex items-start justify-between gap-4 rounded-md border border-slate-200 bg-white p-4">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-slate-900">
          {tx.category.name}
          {tx.refund_of_transaction_id ? (
            <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
              Refund
            </span>
          ) : null}
        </div>

        <div className="mt-1 text-xs text-slate-600">{subtitleParts.join(' · ')}</div>
      </div>

      <div className="shrink-0 text-right">
        <div
          className={[
            'text-sm font-semibold',
            tx.amount_base < 0 ? 'text-red-600' : 'text-slate-900',
          ].join(' ')}
        >
          {formatMoney(tx.amount_base, tx.currency_base)}
        </div>

        <div className="mt-2 flex justify-end">
          <Button
            variant="danger"
            size="sm"
            disabled={deleteDisabled}
            onClick={() => onDelete?.(tx)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
