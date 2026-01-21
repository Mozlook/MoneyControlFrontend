import { currentPeriodDates } from '@/features/dashboard/utils/currentPeriodDates'
import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import { useMeSettingsQuery } from '@/queries/useMeSettingQuery'
import useWalletQuery from '@/queries/useWalletQuery'
import { Input, Label, PageHeader } from '@/ui'
import { useState } from 'react'

export default function WalletDashboardPage() {
  const walletId = useWalletId()
  const wallet = useWalletQuery(walletId)
  const settings = useMeSettingsQuery()
  const { startDate, endDate } = currentPeriodDates(settings.data?.billing_day ?? 10)
  const [fromDate, setFromDate] = useState<string>(startDate)
  const [toDate, setToDate] = useState<string>(endDate)
  return (
    <div>
      <PageHeader title="Dashboard">
        {' '}
        <div className="grid gap-1">
          <Label>From</Label>
          <Input
            type="date"
            value={fromDate}
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
      </PageHeader>
    </div>
  )
}
