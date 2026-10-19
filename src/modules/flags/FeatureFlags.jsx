import { colors } from '../../theme'
import { useFlagStore } from '../../store/flagStore'
import { useTenantStore } from '../../store/tenantStore'

const card = {
  background: colors.surface, border: `1px solid ${colors.border}`,
  borderRadius: 12, padding: 22, marginBottom: 14,
}

const Switch = ({ on, onChange }) => (
  <button
    onClick={onChange}
    aria-pressed={on}
    style={{
      width: 46, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer',
      position: 'relative', flexShrink: 0, background: on ? colors.success : '#CBD5E1',
    }}
  >
    <span
      style={{
        position: 'absolute', top: 3, left: on ? 23 : 3, width: 20, height: 20,
        borderRadius: '50%', background: '#fff', transition: 'left 0.15s',
      }}
    />
  </button>
)

export default function FeatureFlags() {
  const flags = useFlagStore((s) => s.flags)
  const toggleFlag = useFlagStore((s) => s.toggleFlag)
  const setScope = useFlagStore((s) => s.setScope)
  const toggleTenant = useFlagStore((s) => s.toggleTenant)
  const tenants = useTenantStore((s) => s.tenants)

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 28, color: colors.navy700 }}>Feature Flags</h1>
      <p style={{ margin: '4px 0 24px', color: colors.muted }}>
        Switch features on or off for everyone, or for chosen tenants. Every change is saved in the Audit Log.
      </p>

      {flags.map((f) => (
        <div key={f.key} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 700, color: colors.text, fontSize: 16 }}>{f.name}</div>
              <div style={{ fontSize: 14, color: colors.muted }}>{f.description}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: f.enabled ? colors.success : colors.muted }}>
                {f.enabled ? 'ON' : 'OFF'}
              </span>
              <Switch on={f.enabled} onChange={() => toggleFlag(f.key)} />
            </div>
          </div>

          {f.enabled && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${colors.border}` }}>
              <div style={{ display: 'flex', background: colors.pageBg, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 4, width: 'fit-content' }}>
                {[['everyone', 'Everyone'], ['selected', 'Selected tenants']].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => f.scope !== value && setScope(f.key, value)}
                    style={{
                      border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: 8,
                      fontWeight: 600, fontSize: 13,
                      background: f.scope === value ? colors.navy700 : 'transparent',
                      color: f.scope === value ? '#fff' : colors.muted,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {f.scope === 'selected' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
                  {tenants.map((t) => {
                    const on = f.tenantIds.includes(t.id)
                    return (
                      <label
                        key={t.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                          padding: '6px 12px', borderRadius: 8, fontSize: 14, color: colors.text,
                          border: `1px solid ${on ? colors.navy700 : colors.border}`,
                          background: on ? colors.navy50 : colors.surface,
                        }}
                      >
                        <input type="checkbox" checked={on} onChange={() => toggleTenant(f.key, t.id)} />
                        {t.name}
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}