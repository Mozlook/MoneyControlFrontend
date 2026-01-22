import useSummaryByImportanceQuery from '@/queries/useSummaryByImportanceQuery'
import { Button, EmptyState, Spinner } from '@/ui'
import type { SummaryImportance } from '@/models/summary'
import ImportanceTile from './ImportanceTile'

type DashboardByImportanceCardProps = {
  fromDate: string
  toDate: string
  walletId: string
}

type TileConfig = {
  key: keyof Pick<SummaryImportance, 'necessary' | 'important' | 'unnecessary' | 'unassigned'>
  label: string
  className: string
}

const TILES: TileConfig[] = [
  {
    key: 'necessary',
    label: 'Necessary',
    className: 'border-emerald-200 bg-emerald-50',
  },
  {
    key: 'important',
    label: 'Important',
    className: 'border-sky-200 bg-sky-50',
  },
  {
    key: 'unnecessary',
    label: 'Unnecessary',
    className: 'border-rose-200 bg-rose-50',
  },
  {
    key: 'unassigned',
    label: 'Unassigned',
    className: 'border-slate-200 bg-slate-50',
  },
]

export default function DashboardByImportanceCard({
  fromDate,
  toDate,
  walletId,
}: DashboardByImportanceCardProps) {
  const byImportance = useSummaryByImportanceQuery(walletId, {
    current_period: false,
    from_date: fromDate,
    to_date: toDate,
  })

  const data = byImportance.data

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">Spending by importance</div>
          <div className="mt-1 text-xs text-slate-500">
            {(data?.period_start ?? fromDate) + ' → ' + (data?.period_end ?? toDate)}
          </div>
        </div>

        {byImportance.isFetching && !byImportance.isPending ? <Spinner size="sm" /> : null}
      </div>

      {byImportance.isPending ? (
        <div className="flex justify-center py-10">
          <Spinner size="md" />
        </div>
      ) : byImportance.isError ? (
        <div className="py-6">
          <EmptyState
            title="Couldn't load summary"
            description={
              byImportance.error instanceof Error ? byImportance.error.message : 'Unknown error'
            }
            action={
              <Button variant="secondary" onClick={() => byImportance.refetch()}>
                Try again
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TILES.map((t) => (
              <ImportanceTile
                key={t.key}
                label={t.label}
                amount={data?.[t.key]}
                currency={data?.currency}
                className={t.className}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
            <span className="text-slate-600">Total</span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {String(data?.total ?? 0)}{' '}
              <span className="text-sm font-medium text-slate-500">{data?.currency ?? ''}</span>
            </span>
          </div>
        </>
      )}
    </div>
  )
}
