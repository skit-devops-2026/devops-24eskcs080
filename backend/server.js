import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import { readFileSync } from 'node:fs'
import Expense from './models/Expense.js'

const app = express()
const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spendly'

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const validId = (id) => mongoose.isValidObjectId(id)

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
)

app.get('/api/expenses', async (req, res, next) => {
  try {
    const filter = req.query.category ? { category: String(req.query.category) } : {}
    res.json(await Expense.find(filter).sort({ date: 1, createdAt: 1 }))
  } catch (err) { next(err) }
})

app.get('/api/expenses/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(404).json({ error: 'Expense not found' })
    const expense = await Expense.findById(req.params.id)
    if (!expense) return res.status(404).json({ error: 'Expense not found' })
    res.json(expense)
  } catch (err) { next(err) }
})

app.post('/api/expenses', async (req, res, next) => {
  try {
    const { date, category, amount, note } = req.body
    if (!date || !category || !(Number(amount) > 0)) {
      return res.status(400).json({ error: 'date, category and a positive amount are required' })
    }
    const expense = await Expense.create({
      date,
      category,
      amount: Math.round(Number(amount)),
      note: note || category,
    })
    res.status(201).json(expense)
  } catch (err) { next(err) }
})

app.delete('/api/expenses/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(404).json({ error: 'Expense not found' })
    const deleted = await Expense.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Expense not found' })
    res.status(204).end()
  } catch (err) { next(err) }
})

// Error handling middleware
app.use((req, res) => res.status(404).json({ error: 'Not found' }))
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Server error' })
})

async function start() {
  await mongoose.connect(MONGODB_URI)
  console.log('MongoDB connected')

  // Seed sample data once
  if ((await Expense.countDocuments()) === 0) {
    const sample = JSON.parse(readFileSync(new URL('./data/expenses.json', import.meta.url)))
    await Expense.insertMany(sample.map(({ date, category, amount, note }) => ({ date, category, amount, note })))
    console.log(`Seeded ${sample.length} sample expenses`)
  }

  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
}

start().catch((err) => {
  console.error('Failed to start:', err.message)
  process.exit(1)
})
