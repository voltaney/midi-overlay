# MIDI Overlay - MIDI Jog Wheel Overlay

## プロジェクト概要

MIDI入力デバイス（ジョグホイール）の操作を視覚的に表示するWebアプリケーション。
Canvas APIを使用してリアルタイムでジョグホイールの回転を描画し、色や速度などの設定をカスタマイズ可能。

## 技術スタック

- **フレームワーク**: Vue 3 (Composition API)
- **言語**: TypeScript
- **ビルドツール**: Vite
- **パッケージマネージャー**: pnpm
- **主要API**:
  - Web MIDI API (MIDI入力デバイス接続)
  - Canvas API (ジョグホイール描画)
  - LocalStorage API (設定の永続化)

## パッケージ管理

このプロジェクトは **pnpm** を使用してパッケージ管理を行います。

```bash
# インストール
pnpm install

# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# プレビュー
pnpm preview

# Lint
pnpm lint
```

## コーディング規約

### TypeScript

- **`any`型の使用禁止**: 型安全性を確保するため、`any`型は使用しないこと
  - 不明な型の場合は`unknown`を使用し、型ガードで絞り込む
  - 外部ライブラリの型定義がない場合は、独自に型定義を作成する

### コメント・ドキュメント

- **日本語で記述**: コメント、ドキュメント、commit messageは日本語で記述すること
- 複雑なロジックには必ず説明コメントを追加
- JSDocスタイルで関数・型の説明を記載

### その他のベストプラクティス

- **定数化**: マジックナンバーは`src/constants/`に定数として定義
- **ユーティリティ分離**: 汎用的な関数は`src/utils/`に配置
- **型定義の集約**: 共通の型定義は`src/types/`に配置
- **composableの責務**: 1つのcomposableは1つの責務に限定
- **エラーハンドリング**: エラーは適切にキャッチし、ユーザーに通知
- **ログ出力**: 開発環境のみログ出力するように`logger`ユーティリティを使用

## プロジェクト構成

```
src/
├── assets/           # 静的アセット (CSS, ロゴ)
├── components/       # Vueコンポーネント
│   └── MidiJog/     # MIDIジョグホイール関連コンポーネント
├── composables/      # Vue Composition API composables
├── constants/        # 定数定義
├── types/            # TypeScript型定義
└── utils/            # ユーティリティ関数
```

### 主要コンポーネント

- **MidiJog.vue**: メインコンポーネント（MIDIメッセージ処理とアニメーション統合）
- **MidiJogCanvas.vue**: Canvas描画コンポーネント
- **MidiJogSettings.vue**: 設定パネル（回転速度調整）
- **ColorSettings.vue**: 色設定コンポーネント（arc/disk/marker色と透明度）

### 主要Composables

- **useMidiInput.ts**: Web MIDI API接続とメッセージハンドリング
- **useJogSettings.ts**: ジョグホイール設定の管理とLocalStorage永続化
- **useCanvasAnimation.ts**: requestAnimationFrameを使用したアニメーションループ管理

## 主要機能

### 1. MIDI入力対応

- Web MIDI APIを使用してMIDI入力デバイスに接続
- ジョグホイール（CC:1）の回転操作を検出
- リアルタイムで回転角度を更新

### 2. Canvas描画

- ジョグホイールを円形で表現
- Arc（外円）、Disk（内円）、Marker（位置マーカー）の3要素で構成
- 各要素の色と透明度を個別にカスタマイズ可能

### 3. 設定管理

- **回転速度**: ジョグホイールの回転感度を調整
- **色設定**: Arc/Disk/Markerの色と透明度を個別設定
- **永続化**: LocalStorageに設定を自動保存・読み込み

### 4. リアルタイムレンダリング

- requestAnimationFrameによる効率的な描画更新
- MIDI入力時のみ再描画をリクエスト（不要な描画を削減）

## ブラウザ要件

- Web MIDI API対応ブラウザ（Chrome、Edge、Operaなど）
- Canvas API対応
- LocalStorage対応

## 開発時の注意事項

- MIDI入力デバイスが接続されていない場合、コンソールにエラーが表示されます
- 本番ビルド時は`console.log`が自動削除されます（Vite設定）
- 型チェックは`vue-tsc --noEmit`で実行可能
