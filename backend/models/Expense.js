import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
    note: { type: String, default: '' },
  },
  { timestamps: true }
)

// Return a plain `id` so the React app keeps working unchanged
expenseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
  },
})

export default mongoose.model('Expense', expenseSchema)
