<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import MidiJogCanvas from './MidiJogCanvas.vue'
import MidiJogSettings from './MidiJogSettings.vue'
import { useJogSettings } from '@/composables/useJogSettings'
import { useMidiInput } from '@/composables/useMidiInput'
import { useCanvasAnimation } from '@/composables/useCanvasAnimation'
import { logger } from '@/utils/logger'
import { MIDI_VALUES } from '@/constants/midi'
import type { MidiMessage } from '@/types'

const { settings } = useJogSettings()

/** 回転角度（ラジアン） */
const angle = ref(0)
/** Canvasコンポーネントの参照 */
const canvasRef = ref<InstanceType<typeof MidiJogCanvas> | null>(null)

/** Canvas描画処理 */
const { requestRedraw } = useCanvasAnimation(() => {
  canvasRef.value?.draw()
})

/**
 * MIDIメッセージ処理
 * ジョグホイールの回転操作を検出して角度を更新
 */
function onMIDIMessage(msg: MidiMessage): void {
  const [, , data2] = msg.data

  // 最大値・最小値は無視
  if (data2 === MIDI_VALUES.MAX_VALUE || data2 === MIDI_VALUES.MIN_VALUE) {
    return
  }

  // 中央値からの差分で回転方向と量を計算
  const delta = data2 - MIDI_VALUES.NEUTRAL_VALUE
  if (delta !== 0) {
    angle.value += delta * settings.rotationSpeed
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
  logger.debug('初回描画を実行')
  requestRedraw()
})
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="../../assets/logo.svg" width="125" height="125" />
    <div class="wrapper"></div>
  </header>

  <MidiJogCanvas ref="canvasRef" :angle="angle" :settings="settings" />

  <MidiJogSettings :settings="settings" @update:settings="Object.assign(settings, $event)" />
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
