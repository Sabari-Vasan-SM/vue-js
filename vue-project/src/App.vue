<script setup>
import { RouterLink, RouterView } from 'vue-router'
import CryptoPrice from './components/CryptoPrice.vue'
</script>

<template>
  <div class="app-shell">
    <main class="minimal-panel">
      <CryptoPrice />
    </main>

    <footer class="app-footer muted" aria-label="site navigation">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <span class="mx">•</span>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </footer>
  </div>

  <RouterView />
</template>

<style scoped>
.app-footer { margin-top: 1.2rem; font-size: 0.95rem }
.app-footer nav { display:flex; gap:0.6rem; align-items:center }
.mx { opacity: 0.38 }

@media (min-width: 1024px) {
  .app-shell { padding: 3rem }
  .center-panel { padding: 2.4rem }
}
</style>
