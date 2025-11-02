<script setup>
import ColorSetting from './ColorSettings.vue'

defineProps({
  rotationSpeed: {
    type: Number,
    required: true,
  },
  arcColor: {
    type: String,
    required: true,
  },
  markerColor: {
    type: String,
    required: true,
  },
  diskColor: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:rotationSpeed',
  'update:arcColor',
  'update:markerColor',
  'update:diskColor',
])
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
          :value="rotationSpeed"
          @input="emit('update:rotationSpeed', Number($event.target.value))"
          min="0.01"
          max="0.2"
          step="0.01"
        />
        <span>{{ rotationSpeed.toFixed(2) }}</span>
      </div>

      <ColorSetting
        :model-value="arcColor"
        @update:model-value="emit('update:arcColor', $event)"
        label="円弧の色"
      />

      <ColorSetting
        :model-value="markerColor"
        @update:model-value="emit('update:markerColor', $event)"
        label="マーカーの色"
      />

      <ColorSetting
        :model-value="diskColor"
        @update:model-value="emit('update:diskColor', $event)"
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
