export type CategoryCreate = {
  name: string
  color?: string
  icon?: string
}

export type CategoryRead = {
  id: string
  name: string
  color: string | null
  icon: string | null
  created_at: string
}
