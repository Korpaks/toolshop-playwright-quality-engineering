import { expect, type Locator, type Page } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly name: Locator;
  readonly price: Locator;
  readonly quantity: Locator;
  readonly addToCart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.locator('[data-test="product-name"]');
    this.price = page.locator('[data-test="unit-price"]');
    this.quantity = page.locator('[data-test="quantity"]');
    this.addToCart = page.locator('[data-test="add-to-cart"]');
  }

  async add(quantity = 1): Promise<void> {
    await expect(this.addToCart).toBeEnabled();
    await this.quantity.fill(String(quantity));
    await this.addToCart.click();
  }
}
