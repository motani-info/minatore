# みなトレ（minatore）

国立小学校受験レベルの問題を幼稚園児が練習できるブラウザベースの学習アプリ。

## 概要

- React + TypeScript + Vite で構築したSPA
- サーバ不要、完全フロントエンド（localStorage でデータ永続化）
- プラグインアーキテクチャで問題タイプを独立モジュールとして管理
- 幼稚園児が直感的に操作できるUI/UX

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | React 19 |
| 言語 | TypeScript |
| ビルドツール | Vite |
| UIライブラリ | Chakra UI v3 |
| ルーティング | React Router v7 (HashRouter) |
| テスト | Vitest + React Testing Library |
| PBT | fast-check |
| E2E | Playwright |
| デプロイ | GitHub Pages + GitHub Actions |

## 実装済み問題タイプ

### 図形カテゴリ

| グループ | 問題タイプ | 概要 |
|---------|-----------|------|
| 回転図形 | 基本 / 応用 / 連続 | 2×2グリッドの回転操作 |
| 重ね図形 | 基本 / 応用 / 図形 / 線 / 分解 | 図形の重ね合わせ（AND/OR演算、線図形） |
| 折り重ね | 相殺 / 相殺3×3 / 相殺4×4 / 合成 | グリッドの折り重ね（相殺・合成ルール） |
| 図形構成 | 基本 / 応用 | ピース分割・図形構成 |

### 数量・推理カテゴリ

| グループ | 問題タイプ | 概要 |
|---------|-----------|------|
| 比較 | 長さ / 広さ / 水量 / 重さ / ばね | 各種比較問題（専用画面・○×マーク） |
| — | 図形と数カルタ | 複数条件マッチング |
| — | 文字数あつまり | 音の数とグループ対応 |
| — | 1対1対応 | アイテムの過不足 |

## 機能

- **ホーム画面**: カテゴリカード一覧、ランダム10問モード
- **テーマ画面**: カテゴリ別タブ、問題プレビュー一覧
- **問題画面**: 共通4択 or 専用画面（比較系）
- **経験値・レベルシステム**: 問題を解くとXPを獲得しレベルアップ
- **プロフィール**: 名前・アバター・年齢設定、レベル表示
- **履歴**: 学習記録グラフ、分野別統計
- **ランダムクイズ**: 全問題タイプから10問出題

## 開発

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# テスト
npm run test

# E2Eテスト
npm run test:e2e

# リント
npm run lint
```

## プラグインの追加方法

1. `src/plugins/{plugin-id}/` にディレクトリ作成
2. `types.ts` — 型定義
3. `{name}Question.ts` — 問題データ・生成・判定ロジック
4. `components/QuestionDisplay.tsx` — 問題表示
5. `components/ChoiceDisplay.tsx` — 選択肢表示
6. `index.ts` — QuestionType定義 + register関数
7. `src/main.tsx` — プラグイン登録
8. `src/framework/categoryData.ts` — カテゴリ・グラデーション追加

詳細は `.kiro/steering/add-question-from-image.md` を参照。

## プロジェクト構成

```
src/
├── main.tsx                    # エントリポイント（プラグイン登録）
├── App.tsx                     # ルーティング設定
├── types/question.ts           # 問題タイプインターフェース
├── registry/                   # 問題タイプレジストリ
├── framework/                  # 共通フレームワーク（画面・フック）
├── plugins/                    # 問題プラグイン（21種）
├── storage/                    # データ永続化サービス
└── assets/                     # アイコン・画像
```
