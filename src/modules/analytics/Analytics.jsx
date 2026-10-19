import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts'
import { colors } from '../../theme'

// 12 months of sample data
const allData = [
  { month: 'Nov', signups: 8, revenue: 1900, activeUsers: 610 },
  { month: 'Dec', signups: 10, revenue: 2100, activeUsers: 680 },
  { month: 'Jan', signups: 12, revenue: 2300, activeUsers: 760 },
  { month: 'Feb', signups: 9, revenue: 2600, activeUsers: 820 },
  { month: 'Mar', signups: 15, revenue: 2900, activeUsers: 910 },
  { month: 'Apr', signups: 13, revenue: 3050, activeUsers: 1000 },
  { month: 'May', signups: 18, revenue: 3300, activeUsers: 1090 },
  { month: 'Jun', signups: 16, revenue: 3550, activeUsers: 1190 },
  { month: 'Jul', signups: 20, revenue: 3800, activeUsers: 1290 },
  { month: 'Aug', signups: 22, revenue: 4100, activeUsers: 1360 },
  { month: 'Sep', signups: 19, revenue: 4400, activeUsers: 1420 },
  { month: 'Oct', signups: 24, revenue: 4800, activeUsers: 1480 },
]

const features = [
  { name: 'Voice Quote', uses: 1840 },
  { name: 'Invoicing', uses: 1520 },
  { name: 'WhatsApp sending', uses: 1210 },
  { name: 'Certificates', uses: 760 },
]

const ranges = [
  { label: 'Last 3 months', months: 3 },
  { label: 'Last 6 months', months: 6 },
  { label: 'Last 12 months', months: 12 },
]

const card = {
  background: colors.surface, border: `1px solid ${colors.border}`,
  borderRadius: 12, padding: 22,
}

const ChartCard = ({ title, children }) => (
  <div style={card}>
    <h3 style={{ margin: '0 0 12px', color: colors.text }}>{title}</h3>
    <div style={{ height: 240 }}>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  </div>
)

export default function Analytics() {
  const [months, setMonths] = useState(6)
  const data = allData.slice(-months)
  const maxUses = Math.max(...features.map((f) => f.uses))

  const axis = { axisLine: false, tickLine: false, stroke: colors.muted }

  return (
    <div>
      <Link
        to="/admin"
        style={{ color: colors.navy700, fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginBottom: 12 }}
      >
        ← Back to Overview
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: colors.navy700 }}>Analytics</h1>
          <p style={{ margin: '4px 0 0', color: colors.muted }}>Sign-ups, revenue and usage over time</p>
        </div>

        {/* Date-range filter */}
        <div style={{ display: 'flex', background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 4 }}>
          {ranges.map((r) => (
            <button
              key={r.months}
              onClick={() => setMonths(r.months)}
              style={{
                border: 'none', cursor: 'pointer', padding: '8px 14px', borderRadius: 8,
                fontWeight: 600, fontSize: 14,
                background: months === r.months ? colors.navy700 : 'transparent',
                color: months === r.months ? '#fff' : colors.muted,
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts over time */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
        <ChartCard title="New sign-ups">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
            <XAxis dataKey="month" {...axis} />
            <YAxis {...axis} />
            <Tooltip cursor={{ fill: colors.navy50 }} />
            <Bar dataKey="signups" name="Sign-ups" fill={colors.navy700} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Revenue (£)">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
            <XAxis dataKey="month" {...axis} />
            <YAxis {...axis} />
            <Tooltip formatter={(v) => `£${v}`} />
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke={colors.orange500} strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Active users">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
            <XAxis dataKey="month" {...axis} />
            <YAxis {...axis} />
            <Tooltip />
            <Area type="monotone" dataKey="activeUsers" name="Active users" stroke={colors.success} fill="#DCFCE7" strokeWidth={2} />
          </AreaChart>
        </ChartCard>
      </div>

      {/* Most used features */}
      <div style={{ ...card, marginTop: 16 }}>
        <h3 style={{ margin: '0 0 20px', color: colors.text }}>Most used features</h3>
        {features.map((f, i) => (
          <div key={f.name} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
              <span style={{ color: colors.text, fontWeight: 500 }}>
                {i + 1}. {f.name}
              </span>
              <span style={{ color: colors.muted }}>{f.uses.toLocaleString()} uses</span>
            </div>
            <div style={{ height: 10, background: colors.navy50, borderRadius: 999 }}>
              <div
                style={{
                  width: `${(f.uses / maxUses) * 100}%`, height: '100%', borderRadius: 999,
                  background: i === 0 ? colors.orange500 : colors.navy700,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}