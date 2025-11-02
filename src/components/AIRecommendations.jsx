import { useState, useEffect } from 'react'
import { generateAIRecommendations } from '../utils/aiPrompt'

const AIRecommendations = ({ expenses }) => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastExpenseCount, setLastExpenseCount] = useState(0)

  useEffect(() => {
    // Only fetch recommendations if expenses changed significantly
    // (every 5 new expenses or when component first loads)
    const expenseDiff = expenses.length - lastExpenseCount
    
    if (expenses.length === 0 || (expenseDiff > 0 && expenseDiff % 5 === 0) || lastExpenseCount === 0) {
      fetchRecommendations()
      setLastExpenseCount(expenses.length)
    }
  }, [expenses.length])

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const result = await generateAIRecommendations(expenses)
      setRecommendations(result.recommendations || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setRecommendations([
        "⚠️ Unable to load recommendations at this time.",
        "Please try again later."
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchRecommendations()
  }

  if (loading) {
    return (
      <div className="card">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-2xl">✨</span>
            <h2 className="text-l font-bold text-gray-900 dark:text-white">
              AI Recommendations
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Personalized financial insights
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin text-3xl text-primary-600 dark:text-primary-400 mb-3">⏳</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Analyzing your expenses...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-l">✨</span>
            <h2 className="text-l text-white-800 dark:text-black-200 leading-relaxed font-bold">
              Recommendations
            </h2>
          </div>
          <p className="text-white-800 dark:text-black-200 leading-relaxed text-sm font-medium">
            Personalized financial insights
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="text-sm btn-secondary py-2 px-2 flex-shrink-1"
          title="Refresh recommendations"
        >
          <span className="mr-1">🔄</span>
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-3">💭</div>
            <p className="text-sm font-medium">No recommendations yet. Add more expenses!</p>
          </div>
        ) : (
          recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-xl border-l-4 border-accent-500 shadow-sm"
            >
              <p className="text-white-800 dark:text-black-200 leading-relaxed text-sm font-medium">
                {rec}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Recommendations update automatically every 5 new expenses
        </p>
      </div>
    </div>
  )
}

export default AIRecommendations

