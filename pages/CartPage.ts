import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly rows: Locator;
  readonly total: Locator;
  readonly checkout: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rows = page.locator('tbody tr');
    this.total = page.locator('[data-test="cart-total"]');
    this.checkout = page.locator('[data-test="proceed-1"]');
  }

  async goto(): Promise<void> { await this.page.goto('/checkout'); }
}
