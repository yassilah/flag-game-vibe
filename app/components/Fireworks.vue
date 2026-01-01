<script setup lang="ts">
const particles = ref<Array<{
   id: number
   x: number
   y: number
   vx: number
   vy: number
   life: number
   color: string
   size: number
   maxLife: number
}>>([])

let particleId = 0
let animationFrame: number | null = null
const colors = ['#ff1744', '#f50057', '#d500f9', '#651fff', '#2979f3', '#00b0ff', '#00e5ff', '#1de9b6', '#00e676', '#76ff03', '#ffea00', '#ffc400', '#ff9100', '#ff3d00']

function createParticleBurst() {
   const x = Math.random() * 0.6 + 0.2
   const y = Math.random() * 0.6 + 0.1

   for (let i = 0; i < 50; i++) {
      const angle = (Math.PI * 2 * i) / 50 + (Math.random() - 0.5) * 0.3
      const velocity = 4 + Math.random() * 5
      const size = 2 + Math.random() * 3
      particles.value.push({
         id: particleId++,
         x,
         y,
         vx: Math.cos(angle) * velocity,
         vy: Math.sin(angle) * velocity,
         life: 1,
         maxLife: 1,
         color: colors[Math.floor(Math.random() * colors.length)] || '#ffffff',
         size,
      })
   }
}

function animate() {
   particles.value = particles.value
      .map(p => ({
         ...p,
         x: p.x + p.vx * 0.002,
         y: p.y + p.vy * 0.002 + 0.001,
         vx: p.vx * 0.99,
         vy: p.vy * 0.99,
         life: p.life - 0.001,
      }))
      .filter(p => p.life > 0)

   animationFrame = requestAnimationFrame(animate)
}

let burstInterval: NodeJS.Timeout | null = null

onMounted(() => {
   animate()
   burstInterval = setInterval(createParticleBurst, 600)
})

onUnmounted(() => {
   if (animationFrame) {
      cancelAnimationFrame(animationFrame)
   }
   if (burstInterval) {
      clearInterval(burstInterval)
   }
})
</script>

<template>
   <div
      class="pointer-events-none fixed inset-0 overflow-hidden"
   >
      <svg
         class="h-full w-full"
         xmlns="http://www.w3.org/2000/svg"
      >
         <defs>
            <filter id="glow">
               <feGaussianBlur
                  stdDeviation="2"
                  result="coloredBlur"
               />
               <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
               </feMerge>
            </filter>
         </defs>
         <circle
            v-for="particle in particles"
            :key="particle.id"
            :cx="`${particle.x * 100}%`"
            :cy="`${particle.y * 100}%`"
            :r="particle.size * (particle.life * 0.8 + 0.2)"
            :fill="particle.color"
            :opacity="particle.life"
            filter="url(#glow)"
         />
      </svg>
   </div>
</template>
