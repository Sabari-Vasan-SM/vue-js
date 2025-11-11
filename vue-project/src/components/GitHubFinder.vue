<script setup>
import { ref, computed } from 'vue'

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

const hasResult = computed(() => !!current.value)

async function onFindClick() {
  await fetchReposForLanguage(selected.value)
}

function onAnotherClick() {
  if (repos.value && repos.value.length > 1) {
    pickRandomFromRepos()
  } else if (repos.value && repos.value.length === 1) {
    error.value = 'Only one repository in the results — cannot pick another.'
  } else {
    fetchReposForLanguage(selected.value)
  }
}
</script>

<template>
  <div class="glass-finder">
    <div class="panel">
      <header class="panel-header">
        <h2 class="title">{{ msg }}</h2>
        <p class="subtitle">Pick a language and discover a random top GitHub repository.</p>
      </header>

      <div class="controls">
        <label class="sr-only" for="language">Language</label>
        <select id="language" v-model="selected" class="select">
          <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
        </select>

        <div class="btns">
          <button class="btn primary" @click="onFindClick" :disabled="loading">Find</button>
          <button class="btn" @click="onAnotherClick" :disabled="loading || !hasResult">Another</button>
        </div>
      </div>

      <div class="status">
        <p v-if="loading" class="loading">Searching GitHub…</p>
        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <article v-if="hasResult" class="repo">
        <h3 class="repo-name"><a :href="current.url" target="_blank" rel="noopener">{{ current.name }}</a></h3>
        <p class="repo-desc">{{ current.description || 'No description' }}</p>

        <ul class="repo-meta">
          <li>⭐ {{ current.stars }}</li>
          <li>🍴 {{ current.forks }}</li>
          <li>🐞 {{ current.openIssues }}</li>
          <li v-if="current.language">🧩 {{ current.language }}</li>
        </ul>
      </article>

      <p v-else-if="!loading && !error" class="hint">Select a language and tap Find to get started.</p>
    </div>
  </div>
</template>

<style scoped>
:root {
  --glass-bg: rgba(255,255,255,0.55);
  --glass-border: rgba(255,255,255,0.6);
  --muted: rgba(0,0,0,0.55);
}

.glass-finder {
  display: flex;
  justify-content: center;
  padding: 1.5rem;
}

.panel {
  width: 100%;
  max-width: 720px;
  padding: 1.25rem;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255,255,255,0.42), rgba(255,255,255,0.28));
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  backdrop-filter: blur(12px) saturate(130%);
  -webkit-backdrop-filter: blur(12px) saturate(130%);
}

.panel-header { margin-bottom: 0.75rem }
.title { margin: 0; font-size: 1.25rem; font-weight: 600 }
.subtitle { margin: 0.25rem 0 0; color: var(--muted); font-size: 0.9rem }

.controls { display:flex; gap:0.75rem; align-items:center; margin-top:1rem; flex-wrap:wrap }
.select {
  padding: 0.5rem 0.6rem;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.6);
  min-width: 180px;
}

.btns { display:flex; gap:0.5rem }
.btn { padding: 0.5rem 0.9rem; border-radius: 10px; border: none; background: rgba(255,255,255,0.72); cursor: pointer }
.btn.primary { background: linear-gradient(180deg, rgba(10,132,255,0.95), rgba(0,122,255,0.9)); color: white; box-shadow: 0 6px 18px rgba(0,122,255,0.18) }
.btn:disabled { opacity: 0.6; cursor: not-allowed }

.status { margin-top: 0.75rem }
.loading { color: rgba(0,0,0,0.65) }
.error { color: #b00020 }

.repo { margin-top: 1rem; padding: 0.9rem; border-radius: 12px; background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.45)); border: 1px solid rgba(255,255,255,0.5) }
.repo-name { margin: 0 0 0.4rem; font-size: 1rem }
.repo-name a { color: #0a84ff; text-decoration: none }
.repo-desc { margin: 0 0 0.6rem; color: var(--muted) }
.repo-meta { list-style:none; padding:0; margin:0; display:flex; gap:1rem; font-size:0.95rem }

.hint { margin-top: 1rem; color: var(--muted) }

.sr-only { position: absolute !important; height: 1px; width: 1px; overflow: hidden; clip: rect(1px, 1px, 1px, 1px); white-space: nowrap }

@media (min-width: 768px) {
  .panel { padding: 1.5rem }
  .title { font-size: 1.5rem }
}

</style>
