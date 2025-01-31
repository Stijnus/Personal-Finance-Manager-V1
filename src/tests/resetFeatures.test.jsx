import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FinanceProvider } from '../context/FinanceContext';
import SettingsPage from '../components/SettingsPage';

describe('Reset Functionality', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key],
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; }
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  test('Full reset restores default categories', async () => {
    // Set test data
    localStorage.setItem('categories', JSON.stringify(['Test Category']));
    
    render(
      <FinanceProvider>
        <SettingsPage />
      </FinanceProvider>
    );

    // Execute reset
    await userEvent.click(screen.getByText(/Clear All/i));
    
    // Verify defaults
    expect(JSON.parse(localStorage.getItem('categories'))).toEqual(
      ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other']
    );
  });
});
