import { useEffect, useState } from "react";

/**
 * TEMPLATE hydrated widget body. Fetch your widget's `dataEndpoint` (via the
 * base's API wrapper) and render it. Placeholder shown here.
 */
export default function WidgetBody() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  return <p className="tds-widget__metric">{ready ? "—" : "…"}</p>;
}
