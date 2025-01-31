import React, { useState } from 'react'
import { FinanceProvider } from './context/FinanceContext'
import { Toaster } from 'react-hot-toast'
import Dashboard from './components/Dashboard'
import SettingsPage from './components/SettingsPage'
import AlertsPanel from './components/AlertsPanel'
import { FiSettings } from 'react-icons/fi'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <FinanceProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Personal Finance Manager</h1>
              <button
                onClick={() => setShowSettings(true)}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FiSettings className="w-5 h-5" />
                Settings
              </button>
            </div>
            
            <Dashboard />
            <div className="mt-8">
              <AlertsPanel />
            </div>
            
            {showSettings && (
              <ErrorBoundary>
                <SettingsPage onClose={() => setShowSettings(false)} />
              </ErrorBoundary>
            )}
          </div>

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'white',
                },
              },
            }}
          />
        </div>
      </ErrorBoundary>
    </FinanceProvider>
  )
}

export default App
