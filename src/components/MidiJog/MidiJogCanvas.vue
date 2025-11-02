<script setup lang="ts">
import { ref } from 'vue'
import { CANVAS_CONFIG } from '@/constants/canvas'
import type { JogSettings } from '@/types'

/** Props定義 */
interface Props {
  /** 回転角度（ラジアン） */
  angle: number
  /** ジョグホイール設定 */
  settings: JogSettings
}

const props = defineProps<Props>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

/**
 * Canvasに描画
 */
function draw(): void {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  ctx.save()
  ctx.translate(canvasWidth / 2, canvasHeight / 2)
  ctx.rotate(props.angle)

  // 円弧（外円）
  ctx.beginPath()
  ctx.arc(0, 0, CANVAS_CONFIG.ARC_RADIUS, 0, Math.PI * 2)
  ctx.strokeStyle = props.settings.arcColor
  ctx.lineWidth = CANVAS_CONFIG.ARC_LINE_WIDTH
  ctx.stroke()

  // 中心ディスク（内円）
  ctx.beginPath()
  ctx.arc(0, 0, CANVAS_CONFIG.DISK_RADIUS, 0, Math.PI * 2)
  ctx.fillStyle = props.settings.diskColor
  ctx.fill()

  // マーカー（向きを示す線）
  ctx.beginPath()
  ctx.moveTo(0, CANVAS_CONFIG.MARKER_START_Y)
  ctx.lineTo(0, CANVAS_CONFIG.MARKER_END_Y)
  ctx.strokeStyle = props.settings.markerColor
  ctx.lineWidth = CANVAS_CONFIG.MARKER_LINE_WIDTH
  ctx.stroke()
  ctx.restore()
}

defineExpose({
  draw,
})
</script>

<template>
  <main>
    <canvas id="jogCanvas" width="300" height="300" ref="canvasRef"></canvas>
  </main>
</template>

<style scoped>
main {
  background-color: #0f0;
  height: 300px;
}
</style>
