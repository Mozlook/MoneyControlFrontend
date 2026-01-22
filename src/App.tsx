import { Navigate, Route, Routes } from 'react-router-dom'

import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import WalletLayout from './layouts/WalletLayout'

import RequireAuth from './routes/RequireAuth'
import { routePatterns, routePaths } from './routes/routePaths'

import LoginPage from './pages/LoginPage'
import WalletsPage from './pages/WalletsPage'
import NotFoundPage from './pages/NotFoundPage'

import WalletTransactionsPage from './pages/wallet/WalletTransactionsPage'
import WalletCategoriesPage from './pages/wallet/WalletCategoriesPage'
import WalletProductsPage from './pages/wallet/WalletProductsPage'
import WalletRecurringPage from './pages/wallet/WalletRecurringPage'
import WalletMembersPage from './pages/wallet/WalletMembersPage'
import WalletDashboardPage from './pages/wallet/WalletDashboardPage'
import WalletHistoryPage from './pages/wallet/WalletHistoryPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={routePatterns.auth.login} element={<LoginPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to={routePaths.wallets.list()} replace />} />

          <Route path={routePatterns.wallets.list} element={<WalletsPage />} />
          <Route path={routePatterns.settings.root} element={<SettingsPage />} />

          <Route path={routePatterns.wallets.base} element={<WalletLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="transactions" element={<WalletTransactionsPage />} />
            <Route path="categories" element={<WalletCategoriesPage />} />
            <Route path="products" element={<WalletProductsPage />} />
            <Route path="recurring" element={<WalletRecurringPage />} />
            <Route path="members" element={<WalletMembersPage />} />
            <Route path="dashboard" element={<WalletDashboardPage />} />
            <Route path="history" element={<WalletHistoryPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
