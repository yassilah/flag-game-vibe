<script setup lang="ts">
interface Props {
   show: boolean
}

defineProps<Props>()

const particles = ref<Array<{
   id: number
   x: number
   y: number
   vx: number
   vy: number
   life: number
   color: string
}>>([])

let particleId = 0
let animationFrame: number | null = null

function createFireworks() {
   particles.value = []
   const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6bcf7f', '#ff9ff3', '#54a0ff']

   // Create multiple bursts
   for (let burst = 0; burst < 5; burst++) {
      setTimeout(() => {
         const x = Math.random() * 0.6 + 0.2
         const y = Math.random() * 0.4 + 0.2

         for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30
            const velocity = 2 + Math.random() * 3
            particles.value.push({
               id: particleId++,
               x,
               y,
               vx: Math.cos(angle) * velocity,
               vy: Math.sin(angle) * velocity,
               life: 1,
               color: colors[Math.floor(Math.random() * colors.length)],
            })
         }
      }, burst * 150)
   }

   animate()
}

function animate() {
   particles.value = particles.value
      .map(p => ({
         ...p,
         x: p.x + p.vx * 0.02,
         y: p.y + p.vy * 0.02 + 0.01,
         vy: p.vy * 0.98,
         life: p.life - 0.02,
      }))
      .filter(p => p.life > 0)

   if (particles.value.length > 0) {
      animationFrame = requestAnimationFrame(animate)
   }
}

watch(
   () => show,
   (newShow) => {
      if (newShow) {
         createFireworks()
      }
   },
)

onUnmounted(() => {
   if (animationFrame) {
      cancelAnimationFrame(animationFrame)
   }
})
</script>

<template>
   <div
      v-if="show"
      class="pointer-events-none fixed inset-0 overflow-hidden"
   >
      <svg
         class="h-full w-full"
         xmlns="http://www.w3.org/2000/svg"
      >
         <circle
            v-for="particle in particles"
            :key="particle.id"
            :cx="`${particle.x * 100}%`"
            :cy="`${particle.y * 100}%`"
            :r="2"
            :fill="particle.color"
            :opacity="particle.life"
         />
      </svg>
   </div>
</template>
