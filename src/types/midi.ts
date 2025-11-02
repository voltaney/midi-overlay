/**
 * MIDI関連の型定義
 */

/** MIDIメッセージデータ */
export interface MidiMessageData {
  /** ステータスバイト (例: 176 = CC) */
  readonly status: number
  /** データ1バイト (例: CC番号) */
  readonly data1: number
  /** データ2バイト (例: CC値) */
  readonly data2: number
}

/** MIDIメッセージイベント */
export interface MidiMessage {
  /** MIDIメッセージデータ配列 */
  readonly data: readonly [number, number, number]
}

/** MIDIメッセージコールバック関数 */
export type MidiMessageCallback = (message: MidiMessage) => void

/** Web MIDI APIのMIDIInput型（Web MIDI API標準型の拡張） */
export interface MidiInputPort extends EventTarget {
  readonly id: string
  readonly name: string
  readonly type: 'input'
  readonly state: 'connected' | 'disconnected'
  onmidimessage: ((event: WebMidi.MIDIMessageEvent) => void) | null
}
