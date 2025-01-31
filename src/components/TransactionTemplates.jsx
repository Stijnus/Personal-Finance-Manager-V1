import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { FiPlus, FiEdit2, FiTrash2, FiCopy } from 'react-icons/fi';

const TransactionTemplates = () => {
  const { t, categories = [], stores = [], dispatch, transactionTemplates } = useFinance();
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    amount: '',
    category: '',
    store: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTemplate.name && newTemplate.amount) {
      dispatch({
        type: 'ADD_TRANSACTION_TEMPLATE',
        payload: {
          id: Date.now().toString(),
          ...newTemplate,
          amount: parseFloat(newTemplate.amount)
        }
      });
      setNewTemplate({ name: '', amount: '', category: '', store: '' });
    }
  };

  const handleEdit = (template) => {
    setNewTemplate({
      name: template.description,
      amount: template.amount,
      category: template.category,
      store: template.store
    });
  };

  const handleDelete = (id) => {
    if (window.confirm(t('confirmDeleteTemplate'))) {
      dispatch({
        type: 'DELETE_TRANSACTION_TEMPLATE',
        payload: id
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FiCopy className="w-6 h-6" />
          {t('transactionTemplates')}
        </h2>
        <button
          onClick={() => setNewTemplate({ name: '', amount: '', category: '', store: '' })}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          {t('addTemplate')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={t('templateName')}
            className="w-full p-2 border rounded-lg"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            required
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder={t('amount')}
            className="w-full p-2 border rounded-lg"
            value={newTemplate.amount}
            onChange={(e) => setNewTemplate({ ...newTemplate, amount: e.target.value })}
            required
          />
          <select
            value={newTemplate.category}
            onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">{t('selectCategory')}</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={newTemplate.store}
            onChange={(e) => setNewTemplate({ ...newTemplate, store: e.target.value })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">{t('selectStore')}</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {t('saveTemplate')}
        </button>
      </form>

      <div className="space-y-4">
        {transactionTemplates.map(template => (
          <div
            key={template.id}
            className="border rounded-lg p-4 hover:bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{template.description}</h3>
                <p className="text-sm text-gray-600">
                  {t('amount')}: {template.amount}
                </p>
                <p className="text-sm text-gray-600">
                  {t('category')}: {t(template.category.toLowerCase())}
                </p>
                <p className="text-sm text-gray-600">
                  {t('store')}: {template.store}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(template)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionTemplates;
