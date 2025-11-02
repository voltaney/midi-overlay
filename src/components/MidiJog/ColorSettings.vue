<script setup>
import { getOpacityFromHex, setOpacityToHex } from '../../composables/useJogSettings'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

function updateColor(newColor) {
  const alpha = props.modelValue.slice(7, 9)
  emit('update:modelValue', newColor + alpha)
}

function updateOpacity(opacity) {
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
        @input="updateColor($event.target.value)"
      />
      <div class="opacity-control">
        <label>透明度:</label>
        <input
          type="range"
          :value="getOpacityFromHex(modelValue)"
          @input="updateOpacity($event.target.value)"
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
