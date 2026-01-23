import { useMemo, useState } from 'react'
import { Button, EmptyState, Spinner } from '@/ui'
import useCategorieProductsQuery from '@/queries/useCategoriesProductsQuery'
import CategoryNode from './CategoryNode'
import type { SummaryCategoriesProducts } from '@/models/summary'

type Props = {
  walletId: string
  fromDate: string
  toDate: string
}

export default function DashboardCategoriesProductsTreeCard({ walletId, fromDate, toDate }: Props) {
  const query = useCategorieProductsQuery(walletId, {
    current_period: false,
    from_date: fromDate,
    to_date: toDate,
  })

  const data: SummaryCategoriesProducts | undefined = query.data
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})

  const categoriesSorted = useMemo(() => {
    if (!data) return []
    return [...data.categories].sort((a, b) => b.category_sum - a.category_sum)
  }, [data])

  if (query.isPending) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Categories → Products</div>
        <div className="flex justify-center py-10">
          <Spinner size="md" />
        </div>
      </div>
    )
  }

  if (query.isPending) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="text-sm font-semibold text-slate-900">Categories → Products</div>
        <div className="flex justify-center py-10">
          <Spinner size="md" />
        </div>
      </div>
    )
  }

  if (query.isError) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <EmptyState
          title="Couldn't load categories/products summary"
          description={query.error instanceof Error ? query.error.message : 'Unknown error'}
          action={
            <Button variant="secondary" onClick={() => query.refetch()}>
              Try again
            </Button>
          }
        />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">Categories → Products</div>
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          {query.isFetching && !query.isPending ? <Spinner size="sm" /> : null}
          <div className="text-sm font-semibold whitespace-nowrap text-slate-900 tabular-nums">
            {data.total} <span className="text-xs font-medium text-slate-500">{data.currency}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {categoriesSorted.map((c) => (
          <CategoryNode
            key={c.category.id}
            item={c}
            currency={data.currency}
            open={!!openMap[c.category.id]}
            onToggle={() =>
              setOpenMap((prev) => ({ ...prev, [c.category.id]: !prev[c.category.id] }))
            }
          />
        ))}
      </div>
    </div>
  )
}
