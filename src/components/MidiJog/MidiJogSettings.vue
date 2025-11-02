<script setup lang="ts">
import { ref } from 'vue'
import ColorSetting from './ColorSettings.vue'
import type { JogSettings } from '@/types'
import { imageFileToBase64, validateImageFile } from '@/utils/imageUtils'
import { logger } from '@/utils/logger'

/** Props定義 */
interface Props {
  /** ジョグホイール設定 */
  settings: JogSettings
}

const props = defineProps<Props>()

/** Emits定義 */
const emit = defineEmits<{
  'update:settings': [updates: Partial<JogSettings>]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isUploadingImage = ref(false)

/**
 * 設定を更新
 * 部分的な更新をemit
 */
function updateSettings(updates: Partial<JogSettings>): void {
  emit('update:settings', updates)
}

/**
 * 画像ファイル選択ハンドラ
 */
async function handleImageSelect(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  // バリデーション
  const error = validateImageFile(file)
  if (error) {
    alert(error)
    input.value = ''
    return
  }

  try {
    isUploadingImage.value = true
    const base64 = await imageFileToBase64(file)
    updateSettings({ diskBackgroundImage: base64 })
  } catch (e) {
    logger.error('画像のアップロードに失敗:', e)
    alert('画像のアップロードに失敗しました')
  } finally {
    isUploadingImage.value = false
    input.value = ''
  }
}

/**
 * 画像削除ハンドラ
 */
function handleImageRemove(): void {
  updateSettings({ diskBackgroundImage: undefined })
}

/**
 * ファイル選択ダイアログを開く
 */
function openFileDialog(): void {
  fileInputRef.value?.click()
}

/**
 * 円弧の半径変更ハンドラ
 * 内円の半径とマーカーの長さを割合で調整
 */
function handleArcRadiusChange(event: Event): void {
  const newArcRadius = Number((event.target as HTMLInputElement).value)
  const oldArcRadius = props.settings.arcRadius
  const changedRatio = newArcRadius / oldArcRadius

  updateSettings({
    arcRadius: newArcRadius,
    diskRadius: Math.round(changedRatio * props.settings.diskRadius),
    markerLength: Math.round(changedRatio * props.settings.markerLength),
  })
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
          @input="
            updateSettings({ rotationSpeed: Number(($event.target as HTMLInputElement).value) })
          "
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

      <div class="setting-item">
        <label for="arcRadius">円弧の半径:</label>
        <input
          id="arcRadius"
          type="range"
          :value="settings.arcRadius"
          @input="handleArcRadiusChange"
          min="50"
          max="150"
          step="1"
        />
        <span>{{ settings.arcRadius }}</span>
      </div>

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

      <div class="setting-item">
        <label for="diskRadius">中央ディスクの半径:</label>
        <input
          id="diskRadius"
          type="range"
          :value="settings.diskRadius"
          @input="updateSettings({ diskRadius: Number(($event.target as HTMLInputElement).value) })"
          min="10"
          :max="settings.arcRadius"
          step="1"
        />
        <span>{{ settings.diskRadius }}</span>
      </div>

      <div class="setting-item">
        <label for="markerWidth">マーカーの太さ:</label>
        <input
          id="markerWidth"
          type="range"
          :value="settings.markerWidth"
          @input="
            updateSettings({ markerWidth: Number(($event.target as HTMLInputElement).value) })
          "
          min="1"
          max="10"
          step="1"
        />
        <span>{{ settings.markerWidth }}</span>
      </div>

      <div class="setting-item">
        <label for="markerLength">マーカーの長さ:</label>
        <input
          id="markerLength"
          type="range"
          :value="settings.markerLength"
          @input="
            updateSettings({ markerLength: Number(($event.target as HTMLInputElement).value) })
          "
          min="10"
          :max="settings.arcRadius"
          step="1"
        />
        <span>{{ settings.markerLength }}</span>
      </div>

      <div class="image-upload-section">
        <h4>ディスク背景画像</h4>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          @change="handleImageSelect"
          style="display: none"
        />

        <div v-if="settings.diskBackgroundImage" class="image-preview">
          <img :src="settings.diskBackgroundImage" alt="背景画像プレビュー" />
          <button @click="handleImageRemove" type="button" class="remove-button">削除</button>
        </div>

        <button
          v-else
          @click="openFileDialog"
          type="button"
          class="upload-button"
          :disabled="isUploadingImage"
        >
          {{ isUploadingImage ? 'アップロード中...' : '画像をアップロード' }}
        </button>
      </div>
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

.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.image-upload-section h4 {
  margin: 0;
  font-size: 0.95em;
}

.image-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.image-preview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #ddd;
}

.upload-button,
.remove-button {
  padding: 0.5rem 1rem;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.upload-button:hover:not(:disabled),
.remove-button:hover {
  background-color: #0056b3;
}

.upload-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.remove-button {
  background-color: #dc3545;
  border-color: #dc3545;
}

.remove-button:hover {
  background-color: #c82333;
}
</style>
