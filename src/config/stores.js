export const countries = [
  { code: 'BE', name: 'Belgium' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'LU', name: 'Luxembourg' }
]

export const storeTypes = [
  'Supermarket',
  'Department Store',
  'Discount Store',
  'Fashion',
  'Electronics',
  'Home Improvement',
  'Sports',
  'Drugstore',
  'Online Store',
  'Other'
]

export const generateDefaultStoresWithIds = () => {
  const defaultStores = [
    { name: 'Delhaize', country: 'BE', type: 'Supermarket' },
    { name: 'Carrefour', country: 'BE', type: 'Supermarket' },
    { name: 'Colruyt', country: 'BE', type: 'Supermarket' },
    { name: 'Albert Heijn', country: 'NL', type: 'Supermarket' },
    { name: 'MediaMarkt', country: 'BE', type: 'Electronics' },
    { name: 'Kruidvat', country: 'BE', type: 'Drugstore' },
    { name: 'Action', country: 'BE', type: 'Discount Store' },
    { name: 'H&M', country: 'BE', type: 'Fashion' },
    { name: 'Decathlon', country: 'BE', type: 'Sports' },
    { name: 'IKEA', country: 'BE', type: 'Home Improvement' },
    { name: 'Bol.com', country: 'BE', type: 'Online Store' }
  ]

  return defaultStores.map(store => ({
    ...store,
    id: `store-${store.country.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }))
}
