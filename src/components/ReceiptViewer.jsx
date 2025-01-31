import React from 'react'
import { useFinance } from '../context/FinanceContext'
import { FiX, FiTrash2 } from 'react-icons/fi'
import Tooltip from './Tooltip'

const ReceiptViewer = ({ transactionId, onClose }) => {
  const { receipts, dispatch, t } = useFinance()
  const receipt = receipts[transactionId]

  const handleDelete = () => {
    if (window.confirm(t('confirmDeleteReceipt'))) {
      dispatch({
        type: 'DELETE_RECEIPT',
        payload: transactionId
      })
      onClose()
    }
  }

  if (!receipt) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">{t('receipt')}</h3>
          <div className="flex items-center gap-2">
            <Tooltip content={t('deleteReceipt')}>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-900 p-1"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </Tooltip>
            <Tooltip content={t('close')}>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 p-1"
              >
                <FiX className="w-5 h-5" />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="p-4 flex-1 overflow-auto">
          <div className="flex justify-center min-h-full">
            <img
              src={receipt}
              alt={t('receipt')}
              className="max-w-full h-auto object-contain"
              style={{ maxHeight: 'calc(90vh - 8rem)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReceiptViewer
