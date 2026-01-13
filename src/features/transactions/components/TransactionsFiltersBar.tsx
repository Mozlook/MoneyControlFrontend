import type { FormEvent } from 'react'
import { Button, Input, Label, Select } from '@/ui'
import useCategoriesQuery from '@/queries/useCategoriesQuery'
import useProductsQuery from '@/queries/useProductsQuery'
import { useTransactionsFilters } from '@/features/transactions/hooks/useTransactionsFilter'

type Props = {
  walletId: string
  state: ReturnType<typeof useTransactionsFilters>
  isFetching?: boolean
}

export function TransactionsFiltersBar({ walletId, state, isFetching = false }: Props) {
  const categoriesQuery = useCategoriesQuery(walletId)
  const productsQuery = useProductsQuery(walletId, state.draft.category_id || undefined)

  const canApply = state.isDirty && !isFetching
  const canReset = !isFetching

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    state.apply()
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <Label>Period</Label>
          <Select
            value={state.draft.current_period ? 'current' : 'custom'}
            onChange={(e) => {
              const v = e.target.value
              state.setDraft((prev) =>
                v === 'current'
                  ? {
                      ...prev,
                      current_period: true,
                      from_date: undefined,
                      to_date: undefined,
                    }
                  : { ...prev, current_period: false },
              )
            }}
          >
            <option value="current">Current period</option>
            <option value="custom">Custom range</option>
          </Select>
        </div>

        <div className="grid gap-1">
          <Label>From</Label>
          <Input
            type="date"
            value={state.draft.from_date ?? ''}
            disabled={state.draft.current_period}
            onChange={(e) =>
              state.setDraft((prev) => ({
                ...prev,
                current_period: false,
                from_date: e.target.value || undefined,
              }))
            }
          />
        </div>

        <div className="grid gap-1">
          <Label>To</Label>
          <Input
            type="date"
            value={state.draft.to_date ?? ''}
            disabled={state.draft.current_period}
            onChange={(e) =>
              state.setDraft((prev) => ({
                ...prev,
                current_period: false,
                to_date: e.target.value || undefined,
              }))
            }
          />
        </div>

        <div className="grid gap-1">
          <Label>Category</Label>
          <Select
            value={state.draft.category_id ?? ''}
            onChange={(e) => {
              const nextCategoryId = e.target.value || undefined
              state.setDraft((prev) => ({
                ...prev,
                category_id: nextCategoryId,
                product_id: undefined,
              }))
            }}
            disabled={categoriesQuery.isPending || categoriesQuery.isError}
          >
            <option value="">
              {categoriesQuery.isPending
                ? 'Loading...'
                : categoriesQuery.isError
                  ? 'Failed to load'
                  : 'All categories'}
            </option>

            {(categoriesQuery.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-1">
          <Label>Product</Label>
          <Select
            value={state.draft.product_id ?? ''}
            onChange={(e) => {
              const nextProductId = e.target.value || undefined
              state.setDraft((prev) => ({ ...prev, product_id: nextProductId }))
            }}
            disabled={productsQuery.isPending || productsQuery.isError}
          >
            <option value="">
              {productsQuery.isPending
                ? 'Loading...'
                : productsQuery.isError
                  ? 'Failed to load'
                  : 'All products'}
            </option>

            {(productsQuery.data ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" disabled={!canApply}>
            Apply
          </Button>

          <Button type="button" variant="secondary" disabled={!canReset} onClick={state.reset}>
            Reset
          </Button>
        </div>
      </div>
    </form>
  )
}
