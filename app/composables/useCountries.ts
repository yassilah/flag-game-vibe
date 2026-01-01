import type { Country } from '~/types/country'

/**
 * Composable that fetches and caches country data from REST Countries.
 */

/**
 * Cached list of countries.
 */
const countries = ref<Country[]>([])

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
 */
function mapCountry(payload: any): Country {
   return {
      code: payload?.cca2 ?? '',
      name: payload?.name?.common ?? 'Unknown',
      flag: payload?.flags?.svg ?? payload?.flags?.png ?? '',
      emoji: payload?.flag ?? '🏳️',
   }
}

/**
 * Fetch countries from REST Countries once and cache the result.
 */
async function fetchCountries(): Promise<Country[]> {
   if (countries.value.length > 0 || loading.value) {
      return countries.value
   }

   loading.value = true
   error.value = null

   try {
      const response = await $fetch<any[]>(
         'https://restcountries.com/v3.1/all',
         { query: { fields: 'name,cca2,flags,flag' } },
      )

      const mapped = (response || [])
         .map(mapCountry)
         .filter(country => country.code && country.flag)
         .sort((a, b) => a.name.localeCompare(b.name))

      countries.value = mapped
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
