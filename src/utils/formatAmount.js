export const formatAmount = (amount, currency = 'EUR', locale = 'en-US') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Invalid amount'
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount)
}
