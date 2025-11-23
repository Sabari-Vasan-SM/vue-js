<script setup>

import { ref, onMounted } from 'vue'
import { fetchCryptoStats } from '../api/coindesk'

const msg = 'Real-Time Crypto Price'
const instruments = [
  { label: 'BTC / USD', value: 'BTC-USD' },
  { label: 'ETH / USD', value: 'ETH-USD' },
  { label: 'SOL / USD', value: 'SOL-USD' },
  { label: 'XRP / USD', value: 'XRP-USD' },
  { label: 'DOGE / USD', value: 'DOGE-USD' },
]
const selected = ref(instruments[0].value)

const stats = ref(null)
const loading = ref(false)
const error = ref('')


async function loadStats() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchCryptoStats(selected.value)
    stats.value = data
  } catch (err) {
    error.value = err.message || String(err)
    stats.value = null
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  loadStats()
  setInterval(loadStats, 30000)
})
</script>

<template>
  <div class="glass-finder">
    <div class="panel" role="region" aria-label="Crypto price viewer">
      <header>
        <h2 class="title">{{ msg }}</h2>
        <p class="subtitle muted" style="margin:0.25rem 0 0;">Powered by CoinDesk API. Updates every 30 seconds.</p>
      </header>


      <div class="ui form" style="margin-top:1.2rem;max-width:340px">
        <div class="field">
          <label for="instrument">Select Pair</label>
          <select id="instrument" v-model="selected" class="ui dropdown" @change="loadStats">
            <option v-for="inst in instruments" :key="inst.value" :value="inst.value">{{ inst.label }}</option>
          </select>
        </div>
      </div>


      <div class="ui segment" style="margin-top:1.2rem;min-width:260px;max-width:340px">
        <div class="ui statistic" style="margin-bottom:0">
          <div class="value" style="font-size:2.2rem">
            <span v-if="loading"><i class="notched circle loading icon"></i></span>
            <span v-else-if="stats && stats.VALUE !== undefined">${{ Number(stats.VALUE).toLocaleString(undefined, {maximumFractionDigits:2}) }}</span>
            <span v-else>-</span>
          </div>
          <div class="label">{{ instruments.find(i => i.value === selected)?.label || selected }}</div>
        </div>
        <div class="ui mini horizontal label" v-if="stats && stats.VALUE_LAST_UPDATE_TS" style="margin-top:0.7rem">
          Last updated: {{ new Date(stats.VALUE_LAST_UPDATE_TS * 1000).toLocaleTimeString() }}
        </div>
        <div v-if="error" class="ui red message" style="margin-top:0.7rem">{{ error }}</div>

        <div v-if="stats" class="ui mini horizontal list" style="margin-top:1.2rem;flex-wrap:wrap">
          <div class="item">24h Change: <b :class="{'text-red': stats.MOVING_24_HOUR_CHANGE < 0, 'text-green': stats.MOVING_24_HOUR_CHANGE > 0}">{{ stats.MOVING_24_HOUR_CHANGE ? stats.MOVING_24_HOUR_CHANGE.toFixed(2) : '-' }}</b></div>
          <div class="item">24h %: <b :class="{'text-red': stats.MOVING_24_HOUR_CHANGE_PERCENTAGE < 0, 'text-green': stats.MOVING_24_HOUR_CHANGE_PERCENTAGE > 0}">{{ stats.MOVING_24_HOUR_CHANGE_PERCENTAGE ? (stats.MOVING_24_HOUR_CHANGE_PERCENTAGE * 100).toFixed(2) + '%' : '-' }}</b></div>
          <div class="item">24h High: <b>{{ stats.MOVING_24_HOUR_HIGH ? stats.MOVING_24_HOUR_HIGH.toLocaleString(undefined, {maximumFractionDigits:2}) : '-' }}</b></div>
          <div class="item">24h Low: <b>{{ stats.MOVING_24_HOUR_LOW ? stats.MOVING_24_HOUR_LOW.toLocaleString(undefined, {maximumFractionDigits:2}) : '-' }}</b></div>
          <div class="item">24h Vol: <b>{{ stats.MOVING_24_HOUR_VOLUME ? stats.MOVING_24_HOUR_VOLUME.toLocaleString(undefined, {maximumFractionDigits:2}) : '-' }}</b></div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.glass-finder { display:flex; justify-content:center; padding:0.6rem 0 }
.panel { width:100%; max-width:720px; padding:0.6rem 0; border-radius:8px; background:transparent; border:0 }

.title { margin:0; font-size:1.05rem; font-weight:600 }
.subtitle { margin:0; color:var(--muted); font-size:0.95rem }
.text-red { color: #db2828; }
.text-green { color: #21ba45; }
</style>
