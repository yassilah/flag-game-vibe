<script setup lang="ts">
import type { Language } from '~/composables/useLanguage'
import { useLanguage, languageLabels } from '~/composables/useLanguage'

const { selectedLanguage, setLanguage, availableLanguages } = useLanguage()

const isOpen = ref(false)
</script>

<template>
   <div class="relative">
      <UButton
         :color="isOpen ? 'primary' : 'gray'"
         variant="soft"
         icon="i-heroicons-globe-alt"
         size="sm"
         @click="isOpen = !isOpen"
      >
         <span class="hidden sm:inline">
            {{ selectedLanguage.toUpperCase() }}
         </span>
      </UButton>

      <div
         v-if="isOpen"
         class="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
      >
         <button
            v-for="lang in availableLanguages"
            :key="lang"
            :aria-label="`Select ${lang}`"
            class="w-full px-4 py-3 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            :class="{
               'bg-blue-50 font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-300': selectedLanguage === lang,
            }"
            @click="setLanguage(lang as Language); isOpen = false"
         >
            {{ languageLabels[lang as Language] }}
         </button>
      </div>
   </div>
</template>
