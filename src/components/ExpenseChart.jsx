import { useMemo } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { getCategoryById } from '../data/categories'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
)

const ExpenseChart = ({ expenses }) => {
  const chartData = useMemo(() => {
    if (expenses.length === 0) {
      return null
    }

    // Calculate category totals
    const categoryTotals = {}
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount)
    })

    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6) // Top 6 categories

    const labels = sortedCategories.map(([catId]) => {
      const cat = getCategoryById(catId)
      return `${cat.icon} ${cat.label}`
    })

    const data = sortedCategories.map(([, amount]) => amount)
    const colors = sortedCategories.map(([catId]) => {
      const cat = getCategoryById(catId)
      return cat.color
    })

    return {
      labels,
      datasets: [
        {
          label: 'Amount (Rs.)',
          data,
          backgroundColor: colors,
          borderColor: colors.map(c => c + 'CC'),
          borderWidth: 2
        }
      ]
    }
  }, [expenses])

  const monthlyData = useMemo(() => {
    if (expenses.length === 0) return null

    const monthlyTotals = {}
    expenses.forEach(exp => {
      const month = new Date(exp.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      monthlyTotals[month] = (monthlyTotals[month] || 0) + parseFloat(exp.amount)
    })

    const months = Object.keys(monthlyTotals).sort((a, b) => {
      return new Date(a) - new Date(b)
    })

    return {
      labels: months,
      datasets: [
        {
          label: 'Monthly Spending (Rs.)',
          data: months.map(month => monthlyTotals[month]),
          backgroundColor: 'rgba(37, 99, 235, 0.6)',
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 2
        }
      ]
    }
  }, [expenses])

  if (expenses.length === 0) {
    return (
      <div className="card">
        <div className="mb-6">
          <h2 className="text-white-800 dark:text-black-200 leading-relaxed text-2xl font-bold">
            Spending Analytics
          </h2>
          <p className="text-white-800 dark:text-black-200 leading-relaxed text-s font-medium">
            Visual insights into your spending patterns
          </p>
        </div>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-sm font-medium">Add expenses to see visualizations</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pie Chart */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-white-800 dark:text-black-200 leading-relaxed text-s font-bold">
            Category Breakdown
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Top spending categories
          </p>
        </div>
        {chartData && (
          <div className="h-64">
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: window.matchMedia('(prefers-color-scheme: black)').matches || document.documentElement.classList.contains('dark') 
                        ? '#d5d5deff' 
                        : '#1f2937',
                      padding: 10,
                      font: { size: 12 }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || ''
                        const value = context.parsed || 0
                        const total = context.dataset.data.reduce((a, b) => a + b, 0)
                        const percentage = ((value / total) * 100).toFixed(1)
                        return `${label}: Rs. ${value.toFixed(2)} (${percentage}%)`
                      }
                    }
                  }
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Bar Chart */}
      {monthlyData && monthlyData.labels.length > 1 && (
        <div className="card">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Monthly Trends
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Spending over time
            </p>
          </div>
          <div className="h-64">
            <Bar
              data={monthlyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `Rs. ${context.parsed.y.toFixed(2)}`
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `Rs. ${value.toFixed(0)}`,
                      color: window.matchMedia('(prefers-color-scheme: dark)').matches || document.documentElement.classList.contains('dark') 
                        ? '#9ca3af' 
                        : '#6b7280'
                    },
                    grid: {
                      color: window.matchMedia('(prefers-color-scheme: dark)').matches || document.documentElement.classList.contains('dark') 
                        ? '#374151' 
                        : '#e5e7eb'
                    }
                  },
                  x: {
                    ticks: {
                      color: window.matchMedia('(prefers-color-scheme: dark)').matches || document.documentElement.classList.contains('dark') 
                        ? '#9ca3af' 
                        : '#6b7280'
                    },
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpenseChart

