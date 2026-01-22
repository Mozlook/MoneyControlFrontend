import type { CategoriesWithProductsSummaryRead } from '@/models/summary'
import NoProductRow from './NoProductRow'
import ProductRow from './ProductRow'
import { isZero } from '../../utils/isZero'

type CategoryNodeProps = {
  item: CategoriesWithProductsSummaryRead
  currency: string
  open: boolean
  onToggle: () => void
}

export default function CategoryNode({ item, currency, open, onToggle }: CategoryNodeProps) {
  const productsSorted = [...item.products].sort((a, b) => b.product_sum - a.product_sum)

  return (
    <div className="rounded-md border border-slate-200">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-left hover:bg-slate-100"
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="w-4 shrink-0 text-slate-600">{open ? '▾' : '▸'}</span>
          <span className="truncate font-medium text-slate-900">{item.category.name}</span>
        </div>

        <div className="shrink-0 text-sm font-semibold text-slate-900 tabular-nums">
          {item.category_sum} <span className="text-xs font-medium text-slate-500">{currency}</span>
        </div>
      </button>

      {open ? (
        <div className="px-3 py-2">
          <div className="border-l border-slate-200 pl-4">
            {!isZero(item.no_product_sum) ? (
              <NoProductRow amount={item.no_product_sum} currency={currency} />
            ) : null}

            <div className="space-y-1">
              {productsSorted.map((p) => (
                <ProductRow key={p.product.id} item={p} currency={currency} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
