<script setup>
const { $pwa } = useNuxtApp()

const toast = useToast()

onMounted(() => {
   // Register service worker for offline support
   if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
         console.log('Service Worker registered:', registration)
         toast.success('App ready to work offline')
      }).catch((error) => {
         console.warn('Service Worker registration failed:', error)
      })
   }

   if ($pwa?.offlineReady) {
      toast.success('App ready to work offline')
   }
})
</script>

<template>
   <UApp>
      <NuxtPwaManifest />
      <UContainer class="min-h-screen px-4 py-4 sm:px-6 sm:py-8">
         <header class="mb-6 text-center sm:mb-8">
            <h1 class="text-primary mb-2 text-3xl font-bold sm:text-4xl md:text-5xl">
               🏴 Flaggle
            </h1>
            <p class="text-sm text-gray-500 sm:text-base dark:text-gray-400">
               Devinez le drapeau en 5 essais !
            </p>
         </header>
         <div
            v-if="$pwa?.isPWAInstalled && $pwa.needRefresh"
            class="mb-4 flex items-center justify-between rounded-lg bg-blue-100 p-4 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
         >
            <span class="font-medium">
               New content available, click on reload button to update.
            </span>

            <UButton @click="$pwa.updateServiceWorker()">
               Reload
            </UButton>
         </div>

         <NuxtPage />
      </UContainer>
   </UApp>
</template>
