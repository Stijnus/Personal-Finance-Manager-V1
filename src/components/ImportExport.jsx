import React, { useRef } from 'react'
import { useFinance } from '../context/FinanceContext'
import Papa from 'papaparse'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { format } from 'date-fns'
import { FiDownload, FiUpload, FiFileText } from 'react-icons/fi'

const ImportExport = () => {
  const { transactions, dispatch, t } = useFinance()
  const fileInputRef = useRef()

  const handleImportCSV = (event) => {
    const file = event.target.files[0]
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const importedTransactions = results.data
            .filter(row => row.length >= 4) // Ensure row has minimum required fields
            .map(row => ({
              id: Date.now().toString() + Math.random(),
              date: row[0],
              description: row[1],
              amount: parseFloat(row[2]),
              category: row[3],
              store: row[4] || '',
              notes: row[5] || ''
            }))

          importedTransactions.forEach(transaction => {
            dispatch({
              type: 'ADD_TRANSACTION',
              payload: transaction
            })
          })

          // Reset file input
          event.target.value = null
        },
        header: false
      })
    }
  }

  const exportToCSV = () => {
    const csv = Papa.unparse(
      transactions.map(t => [
        format(new Date(t.date), 'yyyy-MM-dd'),
        t.description,
        t.amount,
        t.category,
        t.store,
        t.notes || ''
      ])
    )

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Configure font
    doc.setFont('helvetica')
    
    // Add title
    doc.setFontSize(18)
    doc.text(t('transactionHistory'), 14, 22)

    // Add date
    doc.setFontSize(11)
    doc.text(
      format(new Date(), 'PPP'),
      doc.internal.pageSize.width - 14,
      22,
      { align: 'right' }
    )

    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )

    // Prepare table data
    const tableData = sortedTransactions.map(t => [
      format(new Date(t.date), 'PP'),
      t.description,
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD'
      }).format(t.amount),
      t(t.category.toLowerCase()),
      t.store || '',
      t.notes || ''
    ])

    // Configure table
    doc.autoTable({
      head: [[
        t('date'),
        t('description'),
        t('amount'),
        t('category'),
        t('store'),
        t('notes')
      ]],
      body: tableData,
      startY: 30,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        font: 'helvetica'
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Date
        1: { cellWidth: 40 }, // Description
        2: { cellWidth: 25 }, // Amount
        3: { cellWidth: 30 }, // Category
        4: { cellWidth: 30 }, // Store
        5: { cellWidth: 'auto' }  // Notes
      },
      headStyles: {
        fillColor: [51, 122, 183],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 30 },
      theme: 'grid'
    })

    // Save PDF
    doc.save(`transactions_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <FiFileText className="w-6 h-6" />
        {t('importExport')}
      </h2>

      <div className="space-y-4">
        {/* Import Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">{t('importTransactions')}</h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('importInstructions')}
          </p>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FiUpload className="w-4 h-4" />
            {t('importCSV')}
          </button>
        </div>

        {/* Export Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">{t('exportTransactions')}</h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('exportInstructions')}
          </p>
          <div className="flex gap-4">
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              {t('exportCSV')}
            </button>
            <button
              onClick={exportToPDF}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              {t('exportPDF')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportExport
