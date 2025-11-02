import { useState } from 'react'
import { getCategoryById } from '../data/categories'

const ExpenseList = ({ expenses, onUpdateExpense, onDeleteExpense }) => {
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const handleEdit = (expense) => {
    setEditingId(expense.id)
    setEditForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date
    })
  }

  const handleSave = (id) => {
    onUpdateExpense(id, editForm)
    setEditingId(null)
    setEditForm({})
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (expenses.length === 0) {
    return (
      <div className="card">
        <div className="mb-6">
          <h2 className="text-white-800 dark:text-black-200 leading-relaxed text-s font-bold">
            Your Expenses
          </h2>
          <p className="text-s font-bold text-dark-blue-900 dark:text-blue-900text-white-800 dark:text-black-200 leading-relaxed text-s font-s">
            All your tracked expenses will appear here
          </p>
        </div>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-lg font-medium mb-2">No expenses yet!</p>
          <p className="text-sm">Add your first expense above to get started.</p>
        </div>
      </div>
    )
  }

  // Sort by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-l font-bold text-black:text-white">
            Your Expenses
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} tracked
          </p>
        </div>
        <div className="px-5 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <div className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-0.5">Total Amount</div>
          <div className="text-xl font-bold text-primary-700 dark:text-primary-300">
            Rs. {totalAmount.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
        {sortedExpenses.map(expense => {
          const category = getCategoryById(expense.category)
          const isEditing = editingId === expense.id

          if (isEditing) {
            return (
              <div
                key={expense.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-primary"
              >
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="input-field"
                    placeholder="Title"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                      className="input-field"
                      step="0.01"
                      placeholder="Amount"
                    />
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSave(expense.id)}
                      className="flex-1 btn-primary flex items-center justify-center space-x-1"
                    >
                      <span>✓</span>
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 btn-secondary flex items-center justify-center space-x-1"
                    >
                      <span>✕</span>
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          }

          return (
            <div
              key={expense.id}
              className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-sm group"
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border"
                  style={{ 
                    backgroundColor: category.color + '15', 
                    borderColor: category.color + '40' 
                  }}
                >
                  {category.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1 truncate">
                    {expense.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-100">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-200 dark:bg-gray-700 mr-2">
                      {category.label}
                    </span>
                    {formatDate(expense.date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                <span className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  Rs. {parseFloat(expense.amount).toFixed(2)}
                </span>
                <button
                  onClick={() => handleEdit(expense)}
                  className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100"
                  aria-label="Edit expense"
                  title="Edit expense"
                >
                  <span className="text-base">✏️</span>
                </button>
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100"
                  aria-label="Delete expense"
                  title="Delete expense"
                >
                  <span className="text-base">🗑️</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExpenseList

