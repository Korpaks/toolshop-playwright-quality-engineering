import { test as base, expect, type APIRequestContext } from '@playwright/test';

type Fixtures = { api: APIRequestContext };

export const test = base.extend<Fixtures>({
  api: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com',
      extraHTTPHeaders: { Accept: 'application/json' },
      ignoreHTTPSErrors: true,
    });
    await use(context);
    await context.dispose();
  },
});

export { expect };
