import React from 'react'
import { useFinance } from '../context/FinanceContext'
import { startOfMonth, endOfMonth } from 'date-fns'
import { formatAmount } from '../utils/formatAmount'

const BudgetProgress = ({ category }) => {
  const { transactions = [], budgets, t, formatAmount } = useFinance()
  
  // Get current month's date range
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  
  // Calculate total spent for current month
  const spent = transactions
    .filter(transaction => {
      const date = new Date(transaction.date)
      return (
        transaction.category === category &&
        date >= monthStart &&
        date <= monthEnd &&
        transaction.amount > 0 // Expenses are stored as positive amounts
      )
    })
    .reduce((total, transaction) => total + transaction.amount, 0)

  const budget = budgets[category] || 0
  const percentage = budget > 0 ? (spent / budget) * 100 : 0
  const isOverBudget = percentage > 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{t('spent')}: {formatAmount(spent)}</span>
        <span>{t('budget')}: {formatAmount(budget)}</span>
      </div>
      
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              {Math.round(percentage)}%
            </span>
          </div>
          {isOverBudget && (
            <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
              {t('overBudget')} (+{Math.round(percentage - 100)}%)
            </div>
          )}
        </div>
        
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${Math.min(percentage, 100)}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
              isOverBudget ? 'bg-red-500' : 'bg-blue-500'
            }`}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default BudgetProgress
