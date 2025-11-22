# CryptoPop

A real-time crypto price viewer built with Vue 3, Vite, and Semantic UI CSS.

## Features
- Live Bitcoin (BTC/USD) price from CoinDesk API (auto-refreshes every 30 seconds)
- Modern, minimal UI with Semantic UI CSS
- API key support via `.env` for CoinDesk

## Quick Start

1. Install dependencies
   ```powershell
   cd d:\PROJECTS\vue-js\vue-project
   npm install
   ```
2. Add your CoinDesk API key to a `.env` file at the project root:
   ```env
   VITE_COINDESK_API_KEY=your_api_key_here
   ```
3. Run the dev server
   ```powershell
   npm run dev
   ```
4. Open the URL printed by Vite (usually http://localhost:5173).

## Files of Interest
- `src/components/CryptoPrice.vue` — main real-time price component
- `src/api/coindesk.js` — CoinDesk API logic
- `src/App.vue` — app shell
- `src/main.js` — global CSS imports

## Notes
- Only BTC/USD is supported (per CoinDesk public API)
- API key is sent as a Bearer token in the Authorization header
- For more coins, extend the API module to use other crypto APIs

## License
MIT or original project license
