/**
 * Composable for managing language preference.
 */

/**
 * Available languages for country names.
 */
export type Language = 'eng' | 'fra' | 'esp' | 'deu' | 'ita' | 'por' | 'nld' | 'jap' | 'zho'

/**
 * Language labels
 */
export const languageLabels: Record<Language, string> = {
   eng: '🇬🇧 English',
   fra: '🇫🇷 Français',
   esp: '🇪🇸 Español',
   deu: '🇩🇪 Deutsch',
   ita: '🇮🇹 Italiano',
   por: '🇵🇹 Português',
   nld: '🇳🇱 Nederlands',
   jap: '🇯🇵 日本語',
   zho: '🇨🇳 中文',
}

/**
 * Global singleton state for language
 */
let _selectedLanguage: Ref<Language> | null = null
let _isInitialized: Ref<boolean> | null = null

function getSelectedLanguage(): Ref<Language> {
   if (!_selectedLanguage) {
      _selectedLanguage = ref<Language>('eng')
   }
   return _selectedLanguage
}

function getIsInitialized(): Ref<boolean> {
   if (!_isInitialized) {
      _isInitialized = ref(false)
   }
   return _isInitialized
}

function initializeLanguage() {
   const isInitialized = getIsInitialized()
   const selectedLanguage = getSelectedLanguage()

   if (import.meta.client && !isInitialized.value) {
      const stored = localStorage.getItem('flaggle-language')
      if (stored && stored in languageLabels) {
         selectedLanguage.value = stored as Language
      }
      isInitialized.value = true
   }
}

function setLanguage(lang: Language) {
   const selectedLanguage = getSelectedLanguage()
   selectedLanguage.value = lang
   if (import.meta.client) {
      localStorage.setItem('flaggle-language', lang)
   }
}

/**
 * Expose reactive language state and actions.
 */
export function useLanguage() {
   const selectedLanguage = getSelectedLanguage()
   const availableLanguages = Object.keys(languageLabels) as Language[]

   return {
      selectedLanguage,
      setLanguage,
      initializeLanguage,
      availableLanguages,
      languageLabels,
   }
}
