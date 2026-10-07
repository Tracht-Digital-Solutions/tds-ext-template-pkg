# AGENTS.md — tds-ext-template-pkg

The **clone base** for new TDS frontend extensions: an empty scaffold with the shape every
extension shares, plus a rename checklist (see `README.md`). It is also the **seed** of
`scripts/lint-primitives.mjs`, which every extension, tool pack and two sites copy.

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
- Change `scripts/lint-primitives.mjs` here first, then propagate it to every copy.
- Versions move via the release workflow only.

## Topic files

| File | Read before |
|---|---|
| [docs/agents/architecture.md](docs/agents/architecture.md) | Changing the scaffold or cloning a new extension |
| [docs/agents/lint-primitives.md](docs/agents/lint-primitives.md) | Changing `scripts/lint-primitives.mjs` or chasing a lint finding |
| [docs/agents/backend.md](docs/agents/backend.md) | Touching PHP, migrations or `php/docs/api.php` |
| [docs/agents/frontend-conventions.md](docs/agents/frontend-conventions.md) | Touching any island, page or widget markup |
| [docs/agents/testing.md](docs/agents/testing.md) | Writing or changing tests |
| [docs/agents/release.md](docs/agents/release.md) | Releasing or changing CI |

Workspace rules: `../CLAUDE.md`. Cross-repo state: `../MIGRATION-STATUS.md`.
