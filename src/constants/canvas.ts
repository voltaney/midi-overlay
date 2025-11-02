/**
 * Canvas描画関連の定数
 */

/** Canvas設定 */
export const CANVAS_CONFIG = {
  /** Canvasサイズ (幅・高さ) */
  SIZE: 300,
  /** アーク（外円）の半径 */
  ARC_RADIUS: 120,
  /** ディスク（内円）の半径 */
  DISK_RADIUS: 40,
  /** マーカーの開始位置（Y座標） */
  MARKER_START_Y: -110,
  /** マーカーの終了位置（Y座標） */
  MARKER_END_Y: -80,
  /** アークの線幅 */
  ARC_LINE_WIDTH: 6,
  /** マーカーの線幅 */
  MARKER_LINE_WIDTH: 4,
} as const
