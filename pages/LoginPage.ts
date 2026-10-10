import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.email = page.locator('[data-test="email"]');
    this.password = page.locator('[data-test="password"]');
    this.submit = page.locator('[data-test="login-submit"]');
    this.error = page.locator('[role="alert"], .alert-danger');
  }

  async goto(): Promise<void> {
    await this.page.goto('/auth/login');
    await this.email.waitFor({ state: 'visible' });
  }
  async login(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
