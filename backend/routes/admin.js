import { Router } from 'express'
import mongoose from 'mongoose'
import { Plan, Tenant, BillingInvoice, DailyMetric } from '../models.js'

const router = Router()
const DATE = /^\d{4}-\d{2}-\d{2}$/
const STATUSES = ['Paid', 'Failed', 'Pending']

// Express 4 does not catch errors in async handlers, so wrap each one
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next)

const toPlan = (p) => ({
  id: p._id,
  name: p.name,
  priceMonthly: p.priceMonthly,
  priceYearly: p.priceYearly,
  maxUsers: p.maxUsers,
  features: p.features,
})

const toInvoice = (i) => ({
  id: i._id,
  invoiceNo: i.invoiceNo,
  tenantId: i.tenant?._id,
  tenant: i.tenant?.name,
  amount: i.amount,
  status: i.status,
  failureReason: i.failureReason,
  issuedAt: i.issuedAt,
})

const findInvoices = (filter = {}) =>
  BillingInvoice.find(filter).populate('tenant', 'name').sort({ issuedAt: -1 }).lean()

// GET /api/admin/plans
router.get('/plans', wrap(async (req, res) => {
  const plans = await Plan.find().sort({ priceMonthly: 1 }).lean()
  res.json(plans.map(toPlan))
}))

// GET /api/admin/billing/invoices  (optional ?status=Paid|Failed|Pending)
router.get('/billing/invoices', wrap(async (req, res) => {
  const { status } = req.query
  // Only accept one of the known values, so a crafted query object can't reach MongoDB
  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({ error: 'status must be Paid, Failed or Pending' })
  }
  const invoices = await findInvoices(status ? { status } : {})
  res.json(invoices.map(toInvoice))
}))

// GET /api/admin/billing/failed
router.get('/billing/failed', wrap(async (req, res) => {
  const invoices = await findInvoices({ status: 'Failed' })
  res.json(invoices.map(toInvoice))
}))

// GET /api/admin/billing/subscriptions  (each tenant with its current plan)
router.get('/billing/subscriptions', wrap(async (req, res) => {
  const tenants = await Tenant.find().populate('plan').sort({ name: 1 }).lean()
  res.json(
    tenants.map((t) => ({
      id: t._id,
      name: t.name,
      status: t.status,
      plan: t.plan?.name,
      priceMonthly: t.plan?.priceMonthly,
    }))
  )
}))

// PATCH /api/admin/tenants/:id/plan   body: { "plan": "Pro" }
router.patch('/tenants/:id/plan', wrap(async (req, res) => {
  const { id } = req.params
  const { plan } = req.body || {}

  if (typeof plan !== 'string' || !plan) return res.status(400).json({ error: 'plan is required' })
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid tenant id' })

  const tenant = await Tenant.findById(id).populate('plan')
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' })

  const newPlan = await Plan.findOne({ name: plan })
  if (!newPlan) return res.status(400).json({ error: `Unknown plan: ${plan}` })

  const previousPlan = tenant.plan?.name ?? null
  tenant.plan = newPlan._id
  await tenant.save()
  // The audit log belongs to Student 3: call their "add log" function here when it exists.

  res.json({
    id: tenant._id,
    name: tenant.name,
    previousPlan,
    plan: newPlan.name,
    priceMonthly: newPlan.priceMonthly,
  })
}))

// GET /api/admin/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/analytics', wrap(async (req, res) => {
  const today = new Date()
  const defaultFrom = new Date(today)
  defaultFrom.setDate(defaultFrom.getDate() - 180)

  const to = req.query.to || today.toISOString().slice(0, 10)
  const from = req.query.from || defaultFrom.toISOString().slice(0, 10)

  if (typeof from !== 'string' || typeof to !== 'string' || !DATE.test(from) || !DATE.test(to)) {
    return res.status(400).json({ error: 'from and to must be YYYY-MM-DD' })
  }
  if (from > to) return res.status(400).json({ error: 'from must not be after to' })

  // Long ranges are grouped by month so the charts stay readable
  const days = (new Date(to) - new Date(from)) / 86400000 + 1
  const monthly = days > 62

  const series = await DailyMetric.aggregate([
    { $match: { date: { $gte: from, $lte: to } } },
    {
      $group: {
        _id: monthly ? { $substrBytes: ['$date', 0, 7] } : '$date',
        signups: { $sum: '$signups' },
        revenue: { $sum: '$revenue' },
        activeUsers: { $avg: '$activeUsers' },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        label: '$_id',
        signups: 1,
        revenue: 1,
        activeUsers: { $round: ['$activeUsers', 0] },
      },
    },
  ])

  // Most used features: add up the daily counts inside the range
  const rows = await DailyMetric.find({ date: { $gte: from, $lte: to } }).sort({ date: 1 }).lean()
  const usage = {}
  for (const r of rows) {
    for (const [name, n] of Object.entries(r.featureUsage || {})) {
      usage[name] = (usage[name] || 0) + n
    }
  }
  const features = Object.entries(usage)
    .map(([name, uses]) => ({ name, uses }))
    .sort((a, b) => b.uses - a.uses)

  const last = rows[rows.length - 1]

  res.json({
    from,
    to,
    granularity: monthly ? 'month' : 'day',
    series,
    features,
    totals: {
      signups: series.reduce((a, s) => a + s.signups, 0),
      revenue: series.reduce((a, s) => a + s.revenue, 0),
      activeUsers: last ? last.activeUsers : 0,
    },
  })
}))

export default router