import { NavLink, Outlet } from 'react-router-dom'
import { CreditCard, LineChart } from 'lucide-react'
import { colors } from '../theme'

const nav = [
  { to: '/admin/billing', label: 'Subscription & Billing', icon: CreditCard },
  { to: '/admin/analytics', label: 'Analytics', icon: LineChart },
]
export default function SuperAdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.pageBg }}>
      <aside
        style={{
          width: 250, background: colors.navy900, color: '#fff',
          display: 'flex', flexDirection: 'column', position: 'sticky',
          top: 0, height: '100vh', flexShrink: 0,
        }}
      >
        <div style={{ padding: '24px', fontSize: 22, fontWeight: 800, color: '#fff' }}>
          Trades<span style={{ color: colors.orange500 }}>Dash</span>
        </div>

        <div style={{ padding: '8px 24px 8px', fontSize: 11, letterSpacing: 1.5, color: '#8FA1B8', fontWeight: 600 }}>
          SUPER ADMIN
        </div>

        <nav style={{ flex: 1 }}>
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                margin: '4px 12px', padding: '11px 14px', borderRadius: 10,
                textDecoration: 'none', fontWeight: 500, fontSize: 15,
                color: '#fff',
                background: isActive ? colors.orange500 : 'transparent',
                opacity: isActive ? 1 : 0.75,
              })}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: '#8FA1B8' }}>
          TradesDash owner panel
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            display: 'flex', alignItems: 'center', padding: '12px 24px',
            background: colors.surface, borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: colors.navy700, fontSize: 18 }}>
              TradesDash Control Panel
            </div>
            <div style={{ fontSize: 12, color: colors.muted }}>
              Manage every tradesperson business on the platform
            </div>
          </div>
        </header>

        <main style={{ padding: 32 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}