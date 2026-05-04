# 実装計画: 小学校受験問題練習アプリ

## 概要

React + TypeScript + Vite でブラウザ完結型のSPAを構築する。プラグインアーキテクチャによる問題タイプの拡張性を確保しつつ、初回リリースでは回転図形問題を実装してアプリの骨格とUXを確立する。まずプロジェクトの土台とコア型定義を整備し、共通フレームワーク（ホーム画面・問題画面・フィードバック）を構築した後、回転図形問題プラグインを実装し、最後に全体を結合する。

## タスク

- [x] 1. プロジェクトセットアップとコアインターフェース定義
  - [x] 1.1 Vite + React + TypeScript プロジェクトを初期化する
    - `npm create vite@latest` で React + TypeScript テンプレートを使用してプロジェクトを作成する
    - `react-router-dom`、`vitest`、`@testing-library/react`、`@testing-library/jest-dom`、`jsdom`、`fast-check` を依存関係に追加する
    - `vitest.config.ts` を作成し、テスト環境（jsdom）を設定する
    - CSS Modules を使用するための Vite 設定を確認する（Vite はデフォルトで対応済み）
    - _Requirements: 9.4_

  - [x] 1.2 グローバルスタイルとCSS変数を定義する
    - `src/styles/variables.css` を作成し、パステルカラー基調の配色、フォントサイズ（最小16px）、タップ領域サイズ（最小44×44px）などのCSS変数を定義する
    - `src/styles/global.css` を作成し、リセットCSS、ひらがなフォント設定、レスポンシブ対応の基本スタイルを定義する
    - 320px以上の画面幅に対応するメディアクエリの基本設定を含める
    - _Requirements: 9.1, 9.3, 10.1, 10.6_

  - [x] 1.3 問題タイプインターフェースと共通型を定義する
    - `src/types/question.ts` を作成し、`Question<TQuestionData, TChoiceData>`、`QuestionType<TQuestionData, TChoiceData>`、`QuestionTypeId`、`ChoiceIndex` の型定義を実装する
    - 問題タイプインターフェースには id, displayName, icon, generateQuestion, QuestionDisplay, ChoiceDisplay, checkAnswer を含める
    - _Requirements: 1.1, 1.5_

  - [x] 1.4 問題タイプレジストリを実装する
    - `src/registry/questionTypeRegistry.ts` を作成し、`QuestionTypeRegistry` クラスを実装する
    - `register(questionType)`, `get(id)`, `getAll()`, `has(id)` メソッドを実装する
    - シングルトンインスタンス `registry` をエクスポートする
    - _Requirements: 1.2, 1.3, 1.4_

  - [ ]* 1.5 レジストリのプロパティテストを作成する
    - **Property 1: レジストリの登録・取得ラウンドトリップ**
    - fast-check を使用して、任意の有効な問題タイプオブジェクトに対して register → get のラウンドトリップを検証する
    - **Validates: Requirements 1.2, 1.5**

- [x] 2. ストレージサービスの実装
  - [x] 2.1 ストレージサービスを実装する
    - `src/storage/storageService.ts` を作成し、`StorageService` クラスを実装する
    - `ProgressData`, `TypeProgress` インターフェースを定義する
    - `loadProgress()`, `saveProgress(data)`, `recordAnswer(typeId, isCorrect)`, `getTotalProgress(data)`, `resetProgress()` メソッドを実装する
    - localStorage キー `exam-app-progress` を使用する
    - エラーハンドリング: localStorage未対応時・容量超過時は保存失敗を無視して継続、データ破損時は初期状態にリセット
    - シングルトンインスタンス `storageService` をエクスポートする
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 2.2 ストレージサービスのプロパティテストを作成する
    - **Property 3: 進捗データの記録・読み込みラウンドトリップ**
    - **Property 4: 新問題タイプ追加時の既存データ保持**
    - fast-check を使用して、recordAnswer → loadProgress のラウンドトリップと、新問題タイプ追加時の既存データ不変性を検証する
    - **Validates: Requirements 5.1, 5.2, 5.6**

  - [ ]* 2.3 ストレージサービスのユニットテストを作成する
    - localStorage未対応時の動作テスト
    - データ未存在時の初期状態テスト
    - データ破損時のリカバリテスト
    - _Requirements: 5.4, 5.5_

- [ ] 3. チェックポイント - コア基盤の確認
  - プロジェクトのビルドが成功すること、テストが全て通ることを確認する。問題があればユーザーに確認する。

- [x] 4. 共通フレームワークUIコンポーネントの実装
  - [x] 4.1 ナビゲーションバーコンポーネントを実装する
    - `src/framework/components/NavigationBar.tsx` と対応するCSS Moduleを作成する
    - 「もどる」ボタンを画面上部に表示する（タップ領域 ≥ 44×44px）
    - ホーム画面への遷移機能を実装する
    - _Requirements: 2.5, 2.6_

  - [x] 4.2 問題タイプカードコンポーネントを実装する
    - `src/framework/components/QuestionTypeCard.tsx` と対応するCSS Moduleを作成する
    - アイコンと表示名をカード形式で表示する
    - タップ領域 ≥ 44×44px を確保する
    - タップ時の視覚的フィードバック（背景色変化またはスケール変化）を実装する
    - _Requirements: 2.2, 2.6, 10.5_

  - [x] 4.3 ホーム画面コンポーネントを実装する
    - `src/framework/components/HomeScreen.tsx` と対応するCSS Moduleを作成する
    - レジストリから問題タイプ一覧を取得して QuestionTypeCard で表示する
    - 全問題タイプの累計正答数と累計問題数を「〇もんせいかい / △もんちゅう」形式で表示する
    - 問題タイプカードのタップで `/question/:typeId` に遷移する
    - `useProgress` フックを使用して進捗データを管理する
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 1.3_

  - [x] 4.4 進捗データ管理フック（useProgress）を実装する
    - `src/framework/hooks/useProgress.ts` を作成する
    - storageService を使用して進捗データの読み込み・更新を行うカスタムフックを実装する
    - 進捗表示フォーマット関数（「〇もんせいかい / △もんちゅう」形式）を実装する
    - _Requirements: 5.3, 2.3_

  - [ ]* 4.5 進捗表示フォーマットのプロパティテストを作成する
    - **Property 2: 進捗表示フォーマットの正確性**
    - fast-check を使用して、任意の非負整数 c, t（c ≤ t）に対してフォーマット文字列が正しいことを検証する
    - **Validates: Requirements 2.3**

- [x] 5. 問題画面とフィードバックの実装
  - [x] 5.1 問題出題フロー管理フック（useQuestionFlow）を実装する
    - `src/framework/hooks/useQuestionFlow.ts` を作成する
    - 問題生成、選択肢選択、回答判定、フィードバック表示、次の問題への遷移の状態管理を行うカスタムフックを実装する
    - `QuestionScreenState` の状態遷移（問題表示中 → 回答判定中 → フィードバック表示中 → 問題表示中）を管理する
    - フィードバック表示中は選択肢の再タップを無効にする
    - _Requirements: 3.5, 4.5, 4.6_

  - [x] 5.2 フィードバックオーバーレイコンポーネントを実装する
    - `src/framework/components/FeedbackOverlay.tsx` と対応するCSS Moduleを作成する
    - 正解時: 緑色の○を拡大アニメーション（0.3秒以上）で表示する
    - 不正解時: 赤色の✕を穏やかに表示し、正解の選択肢を枠線ハイライトで示す
    - 「つぎのもんだいへ」ボタンを表示する（タップ領域 ≥ 44×44px）
    - 威圧的な演出を使用しない
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 10.3, 10.4_

  - [x] 5.3 問題画面コンポーネント（共通フレームワーク）を実装する
    - `src/framework/components/QuestionScreen.tsx` と対応するCSS Moduleを作成する
    - 3領域レイアウト: 問題表示エリア（画面上部）、指示テキストエリア（中央）、選択肢エリア（画面下部）を構成する
    - 問題タイプインターフェースから取得した QuestionDisplay を問題表示エリアに描画する
    - 問題タイプインターフェースから取得した ChoiceDisplay を選択肢エリアに描画する
    - 指示テキストをひらがなで表示する
    - useQuestionFlow フックを使用して問題フローを管理する
    - FeedbackOverlay を統合する
    - React Router の useParams で問題タイプIDを取得し、レジストリから問題タイプを取得する（未登録IDの場合はホーム画面にリダイレクト）
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 5.4 問題画面とフィードバックのユニットテストを作成する
    - QuestionScreen の3領域レイアウト構成テスト
    - FeedbackOverlay の正解時○表示・不正解時✕表示テスト
    - 「つぎのもんだいへ」ボタンの動作テスト
    - フィードバック中の選択肢無効化テスト
    - _Requirements: 3.1, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 6. チェックポイント - 共通フレームワークの確認
  - すべてのテストが通ること、ビルドが成功することを確認する。問題があればユーザーに確認する。

- [x] 7. 回転図形問題プラグインのロジック実装
  - [x] 7.1 回転図形問題の型定義を作成する
    - `src/plugins/rotation/types.ts` を作成する
    - `Grid` 型（`[boolean, boolean, boolean, boolean]`）、`RotationDirection` 型（`'right90' | 'left90' | 'rotate180'`）、`RotationQuestionData`、`RotationChoiceData` を定義する
    - _Requirements: 6.1_

  - [x] 7.2 回転ロジックと問題生成関数を実装する
    - `src/plugins/rotation/rotationQuestion.ts` を作成する
    - `rotateRight90(grid)`, `rotateLeft90(grid)`, `rotate180(grid)`, `rotateGrid(grid, direction)` 回転関数を実装する
    - `generateRandomGrid()` 関数を実装する（少なくとも1つのtrue、1つのfalseを保証）
    - `gridsEqual(a, b)` 比較関数を実装する
    - `generateDistractors(correctGrid, count)` 不正解選択肢生成関数を実装する（正解・他の不正解と重複しない、最大試行回数100回）
    - `generateRotationQuestion()` 問題生成関数を実装する（回転方向のランダム選択、正解位置のランダム配置、ひらがな指示テキスト生成）
    - `checkAnswer(question, selectedIndex)` 正解判定関数を実装する
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.1, 7.2, 7.3_

  - [ ]* 7.3 回転ロジックのプロパティテストを作成する
    - **Property 8: 右90度回転4回のラウンドトリップ**
    - **Property 9: 右90度回転と左90度回転の逆操作**
    - **Property 10: 180度回転は右90度回転2回と等価**
    - fast-check を使用して、任意の有効なグリッドパターンに対する回転の数学的性質を検証する
    - **Validates: Requirements 7.3, 7.4, 7.5**

  - [ ]* 7.4 問題生成のプロパティテストを作成する
    - **Property 5: グリッド生成の有効性**
    - **Property 6: 回転方向と指示テキストの整合性**
    - **Property 7: 問題生成の選択肢の正当性**
    - fast-check を使用して、generateRandomGrid と generateRotationQuestion の出力が仕様を満たすことを検証する
    - **Validates: Requirements 6.2, 6.3, 6.4, 6.5, 6.6, 6.7**

- [x] 8. 回転図形問題プラグインのUIコンポーネント実装
  - [x] 8.1 グリッド表示コンポーネントを実装する
    - `src/plugins/rotation/components/GridDisplay.tsx` と対応するCSS Moduleを作成する
    - 2×2グリッドを描画する（塗りつぶしセル=黒系、空白セル=白系）
    - WCAG AA基準のコントラスト比4.5:1以上を確保する
    - 問題表示用（大サイズ: 画面幅の30%以上）と選択肢用（小サイズ）の2つのサイズバリエーションを提供する
    - _Requirements: 8.1, 8.5_

  - [x] 8.2 問題表示コンポーネントと選択肢表示コンポーネントを実装する
    - `src/plugins/rotation/components/QuestionDisplay.tsx` を作成し、元のグリッドパターンを大きく表示する
    - `src/plugins/rotation/components/ChoicesDisplay.tsx` を作成し、4つの選択肢グリッドを2×2レイアウトで表示する
    - 各選択肢のタップ領域 ≥ 44×44px を確保する
    - 選択時の視覚的フィードバック（背景色変化またはスケール変化）を実装する
    - 回転方向の矢印アイコンを指示テキストとともに表示する
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 10.5_

  - [x] 8.3 回転図形問題タイプをレジストリに登録する
    - `src/plugins/rotation/index.ts` を作成し、QuestionType インターフェースに準拠した回転図形問題タイプオブジェクトを定義する
    - id: `"rotation"`, displayName: `"かいてんずけい"`, icon: 適切な絵文字を設定する
    - レジストリへの登録処理を実装する
    - _Requirements: 6.1, 1.1, 1.2_

- [x] 9. アプリケーション全体の結合
  - [x] 9.1 ルーティングとアプリケーションエントリポイントを設定する
    - `src/App.tsx` に React Router v6 を設定し、`/` → ホーム画面、`/question/:typeId` → 問題画面のルーティングを定義する
    - `src/main.tsx` でアプリケーションのエントリポイントを設定し、回転図形問題プラグインの登録を行う
    - グローバルスタイル（`global.css`, `variables.css`）をインポートする
    - _Requirements: 2.4, 9.4_

  - [x] 9.2 レスポンシブデザインの調整を行う
    - 320px以上の画面幅での表示を確認・調整する
    - タッチ操作とマウス操作の両方に対応するスタイルを適用する
    - 画面の向き変更時のレイアウト自動調整を確認する
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 9.3 ホーム画面のユニットテストを作成する
    - 問題タイプ一覧の表示テスト
    - 進捗サマリーの表示テスト
    - カードタップで問題画面に遷移するテスト
    - 戻るボタンの表示と動作テスト
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 10. 最終チェックポイント - 全体の確認
  - すべてのテストが通ること、ビルドが成功することを確認する。問題があればユーザーに確認する。

## 備考

- `*` マーク付きのタスクはオプションであり、MVP構築を優先する場合はスキップ可能
- 各タスクは対応する要件番号を参照しており、トレーサビリティを確保している
- チェックポイントでは段階的に動作確認を行い、問題を早期に発見する
- プロパティベーステストは設計ドキュメントの正当性プロパティに基づいて実装する
- ユニットテストは具体的な例とエッジケースの検証に使用する
