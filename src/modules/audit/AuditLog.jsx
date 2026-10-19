import { useState } from 'react'
import { colors } from '../../theme'
import { useAuditStore } from '../../store/auditStore'

const card = {
  background: colors.surface, border: `1px solid ${colors.border}`,
  borderRadius: 12, padding: 22,
}

const inputStyle = {
  border: `1px solid ${colors.border}`, borderRadius: 10, padding: '9px 12px',
  fontSize: 14, color: colors.text, background: colors.surface,
}

export default function AuditLog() {
  const logs = useAuditStore((s) => s.logs)
  const [user, setUser] = useState('All')
  const [action, setAction] = useState('All')
  const [date, setDate] = useState('')

  const users = [...new Set(logs.map((l) => l.user))]
  const actions = [...new Set(logs.map((l) => l.action))]

  const visible = logs.filter((l) => {
    const day = new Date(l.time).toLocaleDateString('en-CA') // YYYY-MM-DD in local time
    return (
      (user === 'All' || l.user === user) &&
      (action === 'All' || l.action === action) &&
      (!date || day === date)
    )
  })

  const clear = () => {
    setUser('All')
    setAction('All')
    setDate('')
  }

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 28, color: colors.navy700 }}>Audit Log</h1>
      <p style={{ margin: '4px 0 24px', color: colors.muted }}>Who did what, and when</p>

      <div style={card}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          <select value={user} onChange={(e) => setUser(e.target.value)} style={inputStyle}>
            <option value="All">All users</option>
            {users.map((u) => <option key={u}>{u}</option>)}
          </select>

          <select value={action} onChange={(e) => setAction(e.target.value)} style={inputStyle}>
            <option value="All">All actions</option>
            {actions.map((a) => <option key={a}>{a}</option>)}
          </select>

          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />

          <button
            onClick={clear}
            style={{ cursor: 'pointer', padding: '9px 16px', borderRadius: 10, fontWeight: 600, border: `1px solid ${colors.border}`, background: colors.surface, color: colors.muted }}
          >
            Clear filters
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: colors.navy50, color: colors.navy700, textAlign: 'left', fontSize: 13 }}>
                {['When', 'User', 'Action', 'Details'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((l) => (
                <tr key={l.id} style={{ borderTop: `1px solid ${colors.border}` }}>
                  <td style={{ padding: '14px 16px', color: colors.muted, whiteSpace: 'nowrap' }}>
                    {new Date(l.time).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '14px 16px', color: colors.text }}>{l.user}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: colors.navy50, color: colors.navy700, fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 6 }}>
                      {l.action}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: colors.text }}>{l.detail}</td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: 32, textAlign: 'center', color: colors.muted }}>
                    No log entries match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}