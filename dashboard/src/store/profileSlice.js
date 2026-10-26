import { createSlice } from '@reduxjs/toolkit'

// Placeholder profile; later this comes from the logged-in user in MongoDB
const profileSlice = createSlice({
  name: 'profile',
  initialState: { name: 'Bhanu Pratap', email: 'bhanu@example.com', profession: 'student' },
  reducers: {
    saveProfile(state, action) {
      return { ...state, ...action.payload }
    },
  },
})

export const { saveProfile } = profileSlice.actions
export default profileSlice.reducer
