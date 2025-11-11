# vue-project

A small Vue 3 + Vite demo that finds a random GitHub repository by selected programming language.

This fork includes a compact, minimal UI and uses Semantic UI CSS for styling. The main interactive component is
`src/components/GitHubFinder.vue` which queries the GitHub Search API, caches the current result set, and picks a
random repository to display (name, description, stars, forks, issues).

Highlights
- Minimal, accessible UI with Semantic UI CSS classes
- Random repository picker using GitHub Search API (top results by stars)
- "Another" button picks a different repo from the cached result set (no new API call)

Quick start

1. Install dependencies

```powershell
cd d:\PROJECTS\vue-js\vue-project
npm install
```

2. Run the dev server

```powershell
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

Files of interest
- `src/components/GitHubFinder.vue` — the main component (language select, fetch, random pick, UI)
- `src/App.vue` — app shell now renders the finder inside a minimal panel
- `src/main.js` — imports global CSS, including Semantic UI (`semantic-ui-css/semantic.min.css`)
- `src/assets/ui.css` — project design tokens and small utility classes

Notes on GitHub API usage and rate limits
- This app uses unauthenticated requests to the GitHub Search API. Unauthenticated requests are strictly rate-limited
  (typically fewer requests per minute/hour). If you anticipate more usage or are developing heavily, add a GitHub
  personal access token and set it as an environment variable for local development:

  - Create a token on GitHub (no special scopes required for public repo search).
  - Start the dev server with the token available. Example (PowerShell):

  ```powershell
  $env:GITHUB_TOKEN = 'ghp_...'
  npm run dev
  ```

  Optionally I can help wire the app to use `process.env.GITHUB_TOKEN` (Vite uses `import.meta.env`) so the token is
  used in the Authorization header for requests.

Troubleshooting
- If UI styling looks broken, ensure `semantic-ui-css` was installed and `src/main.js` imports
  `semantic-ui-css/semantic.min.css` (this project does that by default).
- If you see frequent 403 responses while fetching repos, you'll likely be hitting GitHub rate limits — use a token
  as described above.

Development notes
- The project uses Vite and Vue Router. Standard npm scripts are available in `package.json`:
  - `npm run dev` — start dev server
  - `npm run build` — build for production
  - `npm run preview` — preview production build

Contributing / changes
- This workspace was adapted to show a minimal GitHub repository finder UI. If you'd like the original starter
  `HelloWorld` restored or alternative styles, tell me which direction you want and I will adjust the components and
  CSS.

License
- This repository retains whatever original license it had (if any). If you need a license added, indicate which one
  (MIT, Apache-2.0, etc.) and I can add it.
