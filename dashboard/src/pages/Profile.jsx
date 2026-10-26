import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveProfile } from '../store/profileSlice'

const PROFESSIONS = [
  { value: 'student', label: 'Student' },
  { value: 'salaried', label: 'Salaried employee' },
  { value: 'business', label: 'Business person' },
  { value: 'retired', label: 'Retired' },
]

export default function Profile() {
  const dispatch = useDispatch()
  const profile = useSelector((s) => s.profile)
  const [form, setForm] = useState(profile)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    setSaved(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const found = {}
    if (form.name.trim().length < 2) found.name = 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) found.email = 'Enter a valid email address.'
    setErrors(found)
    if (Object.keys(found).length) return
    dispatch(saveProfile({ name: form.name.trim(), email: form.email.trim(), profession: form.profession }))
    setSaved(true)
  }

  const input = 'mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2'
  const err = 'mt-1 text-sm text-red-700'

  return (
    <div className="max-w-md">
      <h2 className="mb-6 text-2xl font-semibold">Profile</h2>
      {saved && (
        <p className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800" role="status">
          Profile saved.
        </p>
      )}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <label className="block text-sm font-medium">
          Full name
          <input type="text" value={form.name} onChange={update('name')} className={input} autoComplete="name" />
          {errors.name && <span className={err}>{errors.name}</span>}
        </label>
        <label className="block text-sm font-medium">
          Email address
          <input type="email" value={form.email} onChange={update('email')} className={input} autoComplete="email" />
          {errors.email && <span className={err}>{errors.email}</span>}
        </label>
        <label className="block text-sm font-medium">
          What best describes you?
          <select value={form.profession} onChange={update('profession')} className={input}>
            {PROFESSIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </label>
        <button type="submit" className="rounded-lg bg-orange-600 px-5 py-2 font-semibold text-white hover:bg-orange-700">
          Save profile
        </button>
      </form>
    </div>
  )
}
