import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useMeSettingsQuery } from '@/queries/useMeSettingQuery'
import { Button, EmptyState, FieldError, Input, Label, notify, Select, Spinner } from '@/ui'

import { LANGUAGE_OPTIONS } from '@/features/settings/options/languages'
import { CURRENCY_OPTIONS } from '@/features/settings/options/currencies'
import { getTimeZoneOptions } from '@/features/settings/options/timezones'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/modules'
import type { UserSettingsUpdate } from '@/models/userSettings'
import { queryKeys } from '@/queries/queryKeys'

export default function SettingsPage() {
  const settings = useMeSettingsQuery()

  const [form, setForm] = useState<UserSettingsUpdate>({
    language: '',
    currency: '',
    billing_day: '',
    timezone: '',
  })

  const [error, setError] = useState<string>('')

  const timeZoneOptionsBase = useMemo(() => getTimeZoneOptions(), [])

  const timeZoneOptions = useMemo(() => {
    const current = settings.data?.timezone
    if (!current) return timeZoneOptionsBase

    const exists = timeZoneOptionsBase.some((o) => o.value === current)
    return exists
      ? timeZoneOptionsBase
      : [{ value: current, label: current }, ...timeZoneOptionsBase]
  }, [timeZoneOptionsBase, settings.data?.timezone])

  useEffect(() => {
    if (!settings.data) return
    setForm({
      language: settings.data.language ?? '',
      currency: settings.data.currency ?? '',
      billing_day: String(settings.data.billing_day ?? ''),
      timezone: settings.data.timezone ?? '',
    })
    setError('')
  }, [settings.data])

  const queryClient = useQueryClient()

  const updateSettings = useMutation({
    mutationFn: (payload: UserSettingsUpdate) => usersApi.updateSettings(payload),
    onSuccess: () => {
      notify.success('User settings updated correctly')
      queryClient.invalidateQueries({ queryKey: queryKeys.settings })
    },
    onError: (err) => {
      notify.fromError(err)
    },
  })

  const isSubmitting = updateSettings.isPending
  const disabled = settings.isPending || isSubmitting

  const billingDayNum = Number(form.billing_day)
  const billingDayOk = Number.isInteger(billingDayNum) && billingDayNum >= 1 && billingDayNum <= 28

  const canSubmit =
    !!form.language && !!form.currency && !!form.timezone && billingDayOk && !disabled

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!form.language) return setError('Select language.')
    if (!form.currency) return setError('Select currency.')
    if (!form.timezone) return setError('Select timezone.')
    if (!billingDayOk) return setError('Billing day must be between 1 and 28.')

    setError('')

    updateSettings.mutate({
      language: form.language,
      currency: form.currency,
      billing_day: String(billingDayNum),
      timezone: form.timezone,
    })
  }

  function handleReset() {
    if (!settings.data) return
    setForm({
      language: settings.data.language ?? '',
      currency: settings.data.currency ?? '',
      billing_day: String(settings.data.billing_day ?? ''),
      timezone: settings.data.timezone ?? '',
    })
    setError('')
  }

  if (settings.isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="md" />
      </div>
    )
  }

  if (settings.isError) {
    return (
      <div className="p-6">
        <EmptyState
          title="Couldn't load settings"
          description={settings.error instanceof Error ? settings.error.message : 'Unknown error'}
          action={
            <Button variant="secondary" onClick={() => settings.refetch()}>
              Try again
            </Button>
          }
        />
      </div>
    )
  }

  if (!settings.data) {
    return (
      <div className="p-6">
        <EmptyState title="No settings" description="Settings are not available." />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <div className="text-lg font-semibold text-slate-900">Settings</div>
        <div className="mt-1 text-sm text-slate-500">Account preferences used across the app.</div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div className="grid gap-1">
          <Label htmlFor="settings-language">Language</Label>
          <Select
            id="settings-language"
            value={form.language}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, language: e.target.value }))
              if (error) setError('')
            }}
            disabled={disabled}
          >
            <option value="" disabled>
              Select language
            </option>

            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-1">
          <Label htmlFor="settings-currency">Currency</Label>
          <Select
            id="settings-currency"
            value={form.currency}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, currency: e.target.value }))
              if (error) setError('')
            }}
            disabled={disabled}
          >
            <option value="" disabled>
              Select currency
            </option>

            {CURRENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-1">
          <Label htmlFor="settings-billingDay">Billing day</Label>
          <Input
            id="settings-billingDay"
            type="number"
            inputMode="numeric"
            min={1}
            max={28}
            value={form.billing_day}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, billing_day: e.target.value }))
              if (error) setError('')
            }}
            disabled={disabled}
            placeholder="1"
          />
          <div className="text-xs text-slate-500">Allowed range: 1–28</div>
        </div>

        <div className="grid gap-1">
          <Label htmlFor="settings-timezone">Timezone</Label>
          <Select
            id="settings-timezone"
            value={form.timezone}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, timezone: e.target.value }))
              if (error) setError('')
            }}
            disabled={disabled || timeZoneOptions.length === 0}
          >
            <option value="" disabled>
              {timeZoneOptions.length === 0 ? 'No timezones available' : 'Select timezone'}
            </option>

            {timeZoneOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>

          <div className="text-xs text-slate-500">Uses your browser-supported IANA timezones.</div>
        </div>

        <FieldError>{error}</FieldError>

        <div className="flex items-center gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleReset} disabled={disabled}>
            Reset
          </Button>

          <Button type="submit" variant="primary" disabled={!canSubmit} loading={isSubmitting}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  )
}
