import { api } from '@/api/client'
import { apiPaths } from '@/api/apiPaths'
import type { UserRead } from '@/models/user'
import type { UserSettingsRead, UserSettingsUpdate } from '@/models/userSettings'

export const usersApi = {
  getMe: () => api.get<UserRead>(apiPaths.users.me()),

  getSettings: () => api.get<UserSettingsRead>(apiPaths.settings.me()),

  updateSettings: (payload: UserSettingsUpdate) =>
    api.put<UserSettingsRead>(apiPaths.settings.me(), payload),
}
