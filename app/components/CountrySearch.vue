<script setup lang="ts">
import type { Difficulty } from '~/composables/useFlagGame'
import type { Country } from '~/types/country'

/**
 * Props accepted by the country search list.
 */
const props = defineProps<{ countries: Country[], disabledCodes: string[], difficulty: Difficulty }>()

/**
 * Emits available from this component.
 */
const emit = defineEmits<{ (e: 'guess', country: Country): void }>()

/**
 * Search query entered by the player.
 */
const searchQuery = ref('')

/**
 * Countries filtered by the current search query.
 */
const filteredCountries = computed(() => {
   if (!searchQuery.value) return props.countries
   const query = searchQuery.value.toLowerCase()
   return props.countries.filter(country => country.name.toLowerCase().includes(query))
})

/**
 * Emit the selected country guess.
 */
const emitGuess = (country: Country) => emit('guess', country)
</script>

<template>
   <UCard>
      <template #header>
         <h3 class="text-lg font-semibold">
            Sélectionnez un pays :
         </h3>
      </template>

      <UInput
         v-model="searchQuery"
         icon="i-heroicons-magnifying-glass"
         placeholder="Rechercher un pays..."
         size="lg"
         class="mb-4"
      />

      <div class="grid max-h-96 grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2">
         <UButton
            v-for="country in filteredCountries"
            :key="country.code"
            :disabled="disabledCodes.includes(country.code)"
            variant="outline"
            color="neutral"
            block
            class="justify-start"
            :ui="{ base: ['text-left flex flex-col justify-center items-center', difficulty === 'easy' ? 'h-38' : ''] }"
            @click="emitGuess(country)"
         >
            <!-- Easy: flag emoji + name -->
            <template v-if="difficulty === 'easy'">
               <img
                  :src="country.flag"
                  :alt="country.name"
                  class="mx-auto flex-1 border object-cover"
               >
               <span class="truncate text-sm">{{ country.name }}</span>
            </template>

            <!-- Medium: emoji only -->
            <template v-else-if="difficulty === 'medium'">
               <span class="mr-2 text-xl">{{ country.emoji }}</span>
               <span class="truncate text-sm">{{ country.name }}</span>
            </template>

            <!-- Hard: name only -->
            <template v-else>
               <span class="truncate text-sm">{{ country.name }}</span>
            </template>
         </UButton>
      </div>
   </UCard>
</template>
