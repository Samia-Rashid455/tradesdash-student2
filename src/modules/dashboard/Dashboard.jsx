import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Users, Wallet, UserCheck, Plus } from 'lucide-react'
import { colors } from '../../theme'
import AddTenantModal from '../../components/common/AddTenantModal'
import { useTenantStore } from '../../store/tenantStore'

const revenue = [
  { month: 'Feb', value: 2600 }, { month: 'Mar', value: 2900 },
  { month: 'Apr', value: 3050 }, { month: 'May', value: 3300 },
  { month: 'Jun', value: 3550 }, { month: 'Jul', value: 3800 },
]

const plans = [
  { name: 'Pro', pct: 50, color: colors.navy700 },
  { name: 'Starter', pct: 30, color: colors.info },
  { name: 'Trial', pct: 20, color: colors.warning },
]

const statusStyle = {
  Trial: { bg: '#DBEAFE', fg: colors.info },
  Active: { bg: '#DCFCE7', fg: colors.success },
  Suspended: { bg: '#FEE2E2', fg: colors.danger },
}

const card = {
  background: colors.surface, border: `1px solid ${colors.border}`,
  borderRadius: 12, padding: 22,
}

export default function Dashboard() {
  const [showAdd, setShowAdd] = useState(false)
  const tenants = useTenantStore((s) => s.tenants)
  const recentTenants = tenants.slice(0, 3)

  const kpis = [
    { label: 'Total Tenants', value: String(tenants.length), note: 'on the platform', icon: Users, accent: colors.info },
    { label: 'Monthly Revenue', value: '£3,800', note: '+8% vs last month', icon: Wallet, accent: colors.navy700 },
    { label: 'Active Users', value: '1,480', note: '+120 this week', icon: UserCheck, accent: colors.success },
  ]

  return (
    <div>
      {showAdd && <AddTenantModal onClose={() => setShowAdd(false)} />}

      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: colors.navy700 }}>Overview</h1>
          <p style={{ margin: '4px 0 0', color: colors.muted }}>
            Key numbers and recent activity across all tenants
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer',
            background: colors.orange500, color: '#fff', fontWeight: 600,
            padding: '10px 18px', borderRadius: 10,
          }}
        >
          <Plus size={18} /> Add tenant
        </button>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {kpis.map(({ label, value, note, icon: Icon, accent }) => (
          <div key={label} style={{ ...card, borderTop: `4px solid ${accent}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: colors.muted, fontSize: 14 }}>{label}</span>
              <Icon size={20} color={accent} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, margin: '10px 0 4px', color: colors.text }}>{value}</div>
            <div style={{ fontSize: 12, color: colors.muted }}>{note}</div>
          </div>
        ))}
      </div>

      {/* Shortcuts */}
      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {[['Manage tenants', '/tenants'], ['Subscription & Billing', '/billing'], ['Analytics', '/analytics']].map(([label, to]) => (
          <Link
            key={to}
            to={to}
            style={{
              padding: '10px 18px', borderRadius: 10, textDecoration: 'none',
              border: `1px solid ${colors.navy700}`, color: colors.navy700,
              fontWeight: 600, background: colors.surface,
            }}
          >
            {label} →
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: 16, marginTop: 16 }}>
        <div style={card}>
          <h3 style={{ margin: '0 0 12px', color: colors.text }}>Revenue by month</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={revenue}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} stroke={colors.muted} />
                <YAxis axisLine={false} tickLine={false} stroke={colors.muted} />
                <Tooltip formatter={(v) => `£${v}`} cursor={{ fill: colors.navy50 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {revenue.map((r, i) => (
                    <Cell key={r.month} fill={i === revenue.length - 1 ? colors.orange500 : colors.navy700} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={card}>
          <h3 style={{ margin: '0 0 20px', color: colors.text }}>Subscription plans</h3>
          {plans.map((p) => (
            <div key={p.name} style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                <span style={{ color: colors.text, fontWeight: 500 }}>{p.name}</span>
                <span style={{ color: colors.muted }}>{p.pct}%</span>
              </div>
              <div style={{ height: 10, background: colors.navy50, borderRadius: 999 }}>
                <div style={{ width: `${p.pct}%`, height: '100%', background: p.color, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent sign-ups */}
      <div style={{ ...card, marginTop: 16 }}>
        <h3 style={{ margin: '0 0 12px', color: colors.text }}>Recent sign-ups</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: colors.navy50, color: colors.navy700, textAlign: 'left', fontSize: 13 }}>
              {['Tenant', 'Plan', 'Paid', 'Joined', 'Status'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTenants.map((r) => (
              <tr key={r.id} style={{ borderTop: `1px solid ${colors.border}` }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: colors.navy50, color: colors.navy700, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13 }}>
                      {r.name[0]}
                    </div>
                    <span style={{ color: colors.text }}>{r.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: colors.text }}>{r.plan}</td>
                <td style={{ padding: '14px 16px', color: colors.text }}>
                  {r.status === 'Trial' ? '£0' : r.plan === 'Pro' ? '£49' : '£19'}
                </td>
                <td style={{ padding: '14px 16px', color: colors.muted }}>{r.joined}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: statusStyle[r.status].bg, color: statusStyle[r.status].fg, fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 6 }}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}