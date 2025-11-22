<script setup>
import { ref, onMounted } from 'vue'
import { fetchCryptoPrice } from '../api/coindesk'

const msg = 'Real-Time Crypto Price (BTC/USD)'
const price = ref(null)
const updated = ref('')
const loading = ref(false)
const error = ref('')

async function loadPrice() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchCryptoPrice('BTC')
    price.value = data.price
    updated.value = data.updated
  } catch (err) {
    error.value = err.message || String(err)
    price.value = null
    updated.value = ''
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPrice()
  setInterval(loadPrice, 30000)
})
</script>

<template>
  <div class="glass-finder">
    <div class="panel" role="region" aria-label="Crypto price viewer">
      <header>
        <h2 class="title">{{ msg }}</h2>
        <p class="subtitle muted" style="margin:0.25rem 0 0;">Powered by CoinDesk API. Updates every 30 seconds.</p>
      </header>

      <div class="ui segment" style="margin-top:1.2rem;min-width:260px;max-width:340px">
        <div class="ui statistic" style="margin-bottom:0">
          <div class="value" style="font-size:2.2rem">
            <span v-if="loading"><i class="notched circle loading icon"></i></span>
            <span v-else-if="price !== null">${{ price.toLocaleString(undefined, {maximumFractionDigits:2}) }}</span>
            <span v-else>-</span>
          </div>
          <div class="label">BTC / USD</div>
        </div>
        <div class="ui mini horizontal label" v-if="updated" style="margin-top:0.7rem">Last updated: {{ new Date(updated).toLocaleTimeString() }}</div>
        <div v-if="error" class="ui red message" style="margin-top:0.7rem">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-finder { display:flex; justify-content:center; padding:0.6rem 0 }
.panel { width:100%; max-width:720px; padding:0.6rem 0; border-radius:8px; background:transparent; border:0 }

.title { margin:0; font-size:1.05rem; font-weight:600 }
.subtitle { margin:0; color:var(--muted); font-size:0.95rem }
</style>
