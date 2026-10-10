# Toolshop Quality Engineering Framework

[![Quality Pipeline](https://github.com/Korpaks/toolshop-playwright-quality-engineering/actions/workflows/quality.yml/badge.svg)](https://github.com/Korpaks/toolshop-playwright-quality-engineering/actions/workflows/quality.yml)

A production-style **TypeScript + Playwright** test framework for the [Practice Software Testing Toolshop](https://practicesoftwaretesting.com). It demonstrates how a quality engineer can validate an e-commerce system across its browser UI, REST API, accessibility surface, responsive layout, and cross-layer data flow.

## What this project demonstrates

- Page Object Model for maintainable browser journeys
- First-class API testing with typed response contracts
- Hybrid tests that compare browser content with the API source of truth
- Search, filters, sorting, product details, cart, checkout gates, and authentication validation
- WCAG-focused automated accessibility scanning with axe-core
- Desktop cross-browser and mobile-emulation coverage
- Safe negative tests with no destructive shared-environment mutations
- Parallel execution, retries only in CI, trace/video/screenshot diagnostics
- Pull-request, push, scheduled, and manually triggered GitHub Actions jobs

## Test architecture

```text
pages/          Browser-facing page objects
fixtures/       Isolated API request contexts and shared Playwright fixtures
utils/          Typed domain contracts
tests/api/      Service and contract checks
tests/ui/       Customer-facing browser journeys
tests/hybrid/   API-to-UI consistency checks
tests/accessibility/ Automated WCAG checks
```

The suite contains **32 independent tests**. Browser projects cover Chromium, Firefox, and WebKit; mobile-specific tests additionally run against a Pixel 7 profile. See the [test strategy](docs/TEST_STRATEGY.md) for risk-based coverage and scope decisions.

## Run locally

Requirements: Node.js 22+ and npm.

```bash
npm ci
npx playwright install
npm test
```

Useful focused commands:

```bash
npm run test:smoke
npm run test:api
npm run test:ui
npm run test:a11y
npm run test:headed
npm run report
```

To run the same environment in a container:

```bash
docker compose run --rm tests
```

## Configuration and security

Public non-production URLs are defaults. Override them with `WEB_BASE_URL` and `API_BASE_URL`. Copy `.env.example` only if authenticated scenarios are added locally. `.env` is ignored and no credentials are committed.

The public environment is shared, so tests use read-only API calls and cart state isolated to each browser context. Negative tests use impossible synthetic values and never modify other users' data.

## CI strategy

The pipeline separates fast static analysis and API feedback from the browser matrix. Every browser job publishes its HTML report and failure evidence for 14 days. The weekly scheduled run detects drift in the hosted practice application even when the repository has not changed.

## Test target

Practice Software Testing is an intentionally public training application maintained by Testsmith. This repository is an independent portfolio project and is not affiliated with the application owner.

## Author

**Igor Korpak** — Software Development Engineer in Test / QA Automation Engineer

[LinkedIn](https://www.linkedin.com/in/igor-korpak/) · [GitHub](https://github.com/Korpaks)
