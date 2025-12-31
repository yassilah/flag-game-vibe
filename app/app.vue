<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <h1 class="text-5xl font-bold text-indigo-900 mb-2">🏴 Flaggle</h1>
        <p class="text-gray-600">Devinez le drapeau en 5 essais !</p>
      </header>
      <FlagGame />
    </div>
  </div>
</template>

<script setup>
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

* {
  box-sizing: border-box;
}
</style>
