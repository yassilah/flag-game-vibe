<script setup lang="ts">
import type { Guess } from '~/composables/useFlagGame'

/**
 * Props accepted by the guess history list.
 */
defineProps<{ guesses: Guess[] }>()
</script>

<template>
   <UCard v-if="guesses.length > 0">
      <template #header>
         <h3 class="text-lg font-semibold">
            Vos tentatives :
         </h3>
      </template>

      <div class="space-y-2">
         <div
            v-for="(guess, index) in guesses"
            :key="`${guess.code}-${index}`"
            class="flex items-center justify-between gap-2 rounded-lg bg-gray-50 p-2 sm:gap-3 sm:p-3 dark:bg-gray-800"
         >
            <div class="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
               <span class="text-xl sm:text-2xl">{{ guess.emoji }}</span>
               <span class="truncate text-sm font-medium sm:text-base">{{ guess.name }}</span>
            </div>
            <UBadge
               :color="guess.accuracy >= 90 ? 'success' : guess.accuracy >= 70 ? 'warning' : 'error'"
               variant="subtle"
               size="md"
               class="sm:size-lg flex-shrink-0"
            >
               {{ guess.accuracy.toFixed(1) }}%
            </UBadge>
         </div>
      </div>
   </UCard>
</template>
