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

## Styling: use the shared primitives, never invent a class name

**An extension ships no CSS.** There is no stylesheet in this package and there
must not be one — every token and component comes from `tds-shared`, which the
product already installs (declared here as a **peer** dependency, the same
treatment astro and react get). The host renders this markup inside the `panel`
surface, so the geometry is already decided.

The scaffold's markup is the reference. Use exactly these:

| Slot | Class |
|---|---|
| page shell | `tds-page` + `tds-page__head` > `h1.tds-page__title` (+ `tds-page__lede`) |
| dashboard widget | `article.tds-widget` > `h3.tds-widget__title`, figure `tds-widget__metric` |
| settings slot | `div.tds-settings-section__body` |
| record list | `ul.tds-list` > `li.tds-list__row` |
| card / table / empty | `tds-card` · `tds-table` · `tds-empty` |
| button | `btn` + `btn-primary` / `-accent` / `-ghost` / `-danger` (**both** classes) |
| inline label | `chip` + `chip--{neutral,success,warning,danger,info,cat-*}` |
| block message | `tds-alert` (+ `--success` / `--warning` / `--danger`) |
| label + control | `tds-field-row` · toggle row `tds-toggle-row` |
| message thread | `tds-thread` > `tds-thread__item--own` / `--other` |
| loading | `<Spinner />` from `tds-shared/components` |
| destructive confirm | `<ConfirmDialog />` from `tds-shared/components` — **never `window.confirm()`** |

**Do not invent a bespoke BEM name for any of the above.** Every extension used to
carry its own (`page page--x`, `widget widget--x`, `settings-section--x`,
`widget__metric`, `danger`, `<p>Wird geladen …</p>`) and **none of them had a CSS
rule anywhere** — they were a contract of intent that nothing implemented, so
those regions rendered as raw unstyled HTML. Undoing that took a sweep across all
14 extensions.

Three traps, each of which shipped as a real bug:

- **Never interpolate a class name.** `` className={`chip chip--${status}`} ``
  fails twice over: Tailwind cannot statically extract it, and a value matching no
  variant renders an unstyled element. Map explicitly, with a fallback. When the
  value comes from the **database**, use `resolveChipVariant()` from
  `@tracht-digital-solutions/tds-shared/design` — it is guaranteed to return a
  class that exists. (`badge badge--${status}` shipped in two islands; `.badge`
  never existed at all.)
- **`.status-pill` is an inline label, not a banner.** For a block message use
  `.tds-alert`. A stretched `<p class="status-pill">` was the most common misuse
  in the platform, at 24 sites.
- **A destructive action needs a `<ConfirmDialog>`, and it is controlled.** Park
  the target in state from the row button, and let the dialog perform the action;
  pass `busy` while the request is in flight so it cannot be double-submitted
  (blocking `window.confirm()` gave that away for free — a non-blocking dialog
  must do it explicitly). Auditing every `method: "DELETE"` against its gate
  found **only 3 of 10 destructive actions confirmed at all** — invoices,
  customers, blog posts, FAQ entries, docs and milestones each deleted on a
  single unguarded click. The missing gate, not the ugly native prompt, is the
  failure mode to watch for; grep `method: "DELETE"` when you add one.
- **A JSX comment cannot sit in an expression position** — not after `=> (`, not
  in a ternary branch, not in a `.map()` return. It is valid only as JSX
  *children*. Put the note above the `return`; otherwise the build fails with a
  bare `Expected ")"` pointing at the comment's own closing line. The same applies
  to multi-line `{/* … */}` in an `.astro` template body.

For a component's **internal** layout, reach for the generic primitives before
inventing anything: `.tds-stack` (+ `--tight` / `--loose`) for a vertical stack —
form bodies, detail panels, reply lists; `.tds-row` (+ `--between`) for a
wrapping horizontal row — header rows, filter bars, tab strips; `.tds-compose`
(+ `__actions`) for a reply box. Those three plus the existing `.tds-toolbar`
(action rows) and `.tds-marginalia`-style `.marginalia` (metadata and hint text)
absorbed 46 of the class names extensions had invented for exactly these shapes.

**~31 names across the platform legitimately stay bespoke** and are knowingly
unstyled — genuinely singular internals such as `cms-editor__blocks`,
`live-chat-settings__matrix`, `blog-editor__preview`, `api-wiki__routes`,
`time-tracker__timer`. If you add one, expect it to render on browser defaults
until someone gives it a rule; that is the accepted trade, not an oversight.
(`widget-slot__*` looks orphan but is styled by an inline `<style>` in the host's
dashboard page.)

## Conventions baked in (don't regress)

- Depends on the **published** `tds-frontend-contract` (`^0.2.0`), not a path link —
  npm from GitHub Packages (via `.npmrc` + `NPM_TOKEN`), Composer from the public
  VCS repo. No local path repo — Composer fatals on a missing path repo in CI, so
  extensions resolve the contract purely via VCS (a clone, not a sibling).
- CI installs with **`npm install --no-package-lock`** (win32 lockfile breaks the
  Linux runner) — never `npm ci` + a committed lockfile here.
- `PACKAGE_TOKEN` (a public-Packages-friendly PAT) both installs the contract and
  publishes this package; set `NPM_TOKEN` from it in CI.
- **The npm and Composer versions move independently** — bump `package.json` for
  a frontend-only change (markup, islands, styling) and `composer.json` only when
  the PHP `Module` actually changes. The pushed tag is the Composer release ref.
  Every extension in the platform has its npm version ahead of its Composer one
  for exactly this reason; an earlier revision of this file claimed they move "in
  lockstep", which no repo has ever done.
- Declares `tds-shared` as a **peer** dependency (`>=0.14.0`), like astro and
  react: the product installs it, and a second copy in the extension would mean
  two token sets. An extension that omits it still builds — the product's copy
  resolves — so the omission is invisible until someone installs the package
  standalone. Keep it declared.

## When cloned

Do the README rename checklist in full — a leftover `template`/`Template`/
`tds-ext-template-pkg` string will collide with this template or misresolve a
specifier. `composeExtensions` / `ModuleRegistry` hard-error on a duplicate id, so
a missed rename fails loudly at the host build rather than silently.
