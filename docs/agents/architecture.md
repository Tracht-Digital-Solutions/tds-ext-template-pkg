# Architecture

## Shape (identical in every extension)

| Path | Role |
|---|---|
| `src/index.ts` | The `defineExtension({...})` manifest |
| `pages/*.astro`, `widgets/*.astro`, `islands/*` | Entry points for the route, widget and settings slots; package subpaths in `exports` |
| `php/src/TemplateModule.php` | The backend `Module` |
| `php/db/migrations/*` | Phinx migrations, module id first in file and class name (`20260901000001_template_create_example.php` ⇒ `TemplateCreateExample`) |
| `php/docs/api.php` | One entry per mounted route, returned by the module's `apiDocs()` |
| `php/tests/TemplateApiDocsTest.php` | Documented and registered routes are the same set |
| `.github/workflows/*` | Inline dual pipeline (phpunit + npm publish); reusable workflows are org-blocked |

## Cloning a new extension

1. Do the README rename checklist **in full**. A leftover `template` / `Template` /
   `tds-ext-template-pkg` string collides with this template or misresolves a specifier.
   `composeExtensions` and `ModuleRegistry` fail hard on a duplicate id, so a missed rename
   fails loudly at the host build.
2. Pick a migration version band no shipped extension owns (`tests/rename.test.ts` lists the
   taken prefixes).
3. Keep `php/docs/api.php` and the API-docs test. Adding a route without describing it then
   fails your own suite instead of leaving a blank row in the admin API reference.
4. Start at `0.1.x`. The host's `^0.1.x` caret otherwise never picks the extension up.

## Placeholder widget

The placeholder widget must **hydrate** (a clone starts from something that runs), keep the
`.widget__metric` class the dashboard grid styles, and make **no network request**. A clone
that leaves it in would otherwise hit a non-existent endpoint on every dashboard load.

## Bespoke class names

About 31 class names across the platform legitimately stay bespoke and knowingly unstyled,
for genuinely singular internals (`cms-editor__blocks`, `live-chat-settings__matrix`,
`blog-editor__preview`, `api-wiki__routes`, `time-tracker__timer`). A new one renders on
browser defaults until someone gives it a rule; that is the accepted trade. `widget-slot__*`
looks orphaned but is styled by an inline `<style>` in the host's dashboard page.
