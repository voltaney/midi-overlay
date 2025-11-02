import { ref, onMounted, onUnmounted } from 'vue'

export function useCanvasAnimation(drawCallback) {
  let animationFrameId = null
  const needsRedraw = ref(false)

  function startAnimationLoop() {
    const animate = () => {
      if (needsRedraw.value) {
        drawCallback()
        needsRedraw.value = false
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  }

  function requestRedraw() {
    needsRedraw.value = true
  }

  onMounted(() => {
    startAnimationLoop()
  })

  onUnmounted(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  })

  return {
    requestRedraw,
  }
}
