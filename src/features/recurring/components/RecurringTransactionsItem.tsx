import { Button } from '@/ui'
import type { RecurringRead } from '@/models/recurring'

type RecurringTransactionsItemProps = {
  item: RecurringRead
  setDeactivating: (item: RecurringRead) => void
  showActions?: boolean
  onEdit: (item: RecurringRead) => void
  handleActivate: (recurringId: string) => void
}

function formatAmount(value: unknown) {
  const num = typeof value === 'string' ? Number(value) : (value as number)

  if (Number.isFinite(num)) {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  return String(value ?? '')
}

function formatDateTime(value?: string | null) {
  if (!value) return 'Never applied'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString()
}

export default function RecurringTransactionsItem({
  item,
  setDeactivating,
  showActions = true,
  onEdit,
  handleActivate,
}: RecurringTransactionsItemProps) {
  const categoryName = item.category?.name ?? '—'
  const productName = item.product?.name
  const amount = formatAmount(item.amount_base)
  const currency = (item.currency_base ?? '').toUpperCase()
  const lastApplied = formatDateTime(item.last_applied_at ?? null)
  const description = item.description?.trim()
  const active = item.active

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
              {categoryName}
            </span>

            {productName ? (
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                {productName}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500">
                No product
              </span>
            )}
          </div>

          {description ? (
            <p className="mt-2 text-sm break-words text-slate-700" title={description}>
              {description}
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No description</p>
          )}

          <div className="mt-2 text-xs text-slate-500">
            <span className="font-medium text-slate-600">Last applied:</span> {lastApplied}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <div className="text-lg font-semibold text-slate-900 tabular-nums">
            {amount} <span className="text-sm font-medium text-slate-500">{currency || '—'}</span>
          </div>

          {showActions && (
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => onEdit(item)}>
                Edit
              </Button>
              {active ? (
                <Button variant="danger" onClick={() => setDeactivating(item)}>
                  Deactivate
                </Button>
              ) : (
                <Button variant="danger" onClick={() => handleActivate(item.id)}>
                  Activate
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
