import { useState } from 'react'
import { categories, categorizeExpense } from '../data/categories'

const ExpenseForm = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'other',
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please fill in all fields with valid data')
      return
    }

    // Auto-categorize if user typed something
    const autoCategory = formData.category === 'other' 
      ? categorizeExpense(formData.title)
      : formData.category

    onAddExpense({
      title: formData.title.trim(),
      amount: parseFloat(formData.amount).toFixed(2),
      category: autoCategory,
      date: formData.date
    })

    // Reset form
    setFormData({
      title: '',
      amount: '',
      category: 'other',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Auto-detect category when title changes
  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      category: prev.category === 'other' ? categorizeExpense(title) : prev.category
    }))
  }

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-white-800 dark:text-black-200 leading-relaxed text-2xl font-bold">
          Add New Expense
        </h2>
        <p className="text-white-800 dark:text-black-200 leading-relaxed text-s font-bold">
          Track your spending with intelligent categorization
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="text-white-800 dark:text-black-200 leading-relaxed text-s font-semibold">
            Expense Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="e.g., Netflix, Lunch at Café, Uber ride"
            className="input-field"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1.5">
            <span>💡</span>
            <span>AI will auto-categorize based on keywords</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="text-white-800 dark:text-black-200 leading-relaxed text-s font-semibold">
              Amount (Rs.)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              placeholder="0.00"
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="text-white-800 dark:text-black-200 leading-relaxed text-s font-semibold">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="text-white-800 dark:text-black-200 leading-relaxed text-s font-semibold">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full btn-primary mt-6"
        >
          <span className="mr-2">+</span>
          Add Expense
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm

