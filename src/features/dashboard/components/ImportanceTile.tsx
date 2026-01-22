import type { SummaryImportance } from '@/models/summary'

type MoneyAmount = SummaryImportance['necessary']

type ImportanceTileProps = {
  label: string
  amount?: MoneyAmount
  currency?: string
  className?: string
}

export default function ImportanceTile({
  label,
  amount,
  currency,
  className = '',
}: ImportanceTileProps) {
  return (
    <div className={`rounded-md border p-3 ${className}`}>
      <div className="text-xs font-medium text-slate-700">{label}</div>

      <div className="mt-1 text-lg font-semibold text-slate-900 tabular-nums">
        {String(amount ?? 0)}
        {currency ? <span className="text-sm font-medium text-slate-500"> {currency}</span> : null}
      </div>
    </div>
  )
}
