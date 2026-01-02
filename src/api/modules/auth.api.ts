import { api } from '@/api/client'
import { apiPaths } from '@/api/apiPaths'
import type { Token } from '@/models/token'

type GoogleAuthRequest = {
  id_token: string
}

export const authApi = {
  loginWithGoogle: (idToken: string) =>
    api.post<Token>(apiPaths.auth.google(), { id_token: idToken } satisfies GoogleAuthRequest),
}
