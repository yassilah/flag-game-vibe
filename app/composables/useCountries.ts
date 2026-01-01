import type { Language } from './useLanguage'
import type { Country } from '~/types/country'

/**
 * Composable that fetches and caches country data from REST Countries.
 */

/**
 * Cached list of countries.
 */
const countries = ref<Country[]>([])

/**
 * Cached language for current country list.
 */
const cachedLanguage = ref<Language | null>(null)

/**
 * Raw data with area info for filtering.
 */
const countriesWithArea = ref<any[]>([])

/**
 * Loading state for the countries request.
 */
const loading = ref(false)

/**
 * Error message if the request fails.
 */
const error = ref<string | null>(null)

/**
 * Map REST Countries payload to the internal `Country` shape.
 * If localizations are available, use the specified language.
 */
function mapCountry(payload: any, language: Language): Country {
   let name = payload?.name?.common ?? 'Unknown'

   // Try to get localized name
   if (language !== 'eng' && payload?.translations?.[language]) {
      name = payload.translations[language].common ?? name
   }

   return {
      code: payload?.cca2 ?? '',
      name,
      flag: payload?.flags?.svg ?? payload?.flags?.png ?? '',
      emoji: payload?.flag ?? '🏳️',
   }
}

/**
 * Filter countries by area threshold based on difficulty.
 */
function filterByDifficulty(data: any[], difficulty: 'easy' | 'medium' | 'hard' | 'extreme'): any[] {
   const thresholds: Record<string, number> = {
      easy: 50000,
      medium: 20000,
      hard: 10000,
      extreme: 0,
   }

   const threshold = thresholds[difficulty] ?? 0
   return data.filter((country) => {
      const area = country?.area ?? Infinity
      return area >= threshold
   })
}

/**
 * Fetch countries from REST Countries once and cache the result.
 */
async function fetchCountries(language: Language = 'eng'): Promise<Country[]> {
   if (cachedLanguage.value === language && countries.value.length > 0) {
      return countries.value
   }

   loading.value = true
   error.value = null

   try {
      const response = await $fetch<any[]>(
         'https://restcountries.com/v3.1/all',
         { query: { fields: 'name,cca2,flags,flag,translations,area' } },
      )

      countriesWithArea.value = response || []

      const mapped = (response || [])
         .map(payload => mapCountry(payload, language))
         .filter(country => country.code && country.flag)
         .sort((a, b) => a.name.localeCompare(b.name, language))

      countries.value = mapped
      cachedLanguage.value = language
   }
   catch (err: any) {
      error.value = err?.message || 'Impossible de charger les pays.'
   }
   finally {
      loading.value = false
   }

   return countries.value
}

/**
 * Get countries filtered by difficulty.
 */
function getCountriesByDifficulty(difficulty: 'easy' | 'medium' | 'hard' | 'extreme'): Country[] {
   const filteredData = filterByDifficulty(countriesWithArea.value, difficulty)
   const codes = new Set(filteredData.map(c => c.cca2))
   return countries.value.filter(c => codes.has(c.code))
}

/**
 * Expose reactive country state and actions.
 */
export function useCountries() {
   return {
      countries,
      loading,
      error,
      fetchCountries,
      getCountriesByDifficulty,
   }
}
