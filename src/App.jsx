import { useState, useEffect } from 'react'
import Header from './components/Header'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ExpenseChart from './components/ExpenseChart'
import AIRecommendations from './components/AIRecommendations'
import { loadExpenses, saveExpenses } from './utils/storage'

function App() {
  const [expenses, setExpenses] = useState([])
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      const isDark = JSON.parse(saved)
      // Apply immediately to avoid flash
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return isDark
    }
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    }
    return prefersDark
  })

  useEffect(() => {
    const loadedExpenses = loadExpenses()
    setExpenses(loadedExpenses)
  }, [])

  // Update dark mode class and localStorage when state changes
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now().toString(),
      ...expense,
      date: expense.date || new Date().toISOString().split('T')[0]
    }
    setExpenses([...expenses, newExpense])
  }

  const updateExpense = (id, updatedExpense) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, ...updatedExpense } : exp
    ))
  }

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id))
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-950 transition-colors duration-300">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Form and List */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <ExpenseForm onAddExpense={addExpense} />
            <ExpenseList 
              expenses={expenses} 
              onUpdateExpense={updateExpense}
              onDeleteExpense={deleteExpense}
            />
          </div>

          {/* Right Column - Charts and AI */}
          <div className="space-y-6 lg:space-y-8">
            <ExpenseChart expenses={expenses} />
            <AIRecommendations expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
