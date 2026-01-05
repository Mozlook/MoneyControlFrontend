import { getTokenFromStorage } from '@/authentication/handleToken'
import { routePaths } from './routePaths'
import { Navigate, Outlet } from 'react-router-dom'

export default function RequireAuth() {
  const token = getTokenFromStorage()

  if (!token) {
    return <Navigate to={routePaths.auth.login()} replace />
  }

  return <Outlet />
}
