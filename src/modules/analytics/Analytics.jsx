import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts'
import { colors } from '../../theme'
import { getAnalytics } from '../../services/adminApi'

const card = {
  background: colors.surface, border: `1px solid ${colors.border}`,
  borderRadius: 12, padding: 22,
}
const input = {
  border: `1px solid ${colors.border}`, borderRadius: 8, padding: '8px 12px',
  fontSize: 14, color: colors.text, background: colors.surface,
}
const presetButton = {
  border: `1px solid ${colors.navy700}`, background: colors.surface, color: colors.navy700,
  borderRadius: 8, padding: '8px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
}

// Local date as YYYY-MM-DD
const toISO = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return toISO(d)
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const prettyLabel = (label, granularity) => {
  if (granularity === 'month') {
    const [y, m] = label.split('-')
    return `${MONTHS[Number(m) - 1]} ${y.slice(2)}`
  }
  const [, m, d] = label.split('-')
  return `${Number(d)} ${MONTHS[Number(m) - 1]}`
}

function ChartCard({ title, children }) {
  return (
    <div style={card}>
      <h3 style={{ margin: '0 0 12px', color: colors.text, fontSize: 16 }}>{title}</h3>
      <div style={{ width: '100%', height: 240 }}>{children}</div>
    </div>
  )
}

export default function Analytics() {
  const [from, setFrom] = useState(daysAgo(89))
  const [to, setTo] = useState(daysAgo(0))
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const rangeError = !from || !to ? 'Choose both dates.' : from > to ? 'The "from" date must not be after the "to" date.' : ''

  useEffect(() => {
    if (rangeError) return
    let cancelled = false
    setLoading(true)
    getAnalytics(from, to)
      .then((d) => {
        if (cancelled) return
        setData(d)
        setError('')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.response?.data?.error || 'Could not reach the server. Start it with "npm run server" and reload.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [from, to, rangeError])

  const setPreset = (days) => {
    setFrom(daysAgo(days - 1))
    setTo(daysAgo(0))
  }

  const series = data
    ? data.series.map((s) => ({ ...s, name: prettyLabel(s.label, data.granularity) }))
    : []

  return (
    <div>
      <Link to="/admin" style={{ color: colors.navy700, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
        ← Back to Overview
      </Link>
      <h1 style={{ margin: '8px 0 0', fontSize: 28, color: colors.navy700 }}>Analytics</h1>
      <p style={{ margin: '4px 0 20px', color: colors.muted }}>
        Signups, revenue, active users and the most used features
      </p>

      {/* Date range */}
      <div style={{ ...card, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 16, marginBottom: 16 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: colors.muted }}>
          From
          <input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} style={input} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: colors.muted }}>
          To
          <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} style={input} />
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={presetButton} onClick={() => setPreset(30)}>Last 30 days</button>
          <button style={presetButton} onClick={() => setPreset(90)}>Last 90 days</button>
          <button style={presetButton} onClick={() => setPreset(365)}>Last 12 months</button>
        </div>
        {rangeError && <span style={{ color: colors.danger, fontSize: 14 }}>{rangeError}</span>}
      </div>

      {error && (
        <div style={{ ...card, borderTop: `4px solid ${colors.danger}`, marginBottom: 16 }}>
          <p style={{ margin: 0, color: colors.danger }}>{error}</p>
        </div>
      )}

      {loading && !data && <p style={{ color: colors.muted }}>Loading analytics…</p>}

      {data && (
        <div style={{ opacity: loading ? 0.6 : 1 }}>
          {/* Totals */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
            {[
              { label: 'New signups', value: data.totals.signups.toLocaleString('en-GB'), color: colors.navy700 },
              { label: 'Revenue', value: `£${data.totals.revenue.toLocaleString('en-GB')}`, color: colors.orange500 },
              { label: 'Active users (latest day)', value: data.totals.activeUsers.toLocaleString('en-GB'), color: colors.success },
            ].map((t) => (
              <div key={t.label} style={{ ...card, borderTop: `4px solid ${t.color}` }}>
                <div style={{ color: colors.muted, fontSize: 14 }}>{t.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: colors.text, marginTop: 6 }}>{t.value}</div>
              </div>
            ))}
          </div>

          <p style={{ color: colors.muted, fontSize: 13, margin: '0 0 12px' }}>
            Showing {data.from} to {data.to}, grouped by {data.granularity}.
          </p>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
            <ChartCard title="Signups">
              <ResponsiveContainer>
                <LineChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} minTickGap={24} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="signups" stroke={colors.navy700} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Revenue (£)">
              <ResponsiveContainer>
                <BarChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} minTickGap={24} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `£${v.toLocaleString('en-GB')}`} />
                  <Bar dataKey="revenue" fill={colors.orange500} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Active users">
              <ResponsiveContainer>
                <AreaChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} minTickGap={24} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="activeUsers" stroke={colors.success} fill="#DCFCE7" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Most used features */}
          <div style={{ ...card, marginTop: 16 }}>
            <h3 style={{ margin: '0 0 12px', color: colors.text, fontSize: 16 }}>Most used features</h3>
            <div style={{ width: '100%', height: 40 + data.features.length * 44 }}>
              <ResponsiveContainer>
                <BarChart data={data.features} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 13 }} width={130} />
                  <Tooltip />
                  <Bar dataKey="uses" fill={colors.navy700} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}