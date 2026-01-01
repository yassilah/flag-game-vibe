<script setup lang="ts">
import type { Difficulty } from '~/composables/useFlagGame'
import type { Language } from '~/composables/useLanguage'
import type { Country } from '~/types/country'
import FlagCanvas from '~/components/FlagCanvas.vue'

interface Props {
   difficulty: Difficulty
}

withDefaults(defineProps<Props>(), {})

/**
 * Reference to the flag canvas component instance.
 */
const flagCanvasRef = ref<InstanceType<typeof FlagCanvas> | null>(null)

/**
 * Countries composable state and actions.
 */
const { countries, loading, error, fetchCountries } = useCountries()

/**
 * Language composable state and actions.
 */
const { selectedLanguage } = useLanguage()

/**
 * Game state composable state and actions.
 */
const {
   maxGuesses,
   currentGuess,
   guesses,
   guessedCountries,
   targetCountry,
   gameOver,
   won,
   lastAccuracy,
   matchedPixels,
   startNewGame,
   recordGuess,
   isGuessAllowed,
   updateMatchedPixels,
} = useFlagGame()

/**
 * Reactive list of countries (falls back to empty array).
 */
const countriesList = computed(() => countries.value || [])

/**
 * Human-friendly countries loading flag.
 */
const countriesLoading = computed(() => loading.value)

/**
 * Human-friendly countries error message.
 */
const countriesError = computed(() => error.value)

/**
 * URL of the last guessed flag.
 */
const lastGuessedFlagUrl = computed(() => {
   return guesses.value[guesses.value.length - 1]?.flag ?? null
})

/**
 * Initialize the game flow by fetching countries then starting a round.
 */
async function initializeGame() {
   await fetchCountries(selectedLanguage.value as Language)
   if (countriesList.value.length) {
      startNewGame(countriesList.value)
   }
}

/**
 * Process a player's guess, update accuracy, and reveal the flag on game over.
 */
async function handleGuess(country: Country) {
   if (!isGuessAllowed(country.code) || !targetCountry.value) return

   const canvas = flagCanvasRef.value
   const result = canvas ? await canvas.compareWithGuess(country.flag) : { accuracy: 0, matchedPixels: new Uint8Array() }
   recordGuess(country, result.accuracy)
   updateMatchedPixels(result.matchedPixels)

   if (gameOver.value && !won.value) {
      canvas?.showTargetFlag()
   }
}

/**
 * Reset the game with a new random country and clear the canvas.
 */
function handleReset() {
   if (!countriesList.value.length) return
   startNewGame(countriesList.value)
   flagCanvasRef.value?.drawInitialState()
}

/**
 * Watch for language changes and refetch countries with new language.
 */
watch(
   () => selectedLanguage.value,
   async (newLanguage) => {
      if (!newLanguage) return
      await fetchCountries(newLanguage as Language)
      if (countriesList.value.length) {
         startNewGame(countriesList.value)
         flagCanvasRef.value?.drawInitialState()
      }
   },
   { flush: 'post' },
)

onMounted(initializeGame)
</script>

<template>
   <div class="mx-auto max-w-7xl space-y-4 sm:space-y-6">
      <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
         <NuxtLink
            to="/"
            class="text-sm font-semibold text-blue-600 hover:text-blue-800 sm:text-base md:text-lg dark:text-blue-400 dark:hover:text-blue-300"
         >
            ← Retour à l'accueil
         </NuxtLink>
         <h1 class="text-xl font-bold capitalize sm:text-2xl">
            Niveau: {{ difficulty }}
         </h1>
      </div>

      <UAlert
         v-if="countriesError"
         color="error"
         title="Erreur"
         :description="countriesError"
      />

      <UCard v-else-if="countriesLoading">
         <p class="text-gray-500 dark:text-gray-400">
            Chargement des pays...
         </p>
      </UCard>

      <template v-else>
         <div class="grid gap-4 sm:gap-6 lg:grid-cols-3">
            <!-- Left side: Canvas and info -->
            <div class="space-y-4 sm:space-y-6 lg:col-span-2">
               <UCard>
                  <template #header>
                     <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                        <h2 class="text-lg font-semibold sm:text-xl">
                           Essai {{ currentGuess }}/{{ maxGuesses }}
                        </h2>
                        <UButton
                           v-if="gameOver"
                           color="primary"
                           icon="i-heroicons-arrow-path"
                           size="sm"
                           class="sm:size-md"
                           @click="handleReset"
                        >
                           <span class="hidden sm:inline">Nouveau jeu</span>
                           <span class="sm:hidden">Nouveau</span>
                        </UButton>
                     </div>
                  </template>

                  <FlagCanvas
                     ref="flagCanvasRef"
                     :target-flag-url="targetCountry?.flag ?? null"
                     :accuracy="lastAccuracy"
                     :current-guess="currentGuess"
                     :matched-pixels="matchedPixels"
                     :last-guessed-flag-url="lastGuessedFlagUrl"
                  />

                  <template #footer>
                     <div
                        v-if="currentGuess > 0 && !gameOver"
                        class="flex flex-col gap-2 text-xs sm:flex-row sm:justify-center sm:gap-4 sm:text-sm"
                     >
                        <div class="flex items-center gap-2">
                           <div class="h-3 w-3 flex-shrink-0 rounded border-2 border-gray-800 sm:h-4 sm:w-4 dark:border-gray-300" />
                           <span class="text-gray-600 dark:text-gray-300">Pixels corrects (vraies couleurs)</span>
                        </div>
                        <div class="flex items-center gap-2">
                           <div class="h-3 w-3 flex-shrink-0 rounded border-2 border-gray-400 bg-gray-200 sm:h-4 sm:w-4 dark:border-gray-500 dark:bg-gray-700" />
                           <span class="text-gray-600 dark:text-gray-300">Pixels différents (transparents)</span>
                        </div>
                     </div>

                     <UAlert
                        v-if="gameOver"
                        :color="won ? 'success' : 'error'"
                        :icon="won ? 'i-heroicons-trophy' : 'i-heroicons-x-circle'"
                        :title="won ? '🎉 Bravo ! Vous avez trouvé !' : `😢 Perdu ! C'était ${targetCountry?.name}`"
                     />
                  </template>
               </UCard>

               <guess-history :guesses="guesses" />
            </div>

            <!-- Right side: Country search panel -->
            <div class="lg:col-span-1">
               <country-search
                  v-if="!gameOver && countriesList.length"
                  :countries="countriesList"
                  :disabled-codes="guessedCountries"
                  :difficulty="difficulty"
                  @guess="handleGuess"
               />
            </div>
         </div>
      </template>
   </div>
</template>
