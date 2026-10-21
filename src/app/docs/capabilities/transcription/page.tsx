import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "Timings & Subtitles • COMBO Docs",
  description:
    "Millisecond word alignment and automated SRT/VTT subtitle track generation.",
};

export default function TranscriptionCapabilityPage() {
  return (
    <div>
      <DocHeader
        category="Core Capabilities"
        title="Timings & Subtitles"
        lead="Modern automated video editors and multimodal AI agents require exact word-level timestamping. Combo aligns every spoken word to millisecond precision and generates ready-to-use subtitle tracks."
      />

      <h2>Supported Export Formats</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>
          <strong>SubRip (.srt):</strong> Compatible with Premiere Pro, CapCut,
          Final Cut Pro, DaVinci Resolve, and Remotion.
        </li>
        <li>
          <strong>WebVTT (.vtt):</strong> Standard HTML5 video caption track
          format with styling hooks.
        </li>
        <li>
          <strong>Structured JSON:</strong> Full utterance and token arrays with
          start, end, and confidence metrics.
        </li>
      </ul>

      <h2>Caption Card Chunking</h2>
      <p>
        Use the <code>--words</code> argument to dynamically format caption card
        density (e.g. 1-2 words for TikTok reels, 4-6 words for educational
        courses):
      </p>

      <DocPanel
        title="Extract 3-Word SRT Cards"
        code="combo transcribe audio ./lecture.mp3 --format srt --words 3"
      />
    </div>
  );
}
