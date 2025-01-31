import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { useFinance } from '../context/FinanceContext'
import { format, isWithinInterval } from 'date-fns'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

const Analytics = ({ startDate, endDate }) => {
  const { transactions = [], t } = useFinance()

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      return isWithinInterval(transactionDate, { start: startDate, end: endDate })
    })
  }, [transactions, startDate, endDate])

  // Category-wise spending breakdown
  const categoryData = useMemo(() => {
    const data = {}
    filteredTransactions.forEach(transaction => {
      const translatedCategory = t(transaction.category.toLowerCase())
      data[translatedCategory] = (data[translatedCategory] || 0) + transaction.amount
    })
    return {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6B6B',
          '#4ECDC4',
          '#45B7D1',
          '#96CEB4',
          '#FFEEAD',
          '#D4A5A5',
          '#9B59B6',
          '#3498DB',
          '#E67E22',
          '#95A5A6'
        ]
      }]
    }
  }, [filteredTransactions, t])

  // Monthly spending trends
  const monthlyData = useMemo(() => {
    const data = {}
    filteredTransactions.forEach(transaction => {
      const month = format(new Date(transaction.date), 'MMMM yyyy')
      data[month] = (data[month] || 0) + transaction.amount
    })
    return {
      labels: Object.keys(data),
      datasets: [{
        label: t('monthlySpending'),
        data: Object.values(data),
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4
      }]
    }
  }, [filteredTransactions, t])

  // Store-wise spending analysis
  const storeData = useMemo(() => {
    const data = {}
    filteredTransactions.forEach(transaction => {
      data[transaction.store] = (data[transaction.store] || 0) + transaction.amount
    })
    const sortedData = Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {})
    
    return {
      labels: Object.keys(sortedData),
      datasets: [{
        label: t('storeSpending'),
        data: Object.values(sortedData),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    }
  }, [filteredTransactions, t])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.raw)
            }
            return label
          }
        }
      }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category-wise Spending */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-medium mb-4">{t('categorySpending')}</h3>
        <div className="h-64">
          <Doughnut data={categoryData} options={options} />
        </div>
      </div>

      {/* Monthly Spending Trends */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-medium mb-4">{t('monthlyTrends')}</h3>
        <div className="h-64">
          <Line data={monthlyData} options={options} />
        </div>
      </div>

      {/* Top 5 Stores by Spending */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-medium mb-4">{t('topStores')}</h3>
        <div className="h-64">
          <Bar data={storeData} options={options} />
        </div>
      </div>

      {/* Budget vs Actual */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-medium mb-4">{t('budgetVsActual')}</h3>
        <div className="text-gray-500 text-center h-64 flex items-center justify-center">
          {t('comingSoon')}
        </div>
      </div>
    </div>
  )
}

export default Analytics
