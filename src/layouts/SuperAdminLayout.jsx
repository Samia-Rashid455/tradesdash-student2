import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Building2, CreditCard, LineChart, Activity, Flag, ScrollText, Search, Bell } from 'lucide-react'
import { colors } from '../theme'
import { useTenantStore } from '../store/tenantStore'
import { useAuditStore } from '../store/auditStore'

const nav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/tenants', label: 'Tenants', icon: Building2 },
  { to: '/admin/billing', label: 'Subscription & Billing', icon: CreditCard },
  { to: '/admin/analytics', label: 'Analytics', icon: LineChart },
  { to: '/admin/health', label: 'System Health', icon: Activity },
  { to: '/admin/flags', label: 'Feature Flags', icon: Flag },
  { to: '/admin/audit', label: 'Audit Log', icon: ScrollText },
]

const dropdown = {
  position: 'absolute', top: 'calc(100% + 8px)', background: colors.surface,
  border: `1px solid ${colors.border}`, borderRadius: 12, zIndex: 50,
  boxShadow: '0 8px 24px rgba(20,38,63,0.15)', overflow: 'hidden',
}

export default function SuperAdminLayout() {
  const navigate = useNavigate()
  const tenants = useTenantStore((s) => s.tenants)
  const logs = useAuditStore((s) => s.logs)

  const [query, setQuery] = useState('')
  const [bellOpen, setBellOpen] = useState(false)
  const [seen, setSeen] = useState(() => logs.length)

  const q = query.trim().toLowerCase()
  const results = q
    ? tenants
        .filter((t) => [t.name, t.owner, t.trade].some((v) => v.toLowerCase().includes(q)))
        .slice(0, 5)
    : []

  const unread = Math.max(0, logs.length - seen)

  const openTenant = (id) => {
    navigate(`/admin/tenants/${id}`)
    setQuery('')
  }

  const toggleBell = () => {
    setBellOpen(!bellOpen)
    setSeen(logs.length)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.pageBg }}>
      {/* ---------- SIDEBAR ---------- */}
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

      {/* ---------- MAIN ---------- */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '12px 24px',
            background: colors.surface, borderBottom: `1px solid ${colors.border}`,
            position: 'relative', zIndex: 20,
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

          <div style={{ flex: 1 }} />

          {/* Search */}
          <div style={{ position: 'relative', width: 320 }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                border: `1px solid ${colors.border}`, borderRadius: 10, padding: '8px 14px', background: colors.surface,
              }}
            >
              <Search size={16} color={colors.muted} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && results[0]) openTenant(results[0].id)
                  if (e.key === 'Escape') setQuery('')
                }}
                placeholder="Search tenants..."
                style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, color: colors.text, background: 'transparent' }}
              />
            </div>

            {q && (
              <div style={{ ...dropdown, left: 0, right: 0 }}>
                {results.length === 0 && (
                  <div style={{ padding: 14, fontSize: 14, color: colors.muted }}>No tenants found</div>
                )}
                {results.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => openTenant(t.id)}
                    style={{ padding: '10px 14px', cursor: 'pointer', borderTop: `1px solid ${colors.border}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = colors.navy50)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ fontWeight: 600, color: colors.text, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: colors.muted }}>
                      {t.owner} · {t.trade} · {t.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bell */}
          <div style={{ position: 'relative' }}>
            <div onClick={toggleBell} style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={22} color={colors.navy700} />
              {unread > 0 && (
                <span
                  style={{
                    position: 'absolute', top: -6, right: -8, minWidth: 18, height: 18, borderRadius: 999,
                    background: colors.danger, color: '#fff', fontSize: 11, fontWeight: 700,
                    display: 'grid', placeItems: 'center', padding: '0 4px',
                  }}
                >
                  {unread}
                </span>
              )}
            </div>

            {bellOpen && (
              <>
                <div onClick={() => setBellOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                <div style={{ ...dropdown, right: 0, width: 340, zIndex: 50 }}>
                  <div style={{ padding: '12px 14px', fontWeight: 700, color: colors.navy700 }}>Recent activity</div>
                  {logs.slice(0, 5).map((l) => (
                    <div key={l.id} style={{ padding: '10px 14px', borderTop: `1px solid ${colors.border}` }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{l.action}</div>
                      <div style={{ fontSize: 12, color: colors.muted }}>{l.detail}</div>
                    </div>
                  ))}
                  <div
                    onClick={() => { setBellOpen(false); navigate('/admin/audit') }}
                    style={{ padding: 12, textAlign: 'center', cursor: 'pointer', borderTop: `1px solid ${colors.border}`, color: colors.navy700, fontWeight: 600, fontSize: 14 }}
                  >
                    View full audit log →
                  </div>
                </div>
              </>
            )}
          </div>

          <div style={{ width: 40, height: 40, borderRadius: '50%', background: colors.navy900, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14 }}>
            S
          </div>
        </header>

        <main style={{ padding: 32 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}