import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "combo transcribe • COMBO Docs",
  description:
    "Transcribe audio into word timestamps, SubRip (.srt), and WebVTT (.vtt).",
};

export default function TranscribeCommandPage() {
  return (
    <div>
      <DocHeader
        category="CLI Commands"
        title="combo transcribe"
        lead="Transcribe spoken audio with millisecond word timestamps and export ready-to-use SubRip (.srt), WebVTT (.vtt), and structured JSON tracks."
      />

      <h2>Usage Examples</h2>

      <h3>Generate SRT Subtitle Track</h3>
      <p>Splits transcript into 4-word caption cards with precise timings:</p>
      <DocPanel
        title="SRT Subtitles"
        code="combo transcribe audio ./podcast.mp3 --format srt --words 4"
      />

      <h3>Transcribe Remote CDN Audio with Diarization</h3>
      <p>
        Distinguishes speakers and returns full word arrays in machine-readable
        JSON:
      </p>
      <DocPanel
        title="Diarized JSON"
        code="combo transcribe audio https://cdn.combo.sh/audio/speech.mp3 --diarize --json"
      />

      <h2>Command Flags</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>Flag</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>--format</code>
            </td>
            <td>text</td>
            <td>Output format: srt, vtt, json, or text</td>
          </tr>
          <tr>
            <td>
              <code>--words</code>
            </td>
            <td>4</td>
            <td>Words per subtitle caption card (SRT/VTT)</td>
          </tr>
          <tr>
            <td>
              <code>--diarize</code>
            </td>
            <td>false</td>
            <td>Distinguish speakers in multi-person dialogues</td>
          </tr>
          <tr>
            <td>
              <code>--punctuate</code>
            </td>
            <td>true</td>
            <td>Include natural punctuation and capitalization</td>
          </tr>
          <tr>
            <td>
              <code>--json</code>
            </td>
            <td>false</td>
            <td>Output raw structured JSON with word-level arrays</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
