<script setup>
import { ref, computed } from 'vue'

// props kept for compatibility with existing usage
defineProps({
  msg: {
    type: String,
    required: false,
    default: 'GitHub Random Repository Finder',
  },
})

const languages = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'Go',
  'Ruby',
  'PHP',
  'C++',
  'C#',
  'Rust',
]

const selected = ref(languages[0])
const loading = ref(false)
const error = ref('')
const repos = ref([])
const current = ref(null)

function repoCardData(r) {
  if (!r) return null
  return {
    name: r.full_name,
    url: r.html_url,
    description: r.description,
    stars: r.stargazers_count,
    forks: r.forks_count,
    openIssues: r.open_issues_count,
    language: r.language,
  }
}

async function fetchReposForLanguage(language) {
  loading.value = true
  error.value = ''
  repos.value = []
  current.value = null

  try {
    // Use GitHub Search API. We request up to 100 results and pick randomly.
    const q = encodeURIComponent(`language:${language}`)
    const url = `https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=100`
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })

    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('Rate limit exceeded or access forbidden. Try again later.')
      }
      const text = await res.text()
      throw new Error(`GitHub API error: ${res.status} ${text}`)
    }

    const data = await res.json()

    if (!data.items || data.items.length === 0) {
      error.value = `No repositories found for ${language}.`
      return
    }

    repos.value = data.items
    pickRandomFromRepos()
  } catch (err) {
    error.value = err.message || String(err)
  } finally {
    loading.value = false
  }
}

function pickRandomFromRepos() {
  if (!repos.value || repos.value.length === 0) {
    current.value = null
    error.value = 'No repositories available to pick from.'
    return
  }

  const i = Math.floor(Math.random() * repos.value.length)
  current.value = repoCardData(repos.value[i])
}

// convenience computed for UI
const hasResult = computed(() => !!current.value)

// Public actions
async function onFindClick() {
  await fetchReposForLanguage(selected.value)
}

function onAnotherClick() {
  // pick without refetching if we have cached results
  if (repos.value && repos.value.length > 1) {
    pickRandomFromRepos()
  } else if (repos.value && repos.value.length === 1) {
    error.value = 'Only one repository in the results — cannot pick another.'
  } else {
    // no cache; fetch again
    fetchReposForLanguage(selected.value)
  }
}

</script>

<template>
  <div class="github-finder">
    <h2>{{ msg }}</h2>

    <div class="controls">
      <label for="language">Select language</label>
      <select id="language" v-model="selected">
        <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
      </select>

      <button @click="onFindClick" :disabled="loading">Find repository</button>
      <button @click="onAnotherClick" :disabled="loading || !hasResult">Another random repo</button>
    </div>

    <div class="status">
      <p v-if="loading">Loading…</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <div v-if="hasResult" class="repo-card">
      <h3><a :href="current.url" target="_blank" rel="noopener">{{ current.name }}</a></h3>
      <p class="desc">{{ current.description || 'No description' }}</p>
      <ul class="meta">
        <li>⭐ Stars: {{ current.stars }}</li>
        <li>🍴 Forks: {{ current.forks }}</li>
        <li>🐞 Open issues: {{ current.openIssues }}</li>
        <li v-if="current.language">🧩 Language: {{ current.language }}</li>
      </ul>
    </div>

    <div v-else-if="!loading && !error" class="hint">
      <p>Select a language and click "Find repository" to get a random repository from GitHub.</p>
    </div>
  </div>
</template>

<style scoped>
.github-finder {
  max-width: 720px;
  margin: 1.5rem auto;
  padding: 1rem;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

select {
  padding: 0.4rem 0.6rem;
}

button {
  padding: 0.45rem 0.8rem;
  cursor: pointer;
}

.status { margin-top: 0.6rem }
.error { color: #b00020 }

.repo-card { margin-top: 1rem; padding: 0.8rem; border: 1px solid #eee; border-radius: 6px }
.repo-card h3 { margin: 0 0 0.4rem }
.repo-card .desc { margin: 0 0 0.6rem; color: #333 }
.meta { list-style: none; padding: 0; display:flex; gap:1rem; margin:0 }
.meta li { font-size: 0.95rem }

.hint { margin-top: 1rem; color: #555 }

@media (min-width: 768px) {
  .controls { gap: 1rem }
}

</style>
