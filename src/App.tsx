import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import { routePatterns } from './routes/routePaths'

export default function App() {
  return (
    <div className="min-h-screen p-6">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<LoginPage />} path={routePatterns.auth.login} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
