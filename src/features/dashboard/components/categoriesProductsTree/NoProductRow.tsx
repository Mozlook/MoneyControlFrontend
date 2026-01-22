type NoProductRowProps = {
  amount: number
  currency: string
}

export default function NoProductRow({ amount, currency }: NoProductRowProps) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3 rounded-md bg-slate-50 px-2 py-1">
      <div className="text-sm text-slate-700">Bez produktu</div>
      <div className="text-sm font-semibold text-slate-900 tabular-nums">
        {amount} <span className="text-xs font-medium text-slate-500">{currency}</span>
      </div>
    </div>
  )
}
