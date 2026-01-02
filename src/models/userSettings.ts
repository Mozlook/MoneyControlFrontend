export type UserSettingsRead = {
  language: string
  currency: string
  billing_day: number
  timezone: string
}
export type UserSettingsUpdate = {
  language?: string
  currency?: string
  billing_day?: string
  timezone?: string
}
