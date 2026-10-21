import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "combo voice • COMBO Docs",
  description:
    "Synthesize studio-quality voiceover audio with emotion and pace controls.",
};

export default function VoiceCommandPage() {
  return (
    <div>
      <DocHeader
        category="CLI Commands"
        title="combo voice"
        lead="Synthesize studio-quality voiceover audio from text with natural prosody, emotional cadence, and speed controls. Generated audio is automatically hosted on the global CDN."
      />

      <h2>Generate Voiceover</h2>
      <p>Basic studio voiceover synthesis:</p>
      <DocPanel
        title="Standard Voiceover"
        code='combo voice generate "System operational. Welcome aboard." --voice alexis'
      />

      <p>Expressive voice with pace control:</p>
      <DocPanel
        title="Custom Cadence"
        code='combo voice generate "Breaking news update." --voice cliff --pace 1.1 --expressivity 1.5'
      />

      <h2>Available Studio Voices</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>Voice ID</th>
            <th>Style</th>
            <th>Gender</th>
            <th>Tone &amp; Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>alexis</code>
            </td>
            <td>Corporate &amp; Explainer</td>
            <td>Female</td>
            <td>Clear, authoritative, empathetic for software demos</td>
          </tr>
          <tr>
            <td>
              <code>hannah</code>
            </td>
            <td>Storytelling &amp; Social</td>
            <td>Female</td>
            <td>Confident, conversational, natural cadence</td>
          </tr>
          <tr>
            <td>
              <code>cliff</code>
            </td>
            <td>Documentary &amp; Promo</td>
            <td>Male</td>
            <td>Deep baritone, authoritative gravitas</td>
          </tr>
          <tr>
            <td>
              <code>kit</code>
            </td>
            <td>Tech Reviews &amp; Guides</td>
            <td>Male</td>
            <td>British accent, energetic, crisp technical diction</td>
          </tr>
          <tr>
            <td>
              <code>brooke</code>
            </td>
            <td>Fast Paced / Reels</td>
            <td>Female</td>
            <td>Upbeat, high engagement for short-form video</td>
          </tr>
          <tr>
            <td>
              <code>celeste</code>
            </td>
            <td>Multilingual / Spanish</td>
            <td>Female</td>
            <td>Native Spanish fluency, warm and expressive</td>
          </tr>
        </tbody>
      </table>

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
              <code>--voice</code>
            </td>
            <td>alexis</td>
            <td>
              Voice identifier (alexis, hannah, cliff, kit, brooke, celeste)
            </td>
          </tr>
          <tr>
            <td>
              <code>--pace</code>
            </td>
            <td>1.0</td>
            <td>Pacing multiplier between 0.5 and 2.0</td>
          </tr>
          <tr>
            <td>
              <code>--expressivity</code>
            </td>
            <td>0</td>
            <td>Emotional range from -2.0 (subdued) to +2.0 (expressive)</td>
          </tr>
          <tr>
            <td>
              <code>--json</code>
            </td>
            <td>false</td>
            <td>Outputs JSON with public CDN URL and duration</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
