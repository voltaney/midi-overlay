/**
 * 設定関連の型定義
 */

/** ジョグホイール設定 */
export interface JogSettings {
  /** 回転速度 (0.1 ~ 5.0) */
  rotationSpeed: number
  /** アーク（外円）の色 (hex: #RRGGBBAA) */
  arcColor: string
  /** アーク（外円）の半径 (50 ~ 150) */
  arcRadius: number
  /** ディスク（内円）の色 (hex: #RRGGBBAA) */
  diskColor: string
  /** ディスク（内円）の半径 (10 ~ arcRadius) */
  diskRadius: number
  /** マーカー（位置表示）の色 (hex: #RRGGBBAA) */
  markerColor: string
  /** マーカーの太さ (1 ~ 10) */
  markerWidth: number
  /** マーカーの長さ (10 ~ arcRadius) */
  markerLength: number
  /** ディスク背景画像 (Base64形式、オプション) */
  diskBackgroundImage?: string
}

/** デフォルトのジョグホイール設定値 */
export const DEFAULT_JOG_SETTINGS: Readonly<JogSettings> = {
  rotationSpeed: 1.0,
  arcColor: '#ffffff88',
  arcRadius: 120,
  diskColor: '#ff000088',
  diskRadius: 40,
  markerColor: '#00ff0088',
  markerWidth: 4,
  markerLength: 30,
} as const
