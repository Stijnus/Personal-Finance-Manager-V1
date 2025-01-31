import React, { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { countries } from '../config/stores'

const StoreManager = () => {
  const { stores = [], dispatch, t } = useFinance()
  const [newStore, setNewStore] = useState({ name: '', type: '', country: 'BE' })
  const [editingStore, setEditingStore] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const action = editingStore ? 'UPDATE_STORE' : 'ADD_STORE'
    const payload = editingStore 
      ? { id: editingStore.id, ...newStore }
      : { ...newStore, id: Date.now().toString() }

    dispatch({ type: action, payload })
    setNewStore({ name: '', type: '', country: 'BE' })
    setEditingStore(null)
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{t('storeManagement')}</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder={t('storeName')}
            className="p-2 border rounded-lg"
            value={newStore.name}
            onChange={e => setNewStore({...newStore, name: e.target.value})}
            required
          />
          <select
            className="p-2 border rounded-lg"
            value={newStore.type}
            onChange={e => setNewStore({...newStore, type: e.target.value})}
            required
          >
            <option value="">{t('selectType')}</option>
            <option value="supermarket">{t('supermarket')}</option>
            <option value="electronics">{t('electronics')}</option>
            <option value="clothing">{t('clothing')}</option>
          </select>
          <select
            className="p-2 border rounded-lg"
            value={newStore.country}
            onChange={e => setNewStore({...newStore, country: e.target.value})}
            required
          >
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          {editingStore && (
            <button
              type="button"
              onClick={() => {
                setEditingStore(null)
                setNewStore({ name: '', type: '', country: 'BE' })
              }}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              {t('cancel')}
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editingStore ? t('update') : t('add')}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {stores.map(store => (
          <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium">{store.name}</p>
              <p className="text-sm text-gray-600">
                {t(store.type)} • 
                {countries.find(c => c.code === store.country)?.name}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingStore(store)
                  setNewStore(store)
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                {t('edit')}
              </button>
              <button
                onClick={() => dispatch({ type: 'DELETE_STORE', payload: store.id })}
                className="text-red-600 hover:text-red-700"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StoreManager
