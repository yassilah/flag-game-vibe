<script setup lang="ts">
import type { Country } from '~/types/country'
import FlagCanvas from './FlagCanvas.vue'

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
   difficulty,
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
   setDifficulty,
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
 * Whether the user has started a game (moved past difficulty selection).
 */
const hasStartedGame = ref(false)

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
   hasStartedGame.value = false
   startNewGame(countriesList.value)
   flagCanvasRef.value?.drawInitialState()
}

onMounted(initializeGame)
</script>

<template>
   <div class="mx-auto max-w-7xl space-y-6">
      <!-- Difficulty Selection -->
      <UCard v-if="!hasStartedGame && !countriesLoading && !countriesError">
         <template #header>
            <h3 class="text-lg font-semibold">
               Choisissez un niveau de difficulté :
            </h3>
         </template>

         <div class="flex flex-col gap-3">
            <UButton
               variant="outline"
               :color="difficulty === 'easy' ? 'primary' : 'secondary'"
               block
               @click="setDifficulty('easy')"
            >
               <span class="font-semibold">Facile</span>
               <span class="text-sm text-gray-500">Drapeau + Nom du pays</span>
            </UButton>
            <UButton
               variant="outline"
               :color="difficulty === 'medium' ? 'primary' : 'secondary'"
               block
               @click="setDifficulty('medium')"
            >
               <span class="font-semibold">Moyen</span>
               <span class="text-sm text-gray-500">Emoji du drapeau uniquement</span>
            </UButton>
            <UButton
               variant="outline"
               :color="difficulty === 'hard' ? 'primary' : 'secondary'"
               block
               @click="setDifficulty('hard')"
            >
               <span class="font-semibold">Difficile</span>
               <span class="text-sm text-gray-500">Nom du pays uniquement</span>
            </UButton>

            <UButton
               color="primary"
               block
               class="mt-2"
               @click="() => {
                  startNewGame(countriesList)
                  hasStartedGame = true
               }"
            >
               Commencer le jeu
            </UButton>
         </div>
      </UCard>

      <div
         v-else-if="hasStartedGame"
         class="grid gap-6 lg:grid-cols-3"
      >
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

            <country-search
               v-else-if="!gameOver && countriesList.length"
               :countries="countriesList"
               :disabled-codes="guessedCountries"
               :difficulty="difficulty"
               @guess="handleGuess"
            />
         </div>
      </div>

      <!-- Loading/Error states when not in game -->
      <template v-else>
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
      </template>
   </div>
</template>
