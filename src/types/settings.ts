/**
 * 設定関連の型定義
 */

/** ジョグホイール設定 */
export interface JogSettings {
  /** 回転速度 (0.1 ~ 5.0) */
  rotationSpeed: number
  /** アーク（外円）の色 (hex: #RRGGBBAA) */
  arcColor: string
  /** ディスク（内円）の色 (hex: #RRGGBBAA) */
  diskColor: string
  /** マーカー（位置表示）の色 (hex: #RRGGBBAA) */
  markerColor: string
}

/** デフォルトのジョグホイール設定値 */
export const DEFAULT_JOG_SETTINGS: Readonly<JogSettings> = {
  rotationSpeed: 1.0,
  arcColor: '#ffffff88',
  diskColor: '#ff000088',
  markerColor: '#00ff0088',
} as const
