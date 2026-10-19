import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { colors } from '../../theme'
import { tenantsData } from '../../data/tenants'

const statusStyle = {
  Trial: { bg: '#DBEAFE', fg: colors.info },
  Active: { bg: '#DCFCE7', fg: colors.success },
  Suspended: { bg: '#FEE2E2', fg: colors.danger },
}

const card = {
  background: colors.surface, border: `1px solid ${colors.border}`,
  borderRadius: 12, padding: 22,
}

const inputStyle = {
  border: `1px solid ${colors.border}`, borderRadius: 10, padding: '9px 12px',
  fontSize: 14, color: colors.text, background: colors.surface, outline: 'none',
}

export default function Tenants() {
  const navigate = useNavigate()
  const [tenants, setTenants] = useState(tenantsData)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [planFilter, setPlanFilter] = useState('All')

  const toggleSuspend = (id) => {
    setTenants((list) =>
      list.map((t) =>
        t.id === id ? { ...t, status: t.status === 'Suspended' ? 'Active' : 'Suspended' } : t
      )
    )
  }

  const visible = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.owner.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter
    const matchesPlan = planFilter === 'All' || t.plan === planFilter
    return matchesSearch && matchesStatus && matchesPlan
  })

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 28, color: colors.navy700 }}>Tenant Management</h1>
      <p style={{ margin: '4px 0 24px', color: colors.muted }}>
        {tenants.length} businesses on the platform
      </p>

      <div style={card}>
        {/* Search and filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 220 }}>
            <Search size={16} color={colors.muted} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by business or owner..."
              style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, background: 'transparent', color: colors.text }}
            />
          </div>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={inputStyle}>
            <option value="All">All statuses</option>
            <option>Active</option>
            <option>Trial</option>
            <option>Suspended</option>
          </select>

          <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} style={inputStyle}>
            <option value="All">All plans</option>
            <option>Starter</option>
            <option>Pro</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: colors.navy50, color: colors.navy700, textAlign: 'left', fontSize: 13 }}>
                {['Tenant', 'Owner', 'Plan', 'Users', 'Status', 'Action'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/tenants/${t.id}`)}
                  style={{ borderTop: `1px solid ${colors.border}`, cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = colors.navy50)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: colors.text }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: colors.muted }}>{t.trade}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: colors.text }}>
                    <div>{t.owner}</div>
                    <div style={{ fontSize: 12, color: colors.muted }}>{t.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: colors.text }}>{t.plan}</td>
                  <td style={{ padding: '14px 16px', color: colors.text }}>{t.users}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        background: statusStyle[t.status].bg, color: statusStyle[t.status].fg,
                        fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 6,
                      }}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSuspend(t.id)
                      }}
                      style={{
                        cursor: 'pointer', padding: '6px 14px', borderRadius: 8, fontWeight: 600, fontSize: 13,
                        background: colors.surface,
                        border: `1px solid ${t.status === 'Suspended' ? colors.success : colors.danger}`,
                        color: t.status === 'Suspended' ? colors.success : colors.danger,
                      }}
                    >
                      {t.status === 'Suspended' ? 'Activate' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}

              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: colors.muted }}>
                    No tenants match your search.
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