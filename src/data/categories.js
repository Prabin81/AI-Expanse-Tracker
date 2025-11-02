export const categories = [
  { id: 'food', label: 'Food', icon: '🍔', color: '#FF6B6B' },
  { id: 'transport', label: 'Transport', icon: '🚗', color: '#4ECDC4' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#45B7D1' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#FFA07A' },
  { id: 'bills', label: 'Bills & Utilities', icon: '💡', color: '#98D8C8' },
  { id: 'subscriptions', label: 'Subscriptions', icon: '📱', color: '#F7DC6F' },
  { id: 'health', label: 'Health', icon: '💊', color: '#BB8FCE' },
  { id: 'education', label: 'Education', icon: '📚', color: '#85C1E2' },
  { id: 'travel', label: 'Travel', icon: '✈️', color: '#F8C471' },
  { id: 'other', label: 'Other', icon: '📦', color: '#AAB7B8' },
]

// Auto-categorize based on keywords
export const categorizeExpense = (title) => {
  const titleLower = title.toLowerCase()
  
  const keywordMap = {
    food: ['food', 'lunch', 'dinner', 'breakfast', 'restaurant', 'cafe', 'groceries', 'grocery', 'uber eats', 'doordash', 'grubhub'],
    transport: ['uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking', 'metro', 'subway', 'bus', 'train', 'flight', 'airline'],
    entertainment: ['movie', 'cinema', 'netflix', 'hulu', 'spotify', 'concert', 'game', 'entertainment', 'amazon prime'],
    shopping: ['amazon', 'target', 'walmart', 'shop', 'purchase', 'buy'],
    bills: ['electric', 'water', 'internet', 'phone', 'utility', 'bill', 'rent', 'mortgage'],
    subscriptions: ['netflix', 'spotify', 'hulu', 'disney', 'apple', 'subscription', 'monthly', 'yearly'],
    health: ['pharmacy', 'doctor', 'hospital', 'medicine', 'gym', 'fitness', 'health'],
    education: ['book', 'course', 'school', 'tuition', 'education', 'learning'],
    travel: ['hotel', 'airbnb', 'vacation', 'trip', 'travel'],
  }
  
  for (const [category, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => titleLower.includes(keyword))) {
      return category
    }
  }
  
  return 'other'
}

export const getCategoryById = (id) => {
  return categories.find(cat => cat.id === id) || categories[categories.length - 1]
}

