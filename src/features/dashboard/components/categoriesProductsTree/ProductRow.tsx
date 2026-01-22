import type { ProductWithSumRead } from '@/models/summary'
import { isZero } from '../../utils/isZero'
import { importanceBadgeClass } from '@/ui/importanceBadgeClass'

type ProductRowProps = {
  item: ProductWithSumRead
  currency: string
}

export default function ProductRow({ item, currency }: ProductRowProps) {
  const dim = isZero(item.product_sum)

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-md px-2 py-1 hover:bg-slate-50 ${
        dim ? 'opacity-60' : ''
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-slate-400">•</span>
        <span className="truncate text-sm text-slate-900">{item.product.name}</span>

        <span
          className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${importanceBadgeClass(
            item.product.importance,
          )}`}
        >
          {item.product.importance}
        </span>
      </div>

      <div className="shrink-0 text-sm font-semibold text-slate-900 tabular-nums">
        {item.product_sum} <span className="text-xs font-medium text-slate-500">{currency}</span>
      </div>
    </div>
  )
}
