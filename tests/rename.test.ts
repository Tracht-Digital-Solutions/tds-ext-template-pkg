import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import manifest from "../src/index";

/**
 * This repo is not a feature — it is the CLONE BASE for every new extension,
 * and its README tells you to copy it and find/replace the word "template".
 *
 * So the thing worth testing is that the rename actually WORKS: every
 * placeholder identifier has to be spelled with the same token, in a form a
 * find/replace catches, and nothing may be left over from a real extension.
 * A stray `lexware:read` or a hard-coded `/tickets` path here is copied
 * silently into the next four extensions somebody starts.
 *
 * These assertions fail loudly if the template ever drifts.
 */

const TOKEN = "template";
const root = new URL("../", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8")) as {
  name: string;
  version: string;
};

/** Every identifier the clone checklist tells you to rename. */
const identifiers = [
  manifest.id,
  ...(manifest.permissions ?? []).map((p) => p.id),
  ...(manifest.nav ?? []).map((n) => n.id),
  ...(manifest.widgets ?? []).map((w) => w.id),
  ...(manifest.settings ?? []).map((s) => s.id),
];

/** Every path/specifier the clone checklist tells you to rename. */
const paths = [
  ...(manifest.nav ?? []).map((n) => n.href),
  ...(manifest.routes ?? []).map((r) => r.pattern),
  ...(manifest.widgets ?? []).map((w) => w.dataEndpoint).filter((e): e is string => Boolean(e)),
  ...(manifest.routes ?? []).map((r) => r.entrypoint),
  ...(manifest.widgets ?? []).map((w) => w.island),
  ...(manifest.settings ?? []).map((s) => s.island),
];

describe("the clone checklist", () => {
  it("spells every identifier with the same placeholder token", () => {
    // A mixed vocabulary ("template" here, "vorlage" there) means a
    // find/replace leaves half the ids behind.
    for (const id of identifiers) {
      expect(id, `${id} does not contain "${TOKEN}"`).toContain(TOKEN);
    }
  });

  it("spells every path and specifier with the same placeholder token", () => {
    expect(paths.length).toBeGreaterThan(0);
    for (const p of paths) {
      expect(p, `${p} does not contain "${TOKEN}"`).toContain(TOKEN);
    }
  });

  it("names the package after the same token", () => {
    expect(pkg.name).toBe(`@tracht-digital-solutions/tds-ext-${TOKEN}`);
  });

  it("carries NOTHING left over from a real extension", () => {
    // The failure mode this guards: someone fixes a bug in the template by
    // pasting from lexware/tickets and leaves an id behind, which is then
    // cloned into the next four extensions.
    const FOREIGN = [
      "lexware",
      "tickets",
      "billing",
      "customers",
      "documents",
      "messages",
      "projects",
      "blog-cms",
      "website-cms",
      "live-chat",
      "time-tracker",
      "contact",
      "tools",
    ];
    // Scoped to ids/paths/specifiers on purpose: nav `group` values are shared
    // sidebar buckets ("tools", "verwaltung", "work", …) that every extension
    // legitimately reuses, and labels are free German text.
    const haystack = [...identifiers, ...paths].join(" ").toLowerCase();
    for (const name of FOREIGN) {
      expect(haystack, `the template still mentions "${name}"`).not.toContain(name);
    }
  });

  it("exercises ALL SIX contribution slots", () => {
    // The template is also the worked reference for `frontend-contract`: if a
    // slot is missing here, the next extension author never learns it exists.
    expect(manifest.permissions?.length, "permissions slot").toBeGreaterThan(0);
    expect(manifest.nav?.length, "nav slot").toBeGreaterThan(0);
    expect(manifest.widgets?.length, "widgets slot").toBeGreaterThan(0);
    expect(manifest.settings?.length, "settings slot").toBeGreaterThan(0);
    expect(manifest.routes?.length, "routes slot").toBeGreaterThan(0);
    expect(Object.keys(manifest.i18n ?? {}).length, "i18n slot").toBeGreaterThan(0);
  });

  it("starts a new extension at the 0.1.x line the host pins", () => {
    // A clone inherits this version; starting outside 0.1.x means the host's
    // `^0.1.x` caret never picks the new extension up.
    expect(pkg.version).toMatch(/^0\.1\./);
  });

  it("keeps the manifest version in semver form", () => {
    expect(manifest.version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
