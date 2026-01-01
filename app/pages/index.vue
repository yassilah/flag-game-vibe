<script setup lang="ts">
/**
 * Home page with difficulty level selection.
 */
</script>

<template>
   <div class="mx-auto max-w-2xl space-y-6 py-8">
      <div class="space-y-2 text-center">
         <h1 class="text-4xl font-bold">
            Flag Game
         </h1>
         <p class="text-gray-600 dark:text-gray-400">
            Devinez les pays en reconstituant leurs drapeaux
         </p>
      </div>

      <UCard>
         <template #header>
            <h3 class="text-lg font-semibold">
               Choisissez un niveau de difficulté :
            </h3>
         </template>

         <div class="flex flex-col gap-3">
            <NuxtLink to="/easy">
               <UButton
                  block
                  variant="outline"
                  color="primary"
               >
                  <span class="font-semibold">Facile</span>
                  <span class="text-sm text-gray-500">Drapeau + Nom du pays</span>
               </UButton>
            </NuxtLink>

            <NuxtLink to="/medium">
               <UButton
                  block
                  variant="outline"
                  color="primary"
               >
                  <span class="font-semibold">Moyen</span>
                  <span class="text-sm text-gray-500">Emoji du drapeau uniquement</span>
               </UButton>
            </NuxtLink>

            <NuxtLink to="/hard">
               <UButton
                  block
                  variant="outline"
                  color="primary"
               >
                  <span class="font-semibold">Difficile</span>
                  <span class="text-sm text-gray-500">Nom du pays uniquement</span>
               </UButton>
            </NuxtLink>
         </div>
      </UCard>
   </div>
</template>
