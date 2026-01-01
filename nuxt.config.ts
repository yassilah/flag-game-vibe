// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: '2025-07-15',
   devtools: { enabled: true },
   modules: ['@nuxt/ui'],
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
})
