import { authApi } from '@/api/modules'
import { setTokenToStorage } from '@/authentication/handleToken'
import { routePaths } from '@/routes/routePaths'
import { notify } from '@/ui'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: (idToken: string) => authApi.loginWithGoogle(idToken),

    onSuccess: (tokenResponse) => {
      setTokenToStorage(tokenResponse)
      notify.success('Logged in')
      queryClient.invalidateQueries({ queryKey: ['me'] })
      navigate(routePaths.wallets.list(), { replace: true })
    },

    onError: (err) => {
      notify.fromError(err, 'Login failed')
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
    <div className="fixed inset-0 w-screen overflow-hidden">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center blur-[1px]"
        style={{ backgroundImage: "url('/login_page_background.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

      <div className="relative flex h-full w-full items-center justify-center p-6">
        <div className="w-[min(92vw,560px)] rounded-2xl border border-white/50 bg-white/85 p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-7 text-center">
            <div className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
              MoneyControl
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-600">Use Google account to Login</p>
          </div>

          <div className={loginMutation.isPending ? 'pointer-events-none opacity-70' : ''}>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={() => notify.error('Google login failed')}
                text="signin_with"
              />
            </div>
          </div>

          {loginMutation.isPending && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600">
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"
                aria-hidden="true"
              />
              <span aria-live="polite">Logowanie…</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
