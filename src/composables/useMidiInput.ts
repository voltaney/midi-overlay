import { onMounted, onUnmounted } from 'vue'
import { logger } from '@/utils/logger'
import type { MidiMessageCallback } from '@/types'

/**
 * MIDI入力管理用composable
 * Web MIDI APIを使用してMIDI入力デバイスを接続・管理
 *
 * @param onMessage - MIDIメッセージ受信時のコールバック関数
 * @returns setupMIDI関数を含むオブジェクト
 */
export function useMidiInput(onMessage: MidiMessageCallback) {
  let midiAccess: WebMidi.MIDIAccess | null = null

  /**
   * MIDI入力デバイスにメッセージハンドラーをアタッチ
   */
  function attachInput(input: WebMidi.MIDIInput): void {
    input.onmidimessage = (event: WebMidi.MIDIMessageEvent) => {
      // Uint8Arrayから最初の3バイトを取得してタプルに変換
      const data = Array.from(event.data.slice(0, 3)) as [number, number, number]
      onMessage({ data })
    }
  }

  /**
   * MIDI接続をセットアップ
   */
  function setupMIDI(): void {
    // ブラウザがWeb MIDI APIに対応しているかチェック
    if (!navigator.requestMIDIAccess) {
      logger.error('このブラウザはWebMIDIに対応していません。Chrome系でお試しください。')
      return
    }

    navigator
      .requestMIDIAccess()
      .then((access: WebMidi.MIDIAccess) => {
        midiAccess = access
        logger.info('MIDIアクセスに成功しました。')

        // 接続済みデバイスの登録
        for (const input of access.inputs.values()) {
          attachInput(input)
        }

        // デバイスの動的接続・切断を監視
        access.onstatechange = (e: WebMidi.MIDIConnectionEvent) => {
          if (e.port.type === 'input' && e.port.state === 'connected') {
            attachInput(e.port as WebMidi.MIDIInput)
          }
        }
      })
      .catch((err: Error) => {
        logger.error(`MIDIアクセスに失敗: ${err.message}`)
      })
  }

  onMounted(() => {
    setupMIDI()
  })

  onUnmounted(() => {
    // MIDI接続のクリーンアップ
    if (midiAccess) {
      for (const input of midiAccess.inputs.values()) {
        input.onmidimessage = null
      }
    }
  })

  return {
    setupMIDI,
  }
}
