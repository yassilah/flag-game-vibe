<script setup lang="ts">
/**
 * Props expected by the canvas component.
 */
const props = defineProps<{
   targetFlagUrl: string | null
   accuracy: number | null
   currentGuess: number
   matchedPixels?: Uint8Array | null
   lastGuessedFlagUrl?: string | null
}>()

/**
 * Reference to the canvas element.
 */
const flagCanvas = ref<HTMLCanvasElement | null>(null)

/**
 * Loaded target flag image.
 */
const targetFlagImage = ref<HTMLImageElement | null>(null)

/**
 * Canvas width in pixels.
 */
const canvasWidth = 600

/**
 * Canvas height in pixels.
 */
const canvasHeight = 400

/**
 * Hue tolerance for color matching (in degrees, 0-360).
 * 30 degrees allows similar shades (e.g., red to dark red, light blue to blue).
 */
const hueTolerance = 30

/**
 * Convert RGB to HSL (Hue, Saturation, Lightness).
 * Returns hue in degrees (0-360), saturation and lightness as percentages (0-100).
 */
function rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
   r /= 255
   g /= 255
   b /= 255

   const max = Math.max(r, g, b)
   const min = Math.min(r, g, b)
   let h = 0
   let s = 0
   const l = (max + min) / 2

   if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
         case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6
            break
         case g:
            h = ((b - r) / d + 2) / 6
            break
         case b:
            h = ((r - g) / d + 4) / 6
            break
      }
   }

   return {
      h: h * 360,
      s: s * 100,
      l: l * 100,
   }
}

/**
 * Check if two colors match based on hue similarity.
 * This allows different shades of the same color to be considered matches.
 */
function colorsMatchByHue(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): boolean {
   const hsl1 = rgbToHsl(r1, g1, b1)
   const hsl2 = rgbToHsl(r2, g2, b2)

   // Handle grayscale colors (saturation near 0) - compare lightness instead
   if (hsl1.s < 10 && hsl2.s < 10) {
      // For grayscale, check if lightness is similar
      return Math.abs(hsl1.l - hsl2.l) < 20
   }

   // If one is grayscale and other isn't, they don't match
   if ((hsl1.s < 10) !== (hsl2.s < 10)) {
      return false
   }

   // Compare hue with tolerance, accounting for wrap-around at 360°
   let hueDiff = Math.abs(hsl1.h - hsl2.h)
   if (hueDiff > 180) {
      hueDiff = 360 - hueDiff
   }

   return hueDiff <= hueTolerance
}

/**
 * True when the accuracy card should be visible.
 */
const shouldShowAccuracy = computed(() => props.currentGuess > 0 && props.accuracy !== null)

/**
 * CSS class for the accuracy text color.
 */
const accuracyColor = computed(() => {
   if ((props.accuracy ?? 0) >= 90) return 'text-green-600 dark:text-green-400'
   if ((props.accuracy ?? 0) >= 70) return 'text-yellow-600 dark:text-yellow-400'
   return 'text-red-600 dark:text-red-400'
})

/**
 * Load an image from a URL.
 */
function loadImage(url: string): Promise<HTMLImageElement> {
   return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = err => reject(err)
      img.src = url
   })
}

/**
 * Draw the default instruction state before any guess.
 */
function drawInitialState() {
   if (!flagCanvas.value) return
   const ctx = flagCanvas.value.getContext('2d')
   if (!ctx) return

   ctx.fillStyle = '#e5e7eb'
   ctx.fillRect(0, 0, canvasWidth, canvasHeight)

   ctx.fillStyle = '#6b7280'
   ctx.font = 'bold 24px Inter, sans-serif'
   ctx.textAlign = 'center'
   ctx.textBaseline = 'middle'
   ctx.fillText('Faites votre première tentative', canvasWidth / 2, canvasHeight / 2)
}

/**
 * Draw the full target flag on the canvas.
 */
function showTargetFlag() {
   if (!flagCanvas.value || !targetFlagImage.value) return
   const ctx = flagCanvas.value.getContext('2d')
   if (!ctx) return

   ctx.clearRect(0, 0, canvasWidth, canvasHeight)
   ctx.drawImage(targetFlagImage.value, 0, 0, canvasWidth, canvasHeight)
}

/**
 * Compute accuracy and get matched pixels between the target and guessed flags.
 * Returns both accuracy percentage and a bitmap of newly matched pixels.
 * Does not draw to canvas - that's done by drawAccumulatedPixels.
 */
function computeMatchedPixels(guessedImage: HTMLImageElement): { accuracy: number, matchedPixels: Uint8Array } {
   if (!targetFlagImage.value) return { accuracy: 0, matchedPixels: new Uint8Array() }

   const tempCanvas1 = document.createElement('canvas')
   const tempCanvas2 = document.createElement('canvas')
   tempCanvas1.width = tempCanvas2.width = canvasWidth
   tempCanvas1.height = tempCanvas2.height = canvasHeight

   const tempCtx1 = tempCanvas1.getContext('2d')
   const tempCtx2 = tempCanvas2.getContext('2d')
   if (!tempCtx1 || !tempCtx2) return { accuracy: 0, matchedPixels: new Uint8Array() }

   tempCtx1.drawImage(targetFlagImage.value, 0, 0, canvasWidth, canvasHeight)
   tempCtx2.drawImage(guessedImage, 0, 0, canvasWidth, canvasHeight)

   const targetData = tempCtx1.getImageData(0, 0, canvasWidth, canvasHeight)
   const guessedData = tempCtx2.getImageData(0, 0, canvasWidth, canvasHeight)

   // Bitmap to track which pixels are newly matched in this guess
   const newlyMatchedPixels = new Uint8Array(canvasWidth * canvasHeight)

   let totalPixels = 0
   let matchingPixels = 0

   for (let i = 0; i < targetData.data.length; i += 4) {
      const pixelIndex = i / 4

      const rTarget = targetData.data[i] ?? 0
      const gTarget = targetData.data[i + 1] ?? 0
      const bTarget = targetData.data[i + 2] ?? 0

      const rGuessed = guessedData.data[i] ?? 0
      const gGuessed = guessedData.data[i + 1] ?? 0
      const bGuessed = guessedData.data[i + 2] ?? 0

      totalPixels += 1

      if (colorsMatchByHue(rTarget, gTarget, bTarget, rGuessed, gGuessed, bGuessed)) {
         matchingPixels += 1
         newlyMatchedPixels[pixelIndex] = 1
      }
   }

   return { accuracy: (matchingPixels / totalPixels) * 100, matchedPixels: newlyMatchedPixels }
}

/**
 * Draw accumulated matched pixels from all previous guesses.
 */
async function drawAccumulatedPixels() {
   if (!flagCanvas.value || !targetFlagImage.value || !props.matchedPixels) return

   const ctx = flagCanvas.value.getContext('2d')
   if (!ctx) return

   // Get target flag data
   const tempCanvas = document.createElement('canvas')
   tempCanvas.width = canvasWidth
   tempCanvas.height = canvasHeight
   const tempCtx = tempCanvas.getContext('2d')
   if (!tempCtx) return

   tempCtx.drawImage(targetFlagImage.value, 0, 0, canvasWidth, canvasHeight)
   const targetData = tempCtx.getImageData(0, 0, canvasWidth, canvasHeight)
   const displayData = ctx.createImageData(canvasWidth, canvasHeight)

   // Render accumulated pixels in their real colors
   for (let pixelIndex = 0; pixelIndex < props.matchedPixels.length; pixelIndex++) {
      if (props.matchedPixels[pixelIndex] === 1) {
         const i = pixelIndex * 4
         displayData.data[i] = targetData.data[i] ?? 0
         displayData.data[i + 1] = targetData.data[i + 1] ?? 0
         displayData.data[i + 2] = targetData.data[i + 2] ?? 0
         displayData.data[i + 3] = 255
      }
      else {
         const i = pixelIndex * 4
         displayData.data[i] = 0
         displayData.data[i + 1] = 0
         displayData.data[i + 2] = 0
         displayData.data[i + 3] = 0
      }
   }

   ctx.putImageData(displayData, 0, 0)

   // Draw the last guessed flag as a transparent overlay if available
   if (props.lastGuessedFlagUrl) {
      try {
         const lastGuessedImage = await loadImage(props.lastGuessedFlagUrl)
         ctx.globalAlpha = 0.15
         ctx.drawImage(lastGuessedImage, 0, 0, canvasWidth, canvasHeight)
         ctx.globalAlpha = 1.0
      }
      catch (err) {
         console.error('Erreur de chargement du dernier drapeau:', props.lastGuessedFlagUrl, err)
      }
   }
}

/**
 * Watch for changes to matched pixels and redraw them.
 */
watch(
   () => props.matchedPixels,
   () => {
      drawAccumulatedPixels()
   },
   { immediate: true },
)

/**
 * Compare the target flag to a guessed flag and return the accuracy percentage and matched pixels.
 */
async function compareWithGuess(guessedFlagUrl: string): Promise<{ accuracy: number, matchedPixels: Uint8Array }> {
   try {
      const guessedImage = await loadImage(guessedFlagUrl)
      return computeMatchedPixels(guessedImage)
   }
   catch (err) {
      console.error('Erreur de chargement du drapeau:', guessedFlagUrl, err)
      return { accuracy: 0, matchedPixels: new Uint8Array() }
   }
}

watch(
   () => props.targetFlagUrl,
   async (url) => {
      if (!url) return
      try {
         targetFlagImage.value = await loadImage(url)
         drawInitialState()
      }
      catch (err) {
         console.error('Impossible de charger le drapeau cible', err)
      }
   },
   { immediate: true },
)

onMounted(() => {
   if (!props.targetFlagUrl) {
      drawInitialState()
   }
})

defineExpose({ compareWithGuess, showTargetFlag, drawInitialState })
</script>

<template>
   <div
      class="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
      style="aspect-ratio: 3/2;"
   >
      <canvas
         ref="flagCanvas"
         :width="canvasWidth"
         :height="canvasHeight"
         class="h-full w-full"
      />

      <div
         v-if="shouldShowAccuracy"
         class="absolute top-4 right-4"
      >
         <UCard :ui="{ body: 'p-3' }">
            <p class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
               Précision
            </p>
            <p
               class="text-2xl font-bold"
               :class="accuracyColor"
            >
               {{ (accuracy ?? 0).toFixed(1) }}%
            </p>
         </UCard>
      </div>
   </div>
</template>

<style scoped>
canvas {
  display: block;
}
</style>
