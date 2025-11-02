/**
 * MIDI処理関連の定数
 */

/** MIDI値の定数 */
export const MIDI_VALUES = {
  /** 最大値 */
  MAX_VALUE: 127,
  /** 最小値 */
  MIN_VALUE: 0,
  /** 中央値（ニュートラル） */
  NEUTRAL_VALUE: 64,
} as const

/** MIDI CC番号 */
export const MIDI_CC = {
  /** ジョグホイール用CC番号 */
  JOG_WHEEL: 1,
} as const
