import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const USER = 'Samia'

const ago = (days, hour) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, 15, 0, 0)
  return d.toISOString()
}

export const useAuditStore = create(
  persist(
    (set) => ({
      logs: [
        { id: 1, time: ago(1, 14), user: USER, action: 'Suspend tenant', detail: 'Raza Heating' },
        { id: 2, time: ago(2, 10), user: 'Dan (Support)', action: 'Change plan', detail: 'QuickFix Plumbing Ltd: Starter to Pro' },
        { id: 3, time: ago(3, 16), user: USER, action: 'Feature flag', detail: 'WhatsApp sending turned ON' },
        { id: 4, time: ago(5, 9), user: 'System', action: 'Add tenant', detail: 'Hot Water Heroes signed up' },
        { id: 5, time: ago(6, 11), user: 'Dan (Support)', action: 'Activate tenant', detail: 'Top Notch Roofing' },
      ],

      addLog: ({ action, detail, user = USER }) =>
        set((state) => ({
          logs: [
            { id: Date.now() + Math.random(), time: new Date().toISOString(), user, action, detail },
            ...state.logs,
          ],
        })),
    }),
    { name: 'tradesdash-audit', partialize: (s) => ({ logs: s.logs }) }
  )
)