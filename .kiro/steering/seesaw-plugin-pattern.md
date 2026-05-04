---
inclusion: manual
---

# シーソー問題（比較・重さ）プラグイン実装パターン

このスキルは、固定問題セット + カスタム回答UI を持つ問題タイプの実装パターンを記述する。
シーソー問題を参考例として、同様の問題タイプを追加する際のガイドとして使用する。

## 概要

- **問題タイプ**: 比較（重さ：シーソー）
- **ID**: `seesaw`
- **カテゴリ**: 数量・推理
- **回答方式**: 4択ではなく、各アイテムに○/×をつけるカスタムUI
- **問題生成**: 固定問題プールからランダムに出題（重複なし巡回）

## アーキテクチャ上の特徴

### 1. 専用画面（カスタムUI）パターン

既存の `QuestionScreen` の4択UIに収まらない問題タイプは、**専用画面コンポーネント**を作成する。

```
src/plugins/seesaw/
├── index.ts                    # QuestionType準拠 + レジストリ登録
├── seesawQuestion.ts           # 固定問題データ + 判定ロジック
├── types.ts                    # 型定義
└── components/
    ├── SeesawScreen.tsx        # 専用問題画面（App.tsxに直接ルート追加）
    ├── SeesawDisplay.tsx       # シーソーSVG描画
    ├── QuestionDisplay.tsx     # 問題表示（シーソー2つ）
    └── ChoiceDisplay.tsx       # 回答UI（○/×マーク） + ダミーChoiceDisplay
```

### 2. ルーティング

専用画面を使う場合、`App.tsx` に **`:typeId` より前に** 固定パスのルートを追加する：

```tsx
<Route path="/question/seesaw" element={<SeesawScreen />} />
<Route path="/question/:typeId" element={<QuestionScreen />} />
```

### 3. QuestionType インターフェース準拠

カスタムUIでも `QuestionType` インターフェースには準拠させる（レジストリ登録・ランダムクイズ対応のため）：

- `QuestionDisplay`: 問題表示コンポーネント（ランダムクイズで使用可能）
- `ChoiceDisplay`: ダミー（`null` を返す）。専用画面では使わない
- `checkAnswer`: 共通フレームワークから呼ばれた場合の互換用。`selectedIndex === 0` で正解扱い
- `choices`: 正解情報を1要素だけ持つ配列

### 4. 進捗記録

専用画面内で `useProgress().recordAnswer('seesaw', isCorrect)` を直接呼ぶ。
共通の `useQuestionFlow` フックは使わない。

## 固定問題プールの実装パターン

```typescript
const QUESTION_POOL: Array<{ ... }> = [ /* 問題データ */ ];
let usedIndices: number[] = [];

export function generateQuestion(): Question {
  if (usedIndices.length >= QUESTION_POOL.length) {
    usedIndices = []; // 全問出題したらリセット
  }
  const available = QUESTION_POOL.map((_, i) => i).filter(i => !usedIndices.includes(i));
  const selected = available[Math.floor(Math.random() * available.length)];
  usedIndices.push(selected);
  return QUESTION_POOL[selected];
}
```

## カスタム回答UIの実装パターン

シーソー問題の回答UIは以下のフロー：

1. アイテムをタップ → マークがサイクル（null → ○ → × → null）
2. ○と×が1つずつ揃ったら「こたえあわせ」ボタンが有効化
3. ボタンタップで判定 → FeedbackOverlay表示
4. 「つぎのもんだいへ」で次の問題生成

```tsx
// 回答UIコンポーネントのprops
interface AnswerUIProps {
  questionData: QuestionData;
  choiceData: ChoiceData;      // 正解情報
  onCorrect: () => void;
  onNext: () => void;
  onRetry: () => void;
}
```

## SVGでの図形描画

- シーソーの構造（支点・バー・皿）は幾何学図形で描画
- アイテム（絵文字）は `<foreignObject>` 内のHTML要素として表示（SVG `<text>` だと絵文字サイズが不安定）
- 傾き角度は三角関数で左右のY座標を計算

```tsx
const angle = tilt === 'left' ? -12 : tilt === 'right' ? 12 : 0;
const rad = (angle * Math.PI) / 180;
const leftY = cy - Math.sin(rad) * barHalf;
const rightY = cy + Math.sin(rad) * barHalf;
```

## HomeScreen への追加

`src/framework/components/HomeScreen.tsx` の `CATEGORIES` 配列に単元を追加：

```typescript
{
  title: '数量・推理',
  implementedGradients: {
    seesaw: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
  },
  units: [
    { id: 'seesaw', name: '比較（重さ）', icon: '⚖️', implemented: true },
  ],
}
```

## design.md 更新チェックリスト

新しい問題タイプを追加する際に design.md で更新すべき箇所：

1. 「実装済み問題タイプ一覧」テーブルに行追加
2. 「ディレクトリ構成」にプラグインフォルダ追加
3. ルーティング構成（専用画面がある場合）
4. プラグインの設計セクション追加（型定義・ロジック・固定問題セット）

## Playwright での確認方法

```bash
# 開発サーバー起動
npx vite --port 5180

# スクリーンショット
npx playwright screenshot --browser chromium "http://localhost:5180/minatore/#/question/seesaw" /tmp/seesaw.png

# 要素サイズ確認スクリプト
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5180/minatore/#/question/seesaw');
  await page.waitForTimeout(1500);
  // ... 要素の確認
  await browser.close();
})();
"
```

## 比較グループの一般化パターン

シーソー（重さ）と同じ「専用画面 + ○×マーク付け」パターンは、比較グループ全体で共通して使われる。

### 比較グループの問題タイプ一覧

| ID | サブテーマ | 表示内容 | 凡例 |
|---|---|---|---|
| `seesaw` | 重さ | シーソーSVG | いちばんおもい / いちばんかるい |
| `water-volume` | 水量 | コップ・水槽SVG | いちばんおおい / 2ばんめにおおい |
| `compare-length` | 長さ | 線分SVG | いちばんながい / いちばんみじかい |
| `compare-spring` | ばね | ばねSVG | ◎△×の3段階マーク |
| `area-compare` | 広さ | 白黒グリッドSVG | いちばんひろい / いちばんせまい |

### 共通構造

すべての比較問題は以下の構造を共有する：

1. **固定問題プール** — `QUESTION_POOL` 配列 + `usedIndices` で重複なし巡回
2. **専用画面** — `XxxScreen.tsx`（NavigationBar + 問題表示 + 回答UI）
3. **回答UI** — `AnswerUI.tsx`（マークサイクル + こたえあわせ + FeedbackOverlay）
4. **ダミーChoiceDisplay** — 共通QuestionScreenでは使わないので `null` を返す
5. **`validateXxxMarks()`** — マーク配列から正解判定する関数

### 新しい比較サブテーマを追加する手順

1. `src/plugins/{id}/` にプラグインを作成（上記の共通構造に従う）
2. `categoryData.ts` で `group: '比較'` と `subLabel: 'サブテーマ名'` を指定
3. `App.tsx` に `/question/{id}` ルートを `:typeId` より前に追加
4. 凡例テキスト（○の意味、×の意味）を問題に合わせて変更
