// Small wrapper for GitHub search API calls.
// Returns an array of repository items or throws an Error.
export async function fetchReposForLanguage(language) {
  const q = encodeURIComponent(`language:${language}`)
  const url = `https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=100`

  const headers = { Accept: 'application/vnd.github.v3+json' }
  // Support optional token via Vite env variable VITE_GITHUB_TOKEN
  try {
    const token = import.meta.env.VITE_GITHUB_TOKEN
    if (token) headers.Authorization = `token ${token}`
  } catch (e) {
    // import.meta may not be available in some contexts; ignore
  }

  const res = await fetch(url, { headers })

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error('Rate limit exceeded or access forbidden. Try again later.')
    }
    const text = await res.text()
    throw new Error(`GitHub API error: ${res.status} ${text}`)
  }

  const data = await res.json()
  return data.items || []
}
