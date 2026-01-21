import { usersApi } from '@/api/modules'
import { getTokenFromStorage } from '@/authentication/handleToken'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'

export function useMeSettingsQuery() {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: usersApi.getSettings,
    enabled: hasToken,
    staleTime: 60_000,
  })
}
