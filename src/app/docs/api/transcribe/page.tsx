import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "POST /api/audio/transcribe • COMBO Docs",
  description:
    "Transcribe audio into word timestamps, SubRip (.srt), or structured JSON.",
};

const reqExample = `{
  "url": "https://cdn.combo.sh/audio/speech-alexis.mp3",
  "format": "srt",
  "wordsPerCard": 4
}`;

export default function ApiTranscribePage() {
  return (
    <div>
      <DocHeader
        category="REST API Reference"
        title="POST /api/audio/transcribe"
        lead="Transcribes spoken dialogue streams with millisecond word timestamps and exports ready-to-use subtitle tracks or structured JSON."
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
              <code>url</code>
            </td>
            <td>string</td>
            <td>Yes</td>
            <td>Public HTTP/HTTPS URL of the audio file to transcribe</td>
          </tr>
          <tr>
            <td>
              <code>format</code>
            </td>
            <td>string</td>
            <td>No</td>
            <td>Output format: srt, vtt, json, or text (default: text)</td>
          </tr>
          <tr>
            <td>
              <code>wordsPerCard</code>
            </td>
            <td>number</td>
            <td>No</td>
            <td>Number of words per subtitle card for SRT/VTT (default: 4)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
