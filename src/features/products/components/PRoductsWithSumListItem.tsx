import { useState } from 'react'
import { Button } from '@/ui'
import { importanceBadgeClass } from '@/ui/importanceBadgeClass'
import type { ProductRead, ProductReadSum } from '@/models/product'

import CreateTransactionModal from '@/features/transactions/components/CreateTransactionModal'

type ProductWithSumListItemProps = {
  walletId: string
  product: ProductReadSum
  currency?: string
  canManage?: boolean
  disabled?: boolean
  onDelete?: (product: ProductRead) => void
}

export default function ProductWithSumListItem({
  walletId,
  product,
  currency,
  canManage = false,
  disabled = false,
  onDelete,
}: ProductWithSumListItemProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const sum = product.period_sum ?? 0
  const currencyLabel = currency ? currency.toUpperCase() : ''

  const initialCategoryId = product.category?.id
  const initialProductId = product.id

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        title="Click to add a transaction for this product"
        onClick={() => setIsCreateOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsCreateOpen(true)
          }
        }}
        className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-slate-200 bg-white p-3 hover:bg-slate-50 focus:ring-2 focus:ring-slate-300 focus:outline-none"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate font-medium text-slate-900">{product.name}</div>

            <span
              className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${importanceBadgeClass(
                product.importance,
              )}`}
            >
              {product.importance}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-900 tabular-nums">
              {sum}{' '}
              {currencyLabel ? (
                <span className="text-xs font-medium text-slate-500">{currencyLabel}</span>
              ) : null}
            </div>
          </div>

          {canManage && onDelete ? (
            <Button
              variant="danger"
              size="sm"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(product)
              }}
            >
              Delete
            </Button>
          ) : null}
        </div>
      </div>

      <CreateTransactionModal
        walletId={walletId}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        initialCategoryId={initialCategoryId}
        initialProductId={initialProductId}
      />
    </>
  )
}
