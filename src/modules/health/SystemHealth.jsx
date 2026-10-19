import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import { RefreshCw } from 'lucide-react'
import { colors } from '../../theme'

const statusOf = (s) =>
  s.errorRate >= 5 ? 'Down' : s.errorRate >= 1.5 || s.response > 500 ? 'Degraded' : 'Operational'

const statusStyle = {
  Operational: { bg: '#DCFCE7', fg: colors.success },
  Degraded: { bg: '#FEF3C7', fg: '#B45309' },
  Down: { bg: '#FEE2E2', fg: colors.danger },
}

const initialServices = [
  { name: 'API', note: 'Core backend', uptime: 99.98, response: 120, errorRate: 0.2 },
  { name: 'Database', note: 'Main data store', uptime: 99.99, response: 18, errorRate: 0.0 },
  { name: 'WhatsApp service', note: 'Message sending', uptime: 99.1, response: 640, errorRate: 1.8 },
  { name: 'Payment service', note: 'Card and invoice payments', uptime: 99.95, response: 210, errorRate: 0.4 },
]

const initialHistory = [
  { time: '09:00', response: 250 }, { time: '09:05', response: 270 },
  { time: '09:10', response: 240 }, { time: '09:15', response: 310 },
  { time: '09:20', response: 290 }, { time: '09:25', response: 260 },
]

const jitter = (v, pct) => v * (1 + (Math.random() * 2 - 1) * pct)

const card = {
  background: colors.surface, border: `1px solid ${colors.border}`,
  borderRadius: 12, padding: 22,
}

export default function SystemHealth() {
  const [services, setServices] = useState(initialServices)
  const [history, setHistory] = useState(initialHistory)
  const [checked, setChecked] = useState(new Date())

  const refresh = () => {
    const next = services.map((s) => ({
      ...s,
      response: Math.max(5, Math.round(jitter(s.response, 0.2))),
      errorRate: Math.max(0, +(s.errorRate + (Math.random() - 0.5) * 0.6).toFixed(2)),
    }))
    const avg = Math.round(next.reduce((a, s) => a + s.response, 0) / next.length)
    const now = new Date()
    setServices(next)
    setHistory((h) => [...h.slice(-11), { time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), response: avg }])
    setChecked(now)
  }

  const statuses = services.map(statusOf)
  const overall = statuses.includes('Down')
    ? { text: 'Major outage', ...statusStyle.Down }
    : statuses.includes('Degraded')
    ? { text: 'Some services have problems', ...statusStyle.Degraded }
    : { text: 'All systems operational', ...statusStyle.Operational }

  const avgUptime = (services.reduce((a, s) => a + s.uptime, 0) / services.length).toFixed(2)
  const avgResponse = Math.round(services.reduce((a, s) => a + s.response, 0) / services.length)
  const avgError = (services.reduce((a, s) => a + s.errorRate, 0) / services.length).toFixed(2)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: colors.navy700 }}>System Health</h1>
          <p style={{ margin: '4px 0 0', color: colors.muted }}>
            Simulated status · last checked {checked.toLocaleTimeString('en-GB')}
          </p>
        </div>
        <button
          onClick={refresh}
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '10px 18px', borderRadius: 10, fontWeight: 600, border: `1px solid ${colors.navy700}`, background: colors.surface, color: colors.navy700 }}
        >
          <RefreshCw size={16} /> Check now
        </button>
      </div>

      {/* Overall banner */}
      <div style={{ background: overall.bg, color: overall.fg, fontWeight: 700, padding: '14px 18px', borderRadius: 10, marginBottom: 16 }}>
        {overall.text}
      </div>

      {/* Key numbers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[
          ['Average uptime', `${avgUptime}%`, colors.success],
          ['Average response time', `${avgResponse} ms`, colors.navy700],
          ['Error rate', `${avgError}%`, Number(avgError) >= 1.5 ? colors.danger : colors.success],
        ].map(([label, value, accent]) => (
          <div key={label} style={{ ...card, borderTop: `4px solid ${accent}` }}>
            <div style={{ color: colors.muted, fontSize: 14 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.text, marginTop: 8 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Services */}
      <div style={{ ...card, marginTop: 16 }}>
        <h3 style={{ margin: '0 0 12px', color: colors.text }}>Services</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: colors.navy50, color: colors.navy700, textAlign: 'left', fontSize: 13 }}>
                {['Service', 'Status', 'Uptime', 'Response time', 'Error rate'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s) => {
                const st = statusOf(s)
                return (
                  <tr key={s.name} style={{ borderTop: `1px solid ${colors.border}` }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: colors.text }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: colors.muted }}>{s.note}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: statusStyle[st].bg, color: statusStyle[st].fg, fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 6 }}>
                        {st}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: colors.text }}>{s.uptime}%</td>
                    <td style={{ padding: '14px 16px', color: colors.text }}>{s.response} ms</td>
                    <td style={{ padding: '14px 16px', color: colors.text }}>{s.errorRate}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Response time history */}
      <div style={{ ...card, marginTop: 16 }}>
        <h3 style={{ margin: '0 0 12px', color: colors.text }}>Average response time (ms)</h3>
        <div style={{ height: 240 }}>
          <ResponsiveContainer>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} stroke={colors.muted} />
              <YAxis axisLine={false} tickLine={false} stroke={colors.muted} />
              <Tooltip formatter={(v) => `${v} ms`} />
              <Line type="monotone" dataKey="response" stroke={colors.navy700} strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}