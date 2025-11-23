// CoinDesk API module for real-time crypto prices
// Docs: https://www.coindesk.com/coindesk-api/

// Fetches current price for a given currency (e.g., 'BTC', 'ETH') in USD
// (fetchCryptoPrice is deprecated; use fetchCryptoStats instead)

// Fetch all available fields for a given instrument from CoinDesk Data API
export async function fetchCryptoStats(symbol) {
  const apiKey = import.meta.env.VITE_COINDESK_API_KEY;
  const url = `https://data-api.coindesk.com/index/cc/v1/latest/tick?market=ccix&instruments=${symbol}`;
  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': apiKey
      }
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    if (data.Err && Object.keys(data.Err).length > 0) {
      throw new Error(data.Err.message || 'Unknown API error');
    }
    // Return all fields for the symbol
    return data.Data[symbol];
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch crypto stats');
  }
}
