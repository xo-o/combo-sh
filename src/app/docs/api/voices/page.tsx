import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "GET /api/audio/voices • COMBO Docs",
  description: "Retrieve available studio voice models and descriptors.",
};

const resExample = `[
  {
    "id": "alexis",
    "name": "Alexis",
    "style": "Corporate & Explainer",
    "gender": "Female",
    "tone": "Clear, Professional, Empathetic"
  },
  {
    "id": "cliff",
    "name": "Cliff",
    "style": "Documentary & Promo",
    "gender": "Male",
    "tone": "Deep Baritone, Raspy, Authoritative"
  }
]`;

export default function ApiVoicesPage() {
  return (
    <div>
      <DocHeader
        category="REST API Reference"
        title="GET /api/audio/voices"
        lead="Retrieves the complete list of available studio voice models, recommended styles, and emotional tones."
      />

      <h2>Request</h2>
      <DocPanel title="HTTP Request" code="GET /api/audio/voices HTTP/1.1" />

      <h2>Response Body (200 OK)</h2>
      <DocPanel title="application/json" code={resExample} />
    </div>
  );
}
