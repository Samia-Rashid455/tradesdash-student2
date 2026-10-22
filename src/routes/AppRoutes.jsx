import { Routes, Route, Navigate, Link } from 'react-router-dom'
import SuperAdminLayout from '../layouts/SuperAdminLayout'
import Billing from '../modules/billing/Billing'
import Analytics from '../modules/analytics/Analytics'

// Placeholders for screens owned by teammates
const Placeholder = ({ title, owner }) => (
  <div>
    <h1 style={{ margin: 0 }}>{title}</h1>
    <p style={{ color: '#5B6776' }}>Owned by {owner}. Not built yet.</p>
  </div>
)

const NotFound = () => (
  <div style={{ padding: 40 }}>
    <h1>Page not found</h1>
    <Link to="/admin">Go to Overview</Link>
  </div>
)

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/billing" replace />} />
      <Route path="/admin" element={<SuperAdminLayout />}>
        {/* Hidden placeholders: only here so the links from your screens work */}
        <Route index element={<Placeholder title="Overview" owner="Student 1" />} />
        <Route path="tenants/:id" element={<Placeholder title="Tenant Detail" owner="Student 1" />} />

        {/* ---- YOUR SCREENS ---- */}
        <Route path="billing" element={<Billing />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}