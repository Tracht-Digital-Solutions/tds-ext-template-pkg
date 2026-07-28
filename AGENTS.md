# AGENTS.md — tds-ext-template-pkg

The clone base for TDS frontend extensions. Read `tds-frontend-contract-pkg`'s AGENTS.md
first — extensions implement that contract. `tds-ext-time-tracker-pkg` is the worked
reference; this is the empty scaffold with the same shape + a rename checklist
(see README.md).

## Shape (identical to any extension)

- `src/index.ts` — the `defineExtension({...})` manifest.
- `pages/*.astro` / `widgets/*.astro` / `islands/*` — the route/widget/settings
  slots' entrypoints (package subpaths in `exports`).
- `php/src/*Module.php` — the backend `Module`.
- `php/db/migrations/*` — Phinx migrations, class names **prefixed with the
  module id** (in-process auto-migrator = one process = no name reuse).
- `.github/workflows/*` — inline dual pipeline (phpunit + npm publish).

## Conventions baked in (don't regress)

- Depends on the **published** `tds-frontend-contract` (`^0.2.0`), not a path link —
  npm from GitHub Packages (via `.npmrc` + `NPM_TOKEN`), Composer from the public
  VCS repo. No local path repo — Composer fatals on a missing path repo in CI, so
  extensions resolve the contract purely via VCS (a clone, not a sibling).
- CI installs with **`npm install --no-package-lock`** (win32 lockfile breaks the
  Linux runner) — never `npm ci` + a committed lockfile here.
- `PACKAGE_TOKEN` (a public-Packages-friendly PAT) both installs the contract and
  publishes this package; set `NPM_TOKEN` from it in CI.
- Version bumps `package.json` + `composer.json` in lockstep; the pushed tag is
  the Composer release ref.

## When cloned

Do the README rename checklist in full — a leftover `template`/`Template`/
`tds-ext-template-pkg` string will collide with this template or misresolve a
specifier. `composeExtensions` / `ModuleRegistry` hard-error on a duplicate id, so
a missed rename fails loudly at the host build rather than silently.

## Tests

```bash
npm run test:run    # vitest, 45 tests (jsdom per-file via a @vitest-environment docblock)
```

This repo is not a feature — it is the **clone base** for every new extension —
so the tests target a different risk from the other packages: not "does it
work" but **"does cloning it work"**.

- `tests/rename.test.ts` — the clone checklist, enforced. Every identifier,
  path and specifier must be spelled with the same `template` token, in a form
  a find/replace catches; the package name must match; and **nothing may be
  left over from a real extension** (a stray `lexware:read` or `/tickets` path
  here is copied silently into the next four extensions somebody starts). It
  also asserts the manifest still exercises **all six contribution slots** —
  the template doubles as the worked reference for `frontend-contract`, and a
  slot that quietly disappears is one the next author never learns exists.
  > The foreign-name check is scoped to ids/paths/specifiers, NOT the whole
  > manifest: nav `group` values are shared sidebar buckets ("tools",
  > "verwaltung", "work") that every extension legitimately reuses, and labels
  > are free German text.
- `islands/WidgetBody.test.tsx` — the placeholder must **hydrate** (a clone
  starts from something that demonstrably runs), keep the `.widget__metric`
  class the dashboard grid styles, and make **no network request** — a clone
  that leaves the placeholder in would hit a non-existent endpoint on every
  dashboard load.
- `src/index.test.ts` + `tests/packaging.test.ts` — the manifest as a product
  build sees it, and that every specifier resolves, is exported, and ships.

`tests/rename.test.ts` also pins the version to the **0.1.x** line: a clone
inherits it, and starting outside 0.1.x means the host's `^0.1.x` caret never
picks the new extension up.

Verified by mutation: 17 deliberate breakages introduced, 17 caught.
