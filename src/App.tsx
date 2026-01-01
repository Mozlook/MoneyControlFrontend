import { Navigate, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen p-6">
      <Routes>
        <Route
          path="/"
          element={<h1 className="text-3xl font-bold underline">MoneyControl Frontend</h1>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
