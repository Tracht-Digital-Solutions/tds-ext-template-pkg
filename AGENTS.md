# AGENTS.md — tds-ext-template-pkg

The clone base for TDS panel extensions. Read `tds-panel-contract-pkg`'s AGENTS.md
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

- Depends on the **published** `tds-panel-contract` (`^0.2.0`), not a path link —
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
