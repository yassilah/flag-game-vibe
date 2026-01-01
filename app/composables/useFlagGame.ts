import type { Country } from '~/types/country'

/**
 * Difficulty levels for the game.
 */
export type Difficulty = 'easy' | 'medium' | 'hard'

/**
 * Composable that holds game state and helpers for the flag guessing flow.
 */

/**
 * Guess enriched with accuracy.
 */
export interface Guess extends Country {
   /**
    * Pixel accuracy percentage for the guess.
    */
   accuracy: number
}

/**
 * Maximum number of guesses allowed.
 */
const maxGuesses = 5

/**
 * Current difficulty level.
 */
const difficulty = ref<Difficulty>('medium')

/**
 * Current guess index (1-based).
 */
const currentGuess = ref(0)

/**
 * List of submitted guesses with accuracy.
 */
const guesses = ref<Guess[]>([])

/**
 * Already guessed country codes.
 */
const guessedCountries = ref<string[]>([])

/**
 * Currently selected target country.
 */
const targetCountry = ref<Country | null>(null)

/**
 * Whether the game is over.
 */
const gameOver = ref(false)

/**
 * Whether the player has won.
 */
const won = ref(false)

/**
 * Accuracy of the latest guess.
 */
const lastAccuracy = ref<number | null>(null)

/**
 * Bitmap of matched pixels across all guesses (pixels that were correct).
 */
const matchedPixels = ref<Uint8Array | null>(null)

/**
 * Pick a random country from the provided list.
 */
function selectRandomCountry(list: Country[]): Country | null {
   if (!list.length) return null
   const index = Math.floor(Math.random() * list.length)
   return list[index] ?? null
}

/**
 * Reset all state and assign a new target country.
 */
function startNewGame(list: Country[]): Country | null {
   const nextTarget = selectRandomCountry(list)
   targetCountry.value = nextTarget
   currentGuess.value = 0
   guesses.value = []
   guessedCountries.value = []
   gameOver.value = false
   won.value = false
   lastAccuracy.value = null
   matchedPixels.value = null
   return nextTarget
}

/**
 * Persist a guess, update counters, and determine end-of-game status.
 */
function recordGuess(country: Country, accuracy: number) {
   currentGuess.value += 1
   guessedCountries.value.push(country.code)
   lastAccuracy.value = accuracy

   guesses.value.push({ ...country, accuracy })

   if (!targetCountry.value) return

   const guessedCorrectly = country.code === targetCountry.value.code
   const exhausted = currentGuess.value >= maxGuesses

   if (guessedCorrectly || exhausted) {
      gameOver.value = true
      won.value = guessedCorrectly
   }
}

/**
 * Determine if a country can be guessed.
 */
function isGuessAllowed(code: string) {
   if (gameOver.value) return false
   return !guessedCountries.value.includes(code)
}

/**
 * Update matched pixels bitmap with new matches.
 */
function updateMatchedPixels(newMatches: Uint8Array) {
   if (!matchedPixels.value) {
      // Create a copy to ensure reactivity
      matchedPixels.value = new Uint8Array(newMatches)
   }
   else {
      // Merge with existing matches and create a new array to trigger reactivity
      const merged = new Uint8Array(matchedPixels.value)
      for (let i = 0; i < newMatches.length; i++) {
         if (newMatches[i] === 1) {
            merged[i] = 1
         }
      }
      matchedPixels.value = merged
   }
}

/**
 * Set the difficulty level for the game.
 */
function setDifficulty(newDifficulty: Difficulty) {
   difficulty.value = newDifficulty
}

/**
 * Expose reactive game state and helper actions.
 */
export function useFlagGame() {
   return {
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
   }
}
