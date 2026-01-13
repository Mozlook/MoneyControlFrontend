import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { TransactionsGetAllParams } from '@/models/transaction'

export type TransactionsFiltersDraft = {
  current_period: boolean
  from_date?: string
  to_date?: string
  category_id?: string
  product_id?: string
}

function parseBool(v: string | null): boolean | undefined {
  if (v === 'true') return true
  if (v === 'false') return false
  return undefined
}

function parseFromSearchParams(sp: URLSearchParams): TransactionsFiltersDraft {
  const from_date = sp.get('from_date') ?? undefined
  const to_date = sp.get('to_date') ?? undefined
  const category_id = sp.get('category_id') ?? undefined
  const product_id = sp.get('product_id') ?? undefined

  const explicitCurrent = parseBool(sp.get('current_period'))
  const hasDates = !!from_date || !!to_date

  const current_period = explicitCurrent ?? (hasDates ? false : true)

  return {
    current_period,
    from_date,
    to_date,
    category_id,
    product_id,
  }
}

function buildSearchParams(draft: TransactionsFiltersDraft): URLSearchParams {
  const sp = new URLSearchParams()

  if (!draft.current_period) {
    sp.set('current_period', 'false')
    if (draft.from_date) sp.set('from_date', draft.from_date)
    if (draft.to_date) sp.set('to_date', draft.to_date)
  }

  if (draft.category_id) sp.set('category_id', draft.category_id)
  if (draft.product_id) sp.set('product_id', draft.product_id)

  return sp
}

export function useTransactionsFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchKey = searchParams.toString()

  const active = useMemo(() => parseFromSearchParams(searchParams), [searchKey])

  const [draft, setDraft] = useState<TransactionsFiltersDraft>(active)

  useEffect(() => {
    setDraft(active)
  }, [searchKey])

  const isDirty = useMemo(() => {
    return buildSearchParams(draft).toString() !== buildSearchParams(active).toString()
  }, [draft, active])

  const apply = useCallback(() => {
    setSearchParams(buildSearchParams(draft), { replace: false })
  }, [draft, setSearchParams])

  const reset = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: false })
  }, [setSearchParams])

  const apiParams: TransactionsGetAllParams = useMemo(
    () => ({
      current_period: active.current_period,
      from_date: active.from_date,
      to_date: active.to_date,
      category_id: active.category_id,
      product_id: active.product_id,
    }),
    [active],
  )

  return { active, draft, setDraft, apply, reset, isDirty, apiParams }
}
