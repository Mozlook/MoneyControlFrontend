import { clearTokenStorage } from '@/authentication/handleToken'
import { routePaths } from '@/routes/routePaths'
import { notify } from '@/ui'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import AppNavbar from '@/layouts/components/AppNavbar'

export default function AppLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleUnauthorized = () => {
      clearTokenStorage()
      notify.error('Session expired')
      navigate(routePaths.auth.login(), { replace: true })
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [navigate])

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
        <Outlet />
      </main>
    </div>
  )
}
