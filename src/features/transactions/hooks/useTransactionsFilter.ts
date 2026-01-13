import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { TransactionsGetAllParams } from '@/models/transaction'

const isDate = (v: string | null): v is string => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v)

const parseBool = (v: string | null): boolean | undefined => {
  if (v === null) return undefined
  if (v === '1' || v === 'true') return true
  if (v === '0' || v === 'false') return false
  return undefined
}

type TransactionsFilters = {
  current_period: boolean
  from_date?: string
  to_date?: string
  category_id?: string
  product_id?: string
}

export function useTransactionsFilters() {
  const [sp, setSp] = useSearchParams()

  const from_date = isDate(sp.get('from_date')) ? sp.get('from_date')! : undefined
  const to_date = isDate(sp.get('to_date')) ? sp.get('to_date')! : undefined

  const category_id = sp.get('category_id') || undefined
  const product_id = sp.get('product_id') || undefined

  const hasDates = !!from_date || !!to_date
  const current_period = parseBool(sp.get('current_period')) ?? !hasDates

  const filters: TransactionsFilters = useMemo(
    () => ({
      current_period,
      from_date,
      to_date,
      category_id,
      product_id,
    }),
    [current_period, from_date, to_date, category_id, product_id],
  )

  const apiParams: TransactionsGetAllParams = useMemo(() => {
    const p: TransactionsGetAllParams = {
      current_period: filters.current_period,
    }

    if (!filters.current_period) {
      if (filters.from_date) p.from_date = filters.from_date
      if (filters.to_date) p.to_date = filters.to_date
    }

    if (filters.category_id) p.category_id = filters.category_id
    if (filters.product_id) p.product_id = filters.product_id

    return p
  }, [filters])

  const patch = useCallback(
    (updates: Partial<Record<keyof TransactionsFilters, string | boolean | undefined>>) => {
      setSp(
        (prev) => {
          const next = new URLSearchParams(prev)

          for (const [k, v] of Object.entries(updates)) {
            const key = k as keyof TransactionsFilters

            if (v === undefined || v === '' || v === null) {
              next.delete(key)
              continue
            }

            if (typeof v === 'boolean') {
              next.set(key, v ? '1' : '0')
              continue
            }

            next.set(key, v)
          }

          return next
        },
        { replace: true },
      )
    },
    [setSp],
  )

  const setCurrentPeriod = useCallback(
    (value: boolean) => {
      setSp(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('current_period', value ? '1' : '0')
          if (value) {
            next.delete('from_date')
            next.delete('to_date')
          }
          return next
        },
        { replace: true },
      )
    },
    [setSp],
  )

  const setFromDate = useCallback(
    (value: string) => {
      patch({
        current_period: false,
        from_date: value || undefined,
      })
    },
    [patch],
  )

  const setToDate = useCallback(
    (value: string) => {
      patch({
        current_period: false,
        to_date: value || undefined,
      })
    },
    [patch],
  )

  const setCategoryId = useCallback(
    (value?: string) => {
      setSp(
        (prev) => {
          const next = new URLSearchParams(prev)
          const prevCategory = next.get('category_id') || ''
          const newCategory = value || ''

          if (!newCategory) next.delete('category_id')
          else next.set('category_id', newCategory)

          if (newCategory && newCategory !== prevCategory) {
            next.delete('product_id')
          }

          return next
        },
        { replace: true },
      )
    },
    [setSp],
  )

  const setProductId = useCallback(
    (value?: string) => patch({ product_id: value || undefined }),
    [patch],
  )

  const reset = useCallback(() => {
    setSp(new URLSearchParams(), { replace: true })
  }, [setSp])

  return {
    filters,
    apiParams,

    setCurrentPeriod,
    setFromDate,
    setToDate,
    setCategoryId,
    setProductId,
    reset,
  }
}
