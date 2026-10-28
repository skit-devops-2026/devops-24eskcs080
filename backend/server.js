import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { readFileSync } from 'node:fs'

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// In-memory data (MongoDB replaces this in Phase 4)
let expenses = JSON.parse(readFileSync(new URL('./data/expenses.json', import.meta.url)))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.get('/api/expenses', (req, res) => {
  const { category } = req.query
  res.json(category ? expenses.filter((e) => e.category === category) : expenses)
})

app.get('/api/expenses/:id', (req, res) => {
  const expense = expenses.find((e) => e.id === Number(req.params.id))
  if (!expense) return res.status(404).json({ error: 'Expense not found' })
  res.json(expense)
})

app.post('/api/expenses', (req, res) => {
  const { date, category, amount, note } = req.body
  if (!date || !category || !(Number(amount) > 0)) {
    return res.status(400).json({ error: 'date, category and a positive amount are required' })
  }
  const id = expenses.reduce((max, e) => Math.max(max, e.id), 0) + 1
  const expense = { id, date, category, amount: Math.round(Number(amount)), note: note || category }
  expenses.push(expense)
  res.status(201).json(expense)
})

app.delete('/api/expenses/:id', (req, res) => {
  const before = expenses.length
  expenses = expenses.filter((e) => e.id !== Number(req.params.id))
  if (expenses.length === before) return res.status(404).json({ error: 'Expense not found' })
  res.status(204).end()
})

// Error handling middleware
app.use((req, res) => res.status(404).json({ error: 'Not found' }))
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Server error' })
})

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
