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
    <div class="panel" role="region" aria-label="GitHub repository finder">
      <header>
        <h2 class="title">{{ msg }}</h2>
        <p class="subtitle muted" style="margin:0.25rem 0 0;">Pick a language and get a random repo.</p>
      </header>

      <div class="ui form" style="margin-top:0.8rem">
        <div class="fields" style="align-items:center;gap:0.6rem;display:flex;flex-wrap:wrap">
          <div class="field" style="min-width:160px">
            <label class="visually-hidden" for="language">Language</label>
            <select id="language" v-model="selected" class="ui dropdown" aria-label="Select language">
              <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
            </select>
          </div>

          <div class="field" style="display:flex;gap:0.5rem">
            <button class="ui primary button" @click="onFindClick" :disabled="loading" aria-live="polite">
              <i v-if="!loading" class="search icon"></i>
              <i v-else class="spinner loading icon"></i>
              <span>{{ loading ? 'Loading' : 'Find' }}</span>
            </button>

            <button class="ui button" @click="onAnotherClick" :disabled="loading || !hasResult">Another</button>
          </div>
        </div>
      </div>

      <div class="status" style="margin-top:0.6rem">
        <p v-if="loading" class="loading muted">Searching…</p>
        <p v-if="error" class="error" role="alert">{{ error }}</p>
      </div>

      <div v-if="hasResult" class="ui segment" style="margin-top:0.9rem;padding:0.7rem">
        <div class="ui grid">
          <div class="twelve wide column">
            <a :href="current.url" target="_blank" rel="noopener" class="ui header" style="margin:0;font-size:1rem">{{ current.name }}</a>
            <div class="description" style="margin-top:0.35rem;color:var(--muted)">{{ current.description || 'No description.' }}</div>
          </div>
          <div class="four wide column" style="display:flex;align-items:center;justify-content:flex-end;gap:0.8rem">
            <div class="ui small labels">
              <a class="ui basic label">⭐ {{ current.stars }}</a>
              <a class="ui basic label">🍴 {{ current.forks }}</a>
              <a class="ui basic label">🐞 {{ current.openIssues }}</a>
            </div>
          </div>
        </div>
      </div>

      <p v-else-if="!loading && !error" class="hint muted" style="margin-top:0.9rem">Select a language and click Find.</p>
    </div>
  </div>
</template>

<style scoped>
.glass-finder { display:flex; justify-content:center; padding:0.6rem 0 }
.panel { width:100%; max-width:720px; padding:0.6rem 0; border-radius:8px; background:transparent; border:0 }

.title { margin:0; font-size:1.05rem; font-weight:600 }
.subtitle { margin:0; color:var(--muted); font-size:0.95rem }

.controls { display:flex; gap:0.5rem; align-items:center }
.select { padding:0.38rem 0.5rem; border-radius:8px; border:1px solid rgba(0,0,0,0.08); background:transparent }
.btn-primary { padding:0.4rem 0.65rem; border-radius:8px; border:1px solid var(--accent-500); background:transparent; color:var(--accent-500); cursor:pointer }
.btn-ghost { padding:0.36rem 0.6rem; border-radius:8px; border:1px solid rgba(0,0,0,0.06); background:transparent; cursor:pointer }
.btn-primary:disabled, .btn-ghost:disabled { opacity:0.5; cursor:not-allowed }

.status { margin-top:0.5rem }
.loading { color:var(--muted) }
.error { color:#b00020 }

.repo { margin-top:0.6rem; padding:0.5rem 0 }
.repo-name a { color:inherit; text-decoration:underline }
.repo-desc { margin:0.35rem 0 0 }

.hint { margin-top:0.6rem; color:var(--muted) }

@media (min-width:768px) { .panel { padding:0.8rem 0 } }

</style>
