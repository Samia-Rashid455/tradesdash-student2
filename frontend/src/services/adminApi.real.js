import axios from 'axios'

const api = axios.create({ baseURL: '/api/admin' })

export const getPlans = () => api.get('/plans').then((r) => r.data)
export const getInvoices = () => api.get('/billing/invoices').then((r) => r.data)
export const getSubscriptions = () => api.get('/billing/subscriptions').then((r) => r.data)
export const changePlan = (tenantId, plan) =>
  api.patch(`/tenants/${tenantId}/plan`, { plan }).then((r) => r.data)
export const getAnalytics = (from, to) =>
  api.get('/analytics', { params: { from, to } }).then((r) => r.data)