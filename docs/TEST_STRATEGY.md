# Test Strategy

## Objective

Provide fast, trustworthy evidence that the Toolshop's highest-value shopping capabilities work across service and browser boundaries. The portfolio emphasizes test design, isolation, diagnosability, and CI operation—not raw test count.

## Risk-based scope

| Risk | Coverage | Layer |
|---|---|---|
| Customers cannot discover a product | Search, empty results, category filtering, sorting, product navigation | UI + API |
| Catalog data is wrong or inconsistent | Typed core contract, pagination, taxonomy, UI/API name and price agreement | API + hybrid |
| Cart totals are incorrect | Quantity and line-subtotal calculation | UI |
| Cart state cannot be changed | Add and remove journeys in isolated browser contexts | UI |
| Checkout bypasses identity controls | Checkout authentication gate | UI |
| Authentication fails unsafely | Required fields, invalid credentials, recovery route | UI |
| Mobile experience is unusable | Product journey and horizontal-overflow checks | Mobile emulation |
| Critical accessibility barriers ship | WCAG A/AA axe scan for critical violations | Accessibility |
| Browser-specific regressions escape | Chromium, Firefox, and WebKit CI matrix | Cross-browser |

## Test data and isolation

- Public catalog checks are read-only.
- Cart state lives in a fresh Playwright browser context per test.
- Negative authentication uses reserved `.test` data and cannot target a real mailbox.
- Tests do not create accounts, place orders, or mutate shared inventory.
- API request contexts are created and disposed per worker fixture.

## Execution model

- Pull requests: static analysis, API suite, desktop browser matrix, mobile checks.
- Main branch pushes: same release gate with retained HTML reports and traces on failure.
- Weekly schedule: detects drift in the externally hosted test target.
- Local smoke command: fastest confidence check while developing.

## Known boundaries

Automated axe checks supplement rather than replace keyboard, screen-reader, zoom, and human usability testing. Payment completion and shared-data mutations are intentionally excluded from this public environment. Performance and security testing require separate workload and authorization boundaries.
