import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Canvasアニメーション管理用composable
 * requestAnimationFrameを使用した効率的な描画更新を提供
 *
 * @param drawCallback - 描画処理を行うコールバック関数
 * @returns requestRedraw関数を含むオブジェクト
 */
export function useCanvasAnimation(drawCallback: () => void) {
  let animationFrameId: number | null = null
  const needsRedraw = ref(false)

  /**
   * アニメーションループを開始
   */
  function startAnimationLoop(): void {
    const animate = (): void => {
      if (needsRedraw.value) {
        drawCallback()
        needsRedraw.value = false
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  }

  /**
   * 再描画をリクエスト
   */
  function requestRedraw(): void {
    needsRedraw.value = true
  }

  onMounted(() => {
    startAnimationLoop()
  })

  onUnmounted(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
  })

  return {
    requestRedraw,
  }
}
