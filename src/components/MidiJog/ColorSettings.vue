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
    <label>{{ label }}:</label>
    <input
      type="color"
      :value="modelValue.slice(0, 7)"
      @input="updateColor(($event.target as HTMLInputElement).value)"
    />
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
</template>

<style scoped>
.color-setting {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.color-setting label {
  font-weight: 600;
  font-size: 0.85em;
  color: #555;
}

.color-setting input[type='color'] {
  width: 100%;
  height: 28px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.color-setting input[type='color']:hover {
  border-color: #3b82f6;
}

.color-setting input[type='range'] {
  width: 100%;
  height: 5px;
  background: #ddd;
  border-radius: 3px;
  outline: none;
  margin-top: 8px;
}

.color-setting input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.color-setting input[type='range']::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.color-setting span {
  font-size: 0.8em;
  color: #666;
  text-align: right;
  font-family: 'Courier New', monospace;
}
</style>
