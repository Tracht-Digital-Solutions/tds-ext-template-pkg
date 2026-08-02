// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import WidgetBody from "./WidgetBody";

/**
 * The template's placeholder widget body. There is no data here yet — the
 * point of the test is that the clone base HYDRATES: it must move off its
 * loading placeholder once mounted, so a new extension author who fills in a
 * fetch starts from something that demonstrably runs in the browser.
 */

afterEach(() => cleanup());

describe("the placeholder widget", () => {
  it("renders its loaded state once mounted", async () => {
    render(<WidgetBody />);
    expect(await screen.findByText("—")).toBeTruthy();
  });

  it("leaves the loading placeholder behind", async () => {
    render(<WidgetBody />);
    await screen.findByText("—");
    expect(document.querySelector('[aria-busy="true"]')).toBeNull();
  });

  it("uses the widget metric class the dashboard grid styles", async () => {
    // The host styles `.widget__metric`; a clone that renames it loses the
    // dashboard typography with no visible error.
    render(<WidgetBody />);
    const metric = await screen.findByText("—");
    expect(metric.className).toContain("widget__metric");
  });

  it("makes no network request of its own", async () => {
    // The placeholder must not fetch: a clone that leaves it in place would
    // hit a non-existent endpoint on every dashboard load.
    const seen: string[] = [];
    const original = globalThis.fetch;
    globalThis.fetch = (async (url: string) => {
      seen.push(url);
      return { ok: true, status: 200, json: async () => ({}) } as Response;
    }) as typeof fetch;
    try {
      render(<WidgetBody />);
      await screen.findByText("—");
      expect(seen).toEqual([]);
    } finally {
      globalThis.fetch = original;
    }
  });
});
