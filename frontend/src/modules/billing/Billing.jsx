import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { colors } from '../../theme'
import { getPlans, getInvoices, getSubscriptions, changePlan } from '../../services/adminApi'

const statusStyle = {
  Paid: { bg: '#DCFCE7', fg: colors.success },
  Failed: { bg: '#FEE2E2', fg: colors.danger },
  Pending: { bg: '#FEF3C7', fg: '#B45309' },
}

const card = {
  background: colors.surface, border: `1px solid ${colors.border}`,
  borderRadius: 12, padding: 22,
}
const th = { padding: '12px 16px', fontWeight: 600 }
const td = { padding: '14px 16px', color: colors.text }
const linkStyle = { color: colors.navy700, textDecoration: 'none', fontWeight: 600 }
const button = {
  border: `1px solid ${colors.navy700}`, background: colors.surface, color: colors.navy700,
  borderRadius: 8, padding: '6px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const formatDate = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`
}
export default function Billing() {
  const [plans, setPlans] = useState([])
  const [invoices, setInvoices] = useState([])
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [invoiceFilter, setInvoiceFilter] = useState('All')
  const [message, setMessage] = useState('')

  // Change Plan dialog
  const [dialogTenant, setDialogTenant] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [saving, setSaving] = useState(false)
  const [dialogError, setDialogError] = useState('')

  const load = async () => {
    try {
      const [p, i, s] = await Promise.all([getPlans(), getInvoices(), getSubscriptions()])
      setPlans(p)
      setInvoices(i)
      setSubs(s)
      setError('')
    } catch {
      setError('Could not reach the server. Start it with "npm run dev" in the backend folder and reload this page.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openDialog = (tenant) => {
    setDialogTenant(tenant)
    setSelectedPlan(tenant.plan)
    setDialogError('')
  }

  const closeDialog = () => setDialogTenant(null)

  const confirmChange = async () => {
    setSaving(true)
    setDialogError('')
    try {
      const result = await changePlan(dialogTenant.id, selectedPlan)
      setMessage(`${result.name} moved from ${result.previousPlan} to ${result.plan} (£${result.priceMonthly}/month)`)
      closeDialog()
      await load()
    } catch (err) {
      setDialogError(err.response?.data?.error || 'Could not change the plan. Try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p style={{ color: colors.muted }}>Loading billing data…</p>
  if (error) {
    return (
      <div style={{ ...card, borderTop: `4px solid ${colors.danger}` }}>
        <h3 style={{ margin: '0 0 8px', color: colors.danger }}>Billing data unavailable</h3>
        <p style={{ margin: 0, color: colors.text }}>{error}</p>
      </div>
    )
  }

  const shownInvoices = invoices.filter((i) => invoiceFilter === 'All' || i.status === invoiceFilter)
  const failed = invoices.filter((i) => i.status === 'Failed')

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 28, color: colors.navy700 }}>Subscription & Billing</h1>
      <p style={{ margin: '4px 0 24px', color: colors.muted }}>
        Plans, invoices and payment problems across all tenants
      </p>

      {message && (
        <div style={{ background: colors.orange50, border: `1px solid ${colors.orange500}`, color: colors.text, padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {message}
        </div>
      )}

      {/* 1. Plans and prices */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {plans.map((p) => (
          <div key={p.id} style={{ ...card, borderTop: `4px solid ${p.name === 'Pro' ? colors.orange500 : colors.navy700}` }}>
            <div style={{ color: colors.muted, fontSize: 14 }}>{p.name} plan</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: colors.text, margin: '6px 0 14px' }}>
              £{p.priceMonthly}<span style={{ fontSize: 14, fontWeight: 400, color: colors.muted }}> / month</span>
            </div>
            {p.features.map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 14, color: colors.text }}>
                <Check size={16} color={colors.success} /> {f}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 2. Failed payments list */}
      <div style={{ ...card, marginTop: 16, borderTop: `4px solid ${colors.danger}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
          <h3 style={{ margin: 0, color: colors.text }}>Failed payments</h3>
          <span style={{ color: colors.danger, fontWeight: 700 }}>{failed.length}</span>
        </div>

        {failed.length === 0 ? (
          <p style={{ margin: 0, color: colors.muted }}>No failed payments. Every tenant is up to date.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: colors.navy50, color: colors.navy700, textAlign: 'left', fontSize: 13 }}>
                  {['Tenant', 'Invoice', 'Amount', 'Date', 'Reason'].map((h) => <th key={h} style={th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {failed.map((i) => (
                  <tr key={i.id} style={{ borderTop: `1px solid ${colors.border}` }}>
                    <td style={td}>
                      <Link to={`/admin/tenants/${i.tenantId}`} style={linkStyle}>{i.tenant}</Link>
                    </td>
                    <td style={{ ...td, fontWeight: 600 }}>{i.invoiceNo}</td>
                    <td style={td}>£{i.amount}</td>
                    <td style={{ ...td, color: colors.muted }}>{formatDate(i.issuedAt)}</td>
                    <td style={{ ...td, color: colors.danger }}>{i.failureReason || 'Not recorded'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Tenant invoices */}
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
            <option>Pending</option>
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
              {shownInvoices.map((i) => (
                <tr key={i.id} style={{ borderTop: `1px solid ${colors.border}` }}>
                  <td style={{ ...td, fontWeight: 600 }}>{i.invoiceNo}</td>
                  <td style={td}>
                    <Link to={`/admin/tenants/${i.tenantId}`} style={linkStyle}>{i.tenant}</Link>
                  </td>
                  <td style={td}>£{i.amount}</td>
                  <td style={{ ...td, color: colors.muted }}>{formatDate(i.issuedAt)}</td>
                  <td style={td}>
                    <span style={{ background: statusStyle[i.status].bg, color: statusStyle[i.status].fg, fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 6 }}>
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Subscriptions and plan change */}
      <div style={{ ...card, marginTop: 16 }}>
        <h3 style={{ margin: '0 0 12px', color: colors.text }}>Tenant subscriptions</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: colors.navy50, color: colors.navy700, textAlign: 'left', fontSize: 13 }}>
                {['Tenant', 'Current plan', 'Monthly price', ''].map((h, idx) => <th key={idx} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {subs.map((t) => (
                <tr key={t.id} style={{ borderTop: `1px solid ${colors.border}` }}>
                  <td style={td}>
                    <Link to={`/admin/tenants/${t.id}`} style={linkStyle}>{t.name}</Link>
                  </td>
                  <td style={td}>{t.plan}</td>
                  <td style={td}>£{t.priceMonthly}</td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <button style={button} onClick={() => openDialog(t)}>Change plan</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Plan dialog */}
      {dialogTenant && (
        <div
          onClick={closeDialog}
          style={{ position: 'fixed', inset: 0, background: 'rgba(20,38,63,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Change plan"
            style={{ ...card, width: 420, maxWidth: '90vw', boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}
          >
            <h3 style={{ margin: 0, color: colors.navy700 }}>Change plan</h3>
            <p style={{ margin: '4px 0 16px', color: colors.muted, fontSize: 14 }}>
              {dialogTenant.name} is on the {dialogTenant.plan} plan.
            </p>

            {plans.map((p) => (
              <label
                key={p.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', marginBottom: 8,
                  borderRadius: 10, cursor: 'pointer',
                  border: `2px solid ${selectedPlan === p.name ? colors.orange500 : colors.border}`,
                }}
              >
                <input
                  type="radio"
                  name="plan"
                  checked={selectedPlan === p.name}
                  onChange={() => setSelectedPlan(p.name)}
                />
                <span style={{ flex: 1, color: colors.text, fontWeight: 600 }}>{p.name}</span>
                <span style={{ color: colors.muted }}>£{p.priceMonthly} / month</span>
              </label>
            ))}

            {dialogError && (
              <p style={{ color: colors.danger, fontSize: 14, margin: '8px 0 0' }}>{dialogError}</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button style={button} onClick={closeDialog} disabled={saving}>Cancel</button>
              <button
                onClick={confirmChange}
                disabled={saving || selectedPlan === dialogTenant.plan}
                style={{
                  ...button, background: colors.orange500, borderColor: colors.orange500, color: '#fff',
                  opacity: saving || selectedPlan === dialogTenant.plan ? 0.5 : 1,
                }}
              >
                {saving ? 'Saving…' : 'Confirm change'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}