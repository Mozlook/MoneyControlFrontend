import type { RecurringRead } from '@/models/recurring'

type DeactivateRecurringDescriptionProps = {
  item: RecurringRead
}

function formatDateTime(value?: string | null) {
  if (!value) return 'Never'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString()
}

export default function DeactivateRecurringDescription({
  item,
}: DeactivateRecurringDescriptionProps) {
  const currency = (item.currency_base ?? '').toUpperCase()

  return (
    <div className="space-y-2">
      <div>
        This will <span className="font-medium">disable</span> this recurring item, so it won’t be
        included when you run <span className="font-medium">Apply recurring</span> in future billing
        periods.
      </div>

      <div className="text-slate-600">
        Existing transactions generated in the past will <span className="font-medium">not</span> be
        removed.
      </div>

      <div className="rounded-md border border-slate-200 bg-slate-50 p-2 text-sm text-slate-700">
        <div>
          <span className="font-medium">Amount:</span> {item.amount_base} {currency || '—'}
        </div>

        <div>
          <span className="font-medium">Last applied:</span> {formatDateTime(item.last_applied_at)}
        </div>

        {item.description ? (
          <div className="mt-1">
            <span className="font-medium">Note:</span> {item.description}
          </div>
        ) : null}
      </div>
    </div>
  )
}
