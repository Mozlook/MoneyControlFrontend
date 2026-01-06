import { NavLink, Link, useNavigate } from 'react-router-dom'
import { routePaths } from '@/routes/routePaths'
import { clearTokenStorage } from '@/authentication/handleToken'
import Button from '@/ui/button'
import { notify } from '@/ui'

export default function AppNavbar() {
  const navigate = useNavigate()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'

  const handleLogout = () => {
    clearTokenStorage()
    notify.info('Logged out')
    navigate(routePaths.auth.login(), { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link to={routePaths.wallets.list()} className="text-sm font-semibold text-slate-900">
            MoneyControl
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <NavLink to={routePaths.wallets.list()} className={linkClass}>
              Wallets
            </NavLink>
            <NavLink to={routePaths.settings.root()} className={linkClass}>
              Settings
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
