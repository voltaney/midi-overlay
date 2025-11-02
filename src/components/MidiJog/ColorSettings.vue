<script setup lang="ts">
import { getOpacityFromHex, setOpacityToHex } from '@/utils/colorUtils'

/** Props定義 */
interface Props {
  /** カラー値 (#RRGGBBAA形式) */
  modelValue: string
  /** ラベル */
  label: string
}

const props = defineProps<Props>()

/** Emits定義 */
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

/**
 * 色を更新（透明度は維持）
 */
function updateColor(newColor: string): void {
  const alpha = props.modelValue.slice(7, 9)
  emit('update:modelValue', newColor + alpha)
}

/**
 * 透明度を更新
 */
function updateOpacity(opacityStr: string): void {
  const opacity = parseFloat(opacityStr)
  emit('update:modelValue', setOpacityToHex(props.modelValue, opacity))
}
</script>

<template>
  <div class="color-setting">
    <h4>{{ label }}</h4>
    <div class="color-controls">
      <input
        type="color"
        :value="modelValue.slice(0, 7)"
        @input="updateColor(($event.target as HTMLInputElement).value)"
      />
      <div class="opacity-control">
        <label>透明度:</label>
        <input
          type="range"
          :value="getOpacityFromHex(modelValue)"
          @input="updateOpacity(($event.target as HTMLInputElement).value)"
          min="0"
          max="1"
          step="0.01"
        />
        <span>{{ getOpacityFromHex(modelValue) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-setting {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.color-setting h4 {
  margin: 0;
  font-size: 0.95em;
}

.color-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-controls input[type='color'] {
  width: 60px;
  height: 40px;
  border: none;
  cursor: pointer;
}

.opacity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.opacity-control label {
  font-size: 0.9em;
  min-width: 60px;
}

.opacity-control input[type='range'] {
  flex: 1;
}

.opacity-control span {
  font-size: 0.9em;
  color: #666;
  min-width: 35px;
}
</style>
