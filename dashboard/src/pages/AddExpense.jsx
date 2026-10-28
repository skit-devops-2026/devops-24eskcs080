import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { postExpense } from '../store/expensesSlice'
import { money } from '../components/format'

const CATEGORIES = ['Housing', 'Groceries', 'Transport', 'Dining', 'Bills', 'Health', 'Shopping']
const today = () => new Date().toISOString().split('T')[0]

export default function AddExpense() {
  const dispatch = useDispatch()
  const [form, setForm] = useState({ amount: '', category: 'Groceries', date: today(), note: '' })
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(null)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  function validate() {
    const found = {}
    const amount = Number(form.amount)
    if (!form.amount || Number.isNaN(amount) || amount <= 0) found.amount = 'Enter an amount greater than 0.'
    if (!form.date) found.date = 'Choose a date.'
    if (form.date > today()) found.date = 'Date cannot be in the future.'
    if (form.note.trim().length > 80) found.note = 'Keep the note under 80 characters.'
    return found
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return

    const expense = {
      date: form.date,
      category: form.category,
      amount: Math.round(Number(form.amount)),
      note: form.note.trim() || form.category,
    }
    const result = await dispatch(postExpense(expense))
    if (postExpense.fulfilled.match(result)) {
      setSaved(expense)
      setErrors({})
      setForm({ amount: '', category: form.category, date: today(), note: '' })
    } else {
      setSaved(null)
      setErrors({ amount: 'Could not save: ' + result.error.message })
    }
  }
  const input = 'mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2'
  const err = 'mt-1 text-sm text-red-700'

  return (
    <div className="max-w-md">
      <h2 className="mb-6 text-2xl font-semibold">Add expense</h2>

      {saved && (
        <p className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800" role="status">
          Added {money(saved.amount)} to {saved.category}. <Link to="/transactions" className="underline">View transactions</Link>
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <label className="block text-sm font-medium">
          Amount (₹)
          <input type="number" min="1" step="1" value={form.amount} onChange={update('amount')} className={input} placeholder="e.g. 1240" />
          {errors.amount && <span className={err}>{errors.amount}</span>}
        </label>

        <label className="block text-sm font-medium">
          Category
          <select value={form.category} onChange={update('category')} className={input}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>

        <label className="block text-sm font-medium">
          Date
          <input type="date" value={form.date} max={today()} onChange={update('date')} className={input} />
          {errors.date && <span className={err}>{errors.date}</span>}
        </label>

        <label className="block text-sm font-medium">
          Note (optional)
          <input type="text" value={form.note} onChange={update('note')} className={input} placeholder="e.g. Weekly shop" />
          {errors.note && <span className={err}>{errors.note}</span>}
        </label>

        <button type="submit" className="rounded-lg bg-orange-600 px-5 py-2 font-semibold text-white hover:bg-orange-700">
          Save expense
        </button>
      </form>
    </div>
  )
}
