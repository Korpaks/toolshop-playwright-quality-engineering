import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Authentication validation', () => {
  test('invalid credentials show a safe error @smoke', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('invalid@example.test', 'NotARealPassword!');
    await expect(login.error).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('empty login form exposes required validation', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.submit.click();
    await expect(page.locator('[data-test="email-error"]')).toBeVisible();
    await expect(page.locator('[data-test="password-error"]')).toBeVisible();
  });

  test('password reset link routes to recovery flow', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await page.getByRole('link', { name: /forgot.*password/i }).click();
    await expect(page).toHaveURL(/forgot-password/);
  });
});
