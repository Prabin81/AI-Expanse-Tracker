const STORAGE_KEY = 'expense_tracker_expenses'

export const loadExpenses = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading expenses:', error)
    return []
  }
}

export const saveExpenses = (expenses) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  } catch (error) {
    console.error('Error saving expenses:', error)
  }
}

export const clearExpenses = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing expenses:', error)
  }
}

