<script setup>
import { ref } from 'vue'

const props = defineProps({
  angle: {
    type: Number,
    required: true,
  },
  settings: {
    type: Object,
    required: true,
  },
})

const canvasRef = ref(null)

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.rotate(props.angle)

  // 円弧
  ctx.beginPath()
  ctx.arc(0, 0, 120, 0, Math.PI * 2)
  ctx.strokeStyle = props.settings.arcColor
  ctx.lineWidth = 6
  ctx.stroke()

  // 中心ディスク
  ctx.beginPath()
  ctx.arc(0, 0, 40, 0, Math.PI * 2)
  ctx.fillStyle = props.settings.diskColor
  ctx.fill()

  // 向きがわかるようにマーカー
  ctx.beginPath()
  ctx.moveTo(0, -110)
  ctx.lineTo(0, -80)
  ctx.strokeStyle = props.settings.markerColor
  ctx.lineWidth = 4
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
