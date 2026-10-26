import { createSlice } from '@reduxjs/toolkit'

// Monthly limits in rupees; later these will be stored per user in MongoDB
const budgetsSlice = createSlice({
  name: 'budgets',
  initialState: {
    limits: {
      Housing: 12000,
      Groceries: 5000,
      Transport: 1500,
      Dining: 2000,
      Bills: 2500,
      Health: 1500,
      Shopping: 3000,
    },
  },
  reducers: {
    setLimit(state, action) {
      const { category, amount } = action.payload
      state.limits[category] = amount
    },
  },
})

export const { setLimit } = budgetsSlice.actions
export default budgetsSlice.reducer
