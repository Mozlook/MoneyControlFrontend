import type { Option } from './languages'

const FALLBACK_TIMEZONES = [
  'Europe/Warsaw',
  'UTC',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
] as const

export function getTimeZoneOptions(): Option<string>[] {
  const supportedValuesOf = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] })
    .supportedValuesOf

  const zones =
    typeof supportedValuesOf === 'function'
      ? supportedValuesOf('timeZone')
      : [...FALLBACK_TIMEZONES]

  return zones.map((z) => ({ value: z, label: z }))
}
