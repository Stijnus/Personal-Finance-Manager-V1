import React, { useState, useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import TransactionList from './TransactionList'
import TransactionForm from './TransactionForm'
import DateRangeFilter from './DateRangeFilter'
import Analytics from './Analytics'
import BudgetSummary from './BudgetSummary'
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { FiPieChart, FiBarChart2, FiGlobe, FiPlus } from 'react-icons/fi'

const Dashboard = () => {
  const { transactions = [], t, language, setLanguage, dispatch } = useFinance()
  const [startDate, setStartDate] = useState(startOfMonth(new Date()))
  const [endDate, setEndDate] = useState(endOfMonth(new Date()))
  const [showTransactionForm, setShowTransactionForm] = useState(false)

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'nl', name: 'Nederlands' }
  ]

  const filteredTransactions = useMemo(() => {
    if (!transactions) return []
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      return isWithinInterval(transactionDate, { start: startDate, end: endDate })
    })
  }, [transactions, startDate, endDate])

  const handleDateChange = (start, end) => {
    setStartDate(start)
    setEndDate(end)
  }

  const handleAddTransaction = (transaction) => {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        ...transaction,
        id: Date.now().toString()
      }
    })
    setShowTransactionForm(false)
  }

  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
  }, [filteredTransactions])

  return (
    <div className="p-6 max-w-[95%] mx-auto">
      {/* Header with Language Selector */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowTransactionForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            {t('addTransaction')}
          </button>
          <div className="flex items-center gap-2">
            <FiGlobe className="w-5 h-5 text-gray-600" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="p-2 border rounded-lg"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTransactionForm(false)
            }
          }}
        >
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full mx-4 relative">
            <TransactionForm 
              onSubmit={handleAddTransaction}
              onCancel={() => setShowTransactionForm(false)}
            />
          </div>
        </div>
      )}

      {/* Date Range Filter */}
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
      />

      {/* Analytics Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('analytics')}</h2>
        <Analytics startDate={startDate} endDate={endDate} />
      </div>

      {/* Budget Summary */}
      <BudgetSummary />

      {/* Transaction List */}
      <TransactionList transactions={filteredTransactions} />
    </div>
  )
}

export default Dashboard
