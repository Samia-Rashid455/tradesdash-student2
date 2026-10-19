import { Routes, Route, Navigate, Link } from 'react-router-dom'
import SuperAdminLayout from '../layouts/SuperAdminLayout'
import Dashboard from '../modules/dashboard/Dashboard'
import Tenants from '../modules/tenants/Tenants'
import TenantDetail from '../modules/tenants/TenantDetail'
import Billing from '../modules/billing/Billing'
import Analytics from '../modules/analytics/Analytics'
import SystemHealth from '../modules/health/SystemHealth'
import FeatureFlags from '../modules/flags/FeatureFlags'
import AuditLog from '../modules/audit/AuditLog'

const NotFound = () => (
  <div style={{ padding: 40 }}>
    <h1>Page not found</h1>
    <Link to="/admin">Go to Overview</Link>
  </div>
)

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/admin" element={<SuperAdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tenants" element={<Tenants />} />
        <Route path="tenants/:id" element={<TenantDetail />} />
        <Route path="billing" element={<Billing />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="health" element={<SystemHealth />} />
        <Route path="flags" element={<FeatureFlags />} />
        <Route path="audit" element={<AuditLog />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}