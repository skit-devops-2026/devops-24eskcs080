import useExpenses from '../hooks/useExpenses'
import { money } from '../components/format'

export default function Dashboard() {
  const { expenses, error } = useExpenses()

  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const byCategory = {}
  expenses.forEach((e) => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount })
  const rows = Object.entries(byCategory).sort((a, b) => b[1] - a[1])

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">Dashboard</h2>
      {error && <p className="text-red-700">Could not load expenses ({error}).</p>}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">Total spent</p>
          <p className="text-2xl font-bold">{money(total)}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">Transactions</p>
          <p className="text-2xl font-bold">{expenses.length}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">Top category</p>
          <p className="text-2xl font-bold">{rows[0] ? rows[0][0] : '—'}</p>
        </div>
      </div>
      <h3 className="mb-3 text-lg font-semibold">Spending by category</h3>
      <div className="space-y-3">
        {rows.map(([name, amount]) => (
          <div key={name}>
            <div className="flex justify-between text-sm">
              <span>{name}</span><span>{money(amount)}</span>
            </div>
            <div className="mt-1 h-2 rounded bg-stone-200">
              <div className="h-2 rounded bg-orange-500" style={{ width: (amount / total) * 100 + '%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
