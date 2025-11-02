<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import MidiJogCanvas from './MidiJogCanvas.vue'
import MidiJogSettings from './MidiJogSettings.vue'
import { useJogSettings } from '@/composables/useJogSettings'
import { useMidiInput } from '@/composables/useMidiInput'
import { useCanvasAnimation } from '@/composables/useCanvasAnimation'
import { useInertialRotation, type InertiaSettings } from '@/composables/useInertialRotation'
import { logger } from '@/utils/logger'
import { MIDI_VALUES } from '@/constants/midi'
import type { MidiMessage } from '@/types'

const { settings } = useJogSettings()

/** Canvasコンポーネントの参照 */
const canvasRef = ref<InstanceType<typeof MidiJogCanvas> | null>(null)

/** 慣性設定（settingsから必要な値を抽出） */
const inertiaSettings = computed<InertiaSettings>(() => ({
  decayRate: settings.inertiaDecayRate,
  minVelocity: settings.inertiaMinVelocity,
}))

/** 慣性付き回転管理 */
const { angle, addVelocity, update } = useInertialRotation(inertiaSettings)

/** Canvas描画処理 */
const { requestRedraw } = useCanvasAnimation((deltaTime: number) => {
  // 慣性計算を実行
  const shouldContinue = update(deltaTime)

  // Canvas描画
  canvasRef.value?.draw()

  // 描画継続が必要かどうかを返す
  return shouldContinue
})

/**
 * MIDIメッセージ処理
 * ジョグホイールの回転操作を検出して速度を加算
 */
function onMIDIMessage(msg: MidiMessage): void {
  const [, , data2] = msg.data

  // 最大値・最小値は無視
  if (data2 === MIDI_VALUES.MAX_VALUE || data2 === MIDI_VALUES.MIN_VALUE) {
    return
  }

  // 中央値からの差分で回転方向と量を計算し、速度に加算
  const delta = data2 - MIDI_VALUES.NEUTRAL_VALUE
  if (delta !== 0) {
    addVelocity(delta * settings.rotationSpeed)
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
  <main>
    <MidiJogCanvas ref="canvasRef" :angle="angle" :settings="settings" />
  </main>
  <MidiJogSettings :settings="settings" @update:settings="Object.assign(settings, $event)" />
</template>

<style scoped>
main {
  background-color: #0f0;
  padding: 20px;
}
</style>
