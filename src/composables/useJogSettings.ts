import { reactive, watch } from 'vue'
import { logger } from '@/utils/logger'
import type { JogSettings } from '@/types'

const STORAGE_KEY = 'MIDI_OVERLAY_SETTINGS'

/** デフォルト設定値 */
const defaultSettings: JogSettings = {
  rotationSpeed: 0.04,
  arcColor: '#00ffffff',
  markerColor: '#00ffffff',
  diskColor: '#00ffff38',
}

/**
 * ジョグホイール設定管理用composable
 * LocalStorageを使用して設定を永続化
 *
 * @returns settings - リアクティブな設定オブジェクト
 */
export function useJogSettings() {
  const settings = reactive<JogSettings>({ ...defaultSettings })

  /**
   * LocalStorageから設定を読み込み
   */
  function loadSettings(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: unknown = JSON.parse(saved)

        // 型チェック（簡易版）
        if (typeof parsed === 'object' && parsed !== null) {
          Object.assign(settings, { ...defaultSettings, ...parsed })
        }
      }
    } catch (e) {
      logger.error('設定の読み込みに失敗:', e)
    }
  }

  /**
   * 設定をLocalStorageに保存
   */
  function saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (e) {
      logger.error('設定の保存に失敗:', e)
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
