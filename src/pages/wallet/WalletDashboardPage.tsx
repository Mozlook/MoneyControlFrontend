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
    </div>
  )
}
