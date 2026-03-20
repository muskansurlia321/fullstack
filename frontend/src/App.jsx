import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { AppShell } from './components/AppShell.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { FeaturesPage } from './pages/FeaturesPage.jsx'
import { FlowPage } from './pages/FlowPage.jsx'
import { FutureScopePage } from './pages/FutureScopePage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { ResultsPage } from './pages/ResultsPage.jsx'
import { SignupPage } from './pages/SignupPage.jsx'
import { UploadPage } from './pages/UploadPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/flow" element={<FlowPage />} />
        <Route path="/future-scope" element={<FutureScopePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
