import { onMounted, onUnmounted } from 'vue'

/**
 * Canvasアニメーション管理用composable
 * requestAnimationFrameを使用した効率的な描画更新を提供
 *
 * @param drawCallback - 描画処理を行うコールバック関数（deltaTimeを受け取り、継続するかどうかを返す）
 * @returns requestRedraw関数を含むオブジェクト
 */
export function useCanvasAnimation(drawCallback: (deltaTime: number) => boolean) {
  let animationFrameId: number | null = null
  let lastTimestamp = 0

  /**
   * アニメーションループを開始
   */
  function startAnimationLoop(): void {
    const animate = (timestamp: number): void => {
      // デルタタイムを計算（秒単位）
      const deltaTime = lastTimestamp === 0 ? 0 : (timestamp - lastTimestamp) / 1000
      lastTimestamp = timestamp

      // 描画コールバックを実行し、継続が必要かチェック
      const shouldContinue = drawCallback(deltaTime)

      if (shouldContinue) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        animationFrameId = null
        lastTimestamp = 0
      }
    }
    animate(0)
  }

  /**
   * 再描画をリクエスト
   * アニメーションループが停止している場合は再開
   */
  function requestRedraw(): void {
    if (animationFrameId === null) {
      lastTimestamp = 0
      startAnimationLoop()
    }
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
