import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "Configuration & Environment • COMBO Docs",
  description:
    "Configure API keys and S3/R2 storage credentials for COMBO CLI.",
};

const envExample = `# Deepgram Voice & Transcription
DEEPGRAM_API_KEY=your_deepgram_key

# S3 / Cloudflare R2 Storage
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
S3_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CDN_BASE_URL=https://cdn.combo.sh`;

export default function ConfigurationPage() {
  return (
    <div>
      <DocHeader
        category="Getting Started"
        title="Configuration & Environment"
        lead="Combo connects to AWS S3 or Cloudflare R2 for edge asset storage and Deepgram for audio synthesis and speech transcription."
      />

      <h2>Environment Variables</h2>
      <p>
        Create a <code>.env</code> file in your workspace or set environment
        variables in your shell profile:
      </p>

      <DocPanel title=".env" code={envExample} />

      <h2>Variable Reference</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>Variable</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>DEEPGRAM_API_KEY</code>
            </td>
            <td>Yes</td>
            <td>API key for voice generation and speech transcription</td>
          </tr>
          <tr>
            <td>
              <code>AWS_ACCESS_KEY_ID</code>
            </td>
            <td>Yes</td>
            <td>S3 or Cloudflare R2 access key</td>
          </tr>
          <tr>
            <td>
              <code>AWS_SECRET_ACCESS_KEY</code>
            </td>
            <td>Yes</td>
            <td>S3 or Cloudflare R2 secret access key</td>
          </tr>
          <tr>
            <td>
              <code>S3_BUCKET</code>
            </td>
            <td>Yes</td>
            <td>Storage bucket name for uploaded assets</td>
          </tr>
          <tr>
            <td>
              <code>CDN_BASE_URL</code>
            </td>
            <td>Optional</td>
            <td>Public custom domain URL (defaults to cdn.combo.sh)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
