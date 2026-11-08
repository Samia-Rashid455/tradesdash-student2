// Frontend-only version: same functions as the real API, but the data lives in the browser.

const plans = [
  { id: 1, name: 'Starter', priceMonthly: 19, priceYearly: 190, maxUsers: 3, features: ['Up to 3 users', 'Voice quotes', 'Invoicing'] },
  { id: 2, name: 'Pro', priceMonthly: 49, priceYearly: 490, maxUsers: 10, features: ['Up to 10 users', 'Everything in Starter', 'WhatsApp sending', 'Certificates'] },
]

const tenants = [
  { id: 1, name: 'QuickFix Plumbing Ltd', status: 'Active', plan: 'Pro' },
  { id: 2, name: 'Fenwick Electrical', status: 'Trial', plan: 'Starter' },
  { id: 3, name: 'Raza Heating', status: 'Suspended', plan: 'Pro' },
  { id: 4, name: 'Top Notch Roofing', status: 'Active', plan: 'Starter' },
  { id: 5, name: 'Bright Spark Services', status: 'Active', plan: 'Pro' },
  { id: 6, name: 'Hot Water Heroes', status: 'Trial', plan: 'Starter' },
]

const invoices = [
  { id: 5, invoiceNo: 'INV-1042', tenantId: 1, tenant: 'QuickFix Plumbing Ltd', amount: 49, status: 'Paid', failureReason: null, issuedAt: '2026-10-12' },
  { id: 4, invoiceNo: 'INV-1041', tenantId: 5, tenant: 'Bright Spark Services', amount: 49, status: 'Paid', failureReason: null, issuedAt: '2026-10-10' },
  { id: 3, invoiceNo: 'INV-1040', tenantId: 3, tenant: 'Raza Heating', amount: 49, status: 'Failed', failureReason: 'Card declined', issuedAt: '2026-10-05' },
  { id: 2, invoiceNo: 'INV-1039', tenantId: 4, tenant: 'Top Notch Roofing', amount: 19, status: 'Paid', failureReason: null, issuedAt: '2026-09-28' },
  { id: 1, invoiceNo: 'INV-1038', tenantId: 3, tenant: 'Raza Heating', amount: 49, status: 'Failed', failureReason: 'Insufficient funds', issuedAt: '2026-09-05' },
]

// One row per day for the last 365 days, with a gentle upward trend
const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const metrics = []
const today = new Date()
for (let i = 364; i >= 0; i--) {
  const d = new Date(today)
  d.setDate(d.getDate() - i)
  const t = (365 - i) / 365
  const wave = Math.sin(i / 5)
  metrics.push({
    date: iso(d),
    signups: Math.max(0, Math.round(0.4 + t * 0.5 + wave * 0.35)),
    revenue: Math.round(60 + t * 100 + wave * 10),
    activeUsers: Math.round(600 + t * 900 + wave * 20),
    usage: {
      'Voice Quote': Math.round(40 + t * 40 + wave * 5),
      Invoicing: Math.round(35 + t * 30 + wave * 4),
      'WhatsApp sending': Math.round(25 + t * 28 + wave * 4),
      Certificates: Math.round(12 + t * 14 + wave * 2),
    },
  })
}

// Small delay so the loading state behaves like a real request
const reply = (data) => new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), 150))
const fail = (message) => Promise.reject({ response: { data: { error: message } } })

const priceOf = (name) => plans.find((p) => p.name === name).priceMonthly

export const getPlans = () => reply(plans)

export const getInvoices = () => reply(invoices)

export const getSubscriptions = () =>
  reply(
    [...tenants]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((t) => ({ ...t, priceMonthly: priceOf(t.plan) }))
  )

export const changePlan = (tenantId, planName) => {
  const tenant = tenants.find((t) => t.id === tenantId)
  if (!tenant) return fail('Tenant not found')
  if (!plans.some((p) => p.name === planName)) return fail(`Unknown plan: ${planName}`)

  const previousPlan = tenant.plan
  tenant.plan = planName
  return reply({ id: tenant.id, name: tenant.name, previousPlan, plan: planName, priceMonthly: priceOf(planName) })
}

export const getAnalytics = (from, to) => {
  if (!from || !to) return fail('from and to are required')
  if (from > to) return fail('from must not be after to')

  const rows = metrics.filter((m) => m.date >= from && m.date <= to)
  const days = (new Date(to) - new Date(from)) / 86400000 + 1
  const monthly = days > 62 // long ranges are grouped by month

  const groups = new Map()
  for (const m of rows) {
    const label = monthly ? m.date.slice(0, 7) : m.date
    const g = groups.get(label) || { label, signups: 0, revenue: 0, activeSum: 0, count: 0 }
    g.signups += m.signups
    g.revenue += m.revenue
    g.activeSum += m.activeUsers
    g.count += 1
    groups.set(label, g)
  }
  const series = [...groups.values()].map((g) => ({
    label: g.label,
    signups: g.signups,
    revenue: g.revenue,
    activeUsers: Math.round(g.activeSum / g.count),
  }))

  const usage = {}
  for (const m of rows) {
    for (const [name, n] of Object.entries(m.usage)) usage[name] = (usage[name] || 0) + n
  }
  const features = Object.entries(usage)
    .map(([name, uses]) => ({ name, uses }))
    .sort((a, b) => b.uses - a.uses)

  return reply({
    from,
    to,
    granularity: monthly ? 'month' : 'day',
    series,
    features,
    totals: {
      signups: series.reduce((a, s) => a + s.signups, 0),
      revenue: series.reduce((a, s) => a + s.revenue, 0),
      activeUsers: rows.length ? rows[rows.length - 1].activeUsers : 0,
    },
  })
}