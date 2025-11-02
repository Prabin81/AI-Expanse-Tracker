const API_URL = 'https://api.openai.com/v1/chat/completions'

export const generateAIRecommendations = async (expenses) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    return {
      recommendations: [
        "💡 Tip: Add your OpenAI API key in the .env file to get AI-powered financial recommendations!",
        "📊 Your expense data is being tracked locally and is secure.",
      ],
      error: "API key not configured"
    }
  }

  if (expenses.length === 0) {
    return {
      recommendations: [
        "👋 Welcome! Start adding your expenses to get personalized AI recommendations.",
        "💰 Track your spending habits and get insights on where your money goes.",
      ]
    }
  }

  // Prepare expense summary
  const categoryTotals = {}
  const recentExpenses = expenses.slice(-10)
  
  recentExpenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount)
  })

  const totalSpending = Object.values(categoryTotals).reduce((a, b) => a + b, 0)
  const categoryPercentages = Object.entries(categoryTotals).map(([cat, amt]) => ({
    category: cat,
    amount: amt,
    percentage: ((amt / totalSpending) * 100).toFixed(1)
  })).sort((a, b) => b.amount - a.amount)

  const prompt = `You are a helpful financial advisor AI. Based on the user's last 10 expenses:

${recentExpenses.map((exp, idx) => `${idx + 1}. ${exp.title} - Rs. ${exp.amount} (${exp.category}) - ${exp.date}`).join('\n')}

Category Breakdown:
${categoryPercentages.map(c => `- ${c.category}: ${c.percentage}% (Rs. ${c.amount.toFixed(2)})`).join('\n')}

Total recent spending: Rs. ${totalSpending.toFixed(2)}

Provide 3-4 concise, actionable recommendations in a friendly, conversational tone. Focus on:
1. Highlighting overspending patterns (if any category is >30% of total)
2. Suggesting budget limits for top spending categories
3. Identifying unusual spending patterns
4. General budgeting tips

Format each recommendation as a short bullet point starting with an emoji. Keep each point under 100 characters.`

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful financial advisor that provides concise, actionable budgeting advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const recommendations = data.choices[0].message.content
      .split('\n')
      .filter(line => line.trim() && (line.includes('💡') || line.includes('💰') || line.includes('📊') || line.includes('⚡') || line.includes('🎯') || line.includes('🚨')))
      .slice(0, 4)

    return {
      recommendations: recommendations.length > 0 
        ? recommendations 
        : [
            `💡 You've spent Rs. ${totalSpending.toFixed(2)} recently. Keep tracking to see patterns!`,
            `📊 Top category: ${categoryPercentages[0]?.category || 'None'} at ${categoryPercentages[0]?.percentage || 0}%`,
            `🎯 Consider setting a monthly budget to better manage your expenses.`
          ]
    }
  } catch (error) {
    console.error('AI API Error:', error)
    return {
      recommendations: [
        "⚠️ Unable to fetch AI recommendations. Please check your API key.",
        `📊 You've tracked ${expenses.length} expenses so far.`,
        `💰 Recent total: Rs. ${totalSpending.toFixed(2)}`
      ],
      error: error.message
    }
  }
}

