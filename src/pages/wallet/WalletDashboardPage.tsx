import DashboardCategoriesProductsTreeCard from '@/features/dashboard/components/categoriesProductsTree/DashboardCategoriesProductsTreeCard'
import DashboardByImportanceCard from '@/features/dashboard/components/DashboardByImportanceCard'
import DashboardDateRangeInputs from '@/features/dashboard/components/DashboardDateRangeInputs'
import { currentPeriodDates } from '@/features/dashboard/utils/currentPeriodDates'
import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import { useMeSettingsQuery } from '@/queries/useMeSettingQuery'
import useWalletQuery from '@/queries/useWalletQuery'
import { PageHeader } from '@/ui'
import { useState } from 'react'

export default function WalletDashboardPage() {
  const walletId = useWalletId()
  const wallet = useWalletQuery(walletId)
  const settings = useMeSettingsQuery()
  const { startDate, endDate } = currentPeriodDates(settings.data?.billing_day ?? 15)
  const [fromDate, setFromDate] = useState<string>(startDate)
  const [toDate, setToDate] = useState<string>(endDate)

  return (
    <div>
      <PageHeader title="Dashboard" />

      <DashboardDateRangeInputs
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        disabled={wallet.isPending || settings.isPending}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <DashboardByImportanceCard walletId={walletId} fromDate={fromDate} toDate={toDate} />

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            Chart last periods (placeholder)
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-4">
            <DashboardCategoriesProductsTreeCard
              walletId={walletId}
              fromDate={fromDate}
              toDate={toDate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
