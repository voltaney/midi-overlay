<script setup>
import { ref, onMounted, watch } from 'vue'
import MidiJogCanvas from './MidiJogCanvas.vue'
import MidiJogSettings from './MidiJogSettings.vue'
import { useJogSettings } from '../../composables/useJogSettings'
import { useMidiInput } from '../../composables/useMidiInput'
import { useCanvasAnimation } from '../../composables/useCanvasAnimation'

const { settings } = useJogSettings()

const angle = ref(0) // refに変更
const canvasRef = ref(null)

// Canvas描画
const { requestRedraw } = useCanvasAnimation(() => {
  canvasRef.value?.draw()
})

// MIDIメッセージ処理
function onMIDIMessage(msg) {
  const [, , data2] = msg.data

  if (data2 === 127 || data2 === 0) {
    return
  }

  const delta = data2 - 64
  if (delta !== 0) {
    angle.value += delta * settings.rotationSpeed // .valueを追加
    requestRedraw()
  }
}

// MIDI入力初期化
useMidiInput(onMIDIMessage)

// 設定変更時も再描画
watch(
  settings,
  () => {
    requestRedraw()
  },
  { deep: true }
)

onMounted(() => {
  console.log('draw once on mounted')
  requestRedraw()
})
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="../../assets/logo.svg" width="125" height="125" />
    <div class="wrapper"></div>
  </header>

  <MidiJogCanvas ref="canvasRef" :angle="angle" :settings="settings" />

  <MidiJogSettings
    v-model:rotation-speed="settings.rotationSpeed"
    v-model:arc-color="settings.arcColor"
    v-model:marker-color="settings.markerColor"
    v-model:disk-color="settings.diskColor"
  />
</template>

<style scoped>
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
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    flex-direction: column;
  }
}
</style>
