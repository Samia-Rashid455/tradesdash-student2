import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { colors } from '../../theme'
import { useTenantStore } from '../../store/tenantStore'

const plans = [
  { name: 'Starter', price: 19, features: ['Up to 3 users', 'Voice quotes', 'Invoicing'] },
  { name: 'Pro', price: 49, features: ['Up to 10 users', 'Everything in Starter', 'WhatsApp sending', 'Certificates'] },
]

const priceOf = (planName) => plans.find((p) => p.name === planName).price

const invoicesData = [
  { id: 'INV-1042', tenant: 'QuickFix Plumbing Ltd', amount: 49, date: '12 Oct 2026', status: 'Paid' },
  { id: 'INV-1041', tenant: 'Bright Spark Services', amount: 49, date: '10 Oct 2026', status: 'Paid' },
  { id: 'INV-1040', tenant: 'Raza Heating', amount: 49, date: '05 Oct 2026', status: 'Failed' },
  { id: 'INV-1039', tenant: 'Top Notch Roofing', amount: 19, date: '28 Sep 2026', status: 'Paid' },
  { id: 'INV-1038', tenant: 'Raza Heating', amount: 49, date: '05 Sep 2026', status: 'Failed' },
]

// Same meaning, same colour: Paid = green, Failed = red
const statusStyle = {
  Paid: { bg: '#DCFCE7', fg: colors.success },
  Failed: { bg: '#FEE2E2', fg: colors.danger },
}

const card = {
  background: colors.surface, border: `1px solid ${colors.border}`,
  borderRadius: 12, padding: 22,
}

const th = { padding: '12px 16px', fontWeight: 600 }
const td = { padding: '14px 16px', color: colors.text }
const linkStyle = { color: colors.navy700, textDecoration: 'none', fontWeight: 600 }

export default function Billing() {
  const tenants = useTenantStore((s) => s.tenants)
  const updateTenant = useTenantStore((s) => s.updateTenant)
  const [invoiceFilter, setInvoiceFilter] = useState('All')
  const [message, setMessage] = useState('')

  const changePlan = (id, newPlan) => {
    const tenant = tenants.find((t) => t.id === id)
    updateTenant(id, { plan: newPlan })
    setMessage(`${tenant.name} moved to ${newPlan} (£${priceOf(newPlan)}/month)`)
  }

  const invoices = invoicesData.filter((i) => invoiceFilter === 'All' || i.status === invoiceFilter)
  const failedCount = invoicesData.filter((i) => i.status === 'Failed').length
  const findTenant = (name) => tenants.find((t) => t.name === name)

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 28, color: colors.navy700 }}>Subscription & Billing</h1>
      <p style={{ margin: '4px 0 24px', color: colors.muted }}>
        Plans, invoices and payment problems across all tenants
      </p>

      {/* 1. Plans and prices */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {plans.map((p) => (
          <div key={p.name} style={{ ...card, borderTop: `4px solid ${p.name === 'Pro' ? colors.orange500 : colors.navy700}` }}>
            <div style={{ color: colors.muted, fontSize: 14 }}>{p.name} plan</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: colors.text, margin: '6px 0 14px' }}>
              £{p.price}<span style={{ fontSize: 14, fontWeight: 400, color: colors.muted }}> / month</span>
            </div>
            {p.features.map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 14, color: colors.text }}>
                <Check size={16} color={colors.success} /> {f}
              </div>
            ))}
          </div>
        ))}

        <div style={{ ...card, borderTop: `4px solid ${colors.danger}` }}>
          <div style={{ color: colors.muted, fontSize: 14 }}>Failed payments</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: colors.danger, margin: '6px 0 14px' }}>{failedCount}</div>
          <div style={{ fontSize: 14, color: colors.muted }}>These tenants need to update their payment method.</div>
        </div>
      </div>

      {/* 2. Invoices and failed payments */}
      <div style={{ ...card, marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, color: colors.text }}>Tenant invoices</h3>
          <select
            value={invoiceFilter}
            onChange={(e) => setInvoiceFilter(e.target.value)}
            style={{ border: `1px solid ${colors.border}`, borderRadius: 10, padding: '8px 12px', fontSize: 14, color: colors.text, background: colors.surface }}
          >
            <option value="All">All invoices</option>
            <option>Paid</option>
            <option>Failed</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: colors.navy50, color: colors.navy700, textAlign: 'left', fontSize: 13 }}>
                {['Invoice', 'Tenant', 'Amount', 'Date', 'Status'].map((h) => <th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => {
                const tenant = findTenant(i.tenant)
                return (
                  <tr key={i.id} style={{ borderTop: `1px solid ${colors.border}` }}>
                    <td style={{ ...td, fontWeight: 600 }}>{i.id}</td>
                    <td style={td}>
                      {tenant ? (
                        <Link to={`/admin/tenants/${tenant.id}`} style={linkStyle}>{i.tenant}</Link>
                      ) : (
                        i.tenant
                      )}
                    </td>
                    <td style={td}>£{i.amount}</td>
                    <td style={{ ...td, color: colors.muted }}>{i.date}</td>
                    <td style={td}>
                      <span style={{ background: statusStyle[i.status].bg, color: statusStyle[i.status].fg, fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 6 }}>
                        {i.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Change a tenant's plan */}
      <div style={{ ...card, marginTop: 16 }}>
        <h3 style={{ margin: '0 0 12px', color: colors.text }}>Change a tenant's plan</h3>

        {message && (
          <div style={{ background: colors.orange50, border: `1px solid ${colors.orange500}`, color: colors.text, padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 14 }}>
            {message}
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: colors.navy50, color: colors.navy700, textAlign: 'left', fontSize: 13 }}>
                {['Tenant', 'Current plan', 'Monthly price', 'Change to'].map((h) => <th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id} style={{ borderTop: `1px solid ${colors.border}` }}>
                  <td style={td}>
                    <Link to={`/admin/tenants/${t.id}`} style={linkStyle}>{t.name}</Link>
                  </td>
                  <td style={td}>{t.plan}</td>
                  <td style={td}>£{priceOf(t.plan)}</td>
                  <td style={td}>
                    <select
                      value={t.plan}
                      onChange={(e) => changePlan(t.id, e.target.value)}
                      style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: '6px 10px', fontSize: 14, color: colors.text, background: colors.surface }}
                    >
                      {plans.map((p) => <option key={p.name}>{p.name}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}