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
  gap: 0.2rem;
}

.color-setting label {
  font-weight: bold;
  font-size: 0.75em;
}

.color-setting input[type='color'] {
  width: 100%;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.color-setting input[type='range'] {
  width: 100%;
}

.color-setting span {
  font-size: 0.7em;
  color: #666;
  text-align: right;
}
</style>
