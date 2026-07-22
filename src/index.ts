import { defineExtension } from "@tracht-digital-solutions/tds-frontend-contract";

/**
 * TEMPLATE extension manifest. Clone this repo, then rename:
 *   - the id ("template" → your extension id, kebab-case)
 *   - every "@tracht-digital-solutions/tds-ext-template/..." specifier to your
 *     package name (island/entrypoint paths)
 *   - the permission/nav/widget/settings/route ids + labels
 * See README.md for the full checklist.
 *
 * The six contribution slots below are all optional — delete the ones your
 * extension doesn't use. `frontend-contract`'s composeExtensions validates this at
 * the host build and hard-errors on a collision with another extension.
 */
export default defineExtension({
  id: "template",
  name: "Vorlage",
  version: "0.1.0",
  // dependsOn: ["some-other-extension"],   // to mount into another extension
  permissions: [{ id: "template:read", label: "Vorlage ansehen", group: "template" }],
  nav: [
    {
      id: "template",
      label: "Vorlage",
      href: "/template",
      icon: "square",
      group: "tools",
      order: 100,
      permission: "template:read",
    },
  ],
  widgets: [
    {
      id: "template-widget",
      title: "Vorlage",
      island: "@tracht-digital-solutions/tds-ext-template/widgets/Widget.astro",
      size: "md",
      permission: "template:read",
      dataEndpoint: "/template/summary",
      order: 100,
    },
  ],
  settings: [
    {
      id: "template",
      label: "Vorlage",
      island: "@tracht-digital-solutions/tds-ext-template/islands/Settings.astro",
      order: 100,
    },
  ],
  routes: [
    {
      pattern: "/template",
      entrypoint: "@tracht-digital-solutions/tds-ext-template/pages/Index.astro",
      permission: "template:read",
    },
  ],
  i18n: {
    de: { "template.title": "Vorlage" },
    en: { "template.title": "Template" },
  },
});
