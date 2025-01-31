import React from 'react'
import { useFinance } from '../context/FinanceContext'
import { startOfMonth, endOfMonth } from 'date-fns'

const BudgetSummary = () => {
  const { transactions = [], budgets = {}, categories, t, formatAmount } = useFinance()

  // Get current month's date range
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  // Calculate spending for each category
  const categorySpending = transactions
    .filter(transaction => {
      const date = new Date(transaction.date)
      return (
        date >= monthStart &&
        date <= monthEnd
      )
    })
    .reduce((acc, transaction) => {
      // Only count expenses (positive amounts in the UI are stored as negative in state)
      if (transaction.amount > 0) {
        const category = transaction.category
        acc[category] = (acc[category] || 0) + transaction.amount
      }
      return acc
    }, {})

  // Calculate totals
  const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + (budget || 0), 0)
  const totalSpent = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0)
  const totalRemaining = totalBudget - totalSpent

  // Get categories with budgets
  const categoriesWithBudgets = categories.filter(cat => budgets[cat] > 0)

  if (categoriesWithBudgets.length === 0) return null

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{t('monthlyBudget')}</h2>
      
      {/* Overall summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <div>
          <div className="text-sm text-gray-500">{t('totalBudget')}</div>
          <div className="text-lg font-semibold">{formatAmount(totalBudget)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">{t('totalSpent')}</div>
          <div className="text-lg font-semibold">{formatAmount(totalSpent)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">{t('remaining')}</div>
          <div className={`text-lg font-semibold ${totalRemaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatAmount(totalRemaining)}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="space-y-4">
        {categoriesWithBudgets.map(category => {
          const budget = budgets[category] || 0
          const spent = categorySpending[category] || 0
          const remaining = budget - spent
          const percentage = budget > 0 ? (spent / budget) * 100 : 0

          return (
            <div key={category} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{t(category.toLowerCase())}</span>
                <span className={remaining < 0 ? 'text-red-600' : 'text-green-600'}>
                  {formatAmount(remaining)} {t('remaining')}
                </span>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-gray-600">
                      {formatAmount(spent)} / {formatAmount(budget)}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                      percentage > 100 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BudgetSummary
