import { authApi } from '@/api/modules'
import { setTokenToStorage } from '@/authentication/handleToken'
import { settings } from '@/config/settings'
import { routePaths } from '@/routes/routePaths'
import { notify } from '@/ui'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  console.log('GOOGLE_CLIENT_ID =', settings.GOOGLE_CLIENT_ID)
  const loginMutation = useMutation({
    mutationFn: (idToken: string) => authApi.loginWithGoogle(idToken),

    onSuccess: (tokenResponse) => {
      setTokenToStorage(tokenResponse)

      notify.success('Logged in')
      queryClient.invalidateQueries({ queryKey: ['me'] })

      navigate(routePaths.wallets.list(), { replace: true })
    },

    onError: (err) => {
      notify.fromError(err, 'Loggin failed')
    },
  })

  const onGoogleSuccess = (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential
    if (!idToken) {
      notify.error('Missing credential from Google')
      return
    }

    loginMutation.mutate(idToken)
  }

  return (
    <div className="p-6">
      <GoogleLogin
        onSuccess={onGoogleSuccess}
        onError={() => notify.error('Google login failed')}
        text="signin_with"
      />

      {loginMutation.isPending && <div className="mt-4 text-sm text-slate-600">Logging in…</div>}
    </div>
  )
}
