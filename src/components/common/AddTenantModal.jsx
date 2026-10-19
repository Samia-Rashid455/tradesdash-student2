import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { colors } from '../../theme'
import { useTenantStore } from '../../store/tenantStore'

const inputStyle = {
  width: '100%', boxSizing: 'border-box', border: `1px solid ${colors.border}`,
  borderRadius: 10, padding: '10px 12px', fontSize: 14, color: colors.text, background: colors.surface,
}

const Label = ({ text, error, children }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 13, color: colors.muted, marginBottom: 6 }}>{text}</div>
    {children}
    {error && <div style={{ fontSize: 12, color: colors.danger, marginTop: 4 }}>{error}</div>}
  </div>
)

export default function AddTenantModal({ onClose }) {
  const navigate = useNavigate()
  const addTenant = useTenantStore((s) => s.addTenant)

  const [form, setForm] = useState({ name: '', owner: '', email: '', trade: 'Plumber', plan: 'Starter' })
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const submit = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Business name is required'
    if (!form.owner.trim()) newErrors.owner = 'Owner name is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    addTenant({ ...form, name: form.name.trim(), owner: form.owner.trim() })
    onClose()
    navigate('/tenants')
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(20,38,63,0.55)',
        display: 'grid', placeItems: 'center', zIndex: 1000, padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: colors.surface, borderRadius: 14, padding: 28, width: '100%', maxWidth: 460 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: colors.navy700, fontSize: 22 }}>Add tenant</h2>
          <X size={20} color={colors.muted} style={{ cursor: 'pointer' }} onClick={onClose} />
        </div>

        <Label text="Business name" error={errors.name}>
          <input style={inputStyle} value={form.name} onChange={set('name')} placeholder="e.g. Sparkle Electrical Ltd" />
        </Label>

        <Label text="Owner name" error={errors.owner}>
          <input style={inputStyle} value={form.owner} onChange={set('owner')} placeholder="e.g. John Smith" />
        </Label>

        <Label text="Owner email" error={errors.email}>
          <input style={inputStyle} value={form.email} onChange={set('email')} placeholder="john@sparkle.co.uk" />
        </Label>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Label text="Trade">
              <select style={inputStyle} value={form.trade} onChange={set('trade')}>
                <option>Plumber</option>
                <option>Electrician</option>
                <option>Gas engineer</option>
                <option>Roofer</option>
              </select>
            </Label>
          </div>
          <div style={{ flex: 1 }}>
            <Label text="Plan">
              <select style={inputStyle} value={form.plan} onChange={set('plan')}>
                <option>Starter</option>
                <option>Pro</option>
              </select>
            </Label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button
            onClick={onClose}
            style={{ cursor: 'pointer', padding: '10px 18px', borderRadius: 10, fontWeight: 600, border: `1px solid ${colors.border}`, background: colors.surface, color: colors.muted }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            style={{ cursor: 'pointer', padding: '10px 18px', borderRadius: 10, fontWeight: 600, border: 'none', background: colors.orange500, color: '#fff' }}
          >
            Create tenant
          </button>
        </div>
      </div>
    </div>
  )
}