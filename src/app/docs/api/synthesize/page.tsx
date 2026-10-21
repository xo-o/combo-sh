import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "POST /api/audio/synthesize • COMBO Docs",
  description:
    "Synthesize neural voiceover audio and auto-upload to global CDN.",
};

const reqExample = `{
  "text": "Your export is ready for review.",
  "voice": "alexis",
  "pace": 1.05,
  "expressivity": 1.2
}`;

const resExample = `{
  "audioUrl": "https://cdn.combo.sh/audio/speech-alexis-892f.mp3",
  "duration": 2.45,
  "voice": "alexis"
}`;

export default function ApiSynthesizePage() {
  return (
    <div>
      <DocHeader
        category="REST API Reference"
        title="POST /api/audio/synthesize"
        lead="Synthesizes studio voiceover audio from plain text and automatically hosts the resulting MP3 audio file on CDN edge storage."
      />

      <h2>Request Payload</h2>
      <DocPanel title="application/json" code={reqExample} />

      <h2>Request Fields</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>text</code>
            </td>
            <td>string</td>
            <td>Yes</td>
            <td>Spoken text content to synthesize</td>
          </tr>
          <tr>
            <td>
              <code>voice</code>
            </td>
            <td>string</td>
            <td>No</td>
            <td>Voice model identifier (default: alexis)</td>
          </tr>
          <tr>
            <td>
              <code>pace</code>
            </td>
            <td>number</td>
            <td>No</td>
            <td>Speech rate multiplier (0.5 to 2.0, default: 1.0)</td>
          </tr>
          <tr>
            <td>
              <code>expressivity</code>
            </td>
            <td>number</td>
            <td>No</td>
            <td>Emotion range from -2.0 to +2.0 (default: 0.0)</td>
          </tr>
        </tbody>
      </table>

      <h2>Response Body (200 OK)</h2>
      <DocPanel title="application/json" code={resExample} />
    </div>
  );
}
