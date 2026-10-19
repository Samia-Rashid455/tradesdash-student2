import { create } from 'zustand'
import { useAuditStore } from './auditStore'
import { useTenantStore } from './tenantStore'

const log = (detail) => useAuditStore.getState().addLog({ action: 'Feature flag', detail })

export const useFlagStore = create((set, get) => ({
  flags: [
    { key: 'voice', name: 'Voice quotes', description: 'Create a quote by speaking', enabled: true, scope: 'everyone', tenantIds: [] },
    { key: 'whatsapp', name: 'WhatsApp sending', description: 'Send quotes and invoices through WhatsApp', enabled: true, scope: 'everyone', tenantIds: [] },
    { key: 'chase', name: 'Payment chase sequence', description: 'Automatic reminders for unpaid invoices', enabled: false, scope: 'selected', tenantIds: [1] },
    { key: 'reviews', name: 'Review requests', description: 'Ask customers for a review after a job', enabled: false, scope: 'everyone', tenantIds: [] },
    { key: 'certs', name: 'Certificates', description: 'Create and store safety certificates', enabled: true, scope: 'everyone', tenantIds: [] },
  ],

  toggleFlag: (key) => {
    const flag = get().flags.find((f) => f.key === key)
    set((state) => ({
      flags: state.flags.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f)),
    }))
    log(`${flag.name} turned ${flag.enabled ? 'OFF' : 'ON'}`)
  },

  setScope: (key, scope) => {
    const flag = get().flags.find((f) => f.key === key)
    set((state) => ({
      flags: state.flags.map((f) => (f.key === key ? { ...f, scope } : f)),
    }))
    log(`${flag.name} set to ${scope === 'everyone' ? 'everyone' : 'selected tenants only'}`)
  },

  toggleTenant: (key, tenantId) => {
    const flag = get().flags.find((f) => f.key === key)
    const tenant = useTenantStore.getState().tenants.find((t) => t.id === tenantId)
    const wasOn = flag.tenantIds.includes(tenantId)
    set((state) => ({
      flags: state.flags.map((f) =>
        f.key === key
          ? { ...f, tenantIds: wasOn ? f.tenantIds.filter((i) => i !== tenantId) : [...f.tenantIds, tenantId] }
          : f
      ),
    }))
    log(`${flag.name} turned ${wasOn ? 'OFF' : 'ON'} for ${tenant.name}`)
  },
}))