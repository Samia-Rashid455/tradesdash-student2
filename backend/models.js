import mongoose from 'mongoose'

const { Schema, model } = mongoose

const planSchema = new Schema({
  name: { type: String, required: true, unique: true },
  priceMonthly: { type: Number, required: true },
  priceYearly: { type: Number, required: true },
  maxUsers: { type: Number, required: true },
  features: [String],
})

// Student 1 owns this collection. Stub so this part runs on its own.
const tenantSchema = new Schema({
  name: { type: String, required: true },
  owner: String,
  email: String,
  trade: String,
  plan: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
  status: { type: String, default: 'Trial' },
  joined: String,
})

const invoiceSchema = new Schema({
  invoiceNo: { type: String, required: true, unique: true },
  tenant: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Failed', 'Pending'], required: true },
  failureReason: { type: String, default: null },
  issuedAt: { type: String, required: true }, // YYYY-MM-DD
})

const metricSchema = new Schema({
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  signups: { type: Number, required: true },
  revenue: { type: Number, required: true },
  activeUsers: { type: Number, required: true },
  featureUsage: { type: Schema.Types.Mixed, default: {} },
})

export const Plan = model('Plan', planSchema)
export const Tenant = model('Tenant', tenantSchema)
export const BillingInvoice = model('BillingInvoice', invoiceSchema)
export const DailyMetric = model('DailyMetric', metricSchema)