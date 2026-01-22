import { useMemo, useState } from 'react'
import { Button, EmptyState, Spinner, Select, Label } from '@/ui'
import useLastPeriodsHistoryQuery from '@/queries/useLastPeriodsHistoryQuery'
import type { PeriodTotalRead } from '@/models/history'

type Props = {
  walletId: string
  defaultPeriods?: number
}

function formatShortDate(iso: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit' }).format(d)
}

function formatRange(startIso: string, endIso: string) {
  const start = new Date(startIso)
  const end = new Date(endIso)
  end.setDate(end.getDate() - 1)

  const startLabel = new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(start)

  const endLabel = new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(end)

  return `${startLabel} – ${endLabel}`
}

export default function DashboardLastPeriodsBarChartCard({ walletId, defaultPeriods = 6 }: Props) {
  const [periods, setPeriods] = useState<number>(defaultPeriods)

  const history = useLastPeriodsHistoryQuery(walletId, periods)
  const data = history.data

  const chartPeriods = useMemo(() => {
    return data ? [...data.periods] : []
  }, [data])

  const maxValue = useMemo(() => {
    if (!chartPeriods.length) return 0
    return Math.max(...chartPeriods.map((p) => p.total), 0)
  }, [chartPeriods])

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">Expenses – last months</div>
          <div className="mt-1 text-xs text-slate-500">
            Comparison of spending across recent billing periods
          </div>
        </div>

        <div className="flex items-center gap-3">
          {history.isFetching && !history.isPending ? <Spinner size="sm" /> : null}

          <div className="grid gap-1">
            <Label>Billing periods</Label>
            <Select
              value={String(periods)}
              onChange={(e) => setPeriods(Number(e.target.value))}
              disabled={history.isPending}
            >
              {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {history.isPending ? (
        <div className="flex justify-center py-10">
          <Spinner size="md" />
        </div>
      ) : history.isError ? (
        <div className="py-6">
          <EmptyState
            title="Couldn't load history"
            description={history.error instanceof Error ? history.error.message : 'Unknown error'}
            action={
              <Button variant="secondary" onClick={() => history.refetch()}>
                Try again
              </Button>
            }
          />
        </div>
      ) : !data || chartPeriods.length === 0 ? (
        <div className="py-6">
          <EmptyState title="No data yet" description="Add some transactions to see history." />
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-end gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
            {chartPeriods.map((p: PeriodTotalRead) => {
              const heightPct = maxValue > 0 ? (p.total / maxValue) * 100 : 0
              const safeHeight = Math.max(heightPct, 2)

              return (
                <div key={p.period_start} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative h-40 w-full">
                    <div
                      className="absolute bottom-0 w-full rounded-md bg-sky-500"
                      style={{ height: `${safeHeight}%` }}
                      title={`${formatRange(p.period_start, p.period_end)}\nTotal: ${p.total} ${data.currency}`}
                      aria-label={`${formatRange(p.period_start, p.period_end)}: ${p.total} ${data.currency}`}
                    />
                  </div>

                  <div className="text-[11px] text-slate-600">
                    {formatShortDate(p.period_start)}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-2 text-xs text-slate-500">
            Currency: <span className="font-medium">{data.currency}</span>
          </div>
        </>
      )}
    </div>
  )
}
