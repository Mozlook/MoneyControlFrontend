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
  const { startDate, endDate } = currentPeriodDates(settings.data?.billing_day ?? 10)
  const [fromDate, setFromDate] = useState<Date>(startDate)
  return (
    <div>
      <PageHeader title="Dashboard" />
    </div>
  )
}
