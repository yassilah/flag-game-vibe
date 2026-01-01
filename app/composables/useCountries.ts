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
         { query: { fields: 'name,cca2,flags,flag,translations' } },
      )

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
 * Expose reactive country state and actions.
 */
export function useCountries() {
   return {
      countries,
      loading,
      error,
      fetchCountries,
   }
}
