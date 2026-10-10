import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test('home page has no automatically detectable critical accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .disableRules(['color-contrast']).analyze();
  const critical = results.violations.filter(violation => violation.impact === 'critical');
  expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
});
