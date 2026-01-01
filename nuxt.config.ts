// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: '2025-07-15',
   devtools: { enabled: true },
   modules: ['@nuxt/ui', '@vite-pwa/nuxt'],
   css: ['~/assets/css/main.css'],
   app: {
      head: {
         title: 'Flaggle - Jeu de Devinettes de Drapeaux',
         meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'description', content: 'Devinez le drapeau en 5 essais ! Un jeu avec comparaison pixel par pixel et pourcentage de précision.' },
            { name: 'theme-color', content: '#4f46e5' },
         ],
         link: [
            { rel: 'icon', type: 'image/svg+xml', href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏴</text></svg>' },
         ],
      },
   },
   pwa: {
      manifest: {
         name: 'Flaggle - Jeu de Devinettes de Drapeaux',
         short_name: 'Flaggle',
         description: 'Devinez le drapeau en 5 essais ! Un jeu avec comparaison pixel par pixel et pourcentage de précision.',
         theme_color: '#4f46e5',
         background_color: '#ffffff',
         display: 'standalone',
         scope: '/',
         start_url: '/',
         orientation: 'portrait-primary',
         icons: [
            {
               src: '/icon-192x192.svg',
               sizes: '192x192',
               type: 'image/svg+xml',
               purpose: 'any',
            },
            {
               src: '/icon-512x512.svg',
               sizes: '512x512',
               type: 'image/svg+xml',
               purpose: 'any maskable',
            },
         ],
         categories: ['games'],
      },
      workbox: {
         globPatterns: ['**/*.{js,json,css,html,svg,png,ico,webp,jpg,jpeg,woff2}'],
         navigateFallback: '/',
         cleanupOutdatedCaches: true,
         runtimeCaching: [
            {
               urlPattern: '^https://restcountries\\.com/.*',
               handler: 'CacheFirst',
               options: {
                  cacheName: 'flaggle-api-cache',
                  expiration: {
                     maxEntries: 50,
                     maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
                  },
               },
            },
         ],
      },
   },
})
