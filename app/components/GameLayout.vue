<script setup lang="ts">
import type { Difficulty } from '~/composables/useFlagGame'
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
   await fetchCountries()
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

   if (gameOver.value) {
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

onMounted(initializeGame)
</script>

<template>
   <div class="mx-auto max-w-7xl space-y-6">
      <div class="flex items-center justify-between">
         <NuxtLink
            to="/"
            class="text-lg font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
         >
            ← Retour à l'accueil
         </NuxtLink>
         <h1 class="text-2xl font-bold capitalize">
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
         <div class="grid gap-6 lg:grid-cols-3">
            <!-- Left side: Canvas and info -->
            <div class="space-y-6 lg:col-span-2">
               <UCard>
                  <template #header>
                     <div class="flex items-center justify-between">
                        <h2 class="text-xl font-semibold">
                           Essai {{ currentGuess }}/{{ maxGuesses }}
                        </h2>
                        <UButton
                           v-if="gameOver"
                           color="primary"
                           icon="i-heroicons-arrow-path"
                           @click="handleReset"
                        >
                           Nouveau jeu
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
                        class="flex justify-center gap-4 text-sm"
                     >
                        <div class="flex items-center gap-2">
                           <div class="h-4 w-4 rounded border-2 border-gray-800 dark:border-gray-300" />
                           <span class="text-gray-600 dark:text-gray-300">Pixels corrects (vraies couleurs)</span>
                        </div>
                        <div class="flex items-center gap-2">
                           <div class="h-4 w-4 rounded border-2 border-gray-400 bg-gray-200 dark:border-gray-500 dark:bg-gray-700" />
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
