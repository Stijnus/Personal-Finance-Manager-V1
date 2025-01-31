import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const CategoryManager = () => {
  const { t, categories = [], dispatch } = useFinance();
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      dispatch({
        type: 'ADD_CATEGORY',
        payload: newCategory.trim()
      });
      setNewCategory('');
    }
  };

  const handleDelete = (category) => {
    if (window.confirm(t('confirmDeleteCategory'))) {
      dispatch({
        type: 'DELETE_CATEGORY',
        payload: category
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">{t('categories')}</h3>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder={t('newCategory')}
          className="p-2 border rounded-lg flex-1"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {t('add')}
        </button>
      </form>

      <div className="space-y-2">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <span>{category}</span>
            <button
              onClick={() => handleDelete(category)}
              className="text-red-600 hover:text-red-700"
            >
              {t('delete')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
