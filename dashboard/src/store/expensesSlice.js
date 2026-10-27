import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// In development the API runs on port 4000; in Docker nginx will proxy /api
const API = import.meta.env.VITE_API_URL ?? ''

export const loadExpenses = createAsyncThunk('expenses/load', async () => {
  const response = await fetch(API + '/api/expenses')
  if (!response.ok) throw new Error('HTTP ' + response.status)
  return response.json()
})

export const postExpense = createAsyncThunk('expenses/post', async (expense) => {
  const response = await fetch(API + '/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || 'HTTP ' + response.status)
  }
  return response.json()
})

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: { items: [], status: 'idle', error: '' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadExpenses.pending, (state) => { state.status = 'loading' })
      .addCase(loadExpenses.fulfilled, (state, action) => {
        state.status = 'ready'
        state.items = action.payload
      })
      .addCase(loadExpenses.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message
      })
      .addCase(postExpense.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
  },
})

export default expensesSlice.reducer
