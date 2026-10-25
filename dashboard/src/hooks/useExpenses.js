import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadExpenses } from '../store/expensesSlice'

export default function useExpenses() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((s) => s.expenses)

  useEffect(() => {
    if (status === 'idle') dispatch(loadExpenses())
  }, [status, dispatch])

  return { expenses: items, loading: status === 'idle' || status === 'loading', error }
}
