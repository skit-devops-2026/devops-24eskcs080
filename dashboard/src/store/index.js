import { configureStore } from '@reduxjs/toolkit'
import expensesReducer from './expensesSlice'
import budgetsReducer from './budgetsSlice'

export const store = configureStore({
  reducer: { expenses: expensesReducer, budgets: budgetsReducer },
})
