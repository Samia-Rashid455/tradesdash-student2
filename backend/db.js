import mongoose from 'mongoose'
import { Plan, Tenant, BillingInvoice, DailyMetric } from './models.js'

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tradesdash'

export async function connectDB() {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
  console.log('MongoDB connected')
  if ((await Plan.countDocuments()) === 0) await seed()
}

// Sample data (only runs when the database is empty)
async function seed() {
  const [starter, pro] = await Plan.insertMany([
    { name: 'Starter', priceMonthly: 19, priceYearly: 190, maxUsers: 3, features: ['Up to 3 users', 'Voice quotes', 'Invoicing'] },
    { name: 'Pro', priceMonthly: 49, priceYearly: 490, maxUsers: 10, features: ['Up to 10 users', 'Everything in Starter', 'WhatsApp sending', 'Certificates'] },
  ])

  const tenants = await Tenant.insertMany([
    { name: 'QuickFix Plumbing Ltd', owner: 'Ali Khan', email: 'ali@quickfix.co.uk', trade: 'Plumber', plan: pro._id, status: 'Active', joined: '2026-09-12' },
    { name: 'Fenwick Electrical', owner: 'Sara Ahmed', email: 'sara@fenwick.co.uk', trade: 'Electrician', plan: starter._id, status: 'Trial', joined: '2026-10-15' },
    { name: 'Raza Heating', owner: 'Usman Raza', email: 'usman@razaheating.co.uk', trade: 'Gas engineer', plan: pro._id, status: 'Suspended', joined: '2026-08-02' },
    { name: 'Top Notch Roofing', owner: 'Tom Briggs', email: 'tom@topnotch.co.uk', trade: 'Roofer', plan: starter._id, status: 'Active', joined: '2026-07-28' },
    { name: 'Bright Spark Services', owner: 'Hina Malik', email: 'hina@brightspark.co.uk', trade: 'Electrician', plan: pro._id, status: 'Active', joined: '2026-06-19' },
    { name: 'Hot Water Heroes', owner: 'James Cole', email: 'james@hotwaterheroes.co.uk', trade: 'Plumber', plan: starter._id, status: 'Trial', joined: '2026-10-14' },
  ])
  const [quickfix, , raza, topnotch, brightspark] = tenants

  await BillingInvoice.insertMany([
    { invoiceNo: 'INV-1042', tenant: quickfix._id, amount: 49, status: 'Paid', issuedAt: '2026-10-12' },
    { invoiceNo: 'INV-1041', tenant: brightspark._id, amount: 49, status: 'Paid', issuedAt: '2026-10-10' },
    { invoiceNo: 'INV-1040', tenant: raza._id, amount: 49, status: 'Failed', failureReason: 'Card declined', issuedAt: '2026-10-05' },
    { invoiceNo: 'INV-1039', tenant: topnotch._id, amount: 19, status: 'Paid', issuedAt: '2026-09-28' },
    { invoiceNo: 'INV-1038', tenant: raza._id, amount: 49, status: 'Failed', failureReason: 'Insufficient funds', issuedAt: '2026-09-05' },
  ])

  // One row per day for the last 365 days, with a gentle upward trend
  const metrics = []
  const today = new Date()
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const t = (365 - i) / 365
    const wave = Math.sin(i / 5)
    metrics.push({
      date: d.toISOString().slice(0, 10),
      signups: Math.max(0, Math.round(2 + t * 4 + wave * 1.5)),
      revenue: Math.round(60 + t * 100 + wave * 10),
      activeUsers: Math.round(600 + t * 900 + wave * 20),
      featureUsage: {
        'Voice Quote': Math.round(40 + t * 40 + wave * 5),
        Invoicing: Math.round(35 + t * 30 + wave * 4),
        'WhatsApp sending': Math.round(25 + t * 28 + wave * 4),
        Certificates: Math.round(12 + t * 14 + wave * 2),
      },
    })
  }
  await DailyMetric.insertMany(metrics)

  console.log('Sample data added')
}