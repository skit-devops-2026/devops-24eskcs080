import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import AddExpense from './pages/AddExpense'

function Layout({ children }) {
  const link = ({ isActive }) =>
    'block rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ' +
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
        <Route path="/add" element={<AddExpense />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Placeholder title="Budgets" />} />
        <Route path="/profile" element={<Placeholder title="Profile" />} />
        <Route path="*" element={<Placeholder title="Page not found" />} />
      </Routes>
    </Layout>
  )
}
