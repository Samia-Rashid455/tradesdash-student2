import * as mock from './adminApi.mock'
import * as real from './adminApi.real'

// Real backend only when frontend/.env says VITE_USE_MOCK=false.
// Without that setting (for example, on a fresh clone), the sample-data version is used.
const api = import.meta.env.VITE_USE_MOCK === 'false' ? real : mock

export const getPlans = api.getPlans
export const getInvoices = api.getInvoices
export const getSubscriptions = api.getSubscriptions
export const changePlan = api.changePlan
export const getAnalytics = api.getAnalytics