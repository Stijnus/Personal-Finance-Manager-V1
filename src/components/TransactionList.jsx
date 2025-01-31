import React, { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { format } from 'date-fns'
import { FiEdit2, FiTrash2, FiImage, FiList, FiSearch, FiPaperclip } from 'react-icons/fi'
import TransactionForm from './TransactionForm'
import ReceiptUpload from './ReceiptUpload'
import ReceiptViewer from './ReceiptViewer'
import Tooltip from './Tooltip'

const TransactionList = () => {
  const { transactions = [], receipts = {}, dispatch, formatAmount, t, users = [], stores = [] } = useFinance()
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [viewingReceipt, setViewingReceipt] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const getStoreName = (storeId) => {
    const store = stores.find(s => s.id === storeId)
    return store ? store.name : ''
  }

  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase()
    const userInfo = users.find(u => u.id === transaction.user)?.name || ''
    return (
      transaction.description?.toLowerCase().includes(searchLower) ||
      transaction.category?.toLowerCase().includes(searchLower) ||
      getStoreName(transaction.store).toLowerCase().includes(searchLower) ||
      userInfo.toLowerCase().includes(searchLower) ||
      (transaction.amount?.toString().includes(searchLower))
    )
  })

  const handleDelete = (id) => {
    if (window.confirm(t('confirmDelete'))) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id })
    }
  }

  const handleUpdateTransaction = (updatedTransaction) => {
    dispatch({
      type: 'UPDATE_TRANSACTION',
      payload: updatedTransaction
    })
    setEditingTransaction(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FiList className="w-6 h-6" />
            {t('transactions')}
          </h2>
          <div className="relative w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search')}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('date')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('description')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('amount')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('category')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('store')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('user')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm ? t('noSearchResults') : t('noTransactions')}
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(transaction.date), 'PP')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      {receipts && receipts[transaction.id] && (
                        <Tooltip content={t('hasReceipt')}>
                          <FiPaperclip className="w-4 h-4 text-green-600" />
                        </Tooltip>
                      )}
                      {transaction.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatAmount(transaction.amount || 0)}
                      {transaction.originalCurrency && transaction.originalAmount && transaction.originalAmount !== transaction.amount && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {formatAmount(transaction.originalAmount || 0, transaction.originalCurrency)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t(transaction.category.toLowerCase())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStoreName(transaction.store)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {users.find(u => u.id === transaction.user)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <Tooltip content={t('edit')}>
                      <button
                        onClick={() => setEditingTransaction(transaction)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    <Tooltip content={t('delete')}>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    {receipts && receipts[transaction.id] ? (
                      <Tooltip content={t('viewReceipt')}>
                        <button
                          onClick={() => setViewingReceipt(transaction.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FiImage className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    ) : (
                      <ReceiptUpload
                        transactionId={transaction.id}
                        onComplete={(data) => {
                          if (data.amount || data.description) {
                            dispatch({
                              type: 'UPDATE_TRANSACTION',
                              payload: {
                                ...transaction,
                                amount: data.amount || transaction.amount,
                                description: data.description || transaction.description
                              }
                            })
                          }
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full mx-4">
            <TransactionForm
              transaction={editingTransaction}
              onSubmit={handleUpdateTransaction}
              onCancel={() => setEditingTransaction(null)}
            />
          </div>
        </div>
      )}

      {viewingReceipt && (
        <ReceiptViewer
          transactionId={viewingReceipt}
          onClose={() => setViewingReceipt(null)}
        />
      )}
    </div>
  )
}

export default TransactionList
