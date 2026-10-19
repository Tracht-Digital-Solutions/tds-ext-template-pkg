# AGENTS.md — tds-ext-template-pkg

The **clone base** for new TDS frontend extensions: an empty scaffold with the shape every
extension shares, plus a rename checklist (see `README.md`). Its `lint:primitives` script is the
tds-shared bin (`"lint:primitives": "tds-lint-primitives"`, since 0.59), not a local copy.

Read `tds-frontend-contract-pkg/AGENTS.md` first. `tds-ext-time-tracker-pkg` is the worked
reference with real behaviour.

## Commands

```bash
npm install --no-package-lock   # never npm ci
npm run type-check
npm run lint:primitives
npm run test:run                # vitest; the clone-safety tests live here
npm run build                   # tsup
composer install && composer test   # phpunit
```

## Hard rules

- Every identifier, path and specifier uses the `template` token, so a find/replace catches it.
- Nothing from a real extension may appear in ids, paths or specifiers.
- The manifest keeps exercising **all six** contribution slots.
- Keep `php/docs/api.php` and `php/tests/TemplateApiDocsTest.php`; clones inherit the parity check.
- Stay in the `0.1.x` line; a clone inherits it, and the host pins `^0.1.x`.
- The lint script lives in tds-shared (`scripts/lint-primitives.mjs`); never copy it back into a repo.
- Versions move via the release workflow only.

## Topic files

| File | Read before |
|---|---|
| [docs/agents/architecture.md](docs/agents/architecture.md) | Changing the scaffold or cloning a new extension |
| [docs/agents/lint-primitives.md](docs/agents/lint-primitives.md) | Chasing a lint finding or allowing a new primitive class |
| [docs/agents/backend.md](docs/agents/backend.md) | Touching PHP, migrations or `php/docs/api.php` |
| [docs/agents/frontend-conventions.md](docs/agents/frontend-conventions.md) | Touching any island, page or widget markup |
| [docs/agents/testing.md](docs/agents/testing.md) | Writing or changing tests |
| [docs/agents/release.md](docs/agents/release.md) | Releasing or changing CI |

Workspace rules: `../CLAUDE.md`. Cross-repo state: `../MIGRATION-STATUS.md`.
