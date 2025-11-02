# MIDI Overlay

MIDI入力デバイス（ジョグホイール）の操作を視覚的に表示するWebアプリケーション。

## 技術スタック

- **フレームワーク**: Vue 3 (Composition API)
- **言語**: TypeScript
- **ビルドツール**: Vite
- **パッケージマネージャー**: pnpm
- **主要API**: Web MIDI API, Canvas API, LocalStorage API

## プロジェクト構成

```plaintext
src/
├── assets/           # 静的アセット (CSS, ロゴ)
├── components/       # Vueコンポーネント
│   └── MidiJog/     # MIDIジョグホイール関連コンポーネント
│       ├── MidiJog.vue           # メインコンポーネント
│       ├── MidiJogCanvas.vue     # Canvas描画
│       ├── MidiJogSettings.vue   # 設定パネル
│       └── ColorSettings.vue     # 色設定
├── composables/      # Vue Composition API composables
│   ├── useCanvasAnimation.ts    # アニメーションループ管理
│   ├── useMidiInput.ts          # MIDI入力管理
│   └── useJogSettings.ts        # 設定管理
├── constants/        # 定数定義
│   ├── canvas.ts    # Canvas描画定数
│   ├── midi.ts      # MIDI処理定数
│   └── index.ts
├── types/            # TypeScript型定義
│   ├── midi.ts      # MIDI関連型
│   ├── settings.ts  # 設定型
│   ├── webmidi.d.ts # Web MIDI API型定義
│   ├── env.d.ts     # Vue SFC型定義
│   └── index.ts
├── utils/            # ユーティリティ関数
│   ├── logger.ts     # ログ出力
│   ├── colorUtils.ts # 色操作
│   └── index.ts
├── App.vue
└── main.ts
```

## 主要機能

- **MIDI入力対応**: Web MIDI APIでジョグホイール操作を検出
- **Canvas描画**: リアルタイムでジョグホイールを可視化
- **カスタマイズ**: 回転速度、色、透明度を個別に設定可能
- **設定永続化**: LocalStorageに自動保存

## ブラウザ要件

- Web MIDI API対応ブラウザ（Chrome、Edge、Operaなど）
- Canvas API対応
- LocalStorage対応

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
