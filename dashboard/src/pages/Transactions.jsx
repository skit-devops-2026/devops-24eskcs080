import { useMemo, useState } from 'react'
import useExpenses from '../hooks/useExpenses'
import { money } from '../components/format'

export default function Transactions() {
  const { expenses, loading, error } = useExpenses()
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('date-desc')

  const categories = useMemo(
    () => [...new Set(expenses.map((e) => e.category))].sort(),
    [expenses]
  )

  const shown = useMemo(() => {
    const list = category === 'all' ? expenses : expenses.filter((e) => e.category === category)
    const sorted = [...list]
    if (sort === 'date-desc') sorted.sort((a, b) => b.date.localeCompare(a.date))
    if (sort === 'date-asc') sorted.sort((a, b) => a.date.localeCompare(b.date))
    if (sort === 'amount-desc') sorted.sort((a, b) => b.amount - a.amount)
    if (sort === 'amount-asc') sorted.sort((a, b) => a.amount - b.amount)
    return sorted
  }, [expenses, category, sort])

  const total = shown.reduce((s, e) => s + e.amount, 0)

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">Transactions</h2>

      <div className="mb-4 flex flex-wrap gap-4">
        <label className="text-sm font-medium">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block rounded-lg border border-stone-300 bg-white px-3 py-2"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="mt-1 block rounded-lg border border-stone-300 bg-white px-3 py-2"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>
        </label>
      </div>

      {loading && <p className="text-stone-500">Loading expenses…</p>}
      {error && <p className="text-red-700">Could not load expenses ({error}).</p>}

      {!loading && !error && (
        <>
          <p className="mb-3 text-sm text-stone-600">
            {shown.length} expenses · total <strong>{money(total)}</strong>
          </p>
          <ul className="divide-y divide-stone-200 rounded-xl bg-white shadow-sm">
            {shown.map((e) => (
              <li key={e.id} className="grid grid-cols-[6rem_7rem_1fr_auto] items-center gap-3 px-4 py-3 text-sm">
                <span className="text-stone-500">{e.date}</span>
                <span className="font-medium">{e.category}</span>
                <span className="text-stone-600">{e.note}</span>
                <span className="font-semibold">{money(e.amount)}</span>
              </li>
            ))}
            {shown.length === 0 && <li className="px-4 py-3 text-stone-500">No expenses found.</li>}
          </ul>
        </>
      )}
    </div>
  )
}
