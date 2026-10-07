# `scripts/lint-primitives.mjs` (the seed)

This file is the seed for every repo that carries the script (27 at last count: the
`tds-ext-*` packages, the `tds-tool-*` packs, `tds-core-frontend-pkg`, `tds-tools-frontend`
and `tds-shop-frontend`). Reusable workflows are org-blocked, so copying is the mechanism:
**change it here, propagate to every copy, and re-run each one.**

## The copies have drifted

The copies are meant to be identical. Content-wise there are currently two variants (some
copies differ only in line endings, which doesn't matter):

| Variant | Repos | Difference |
|---|---|---|
| Seed | this repo, `tds-core-frontend-pkg`, the other `tds-ext-*`, the `tds-tool-*` packs | — |
| App-shell | `tds-tools-frontend`, `tds-shop-frontend` | Also accepts the tds-shared app-shell controls (`tds-tabbar__item`, `tds-sheet__close`, `tds-segmented__option`, `tds-tile`, `tds-searchfield__input`) |

Before changing the script, bring the seed up to the app-shell variant and propagate from
here. Compare copies with `diff --strip-trailing-cr`, not a plain checksum.

## What it checks

- A control (`button`, `input`, `select`, `textarea`, …) without a shared class.
- A `<table>` without `tds-table`, and a flex/grid table cell (which drops the cell out of
  the column algorithm).
- A `btn-*` variant that doesn't exist in tds-shared. `btn btn-secondary` used to pass while
  matching no rule at all.
- `.tds-dropdown__trigger` / `__item` count as shared classes; forcing `.btn` onto a menu row
  would give it pill radius and button padding.

Don't fork the script per repo again; the variant checks used to live only in
`tds-core-frontend-pkg`.

## How it reads markup

- It is a **regex scan**, so a tag name written inside a comment counts as markup. Name
  elements in prose.
- `readTag()` walks each tag tracking string state and `{}` depth. Tags used to be matched
  with `[^>]*>`, which stops at the first `>` an arrow handler (`onClick={() => …}`)
  supplies. That reported correctly classed controls as bare and silently missed `flex`
  cells.
- `classOf()` resolves a local `const field = "…"`, so the result no longer depends on a
  variable's name.

Before "fixing" a false positive, check whether the tag parsing is the cause. All 20 repos
were re-run after the parser fix with zero findings.
