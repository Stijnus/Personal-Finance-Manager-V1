import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";

const BudgetManager = () => {
  const { t, categories = [], budgets = [], dispatch } = useFinance();
  const [newBudget, setNewBudget] = useState({ categoryId: "", amount: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newBudget.categoryId && newBudget.amount) {
      dispatch({
        type: "ADD_BUDGET",
        payload: {
          id: Date.now().toString(),
          categoryId: newBudget.categoryId,
          amount: parseFloat(newBudget.amount)
        }
      });
      setNewBudget({ categoryId: "", amount: "" });
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <select
            value={newBudget.categoryId}
            onChange={(e) => setNewBudget({ ...newBudget, categoryId: e.target.value })}
            className="p-2 border rounded-lg flex-1"
            required
          >
            <option value="">{t('selectCategory')}</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder={t('amount')}
            className="p-2 border rounded-lg w-32"
            value={newBudget.amount}
            onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {t('add')}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {budgets.map((budget) => {
          const category = categories.find(c => c === budget.categoryId);
          return (
            <div key={budget.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <span className="font-medium">{category || t('unknownCategory')}</span>
                <span className="ml-2 text-sm text-gray-600">
                  €{budget.amount.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => dispatch({ type: "DELETE_BUDGET", payload: budget.id })}
                className="text-red-600 hover:text-red-700"
              >
                {t('delete')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetManager;
