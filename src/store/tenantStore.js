import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tenantsData } from '../data/tenants'
import { useAuditStore } from './auditStore'

const log = (action, detail) => useAuditStore.getState().addLog({ action, detail })

export const useTenantStore = create(
  persist(
    (set, get) => ({
      tenants: tenantsData,

      addTenant: (data) => {
        const tenant = {
          id: Math.max(0, ...get().tenants.map((t) => t.id)) + 1,
          users: 1,
          status: 'Trial',
          joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          ...data,
        }
        set((state) => ({ tenants: [tenant, ...state.tenants] }))
        log('Add tenant', `Created ${tenant.name} on the ${tenant.plan} plan`)
      },

      updateTenant: (id, changes) => {
        const old = get().tenants.find((t) => t.id === id)
        if (!old) return
        set((state) => ({
          tenants: state.tenants.map((t) => (t.id === id ? { ...t, ...changes } : t)),
        }))
        if (changes.status && changes.status !== old.status) {
          log(changes.status === 'Suspended' ? 'Suspend tenant' : 'Activate tenant', old.name)
        }
        if (changes.plan && changes.plan !== old.plan) {
          log('Change plan', `${old.name}: ${old.plan} to ${changes.plan}`)
        }
      },
    }),
    { name: 'tradesdash-tenants', partialize: (s) => ({ tenants: s.tenants }) }
  )
)