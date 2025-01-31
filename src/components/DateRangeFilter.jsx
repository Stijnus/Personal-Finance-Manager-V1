import React from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { FiCalendar, FiClock } from 'react-icons/fi'
import { startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from 'date-fns'
import { useFinance } from '../context/FinanceContext'

const DateRangeFilter = ({ startDate, endDate, onDateChange }) => {
  const { t } = useFinance()

  const datePresets = [
    {
      label: t('thisMonth'),
      range: () => ({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date())
      })
    },
    {
      label: t('lastMonth'),
      range: () => {
        const lastMonth = subMonths(new Date(), 1)
        return {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth)
        }
      }
    },
    {
      label: t('last3Months'),
      range: () => ({
        start: startOfMonth(subMonths(new Date(), 2)),
        end: endOfMonth(new Date())
      })
    },
    {
      label: t('thisYear'),
      range: () => ({
        start: startOfYear(new Date()),
        end: endOfYear(new Date())
      })
    }
  ]

  const handlePresetClick = (preset) => {
    const { start, end } = preset.range()
    onDateChange(start, end)
  }

  return (
    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
        <FiClock className="w-5 h-5" />
        {t('dateRange')}
      </h3>
      
      <div className="flex flex-wrap gap-4 mb-4">
        {datePresets.map((preset, index) => (
          <button
            key={index}
            onClick={() => handlePresetClick(preset)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">{t('startDate')}</label>
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={date => onDateChange(date, endDate)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="w-full p-2 border rounded-lg"
              dateFormat="yyyy-MM-dd"
            />
            <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">{t('endDate')}</label>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={date => onDateChange(startDate, date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="w-full p-2 border rounded-lg"
              dateFormat="yyyy-MM-dd"
            />
            <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DateRangeFilter
