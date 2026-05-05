import { test, expect } from 'playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

for (const vp of viewports) {
  test.describe(`${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('ホーム画面が表示される', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('body')).not.toBeEmpty();
      // パネルが表示されていること
      const panels = page.locator('button[aria-label]');
      await expect(panels.first()).toBeVisible();
      // コンテンツがビューポートからはみ出していないこと
      const body = page.locator('body');
      const bodyBox = await body.boundingBox();
      expect(bodyBox).not.toBeNull();
      // 水平スクロールが発生していないこと
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);
    });

    test('テーマ画面が表示される', async ({ page }) => {
      await page.goto('/#/theme/shapes');
      await expect(page.locator('body')).not.toBeEmpty();
      // テーマ画面のコンテンツが表示されること（最初のグループ名がヘッダーに表示）
      await expect(page.getByText('回転図形', { exact: true }).first()).toBeVisible();
      // 水平スクロールが発生していないこと
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);
    });

    test('テーマ画面（数量・推理）が表示される', async ({ page }) => {
      await page.goto('/#/theme/math-reasoning');
      await expect(page.locator('body')).not.toBeEmpty();
      await expect(page.getByText('比較', { exact: true }).first()).toBeVisible();
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);
    });

    test('問題画面が表示される', async ({ page }) => {
      await page.goto('/#/question/rotation');
      await expect(page.locator('body')).not.toBeEmpty();
      // 選択肢が表示されること
      const choices = page.locator('button[aria-label^="せんたくし"]');
      await expect(choices.first()).toBeVisible();
      // 水平スクロールが発生していないこと
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);
    });

    test('ランダム画面が表示される', async ({ page }) => {
      await page.goto('/#/random');
      await expect(page.locator('body')).not.toBeEmpty();
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);
    });
  });
}
