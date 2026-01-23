import { NavLink, Link, useNavigate } from 'react-router-dom'
import { routePaths } from '@/routes/routePaths'
import { clearTokenStorage } from '@/authentication/handleToken'
import Button from '@/ui/button'
import { notify, Spinner } from '@/ui'
import { useMeQuery } from '@/queries/useMeQuery'
import { useEffect, useState } from 'react'

export default function AppNavbar() {
  const navigate = useNavigate()
  const me = useMeQuery()

  const [mobileOpen, setMobileOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'

  const handleLogout = () => {
    clearTokenStorage()
    notify.info('Logged out')
    navigate(routePaths.auth.login(), { replace: true })
  }

  useEffect(() => {
    if (!mobileOpen) return
    const onPop = () => setMobileOpen(false)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to={routePaths.wallets.list()} className="text-sm font-semibold text-slate-900">
            MoneyControl
          </Link>

          <nav className="hidden items-center gap-4 text-sm sm:flex">
            <NavLink to={routePaths.wallets.list()} className={linkClass}>
              Wallets
            </NavLink>
            <NavLink to={routePaths.settings.root()} className={linkClass}>
              Settings
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            {me.isPending ? (
              <Spinner size="sm" />
            ) : me.isError ? null : (
              <span className="max-w-[220px] truncate text-sm text-slate-700">
                {me.data?.display_name ?? me.data?.email}
              </span>
            )}

            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <div className="sm:hidden">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Open menu"
            >
              {mobileOpen ? 'Close' : 'Menu'}
            </Button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white sm:hidden">
          <div className="mx-auto w-full max-w-6xl px-4 py-3">
            <div className="flex flex-col gap-2">
              <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {me.isPending ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span>Loading…</span>
                  </div>
                ) : me.isError ? (
                  <span>—</span>
                ) : (
                  <span className="break-all">{me.data?.display_name ?? me.data?.email}</span>
                )}
              </div>

              <NavLink
                to={routePaths.wallets.list()}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm ${
                    isActive
                      ? 'bg-slate-100 font-medium text-slate-900'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                Wallets
              </NavLink>

              <NavLink
                to={routePaths.settings.root()}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm ${
                    isActive
                      ? 'bg-slate-100 font-medium text-slate-900'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                Settings
              </NavLink>

              <Button
                variant="secondary"
                onClick={() => {
                  setMobileOpen(false)
                  handleLogout()
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
