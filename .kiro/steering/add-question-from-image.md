---
inclusion: auto
---

# 画像から問題プラグインを追加するガイド

ユーザーが問題用紙の写真を添付して「この問題を追加して」と依頼した場合の実装手順。

## 全体フロー

1. **画像分析** — 問題形式・問題文・問題数・回答方式を読み取る
2. **分類判断** — 既存カテゴリ/グループに属するか、新規か
3. **回答方式判断** — 4択形式 or カスタムUI（○×マーク等）
4. **プラグイン実装** — 型定義 → ロジック → コンポーネント → 登録
5. **カテゴリ登録** — categoryData.ts + テーマカラー追加
6. **ビルド確認** — `npm run build`
7. **Playwright動作確認** — 画面遷移・回答操作・フィードバック表示
8. **一時ファイル削除**

## Step 1: 画像分析

画像から以下を読み取る：

- **問題文**（ひらがな）— そのまま `instructionText` に使う
- **問題形式** — グリッド型、図形比較型、線の比較型、ばね型など
- **問題数** — 固定問題プールのサイズ
- **回答方式** — 4択選択 / ○×マーク / ◎△×マーク / 塗りつぶし
- **各問題のデータ** — セルの配置、図形の種類、正解

## Step 2: 回答方式の判断

| 回答方式 | 使用するフレームワーク | 例 |
|---|---|---|
| 4択から1つ選ぶ | 共通 `QuestionScreen` | 回転図形、重ね図形 |
| ○×をつける | 専用画面（SeesawScreenパターン） | 比較（長さ）、比較（重さ） |
| ◎△×をつける | 専用画面 | 比較（ばね） |
| セルを塗る | 専用画面 | 重ね図形応用（将来） |

**4択形式の場合**: `QuestionScreen` をそのまま使う。`choices` に4つの選択肢データを入れる。
**カスタムUI形式の場合**: 専用画面コンポーネントを作り、`App.tsx` に `:typeId` より前にルートを追加する。

## Step 3: プラグインのファイル構成

```
src/plugins/{plugin-id}/
├── types.ts                    # 型定義
├── {pluginId}Question.ts       # 固定問題データ + 判定ロジック
├── index.ts                    # QuestionType定義 + レジストリ登録
└── components/
    ├── QuestionDisplay.tsx      # 問題表示コンポーネント
    ├── ChoiceDisplay.tsx        # 選択肢表示（4択）or ダミー（カスタムUI）
    └── {PluginName}Screen.tsx   # 専用画面（カスタムUIの場合のみ）
```

### types.ts テンプレート

```typescript
/** 問題データ */
export interface XxxQuestionData {
  // 問題固有のデータ
}

/** 選択肢データ（4択の場合） */
export type XxxChoiceData = /* 選択肢の型 */;

/** 選択肢データ（カスタムUIの場合） */
export interface XxxChoiceData {
  // 正解情報（heaviestIndex, longestIndex など）
}
```

### question.ts テンプレート（固定問題プール）

```typescript
import type { Question } from '../../types/question';
import type { XxxQuestionData, XxxChoiceData } from './types';

interface FixedQ {
  // 問題固有のデータ + 正解情報
}

const FIXED_QUESTIONS: FixedQ[] = [
  // 画像から読み取った問題データ
];

const INSTRUCTION_TEXT = '問題文をそのまま使う';

export function generateXxxQuestion(): Question<XxxQuestionData, XxxChoiceData> {
  const fixedQ = FIXED_QUESTIONS[Math.floor(Math.random() * FIXED_QUESTIONS.length)];
  // 4択の場合: 正解 + 不正解3つを生成して choices に入れる
  // カスタムUIの場合: choices に正解情報を1要素だけ入れる
  return { questionData, choices, correctIndex, instructionText: INSTRUCTION_TEXT };
}
```

### index.ts テンプレート

```typescript
import type { QuestionType } from '../../types/question';
import type { XxxQuestionData, XxxChoiceData } from './types';
import { generateXxxQuestion, checkXxxAnswer } from './xxxQuestion';
import { XxxQuestionDisplay } from './components/QuestionDisplay';
import { XxxChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

export const xxxQuestionType: QuestionType<XxxQuestionData, XxxChoiceData> = {
  id: 'xxx',
  displayName: '表示名',
  icon: '🔲',
  generateQuestion: generateXxxQuestion,
  QuestionDisplay: XxxQuestionDisplay,
  ChoiceDisplay: XxxChoiceDisplay,
  checkAnswer: checkXxxAnswer,
};

export function registerXxxPlugin(): void {
  registry.register(xxxQuestionType as QuestionType);
}
```

## Step 4: 登録箇所（5ファイル）

新しいプラグインを追加する際に必ず更新するファイル：

### 1. `src/main.tsx`
```typescript
import { registerXxxPlugin } from './plugins/xxx';
registerXxxPlugin();
```

### 2. `src/framework/categoryData.ts`
```typescript
// implementedGradients に追加
'xxx': 'linear-gradient(135deg, #色1 0%, #色2 100%)',

// units に追加（グループ化する場合は group と subLabel を指定）
{ id: 'xxx', name: 'グループ名', icon: '🔲', implemented: true, group: 'グループ名', subLabel: 'サブラベル' },
```

### 3. `src/framework/components/QuestionScreen.tsx` — TYPE_THEMES に追加
```typescript
'xxx': { gradient: 'linear-gradient(135deg, #色1 0%, #色2 100%)', accent: '#色1' },
```

### 4. `src/framework/components/QuestionListScreen.tsx` — TYPE_THEMES に追加
（QuestionScreen.tsx と同じ形式）

### 5. `src/App.tsx`（カスタムUIの場合のみ）
```tsx
import { XxxScreen } from './plugins/xxx/components/XxxScreen';
// :typeId より前に配置
<Route path="/question/xxx" element={<XxxScreen />} />
```

## Step 5: グループ化のルール

同じ大テーマに属する問題タイプは `group` プロパティでグループ化する。

```typescript
// categoryData.ts の units 配列
{ id: 'overlay', name: '重ね図形', icon: '🔲', implemented: true, group: '重ね図形', subLabel: '基本' },
{ id: 'overlay-advanced', name: '重ね図形', icon: '🔲', implemented: true, group: '重ね図形', subLabel: '応用' },
```

- `group` が同じ unit はホーム画面で1枚のカードにまとまる
- カード内にサブボタン（基本/応用/図形など）が表示される
- 新しいサブタイプを追加する場合は同じ `group` 名を使う

## Step 5b: ボタン内テキストの注意点

`display: flex` のボタン内にルビ付きテキスト（`<R>` コンポーネント）を直接置くと、`<ruby>` タグがflex子要素として分断されてテキストが崩れる。

**NG:**
```tsx
<chakra.button display="flex" ...>
  ▶ すぐに<R rt="はじ">始</R>める   {/* 崩れる */}
</chakra.button>
```

**OK — ひらがなに置き換える（ボタンラベルにルビは不要）:**
```tsx
<chakra.button textAlign="center" ...>
  ▶ すぐにはじめる
</chakra.button>
```

**OK — `<Text>` や `<Box>` で囲んで1つのflex子要素にする:**
```tsx
<chakra.button display="flex" ...>
  <Box>▶ すぐに<R rt="はじ">始</R>める</Box>
</chakra.button>
```

ボタンラベルは対象ユーザー（幼児〜小学校低学年）向けなので、ひらがなに置き換えるのが最もシンプル。

## Step 5c: グリッド型問題データの定義パターン

白黒グリッドの問題データは、ヘルパー関数で簡潔に定義できる：

```typescript
/** B=black, W=white の文字列からグリッドを生成 */
function g(size: number, pattern: string): AreaGrid {
  const cells = pattern.split('').map(c => c === 'B' ? 'black' : 'white');
  return { size, cells };
}

// 使用例: 3×3グリッド（5黒）
{ grid: g(3, 'BWBBWWBWB'), name: 'ひだり' }
```

パターン文字列は左上から右下へ行優先で並べる。`size × size` の長さになるよう注意。

## Step 6: 図形描画のパターン

### SVGで描画する場合（推奨）
- 丸、三角、四角などの基本図形 → `<circle>`, `<polygon>`, `<rect>`
- 複雑な形状 → `<path>` の d 属性
- 座標は正規化（0〜100）して viewBox で制御

### グリッド型の場合
- Chakra UI の `<Grid>` + `<GridItem>` でセルを配置
- 各セル内に SVG でシンボルを描画

### 色の使い分け
- 問題表示: 黒 `#1a1a1a`（輪郭線）、白 `#ffffff`（背景）
- 選択肢の正解部分: 濃い灰色 `#6b7280`（塗り）
- 選択肢の非正解部分: 薄い灰色 `#d1d5db`（点線）

## Step 7: 不正解選択肢の生成（4択の場合）

```typescript
function generateDistractors(correct: ChoiceData, count: number): ChoiceData[] {
  const distractors: ChoiceData[] = [];
  let attempts = 0;
  while (distractors.length < count && attempts < 200) {
    attempts++;
    const candidate = mutate(correct); // 正解を少し変えたもの
    if (equals(candidate, correct)) continue;
    if (distractors.some(d => equals(d, candidate))) continue;
    distractors.push(candidate);
  }
  return distractors;
}
```

不正解は「正解に似ているが1〜2箇所異なる」ものが良い。画像に不正解の選択肢が明示されている場合はそれをそのまま使う。

## Step 8: Playwright動作確認

実装後に必ず確認する項目：

1. **問題画面が表示される** — 指示テキスト、問題表示、選択肢/マークボタン
2. **回答操作ができる** — 選択肢クリック or マークサイクル → こたえあわせ
3. **フィードバックが表示される** — `[role="dialog"]` の存在確認
4. **次の問題に遷移できる** — 「つぎの問題へ」ボタン
5. **問題の多様性** — 複数回遷移して異なる問題が出るか

```typescript
// テストスクリプトのパターン
import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// ページ遷移（ハッシュルーティング対策: 一度ホームを経由）
await page.goto('http://localhost:5173/minatore/#/');
await page.waitForTimeout(200);
await page.goto('http://localhost:5173/minatore/#/question/{plugin-id}');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(500);

// 確認
const content = await page.textContent('body');
// ... テキスト・要素の確認

await browser.close();
```

## チェックリスト

新しい問題プラグインを追加する際の最終確認：

- [ ] types.ts — 型定義
- [ ] xxxQuestion.ts — 固定問題データ + 生成関数 + 判定関数
- [ ] components/QuestionDisplay.tsx — 問題表示
- [ ] components/ChoiceDisplay.tsx — 選択肢表示 or ダミー
- [ ] components/XxxScreen.tsx — 専用画面（カスタムUIの場合）
- [ ] index.ts — QuestionType定義 + register関数
- [ ] src/main.tsx — プラグイン登録
- [ ] src/framework/categoryData.ts — カテゴリ登録 + グラデーション
- [ ] src/framework/components/QuestionScreen.tsx — TYPE_THEMES
- [ ] src/framework/components/QuestionListScreen.tsx — TYPE_THEMES
- [ ] src/App.tsx — ルート追加（カスタムUIの場合）
- [ ] `npm run build` — ビルド成功
- [ ] Playwright — 動作確認成功
- [ ] 一時ファイル削除（e2e-check.ts, スクリーンショット）
