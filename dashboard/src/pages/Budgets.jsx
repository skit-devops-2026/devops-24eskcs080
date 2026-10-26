import { useDispatch, useSelector } from 'react-redux'
import useExpenses from '../hooks/useExpenses'
import { setLimit } from '../store/budgetsSlice'
import { money } from '../components/format'

export default function Budgets() {
  const dispatch = useDispatch()
  const limits = useSelector((s) => s.budgets.limits)
  const { expenses, loading, error } = useExpenses()

  const spent = {}
  expenses.forEach((e) => { spent[e.category] = (spent[e.category] || 0) + e.amount })

  return (
    <div className="max-w-2xl">
      <h2 className="mb-2 text-2xl font-semibold">Budgets</h2>
      <p className="mb-6 text-sm text-stone-500">Set a monthly limit for each category. Bars turn red when you go over.</p>

      {loading && <p className="text-stone-500">Loading…</p>}
      {error && <p className="text-red-700">Could not load expenses ({error}).</p>}

      <div className="space-y-5">
        {Object.entries(limits).map(([category, limit]) => {
          const used = spent[category] || 0
          const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
          const over = used > limit
          return (
            <div key={category} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">{category}</span>
                <label className="text-sm text-stone-600">
                  Limit ₹
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={limit}
                    onChange={(e) => dispatch(setLimit({ category, amount: Math.max(0, Number(e.target.value) || 0) }))}
                    className="ml-2 w-24 rounded-lg border border-stone-300 px-2 py-1"
                  />
                </label>
              </div>
              <div className="mt-3 h-2 rounded bg-stone-200">
                <div className={'h-2 rounded ' + (over ? 'bg-red-600' : 'bg-orange-500')} style={{ width: pct + '%' }} />
              </div>
              <p className={'mt-2 text-sm ' + (over ? 'font-semibold text-red-700' : 'text-stone-600')}>
                {money(used)} of {money(limit)}
                {over ? ' · over by ' + money(used - limit) : ' · ' + money(limit - used) + ' left'}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
