import { Input, Label } from '@/ui'

type DashboardDateRangeInputsProps = {
  fromDate: string
  toDate: string
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
  disabled?: boolean
}

export default function DashboardDateRangeInputs({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  disabled = false,
}: DashboardDateRangeInputsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="grid min-w-0 gap-1">
        <Label>From</Label>
        <Input
          className="w-full min-w-0"
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="grid min-w-0 gap-1">
        <Label>To</Label>
        <Input
          className="w-full min-w-0"
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
