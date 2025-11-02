<script setup>
import HelloWorld from './components/HelloWorld.vue'
import ButtonCounter from './components/ButtonCounter.vue'
import { ref, watch, computed, reactive, onMounted, onUnmounted } from 'vue'

let angle = 0
const canvasRef = ref(null)

const LOCAL_STORAGE_KEY = 'MidiOverlaySettings'

// 設定（localStorageと同期）
const settings = reactive({
  rotationSpeed: 0.04, // 回転速度
  arcColor: '#00ffff', // 円弧の色
})

// アニメーションフレーム管理
let animationFrameId = null
let needsRedraw = false

onMounted(() => {
  loadSettings()
  if (!navigator.requestMIDIAccess) {
    console.error('このブラウザはWebMIDIに対応していません。Chrome系でお試しください。')
    return
  }
  navigator.requestMIDIAccess({ sysex: true }).then(
    (midiAccess) => {
      console.log('MIDIアクセスに成功しました。')
      for (const input of midiAccess.inputs.values()) {
        attachInput(input)
      }
      midiAccess.onstatechange = (e) => {
        console.log(e)
        if (e.port.type === 'input' && e.port.state === 'connected') {
          attachInput(e.port)
        }
      }
    },
    (err) => {
      console.error(`MIDIアクセスに失敗: ${err}`)
    }
  )
  drawCanvas()

  startAnimationLoop()
})

onUnmounted(() => {
  // クリーンアップ
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

// 設定が変更されたらlocalStorageに保存＆再描画
watch(
  settings,
  (newSettings) => {
    saveSettings(newSettings)
    needsRedraw = true
  },
  { deep: true }
)

function loadSettings() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      settings.rotationSpeed = parsed.rotationSpeed ?? 0.04
      settings.arcColor = parsed.arcColor ?? '#00ffff'
    }
  } catch (e) {
    console.error('設定の読み込みに失敗:', e)
  }
}

function saveSettings(newSettings) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSettings))
  } catch (e) {
    console.error('設定の保存に失敗:', e)
  }
}

function startAnimationLoop() {
  const animate = () => {
    // 再描画が必要な場合のみ描画
    if (needsRedraw) {
      drawCanvas()
      needsRedraw = false
    }

    animationFrameId = requestAnimationFrame(animate)
  }

  animate()
}

function drawCanvas() {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.rotate(angle)

  // 円弧
  ctx.beginPath()
  ctx.arc(0, 0, 120, 0, Math.PI * 2)
  ctx.strokeStyle = settings.arcColor
  ctx.lineWidth = 6
  ctx.stroke()

  // 中心ディスク
  ctx.beginPath()
  ctx.arc(0, 0, 40, 0, Math.PI * 2)
  // 色に透明度を追加
  const rgb = hexToRgb(settings.arcColor)
  ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`
  ctx.fill()

  // 向きがわかるようにマーカー
  ctx.beginPath()
  ctx.moveTo(0, -110)
  ctx.lineTo(0, -80)
  ctx.strokeStyle = settings.arcColor
  ctx.lineWidth = 4
  ctx.stroke()
  ctx.restore()
}
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 255, b: 255 }
}
function attachInput(input) {
  input.onmidimessage = onMIDIMessage
}
function onMIDIMessage(msg) {
  const [, , data2] = msg.data

  if (data2 === 127 || data2 === 0) {
    return
  }
  const delta = data2 - 64
  if (delta !== 0) {
    angle += delta * settings.rotationSpeed
    needsRedraw = true
  }
}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper"></div>
  </header>
  <main>
    <canvas id="jogCanvas" width="300" height="300" ref="canvasRef"></canvas>
  </main>
  <aside>
    <h2>設定</h2>
    <h3>MIDI機器</h3>
    <div class="settings">
      <div class="setting-item">
        <label for="rotationSpeed">回転速度:</label>
        <input
          id="rotationSpeed"
          type="range"
          v-model.number="settings.rotationSpeed"
          min="0.01"
          max="0.2"
          step="0.01"
        />
        <span>{{ settings.rotationSpeed.toFixed(2) }}</span>
      </div>

      <div class="setting-item">
        <label for="arcColor">円弧の色:</label>
        <input id="arcColor" type="color" v-model="settings.arcColor" />
        <span>{{ settings.arcColor }}</span>
      </div>
    </div>
  </aside>
  <!-- <main>
    <TheWelcome />
  </main> -->
</template>

<style scoped>
main {
  background-color: #0f0;
  height: 300px;
}

aside {
  display: flex;
  flex-direction: column;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    /* place-items: center; */
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    flex-direction: column;
    /* place-items: flex-start; */
    /* flex-wrap: wrap; */
  }
}
</style>
