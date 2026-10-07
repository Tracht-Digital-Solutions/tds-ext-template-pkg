# Testing

```bash
npm run test:run   # vitest; islands opt into jsdom per file via a @vitest-environment docblock
composer test      # phpunit
```

CI (`_build.yml`) runs both suites, plus type-check, `lint:primitives` and build, on
every run.

## Test environment against the current tds-shared

tds-shared is a **peer** dependency, so a fresh standalone install may resolve an old
version while every product build composes the current one. Keep these in mind:

- `apiFetch` first consults the host runtime config (`/tds-runtime.json`), so
  `fetch.mock.calls[0]` is that probe. Call **`primeRuntimeConfig(null)`** in
  `beforeEach`; panel products never ship that file, so "absent" matches production.
- `apiFetch` is **async**. `await waitFor(() => expect(fetch).toHaveBeenCalled())`
  before reading `mock.calls`.
- A multipart upload carries an **empty** `headers` object. Assert "no content-type
  header", never "headers is undefined".
- Error-path tests answer with a **populated** body and a non-OK status. Against an
  empty error body the ok-check is unobservable.
- At least one assertion per suite pins the **absolute API host** (see
  [frontend-conventions.md](frontend-conventions.md#api-calls-apifetch-never-a-relative-fetch)).

## Suites

This repo is a clone base, so the tests target **"does cloning it work"**, not "does it work".

| Suite | Covers |
|---|---|
| `tests/rename.test.ts` | The clone checklist: one `template` token everywhere; package name matches; no leftovers from real extensions (e.g. `lexware:read`, `/tickets`); all six contribution slots present; version in the `0.1.x` line; taken migration version bands |
| `islands/WidgetBody.test.tsx` | Placeholder hydrates, keeps `.widget__metric`, makes no network request |
| `src/index.test.ts` + `tests/packaging.test.ts` | Manifest as a product build sees it; specifiers resolve, are exported and ship |
| `php/tests/TemplateModuleTest.php`, `TemplateApiDocsTest.php` | Module and API-doc parity |

The foreign-name check is scoped to ids, paths and specifiers, **not** the whole manifest:
nav `group` values are shared sidebar buckets ("tools", "verwaltung", "work") and labels are
free German text.

Mutation check: 17 breakages, 17 caught.
