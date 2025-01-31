import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const TransactionForm = ({ onSubmit, initialData = null }) => {
  const { t, categories = [], stores = [], users = [] } = useFinance();
  const [transaction, setTransaction] = useState(
    initialData || {
      description: '',
      amount: '',
      category: '',
      store: '',
      user: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (transaction.amount) {  
      onSubmit({
        ...transaction,
        amount: parseFloat(transaction.amount)
      });
      if (!initialData) {
        setTransaction({
          description: '',
          amount: '',
          category: '',
          store: '',
          user: '',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('description')}</label>
          <input
            type="text"
            value={transaction.description}
            onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
            className="w-full p-2 border rounded-lg"
            placeholder={t('optionalDescription')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('amount')}</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={transaction.amount}
            onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('category')}</label>
          <select
            value={transaction.category}
            onChange={(e) => setTransaction({ ...transaction, category: e.target.value })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">{t('selectCategory')}</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('store')}</label>
          <select
            value={transaction.store}
            onChange={(e) => setTransaction({ ...transaction, store: e.target.value })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">{t('selectStore')}</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('user')}</label>
          <select
            value={transaction.user}
            onChange={(e) => setTransaction({ ...transaction, user: e.target.value })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">{t('selectUser')}</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('date')}</label>
          <input
            type="date"
            value={transaction.date}
            onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t('notes')}</label>
        <textarea
          value={transaction.notes}
          onChange={(e) => setTransaction({ ...transaction, notes: e.target.value })}
          className="w-full p-2 border rounded-lg"
          rows="3"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {initialData ? t('update') : t('add')}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
