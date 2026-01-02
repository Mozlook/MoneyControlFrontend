import { api } from '@/api/client'
import { apiPaths } from '@/api/apiPaths'
import type { UserRead } from '@/models/user'
import type { UserSettingsRead, UserSettingsUpdate } from '@/models/userSettings'

export const usersApi = {
  getMe: () => api.get<UserRead>(apiPaths.users.me()),

  getSettings: () => api.get<UserSettingsRead>(apiPaths.users.settings()),

  updateSettings: (payload: UserSettingsUpdate) =>
    api.put<UserSettingsRead>(apiPaths.users.settings(), payload),
}
