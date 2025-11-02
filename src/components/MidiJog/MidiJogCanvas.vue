<script setup lang="ts">
import { ref, watch } from 'vue'
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
const backgroundImage = ref<HTMLImageElement | null>(null)

/**
 * 背景画像を読み込み
 */
watch(
  () => props.settings.diskBackgroundImage,
  (newImage) => {
    if (newImage) {
      const img = new Image()
      img.onload = () => {
        backgroundImage.value = img
        // 画像読み込み完了後に再描画
        draw()
      }
      img.src = newImage
    } else {
      backgroundImage.value = null
      // 画像削除時も再描画
      draw()
    }
  },
  { immediate: true }
)

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

  // 背景画像（円弧のサイズに合わせて表示）
  if (backgroundImage.value) {
    ctx.save()

    // 円形クリップ領域を作成（円弧のサイズ）
    ctx.beginPath()
    ctx.arc(0, 0, props.settings.arcRadius, 0, Math.PI * 2)
    ctx.clip()

    const radius = props.settings.arcRadius
    const size = radius * 2

    // 画像を円の中心に配置して描画
    ctx.drawImage(backgroundImage.value, -radius, -radius, size, size)
    ctx.restore()
  }

  // マーカー（向きを示す線）
  // 90度の位置（真右）に円中央から外側に伸びる
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(props.settings.markerLength, 0)
  ctx.strokeStyle = props.settings.markerColor
  ctx.lineWidth = props.settings.markerWidth
  ctx.stroke()

  // 中心ディスク（内円）- マーカーの上に描画
  ctx.beginPath()
  ctx.arc(0, 0, props.settings.diskRadius, 0, Math.PI * 2)
  ctx.fillStyle = props.settings.diskColor
  ctx.fill()

  // 円弧（外円）- 一番上に描画
  ctx.beginPath()
  ctx.arc(0, 0, props.settings.arcRadius, 0, Math.PI * 2)
  ctx.strokeStyle = props.settings.arcColor
  ctx.lineWidth = CANVAS_CONFIG.ARC_LINE_WIDTH
  ctx.stroke()

  ctx.restore()
}

defineExpose({
  draw,
})
</script>

<template><canvas id="jogCanvas" width="320" height="320" ref="canvasRef"></canvas></template>

<style scoped></style>
