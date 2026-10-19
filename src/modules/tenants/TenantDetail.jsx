import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Eye } from 'lucide-react'
import { colors } from '../../theme'
import { tenantsData } from '../../data/tenants'
import { tenantUsers, tenantUsage, planLimits } from '../../data/tenantUsers'

const statusStyle = {
  Trial: { bg: '#DBEAFE', fg: colors.info },
  Active: { bg: '#DCFCE7', fg: colors.success },
  Suspended: { bg: '#FEE2E2', fg: colors.danger },
}

const card = {
  background: colors.surface, border: `1px solid ${colors.border}`,
  borderRadius: 12, padding: 22,
}

const Field = ({ label, value }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 12, color: colors.muted }}>{label}</div>
    <div style={{ fontSize: 15, color: colors.text, fontWeight: 500 }}>{value}</div>
  </div>
)

export default function TenantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const found = tenantsData.find((t) => t.id === Number(id))
  const [tenant, setTenant] = useState(found)
  const [viewAs, setViewAs] = useState(false)

  if (!tenant) {
    return (
      <div>
        <h1 style={{ color: colors.navy700 }}>Tenant not found</h1>
        <Link to="/tenants" style={{ color: colors.navy700, fontWeight: 600 }}>← Back to tenants</Link>
      </div>
    )
  }

  const users = tenantUsers[tenant.id] || []
  const usage = tenantUsage[tenant.id] || { quotes: 0, invoices: 0, whatsapp: 0 }
  const limit = planLimits[tenant.plan]
  const percent = Math.min(100, Math.round((users.length / limit) * 100))

  const changePlan = (plan) => setTenant({ ...tenant, plan })
  const toggleSuspend = () =>
    setTenant({ ...tenant, status: tenant.status === 'Suspended' ? 'Active' : 'Suspended' })

  return (
    <div>
      {/* Simulated "view as tenant" banner */}
      {viewAs && (
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: colors.orange50, border: `1px solid ${colors.orange500}`,
            padding: '12px 16px', borderRadius: 10, marginBottom: 16, color: colors.text,
          }}
        >
          <span>
            <strong>Viewing as {tenant.name}</strong> (simulated). You are seeing what {tenant.owner} sees.
          </span>
          <button
            onClick={() => setViewAs(false)}
            style={{ cursor: 'pointer', border: 'none', background: colors.navy700, color: '#fff', padding: '6px 14px', borderRadius: 8, fontWeight: 600 }}
          >
            Exit
          </button>
        </div>
      )}

      <button
        onClick={() => navigate('/tenants')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', color: colors.navy700, fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: 12 }}
      >
        <ArrowLeft size={16} /> Back to tenants
      </button>

      {/* Title and status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, fontSize: 28, color: colors.navy700 }}>{tenant.name}</h1>
        <span
          style={{
            background: statusStyle[tenant.status].bg, color: statusStyle[tenant.status].fg,
            fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 6,
          }}
        >
          {tenant.status}
        </span>
      </div>

      {/* Profile, plan and usage */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', color: colors.text }}>Business profile</h3>
          <Field label="Owner" value={tenant.owner} />
          <Field label="Email" value={tenant.email} />
          <Field label="Trade" value={tenant.trade} />
          <Field label="Joined" value={tenant.joined} />
        </div>

        <div style={card}>
          <h3 style={{ margin: '0 0 16px', color: colors.text }}>Plan and usage</h3>
          <Field label="Current plan" value={`${tenant.plan} (${limit} users included)`} />

          <div style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>
            User seats: {users.length} of {limit}
          </div>
          <div style={{ height: 10, background: colors.navy50, borderRadius: 999, marginBottom: 18 }}>
            <div
              style={{
                width: `${percent}%`, height: '100%', borderRadius: 999,
                background: percent >= 100 ? colors.warning : colors.navy700,
              }}
            />
          </div>

          <Field label="Quotes created" value={usage.quotes} />
          <Field label="Invoices sent" value={usage.invoices} />
          <Field label="WhatsApp messages" value={usage.whatsapp} />
        </div>

        {/* Actions */}
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', color: colors.text }}>Actions</h3>

          <div style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>Change plan</div>
          <select
            value={tenant.plan}
            onChange={(e) => changePlan(e.target.value)}
            style={{ width: '100%', border: `1px solid ${colors.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 14, color: colors.text, background: colors.surface, marginBottom: 16 }}
          >
            <option>Starter</option>
            <option>Pro</option>
          </select>

          <button
            onClick={toggleSuspend}
            style={{
              width: '100%', cursor: 'pointer', padding: '10px 14px', borderRadius: 10, fontWeight: 600,
              background: colors.surface, marginBottom: 12,
              border: `1px solid ${tenant.status === 'Suspended' ? colors.success : colors.danger}`,
              color: tenant.status === 'Suspended' ? colors.success : colors.danger,
            }}
          >
            {tenant.status === 'Suspended' ? 'Activate tenant' : 'Suspend tenant'}
          </button>

          <button
            onClick={() => setViewAs(true)}
            style={{
              width: '100%', cursor: 'pointer', padding: '10px 14px', borderRadius: 10, fontWeight: 600,
              border: 'none', background: colors.orange500, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <Eye size={16} /> View as tenant
          </button>
        </div>
      </div>

      {/* Tenant's users */}
      <div style={{ ...card, marginTop: 16 }}>
        <h3 style={{ margin: '0 0 12px', color: colors.text }}>Users in this business ({users.length})</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: colors.navy50, color: colors.navy700, textAlign: 'left', fontSize: 13 }}>
              {['Name', 'Email', 'Role'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} style={{ borderTop: `1px solid ${colors.border}` }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: colors.navy50, color: colors.navy700, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13 }}>
                      {u.name[0]}
                    </div>
                    <span style={{ color: colors.text }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: colors.muted }}>{u.email}</td>
                <td style={{ padding: '14px 16px', color: colors.text }}>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}