import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { translations } from '../translations'
import { addDays, addWeeks, addMonths, addYears, parseISO } from 'date-fns'
import toast from 'react-hot-toast'

const FinanceContext = createContext()

// Helper function to save state to localStorage
const saveToLocalStorage = (key, value) => {
  try {
    console.log(`Saving ${key} to localStorage:`, value)
    localStorage.setItem(key, JSON.stringify(value))
    toast.success(`${key} saved successfully`)
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
    toast.error(`Error saving ${key}`)
  }
}

// Helper function to save state to localStorage without notifications
const saveToLocalStorageQuiet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

// Helper function to load state from localStorage
const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key)
    console.log(`Loading ${key} from localStorage:`, saved)
    if (saved === null) return defaultValue
    // Handle string values like 'en' and 'USD'
    if (typeof defaultValue === 'string') {
      return saved
    }
    return JSON.parse(saved)
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    toast.error(`Error loading ${key}`)
    return defaultValue
  }
}

const defaultState = {
  transactions: [],
  transactionTemplates: [],
  recurringTransactions: [],
  categories: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other'],
  stores: [
    { id: 'store-1', name: 'Colruyt', type: 'Supermarket', country: 'BE' },
    { id: 'store-2', name: 'Delhaize', type: 'Supermarket', country: 'BE' },
    { id: 'store-3', name: 'Carrefour', type: 'Supermarket', country: 'BE' },
    { id: 'store-4', name: 'Aldi', type: 'DiscountStore', country: 'BE' },
    { id: 'store-5', name: 'Lidl', type: 'DiscountStore', country: 'BE' },
    { id: 'store-6', name: 'MediaMarkt', type: 'Electronics', country: 'BE' },
    { id: 'store-7', name: 'Kruidvat', type: 'Drugstore', country: 'BE' }
  ],
  users: [
    { id: 'user-1', name: 'Admin', role: 'admin' },
    { id: 'user-2', name: 'User', role: 'user' }
  ],
  budgets: [],
  language: 'en',
  defaultCurrency: 'EUR',
  currencies: {
    EUR: { symbol: '€', rate: 1 },
    USD: { symbol: '$', rate: 1.08 },
    GBP: { symbol: '£', rate: 0.85 }
  }
}

// Load initial state from localStorage
const loadInitialState = () => {
  const state = {
    transactions: loadFromLocalStorage('transactions', defaultState.transactions),
    transactionTemplates: loadFromLocalStorage('transactionTemplates', defaultState.transactionTemplates),
    recurringTransactions: loadFromLocalStorage('recurringTransactions', defaultState.recurringTransactions),
    categories: loadFromLocalStorage('categories', defaultState.categories),
    stores: loadFromLocalStorage('stores', defaultState.stores),
    users: loadFromLocalStorage('users', defaultState.users),
    budgets: loadFromLocalStorage('budgets', defaultState.budgets),
    language: loadFromLocalStorage('language', defaultState.language),
    defaultCurrency: loadFromLocalStorage('defaultCurrency', defaultState.defaultCurrency),
    currencies: defaultState.currencies
  }
  console.log('Loaded initial state:', state)
  return state
}

const reducer = (state, action) => {
  console.log('Reducer action:', action.type, action.payload)
  let newState = state

  switch (action.type) {
    case 'RESET_TO_DEFAULTS': {
      console.log('Reducer: Handling RESET_TO_DEFAULTS')
      console.log('Payload:', action.payload)
      return action.payload
    }

    case 'RESET_CATEGORIES':
      newState = { ...state, categories: defaultState.categories }
      saveToLocalStorage('categories', defaultState.categories)
      toast.success(t('categoriesReset'))
      return newState;

    case 'RESET_TRANSACTIONS':
      newState = { ...state, transactions: [] }
      saveToLocalStorage('transactions', [])
      toast.success(t('transactionsReset'))
      return newState;

    case 'ADD_STORE': {
      const newStore = {
        id: `store-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: action.payload.name,
        type: action.payload.type || 'Other',
        country: action.payload.country || 'BE'
      }
      newState = {
        ...state,
        stores: [...state.stores, newStore]
      }
      saveToLocalStorage('stores', newState.stores)
      return newState
    }

    case 'UPDATE_STORE': {
      const updatedStores = state.stores.map(store =>
        store.id === action.payload.id
          ? {
              ...store,
              name: action.payload.name,
              type: action.payload.type,
              country: action.payload.country
            }
          : store
      )
      newState = {
        ...state,
        stores: updatedStores
      }
      saveToLocalStorage('stores', updatedStores)
      return newState
    }

    case 'DELETE_STORE': {
      const filteredStores = state.stores.filter(store => store.id !== action.payload)
      newState = {
        ...state,
        stores: filteredStores
      }
      saveToLocalStorage('stores', filteredStores)
      return newState
    }

    case 'ADD_TRANSACTION': {
      const newTransaction = {
        id: action.payload.id || `tx-${Date.now()}`,
        ...action.payload,
        date: new Date(action.payload.date || Date.now()).toISOString()
      }
      newState = {
        ...state,
        transactions: [...state.transactions, newTransaction]
      }
      saveToLocalStorage('transactions', newState.transactions)
      return newState
    }

    case 'UPDATE_TRANSACTION': {
      const updatedTransactions = state.transactions.map(tx =>
        tx.id === action.payload.id ? { ...action.payload } : tx
      )
      newState = {
        ...state,
        transactions: updatedTransactions
      }
      saveToLocalStorage('transactions', updatedTransactions)
      return newState
    }

    case 'DELETE_TRANSACTION': {
      const filteredTransactions = state.transactions.filter(tx => tx.id !== action.payload)
      newState = {
        ...state,
        transactions: filteredTransactions
      }
      saveToLocalStorage('transactions', filteredTransactions)
      return newState
    }

    case 'ADD_TRANSACTION_TEMPLATE': {
      const newTemplate = {
        id: action.payload.id || `template-${Date.now()}`,
        ...action.payload
      }
      newState = {
        ...state,
        transactionTemplates: [...state.transactionTemplates, newTemplate]
      }
      saveToLocalStorage('transactionTemplates', newState.transactionTemplates)
      return newState
    }

    case 'DELETE_TRANSACTION_TEMPLATE': {
      const filteredTemplates = state.transactionTemplates.filter(template => template.id !== action.payload)
      newState = {
        ...state,
        transactionTemplates: filteredTemplates
      }
      saveToLocalStorage('transactionTemplates', filteredTemplates)
      return newState
    }

    case 'ADD_RECURRING_TRANSACTION': {
      const newRecurring = {
        id: action.payload.id || `recurring-${Date.now()}`,
        ...action.payload,
        nextDate: new Date(action.payload.nextDate || Date.now()).toISOString()
      }
      newState = {
        ...state,
        recurringTransactions: [...state.recurringTransactions, newRecurring]
      }
      saveToLocalStorage('recurringTransactions', newState.recurringTransactions)
      return newState
    }

    case 'DELETE_RECURRING_TRANSACTION': {
      const filteredRecurring = state.recurringTransactions.filter(recurring => recurring.id !== action.payload)
      newState = {
        ...state,
        recurringTransactions: filteredRecurring
      }
      saveToLocalStorage('recurringTransactions', filteredRecurring)
      return newState
    }

    case 'ADD_USER': {
      const newUser = {
        id: action.payload.id || `user-${Date.now()}`,
        name: action.payload.name,
        role: action.payload.role || 'user'
      }
      newState = {
        ...state,
        users: [...state.users, newUser]
      }
      saveToLocalStorage('users', newState.users)
      return newState
    }

    case 'DELETE_USER': {
      const filteredUsers = state.users.filter(user => user.id !== action.payload)
      newState = {
        ...state,
        users: filteredUsers
      }
      saveToLocalStorage('users', filteredUsers)
      return newState
    }

    case 'ADD_BUDGET': {
      const newBudget = {
        id: action.payload.id || `budget-${Date.now()}`,
        categoryId: action.payload.categoryId,
        amount: action.payload.amount
      }
      newState = {
        ...state,
        budgets: [...state.budgets, newBudget]
      }
      saveToLocalStorage('budgets', newState.budgets)
      return newState
    }

    case 'DELETE_BUDGET': {
      const filteredBudgets = state.budgets.filter(budget => budget.id !== action.payload)
      newState = {
        ...state,
        budgets: filteredBudgets
      }
      saveToLocalStorage('budgets', filteredBudgets)
      return newState
    }

    case 'UPDATE_BUDGETS': {
      newState = {
        ...state,
        budgets: action.payload
      }
      saveToLocalStorage('budgets', action.payload)
      return newState
    }

    case 'ADD_CATEGORY': {
      if (!state.categories.includes(action.payload)) {
        newState = {
          ...state,
          categories: [...state.categories, action.payload]
        }
        saveToLocalStorage('categories', newState.categories)
      }
      return newState
    }

    case 'DELETE_CATEGORY': {
      newState = {
        ...state,
        categories: state.categories.filter(category => category !== action.payload)
      }
      saveToLocalStorage('categories', newState.categories)
      return newState
    }

    case 'SET_LANGUAGE': {
      const newLanguage = action.payload;
      // Save to localStorage
      localStorage.setItem('language', newLanguage);
      // Update state
      return {
        ...state,
        language: newLanguage
      };
    }

    case 'SET_DEFAULT_CURRENCY': {
      newState = {
        ...state,
        defaultCurrency: action.payload
      }
      saveToLocalStorage('defaultCurrency', action.payload)
      return newState
    }

    case 'RESTORE_BACKUP': {
      newState = action.payload
      Object.keys(newState).forEach(key => {
        saveToLocalStorage(key, newState[key])
      })
      return newState
    }

    default:
      return state
  }
}

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, loadInitialState())

  const resetToDefaults = async () => {
    try {
      // 1. Clear all localStorage first
      localStorage.clear(); // This ensures we remove ANY old data

      // 2. Create fresh state with defaults (deep clone to ensure clean state)
      const resetState = JSON.parse(JSON.stringify(defaultState));

      // 3. Save default values to localStorage
      for (const [key, value] of Object.entries(resetState)) {
        if (key !== 'currencies') { // Don't save static values
          localStorage.setItem(key, JSON.stringify(value));
        }
      }

      // 4. Update application state
      dispatch({ type: 'RESET_TO_DEFAULTS', payload: resetState });

      // 5. Show success message
      toast.success(t('allSettingsReset'));

      return true;
    } catch (error) {
      console.error('Reset failed:', error);
      toast.error(t('resetError'));
      return false;
    }
  }

  const backupData = () => {
    const backup = {
      version: 1.0,
      date: new Date().toISOString(),
      data: state
    }
    const blob = new Blob([JSON.stringify(backup)], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finance-backup-${new Date().toISOString()}.json`
    a.click()
    toast.success(t('backupSuccess'))
  };

  const restoreData = (backup) => {
    if (backup?.version !== 1.0) {
      toast.error(t('invalidBackup'))
      return
    }
    dispatch({ type: 'RESTORE_BACKUP', payload: backup.data })
    toast.success(t('restoreSuccess'))
  };

  // Translation helper
  const t = (key) => {
    return translations[state.language]?.[key] || key
  }

  // Format amount helper
  const formatAmount = (amount, currency = state.defaultCurrency) => {
    const currencyInfo = state.currencies[currency]
    if (!currencyInfo) return `${amount}`
    
    const formattedAmount = new Intl.NumberFormat(state.language, {
      style: 'currency',
      currency: currency
    }).format(amount)
    
    return formattedAmount
  }

  const setLanguage = (newLanguage) => {
    dispatch({ type: 'SET_LANGUAGE', payload: newLanguage });
  };

  const value = {
    ...state,
    dispatch,
    resetToDefaults,
    backupData,
    restoreData,
    setLanguage,
    t,
    formatAmount
  }

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
