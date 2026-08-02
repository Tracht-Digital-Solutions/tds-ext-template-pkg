import { useEffect, useState } from "react";

import { Skeleton } from "@tracht-digital-solutions/tds-shared/components";

/**
 * TEMPLATE hydrated widget body. Fetch your widget's `dataEndpoint` (via the
 * base's API wrapper) and render it. Placeholder shown here.
 *
 * KEEP THE LOADING STATE AS IT IS WRITTEN BELOW. Every extension is cloned
 * from this file, and the previous version rendered a literal "…" — which is
 * how 12 of the 13 dashboard widgets ended up with a static ellipsis that was
 * indistinguishable from a real value and invisible to assistive tech.
 * `aria-busy` announces the wait; `<Skeleton>` shows it.
 */
export default function WidgetBody() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <p className="tds-widget__metric" aria-busy={!ready}>
      {ready ? "—" : <Skeleton width="3ch" height="1.75rem" />}
    </p>
  );
}
