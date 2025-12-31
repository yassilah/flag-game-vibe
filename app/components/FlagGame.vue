<template>
  <div class="max-w-4xl mx-auto">
    <!-- Zone d'affichage du drapeau progressif -->
    <div class="bg-white rounded-2xl shadow-xl p-8 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          Essai {{ currentGuess }}/{{ maxGuesses }}
        </h2>
        <button 
          v-if="gameOver"
          @click="resetGame"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Nouveau jeu
        </button>
      </div>
      
      <!-- Canvas pour le drapeau progressif -->
      <div class="relative bg-gray-100 rounded-lg overflow-hidden" style="aspect-ratio: 3/2;">
        <canvas 
          ref="flagCanvas" 
          :width="600" 
          :height="400"
          class="w-full h-full"
        ></canvas>
      </div>

      <!-- Message de résultat -->
      <div v-if="gameOver" class="mt-4 p-4 rounded-lg" :class="won ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        <p class="text-lg font-semibold text-center">
          {{ won ? '🎉 Bravo ! Vous avez trouvé !' : `😢 Perdu ! C'était ${targetCountry.name}` }}
        </p>
      </div>
    </div>

    <!-- Zone de sélection -->
    <div v-if="!gameOver" class="bg-white rounded-2xl shadow-xl p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Sélectionnez un pays :</h3>
      
      <!-- Barre de recherche -->
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher un pays..."
        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-indigo-500 focus:outline-none"
      />

      <!-- Liste des pays filtrés -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
        <button
          v-for="country in filteredCountries"
          :key="country.code"
          @click="makeGuess(country)"
          :disabled="guessedCountries.includes(country.code)"
          class="flex items-center gap-2 p-3 border-2 rounded-lg transition hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="guessedCountries.includes(country.code) ? 'border-gray-300 bg-gray-50' : 'border-gray-300'"
        >
          <span class="text-2xl">{{ country.emoji }}</span>
          <span class="text-sm font-medium text-gray-700">{{ country.name }}</span>
        </button>
      </div>
    </div>

    <!-- Historique des tentatives -->
    <div v-if="guesses.length > 0" class="bg-white rounded-2xl shadow-xl p-6 mt-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Vos tentatives :</h3>
      <div class="space-y-2">
        <div 
          v-for="(guess, index) in guesses" 
          :key="index"
          class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
        >
          <span class="text-2xl">{{ guess.emoji }}</span>
          <span class="font-medium text-gray-700">{{ guess.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { countries } from '../data/countries'

const maxGuesses = 5
const currentGuess = ref(0)
const guesses = ref([])
const guessedCountries = ref([])
const targetCountry = ref(null)
const gameOver = ref(false)
const won = ref(false)
const searchQuery = ref('')
const flagCanvas = ref(null)

// Image du drapeau cible
const targetFlagImage = ref(null)

// Pays filtrés par recherche
const filteredCountries = computed(() => {
  if (!searchQuery.value) {
    return countries
  }
  const query = searchQuery.value.toLowerCase()
  return countries.filter(country => 
    country.name.toLowerCase().includes(query)
  )
})

// Initialiser le jeu
const initGame = () => {
  // Sélectionner un pays aléatoire
  targetCountry.value = countries[Math.floor(Math.random() * countries.length)]
  currentGuess.value = 0
  guesses.value = []
  guessedCountries.value = []
  gameOver.value = false
  won.value = false
  searchQuery.value = ''
  
  // Charger l'image du drapeau
  loadTargetFlag()
}

// Charger l'image du drapeau cible
const loadTargetFlag = () => {
  targetFlagImage.value = new Image()
  targetFlagImage.value.crossOrigin = 'anonymous'
  targetFlagImage.value.onload = () => {
    drawProgressiveFlag()
  }
  targetFlagImage.value.src = targetCountry.value.flag
}

// Dessiner le drapeau progressivement
const drawProgressiveFlag = () => {
  if (!flagCanvas.value || !targetFlagImage.value) return
  
  const ctx = flagCanvas.value.getContext('2d')
  const canvas = flagCanvas.value
  
  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  if (currentGuess.value === 0) {
    // Avant la première tentative, afficher un fond gris
    ctx.fillStyle = '#e5e7eb'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    return
  }
  
  // Calculer le pourcentage de révélation
  const revealPercentage = currentGuess.value / maxGuesses
  
  // Dessiner l'image complète
  ctx.drawImage(targetFlagImage.value, 0, 0, canvas.width, canvas.height)
  
  // Appliquer un filtre de pixelisation inversé (plus on devine, moins c'est pixelisé)
  const pixelSize = Math.max(1, Math.floor(30 * (1 - revealPercentage)))
  
  if (pixelSize > 1) {
    // Obtenir les données de l'image
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    // Pixeliser
    for (let y = 0; y < canvas.height; y += pixelSize) {
      for (let x = 0; x < canvas.width; x += pixelSize) {
        // Obtenir la couleur du pixel
        const pixelIndex = (y * canvas.width + x) * 4
        const r = imageData.data[pixelIndex]
        const g = imageData.data[pixelIndex + 1]
        const b = imageData.data[pixelIndex + 2]
        
        // Remplir le bloc avec cette couleur
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.fillRect(x, y, pixelSize, pixelSize)
      }
    }
  }
}

// Faire une tentative
const makeGuess = (country) => {
  if (gameOver.value || guessedCountries.value.includes(country.code)) {
    return
  }
  
  currentGuess.value++
  guesses.value.push(country)
  guessedCountries.value.push(country.code)
  
  // Vérifier si c'est le bon drapeau
  if (country.code === targetCountry.value.code) {
    won.value = true
    gameOver.value = true
  } else if (currentGuess.value >= maxGuesses) {
    gameOver.value = true
  }
  
  // Redessiner le drapeau avec plus de détails
  drawProgressiveFlag()
}

// Réinitialiser le jeu
const resetGame = () => {
  initGame()
}

// Initialiser au montage
onMounted(() => {
  initGame()
})

// Observer les changements de targetFlagImage
watch(() => targetFlagImage.value, () => {
  if (targetFlagImage.value) {
    drawProgressiveFlag()
  }
})
</script>

<style scoped>
/* Personnalisation de la scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
