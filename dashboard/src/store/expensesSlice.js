import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Later this will call the Express API instead of the JSON file
export const loadExpenses = createAsyncThunk('expenses/load', async () => {
  const response = await fetch(import.meta.env.BASE_URL + 'data/expenses.json')
  if (!response.ok) throw new Error('HTTP ' + response.status)
  return response.json()
})

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: { items: [], status: 'idle', error: '' },
  reducers: {
    addExpense(state, action) {
      const nextId = state.items.reduce((max, e) => Math.max(max, e.id), 0) + 1
      state.items.push({ id: nextId, ...action.payload })
    },
  },
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
  },
})

export const { addExpense } = expensesSlice.actions
export default expensesSlice.reducer
