import { onMounted, onUnmounted } from 'vue'

export function useMidiInput(onMessage) {
  let midiAccess = null

  function attachInput(input) {
    input.onmidimessage = onMessage
  }

  function setupMIDI() {
    if (!navigator.requestMIDIAccess) {
      console.error('このブラウザはWebMIDIに対応していません。Chrome系でお試しください。')
      return
    }

    navigator.requestMIDIAccess({ sysex: true }).then(
      (access) => {
        midiAccess = access
        console.log('MIDIアクセスに成功しました。')

        // 接続済みデバイスの登録
        for (const input of access.inputs.values()) {
          attachInput(input)
        }

        access.onstatechange = (e) => {
          // 動的なデバイス登録
          if (e.port.type === 'input' && e.port.state === 'connected') {
            attachInput(e.port)
          }
        }
      },
      (err) => {
        console.error(`MIDIアクセスに失敗: ${err}`)
      }
    )
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
