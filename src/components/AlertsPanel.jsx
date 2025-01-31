import React from 'react'
import { useFinance } from '../context/FinanceContext'
import { FiAlertCircle } from 'react-icons/fi'
import { startOfMonth, endOfMonth } from 'date-fns'

const AlertsPanel = () => {
  const { transactions = [], budgets = {}, t } = useFinance()

  // Get current month's date range
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  // Calculate current month's spending for each category
  const categorySpending = transactions
    .filter(transaction => {
      const date = new Date(transaction.date)
      return (
        date >= monthStart &&
        date <= monthEnd &&
        transaction.amount > 0 // Expenses are stored as positive amounts
      )
    })
    .reduce((acc, transaction) => {
      const category = transaction.category
      acc[category] = (acc[category] || 0) + transaction.amount
      return acc
    }, {})

  // Find categories that are over budget
  const overBudgetCategories = Object.entries(budgets)
    .filter(([category, budget]) => {
      const spent = categorySpending[category] || 0
      return budget > 0 && spent > budget
    })
    .map(([category, budget]) => ({
      category,
      budget,
      spent: categorySpending[category] || 0,
      percentage: ((categorySpending[category] || 0) / budget) * 100
    }))

  if (overBudgetCategories.length === 0) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <h3 className="text-red-800 font-medium flex items-center gap-2 mb-3">
        <FiAlertCircle className="w-5 h-5" />
        {t('budgetAlerts')}
      </h3>
      <div className="space-y-2">
        {overBudgetCategories.map(({ category, budget, spent, percentage }) => (
          <div key={category} className="text-sm text-red-700">
            {t(category.toLowerCase())}: {t('overBudgetAlert', {
              percentage: Math.round(percentage - 100),
              spent: spent.toFixed(2),
              budget: budget.toFixed(2)
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertsPanel
