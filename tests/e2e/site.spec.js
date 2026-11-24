const { test, expect } = require('@playwright/test');

test('all pages and local assets work under a GitHub Pages project path', async ({ page, request }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const file of ['index.html', 'about.html', 'works.html', 'contact.html']) {
    await page.goto(file);
    await expect(page.locator('main h1')).toHaveCount(1);
    const links = await page.locator('[href], [src]').evaluateAll(elements =>
      elements.flatMap(element => ['href', 'src'].map(key => element.getAttribute(key)))
        .filter(value => value?.startsWith('./')),
    );
    for (const link of new Set(links)) {
      const response = await request.head(new URL(link, page.url()).href);
      expect(response.ok(), `${file}: ${link}`).toBe(true);
    }
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test('desktop gallery remains readable without JavaScript or animation libraries', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const noScript = await context.newPage();
  await noScript.goto('http://127.0.0.1:8766/eraf-web/');
  await expect(noScript.getByRole('heading', { name: 'Carolina', exact: true })).toBeInViewport();
  await noScript.getByRole('heading', { name: '80\'s vibes', exact: true }).scrollIntoViewIfNeeded();
  await expect(noScript.getByRole('heading', { name: '80\'s vibes', exact: true })).toBeInViewport();
  await context.close();

  await page.route('**/assets/scripts/vendor/gsap.min.js', route => route.abort());
  await page.goto('index.html');
  await expect(page.locator('html')).not.toHaveClass('motion-ready');
  await expect(page.getByRole('heading', { name: 'Carolina', exact: true })).toBeInViewport();
});

test('motion enhancement cleans up on resize and preference changes', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('index.html');
  await expect(page.locator('html')).toHaveClass('motion-ready');
  await expect(page.locator('.pin-spacer')).toHaveCount(2);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.getByRole('heading', { name: '80\'s vibes', exact: true })).toBeInViewport();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('html')).not.toHaveClass('motion-ready');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect.poll(() => page.locator('video').evaluate(video => video.paused)).toBe(true);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('html')).toHaveClass('motion-ready');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveClass('motion-ready');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect.poll(() => page.locator('video').evaluate(video => video.paused)).toBe(true);
  expect(errors).toEqual([]);
});

test('works series keep headings and image columns as siblings', async ({ page }) => {
  await page.goto('works.html');
  await expect(page.locator('article > .col-2')).toHaveCount(3);
  await expect(page.locator('article > .col-1')).toHaveCount(3);
  await expect(page.locator('article > .col-3')).toHaveCount(3);
  await page.getByRole('link', { name: 'Soul Dance', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Soul Dance', exact: true })).toBeInViewport();
});
