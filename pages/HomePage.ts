import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder(/search/i);
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.productCards = page.locator('[data-test="product-name"]');
    this.sortSelect = page.locator('[data-test="sort"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page).toHaveTitle(/practice software testing|toolshop/i);
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async openProduct(name: string): Promise<void> {
    const product = this.page.locator('[data-test="product-name"]').filter({ hasText: name }).first();
    await product.waitFor();
    await product.click();
    await this.page.waitForURL(/\/product\//);
  }
}
