// src/components/SettingsPage.jsx
import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { FiSettings, FiX, FiTrash2 } from "react-icons/fi";
import CategoryManager from "./CategoryManager";
import BudgetManager from "./BudgetManager";
import StoreManager from "./StoreManager";
import RecurringTransactions from "./RecurringTransactions";
import TransactionTemplates from "./TransactionTemplates";
import ImportExport from "./ImportExport";
import UserManager from "./UserManager";
import Tabs from "./Tabs";
import toast from 'react-hot-toast';

const SettingsPage = ({ onClose }) => {
  const { t, resetToDefaults, restoreData, handleBackup } = useFinance();
  const [resetting, setResetting] = useState(false);

  const handleClearAll = async () => {
    if (resetting) return; // Prevent multiple clicks
    
    if (window.confirm(t("clearAllSettingsConfirm"))) {
      setResetting(true);
      
      try {
        const success = await resetToDefaults();
        if (success) {
          // Reload the page to ensure clean state
          window.location.reload();
        }
      } catch (error) {
        console.error('Reset failed:', error);
        toast.error(t("resetError"));
        setResetting(false);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const backup = JSON.parse(event.target.result)
          restoreData(backup)
        } catch (error) {
          toast.error(t('invalidBackupFile'))
        }
      }
      reader.readAsText(file)
    }
  };

  const tabs = [
    { label: t("categories"), content: <CategoryManager /> },
    { label: t("budgets"), content: <BudgetManager /> },
    { label: t("stores"), content: <StoreManager /> },
    { label: t("users"), content: <UserManager /> },
    { label: t("recurringTransactions"), content: <RecurringTransactions /> },
    { label: t("transactionTemplates"), content: <TransactionTemplates /> },
    { label: t("importExport"), content: <ImportExport /> },
    { label: t('system'), content: (
      <div className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{t('dangerZone')}</h3>
          <button onClick={handleBackup} className="bg-blue-500 text-white px-4 py-2 rounded">
            {t('createBackup')}
          </button>
          <input type="file" onChange={handleFileUpload} className="ml-4" />
        </div>
      </div>
    )},
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-8 border w-3/4 shadow-lg rounded-md bg-white max-w-[95%]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          <FiX />
        </button>

        <button
          onClick={handleClearAll}
          disabled={resetting}
          className={`absolute top-2 right-12 ${
            resetting ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-700'
          } text-white font-bold py-1 px-2 rounded flex items-center gap-1`}
        >
          {resetting ? (
            <>
              <span className="animate-spin">⟳</span>
              {t("resetting")}
            </>
          ) : (
            <>
              <FiTrash2 />
              {t("clearAll")}
            </>
          )}
        </button>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FiSettings className="w-6 h-6" />
          {t("settings")}
        </h2>

        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};

export default SettingsPage;
