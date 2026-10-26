import { configureStore } from '@reduxjs/toolkit'
import expensesReducer from './expensesSlice'
import budgetsReducer from './budgetsSlice'
import profileReducer from './profileSlice'

export const store = configureStore({
  reducer: { expenses: expensesReducer, budgets: budgetsReducer, profile: profileReducer },
})
