import { usersApi } from '@/api/modules'
import { getTokenFromStorage } from '@/authentication/handleToken'
import { useQuery } from '@tanstack/react-query'

export function useMeQuery() {
  const token = getTokenFromStorage()
  const hasToken = !!token?.access_token

  return useQuery({
    queryKey: ['me'],
    queryFn: usersApi.getMe,
    enabled: hasToken,
    staleTime: 60_000,
  })
}
