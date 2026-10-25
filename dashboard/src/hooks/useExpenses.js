import { useEffect, useState } from 'react'

// Loads sample expenses once; later this will call the Express API
export default function useExpenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/data/expenses.json')
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status)
        return r.json()
      })
      .then(setExpenses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { expenses, loading, error }
}
