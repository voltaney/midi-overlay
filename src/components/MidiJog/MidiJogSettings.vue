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

    <div class="settings-grid">
      <!-- 回転速度 -->
      <section class="settings-section">
        <h3>MIDI機器</h3>
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
      </section>

      <!-- 外円（円弧） -->
      <section class="settings-section">
        <h3>外円</h3>
        <div class="two-column-grid">
          <ColorSetting
            :model-value="settings.arcColor"
            @update:model-value="updateSettings({ arcColor: $event })"
            label="色"
          />
          <div class="setting-item">
            <label for="arcRadius">半径:</label>
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
        </div>
      </section>

      <!-- 内円（ディスク） -->
      <section class="settings-section">
        <h3>内円</h3>
        <div class="two-column-grid">
          <ColorSetting
            :model-value="settings.diskColor"
            @update:model-value="updateSettings({ diskColor: $event })"
            label="色"
          />
          <div class="setting-column">
            <div class="setting-item">
              <label for="diskRadius">半径:</label>
              <input
                id="diskRadius"
                type="range"
                :value="settings.diskRadius"
                @input="
                  updateSettings({ diskRadius: Number(($event.target as HTMLInputElement).value) })
                "
                min="10"
                :max="settings.arcRadius"
                step="1"
              />
              <span>{{ settings.diskRadius }}</span>
            </div>
            <div class="image-upload-section">
              <h4>背景画像</h4>
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                @change="handleImageSelect"
                style="display: none"
              />
              <div v-if="settings.diskBackgroundImage" class="image-preview">
                <img :src="settings.diskBackgroundImage" alt="背景画像プレビュー" />
                <button @click="handleImageRemove" type="button" class="remove-button">
                  削除
                </button>
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
        </div>
      </section>

      <!-- マーカー -->
      <section class="settings-section">
        <h3>マーカー</h3>
        <div class="two-column-grid">
          <ColorSetting
            :model-value="settings.markerColor"
            @update:model-value="updateSettings({ markerColor: $event })"
            label="色"
          />
          <div class="setting-column">
            <div class="setting-item">
              <label for="markerWidth">太さ:</label>
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
              <label for="markerLength">長さ:</label>
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
          </div>
        </div>
      </section>
    </div>
  </aside>
</template>

<style scoped>
aside {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  height: 100vh;
  overflow: auto;
}

aside > h2 {
  margin: 0 0 0.75rem 0;
  font-size: 1.1em;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  align-items: start;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.settings-section h3 {
  margin: 0;
  font-size: 0.9em;
  padding-bottom: 0.35rem;
  border-bottom: 2px solid #007bff;
}

.two-column-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.setting-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.setting-item label {
  font-weight: bold;
  font-size: 0.75em;
}

.setting-item input[type='range'] {
  width: 100%;
}

.setting-item span {
  font-size: 0.7em;
  color: #666;
  text-align: right;
}

.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
}

.image-upload-section h4 {
  margin: 0;
  font-size: 0.75em;
  font-weight: bold;
}

.image-preview {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  align-items: center;
}

.image-preview img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #ddd;
}

.upload-button,
.remove-button {
  padding: 0.35rem 0.6rem;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.7em;
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
