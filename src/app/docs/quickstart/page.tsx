import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "Quick Start • COMBO Docs",
  description:
    "Quickly test asset uploads, studio voice generation, and transcription.",
};

export default function QuickstartPage() {
  return (
    <div>
      <DocHeader
        category="Getting Started"
        title="Quick Start"
        lead="Get started with the three core cloud primitives in under two minutes: asset uploads, studio voice generation, and audio transcription."
      />

      <h2>1. Upload an Asset to Edge Storage</h2>
      <p>
        Direct-to-S3 upload bypassing server bandwidth limits and returning a
        permanent global CDN URL:
      </p>
      <DocPanel
        title="Upload Image"
        code="combo asset upload ./banner.png --folder media"
      />

      <h2>2. Synthesize Studio Voiceover</h2>
      <p>
        Generate studio-quality voiceovers with adjustable pace and
        expressivity:
      </p>
      <DocPanel
        title="Generate Voice"
        code='combo voice generate "System ready. Welcome aboard." --voice alexis'
      />

      <h2>3. Transcribe Spoken Dialogue</h2>
      <p>Extract word-accurate timestamps and ready-to-use subtitle tracks:</p>
      <DocPanel
        title="Generate SRT Subtitles"
        code="combo transcribe audio ./interview.mp3 --format srt --words 4"
      />

      <h2>4. Start the Agent MCP Server</h2>
      <p>
        Expose all capabilities directly to Claude Desktop, Cursor, and
        autonomous tools via stdio:
      </p>
      <DocPanel title="Start MCP Stdio" code="combo mcp" />
    </div>
  );
}
