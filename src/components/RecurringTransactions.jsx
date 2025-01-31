import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const RecurringTransactions = () => {
  const { t, categories = [], stores = [], dispatch } = useFinance();
  const [newRecurring, setNewRecurring] = useState({
    name: '',
    amount: '',
    category: '',
    store: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newRecurring.name && newRecurring.amount) {
      dispatch({
        type: 'ADD_RECURRING_TRANSACTION',
        payload: {
          id: Date.now().toString(),
          ...newRecurring,
          amount: parseFloat(newRecurring.amount)
        }
      });
      setNewRecurring({
        name: '',
        amount: '',
        category: '',
        store: '',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">{t('recurringTransactions')}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={t('transactionName')}
            className="p-2 border rounded-lg"
            value={newRecurring.name}
            onChange={(e) => setNewRecurring({ ...newRecurring, name: e.target.value })}
            required
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder={t('amount')}
            className="p-2 border rounded-lg"
            value={newRecurring.amount}
            onChange={(e) => setNewRecurring({ ...newRecurring, amount: e.target.value })}
            required
          />
          <select
            value={newRecurring.category}
            onChange={(e) => setNewRecurring({ ...newRecurring, category: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="">{t('selectCategory')}</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={newRecurring.store}
            onChange={(e) => setNewRecurring({ ...newRecurring, store: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="">{t('selectStore')}</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
          <select
            value={newRecurring.frequency}
            onChange={(e) => setNewRecurring({ ...newRecurring, frequency: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="daily">{t('daily')}</option>
            <option value="weekly">{t('weekly')}</option>
            <option value="monthly">{t('monthly')}</option>
            <option value="yearly">{t('yearly')}</option>
          </select>
          <input
            type="date"
            value={newRecurring.startDate}
            onChange={(e) => setNewRecurring({ ...newRecurring, startDate: e.target.value })}
            className="p-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {t('saveRecurring')}
        </button>
      </form>
    </div>
  );
};

export default RecurringTransactions;
