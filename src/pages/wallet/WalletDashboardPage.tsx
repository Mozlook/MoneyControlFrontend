import DashboardCategoriesProductsTreeCard from '@/features/dashboard/components/categoriesProductsTree/DashboardCategoriesProductsTreeCard'
import DashboardByImportanceCard from '@/features/dashboard/components/DashboardByImportanceCard'
import DashboardDateRangeInputs from '@/features/dashboard/components/DashboardDateRangeInputs'
import DashboardLastPeriodsBarChartCard from '@/features/dashboard/components/DashboardLastPeriodsBarChartCard'
import { currentPeriodDates } from '@/features/dashboard/utils/currentPeriodDates'
import CreateTransactionModal from '@/features/transactions/components/CreateTransactionModal'
import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import { useMeSettingsQuery } from '@/queries/useMeSettingQuery'
import useWalletQuery from '@/queries/useWalletQuery'
import { Button, PageHeader } from '@/ui'
import { useMemo, useState } from 'react'

export default function WalletDashboardPage() {
  const walletId = useWalletId()
  const wallet = useWalletQuery(walletId)
  const settings = useMeSettingsQuery()
  const billingDay = settings.data?.billing_day
  const [isTransactionOpen, setIsTransactionOpen] = useState<boolean>(false)

  const defaultRange = useMemo(() => {
    if (!billingDay) return null
    return currentPeriodDates(billingDay)
  }, [billingDay])

  const [customRange, setCustomRange] = useState<{ from: string; to: string } | null>(null)

  const fromDate = customRange?.from ?? defaultRange?.startDate ?? ''
  const toDate = customRange?.to ?? defaultRange?.endDate ?? ''

  const handleFromDateChange = (value: string) => {
    setCustomRange((prev) => ({
      from: value,
      to: prev?.to ?? toDate,
    }))
  }

  const handleToDateChange = (value: string) => {
    setCustomRange((prev) => ({
      from: prev?.from ?? fromDate,
      to: value,
    }))
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        actions={
          <Button variant="primary" className="mb-4" onClick={() => setIsTransactionOpen(true)}>
            Add transaction
          </Button>
        }
      />

      <CreateTransactionModal
        open={isTransactionOpen}
        onOpenChange={setIsTransactionOpen}
        walletId={walletId}
      />

      <DashboardDateRangeInputs
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={handleFromDateChange}
        onToDateChange={handleToDateChange}
        disabled={wallet.isPending || settings.isPending}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <DashboardByImportanceCard walletId={walletId} fromDate={fromDate} toDate={toDate} />
          <DashboardLastPeriodsBarChartCard walletId={walletId} />
        </div>

        <div className="lg:col-span-5">
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
