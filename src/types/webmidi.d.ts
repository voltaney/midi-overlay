/**
 * Web MIDI API型定義
 *
 * 標準のWeb MIDI API仕様に基づいた型定義
 * @see https://www.w3.org/TR/webmidi/
 */

declare namespace WebMidi {
  interface MIDIMessageEvent extends Event {
    readonly data: Uint8Array
  }

  interface MIDIInput extends EventTarget {
    readonly id: string
    readonly name: string
    readonly type: 'input'
    readonly state: 'connected' | 'disconnected'
    onmidimessage: ((event: MIDIMessageEvent) => void) | null
  }

  interface MIDIOutput extends EventTarget {
    readonly id: string
    readonly name: string
    readonly type: 'output'
    readonly state: 'connected' | 'disconnected'
  }

  interface MIDIPort extends EventTarget {
    readonly id: string
    readonly name: string
    readonly type: 'input' | 'output'
    readonly state: 'connected' | 'disconnected'
  }

  interface MIDIConnectionEvent extends Event {
    readonly port: MIDIPort
  }

  interface MIDIAccess extends EventTarget {
    readonly inputs: Map<string, MIDIInput>
    readonly outputs: Map<string, MIDIOutput>
    onstatechange: ((event: MIDIConnectionEvent) => void) | null
  }

  interface MIDIOptions {
    sysex?: boolean
    software?: boolean
  }
}

interface Navigator {
  requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>
}
