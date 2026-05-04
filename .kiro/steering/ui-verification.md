---
inclusion: auto
---

# UI変更時のPlaywright確認ルール

画面の見た目に影響する変更（コンポーネント、スタイル、レイアウト、アイコン等）を行った場合、必ずPlaywrightでスクリーンショットを撮って確認すること。

## 手順

1. devサーバーが起動していることを確認（`http://localhost:5173/minatore/` or 5174）
2. 以下のパターンでスクリーンショットを取得:

```javascript
import { chromium } from '/Users/motani/Develop/github/minatore/node_modules/playwright/index.mjs';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 920, height: 800 } });
await page.goto('http://localhost:5174/minatore/');
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/screenshot.png', fullPage: true });
await browser.close();
```

3. 変更した画面に応じて適切なページに遷移してスクリーンショットを撮る
4. スクリーンショットのパスをユーザーに報告する

## 対象となる変更

- コンポーネントの追加・変更・削除
- CSS/スタイルの変更（幅、色、フォント、レイアウト等）
- アイコン・画像の追加・変更
- ルーティングの追加（新画面）

## 対象外

- ロジックのみの変更（問題生成、正解判定等）
- テストファイルの変更
- 設定ファイルの変更
