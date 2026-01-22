export type Option<T extends string | number = string> = {
  value: T
  label: string
}

export const LANGUAGE_OPTIONS: Option<string>[] = [
  { value: 'pl', label: 'Polski (pl)' },
  { value: 'en', label: 'English (en)' },
]
