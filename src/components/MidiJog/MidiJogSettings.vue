<script setup lang="ts">
import ColorSetting from './ColorSettings.vue'
import type { JogSettings } from '@/types'

/** Props定義 */
interface Props {
  /** ジョグホイール設定 */
  settings: JogSettings
}

defineProps<Props>()

/** Emits定義 */
const emit = defineEmits<{
  'update:settings': [updates: Partial<JogSettings>]
}>()

/**
 * 設定を更新
 * 部分的な更新をemit
 */
function updateSettings(updates: Partial<JogSettings>): void {
  emit('update:settings', updates)
}
</script>

<template>
  <aside>
    <h2>設定</h2>
    <h3>MIDI機器</h3>

    <div class="settings">
      <div class="setting-item">
        <label for="rotationSpeed">回転速度:</label>
        <input
          id="rotationSpeed"
          type="range"
          :value="settings.rotationSpeed"
          @input="updateSettings({ rotationSpeed: Number(($event.target as HTMLInputElement).value) })"
          min="0.01"
          max="0.2"
          step="0.01"
        />
        <span>{{ settings.rotationSpeed.toFixed(2) }}</span>
      </div>

      <ColorSetting
        :model-value="settings.arcColor"
        @update:model-value="updateSettings({ arcColor: $event })"
        label="円弧の色"
      />

      <ColorSetting
        :model-value="settings.markerColor"
        @update:model-value="updateSettings({ markerColor: $event })"
        label="マーカーの色"
      />

      <ColorSetting
        :model-value="settings.diskColor"
        @update:model-value="updateSettings({ diskColor: $event })"
        label="中央ディスクの色"
      />
    </div>
  </aside>
</template>

<style scoped>
aside {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-item label {
  font-weight: bold;
}

.setting-item input[type='range'] {
  width: 100%;
}

.setting-item span {
  font-size: 0.9em;
  color: #666;
}
</style>
