import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "Studio Voice Engine • COMBO Docs",
  description:
    "Low-latency neural voice synthesis with expressivity and pitch controls.",
};

export default function VoicesCapabilityPage() {
  return (
    <div>
      <DocHeader
        category="Core Capabilities"
        title="Studio Voiceover Engine"
        lead="Sub-second neural voice synthesis engineered for developer scripts, product walkthroughs, social media reels, and automated video renderers."
      />

      <h2>Audio Specification</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>
          <strong>Encoding:</strong> High-bitrate MP3 (44.1kHz, 128kbps stereo)
        </li>
        <li>
          <strong>Latency:</strong> Sub-second streaming synthesis
        </li>
        <li>
          <strong>Pacing Controls:</strong> 0.5x to 2.0x playback speed
        </li>
        <li>
          <strong>Expressivity Range:</strong> -2.0 (monotone/technical) to +2.0
          (dramatic/commercial)
        </li>
      </ul>

      <h2>Integrated CDN Delivery</h2>
      <p>
        Every generated voice clip is automatically pushed to your edge bucket,
        returning an immediate HTTPS stream link suitable for direct ingestion
        by agents or video renderers like Remotion:
      </p>

      <DocPanel
        title="Voice Generation"
        code='combo voice generate "All integration tests passed." --voice kit'
      />
    </div>
  );
}
