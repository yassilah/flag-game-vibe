<script setup lang="ts">
/**
 * Home page with difficulty level selection.
 */
</script>

<template>
   <div class="mx-auto max-w-2xl space-y-4 py-4 sm:space-y-6 sm:py-8">
      <div class="space-y-2 text-center">
         <h1 class="text-2xl font-bold sm:text-3xl md:text-4xl">
            Flag Game
         </h1>
         <p class="text-sm text-gray-600 sm:text-base dark:text-gray-400">
            Devinez les pays en reconstituant leurs drapeaux
         </p>
      </div>

      <UCard>
         <template #header>
            <h3 class="text-lg font-semibold">
               Choisissez un niveau de difficulté :
            </h3>
         </template>

         <div class="flex flex-col gap-2 sm:gap-3">
            <NuxtLink to="/easy">
               <UButton
                  block
                  variant="outline"
                  color="primary"
                  class="flex-col items-start gap-0.5 py-3 sm:py-4"
               >
                  <span class="text-sm font-semibold sm:text-base">Facile</span>
                  <span class="text-xs text-gray-500 sm:text-sm">Drapeau + Nom du pays</span>
               </UButton>
            </NuxtLink>

            <NuxtLink to="/medium">
               <UButton
                  block
                  variant="outline"
                  color="primary"
                  class="flex-col items-start gap-0.5 py-3 sm:py-4"
               >
                  <span class="text-sm font-semibold sm:text-base">Moyen</span>
                  <span class="text-xs text-gray-500 sm:text-sm">Emoji du drapeau uniquement</span>
               </UButton>
            </NuxtLink>

            <NuxtLink to="/hard">
               <UButton
                  block
                  variant="outline"
                  color="primary"
                  class="flex-col items-start gap-0.5 py-3 sm:py-4"
               >
                  <span class="text-sm font-semibold sm:text-base">Difficile</span>
                  <span class="text-xs text-gray-500 sm:text-sm">Nom du pays uniquement</span>
               </UButton>
            </NuxtLink>

            <NuxtLink to="/extreme">
               <UButton
                  block
                  variant="outline"
                  color="error"
                  class="flex-col items-start gap-0.5 py-3 sm:py-4"
               >
                  <span class="text-sm font-semibold sm:text-base">Extrême</span>
                  <span class="text-xs text-gray-500 sm:text-sm">Tous les pays, pas de indices</span>
               </UButton>
            </NuxtLink>
         </div>
      </UCard>
   </div>
</template>
