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
    <div className="flex gap-2">
      <div className="grid gap-1">
        <Label>From</Label>
        <Input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="grid gap-1">
        <Label>To</Label>
        <Input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
