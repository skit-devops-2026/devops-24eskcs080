import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'

const money = (n) => '₹' + n.toLocaleString('en-IN')

function Layout({ children }) {
  const link = ({ isActive }) =>
    'block rounded-lg px-3 py-2 text-sm font-medium ' +
    (isActive ? 'bg-orange-100 text-orange-700' : 'text-stone-600 hover:bg-stone-100')
  return (
    <div className="flex min-h-screen bg-stone-50 text-stone-800">
      <aside className="w-56 shrink-0 border-r border-stone-200 bg-white p-4">
        <h1 className="mb-6 text-xl font-bold text-orange-700">spendly</h1>
        <nav className="space-y-1">
          <NavLink to="/" end className={link}>Dashboard</NavLink>
          <NavLink to="/add" className={link}>Add expense</NavLink>
          <NavLink to="/transactions" className={link}>Transactions</NavLink>
          <NavLink to="/budgets" className={link}>Budgets</NavLink>
          <NavLink to="/profile" className={link}>Profile</NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}

function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/data/expenses.json')
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status)
        return r.json()
      })
      .then(setExpenses)
      .catch((e) => setError(e.message))
  }, [])

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

const Placeholder = ({ title }) => (
  <div>
    <h2 className="mb-2 text-2xl font-semibold">{title}</h2>
    <p className="text-stone-500">Coming in the next step.</p>
  </div>
)

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<Placeholder title="Add expense" />} />
        <Route path="/transactions" element={<Placeholder title="Transactions" />} />
        <Route path="/budgets" element={<Placeholder title="Budgets" />} />
        <Route path="/profile" element={<Placeholder title="Profile" />} />
        <Route path="*" element={<Placeholder title="Page not found" />} />
      </Routes>
    </Layout>
  )
}
