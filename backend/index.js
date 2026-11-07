import express from 'express'
import cors from 'cors'
import { connectDB } from './db.js'
import adminRoutes from './routes/admin.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/api/admin', adminRoutes)

// The public Pricing page (Student 4) reads the same plans
app.get('/api/plans', (req, res) => res.redirect(307, '/api/admin/plans'))

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use((req, res) => res.status(404).json({ error: 'Not found' }))

// Any error thrown inside a route ends up here
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Server error' })
})

try {
  await connectDB()
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
} catch (err) {
  console.error('Could not connect to MongoDB:', err.message)
  process.exit(1)
}