import { reactive, watch } from 'vue'

const STORAGE_KEY = 'MIDI_OVERLAY_SETTINGS'

// 初期値
const defaultSettings = {
  rotationSpeed: 0.04,
  arcColor: '#00ffffff',
  markerColor: '#00ffffff',
  diskColor: '#00ffff38',
}

export function useJogSettings() {
  const settings = reactive({ ...defaultSettings })

  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        Object.assign(settings, { ...defaultSettings, ...parsed })
      }
    } catch (e) {
      console.error('設定の読み込みに失敗:', e)
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (e) {
      console.error('設定の保存に失敗:', e)
    }
  }

  // 設定変更時に自動保存
  watch(settings, saveSettings, { deep: true })

  // 初期化時に読み込み
  loadSettings()

  return {
    settings,
  }
}

// ヘルパー関数
export function getOpacityFromHex(hexColor) {
  if (hexColor.length === 9) {
    const alpha = parseInt(hexColor.slice(7, 9), 16)
    return (alpha / 255).toFixed(2)
  }
  return '1.00'
}

export function setOpacityToHex(hexColor, opacity) {
  const rgb = hexColor.slice(0, 7)
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')
  return rgb + alpha
}
