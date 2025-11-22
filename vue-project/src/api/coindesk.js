// CoinDesk API module for real-time crypto prices
// Docs: https://www.coindesk.com/coindesk-api/

// Fetches current price for a given currency (e.g., 'BTC', 'ETH') in USD
export async function fetchCryptoPrice(symbol = 'BTC') {
  // CoinDesk only supports BTC/USD directly, for ETH and others use other APIs or mock
  if (symbol !== 'BTC') {
    throw new Error('CoinDesk API only supports BTC/USD directly. For other coins, use another API.')
  }
  const url = 'https://api.coindesk.com/v1/bpi/currentprice/USD.json'
  const headers = {}
  // Support API key via VITE_COINDESK_API_KEY
  try {
    const key = import.meta.env.VITE_COINDESK_API_KEY
    if (key) headers['Authorization'] = `Bearer ${key}`
  } catch (e) {}
  const res = await fetch(url, { headers })
  if (!res.ok) {
    throw new Error('Failed to fetch from CoinDesk API')
  }
  const data = await res.json()
  // Structure: data.bpi.USD.rate_float
  return {
    symbol: 'BTC',
    price: data.bpi.USD.rate_float,
    updated: data.time.updatedISO
  }
}
