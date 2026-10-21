import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "combo asset • COMBO Docs",
  description: "Direct-to-S3 edge asset storage via signed URLs.",
};

export default function AssetCommandPage() {
  return (
    <div>
      <DocHeader
        category="CLI Commands"
        title="combo asset"
        lead="Direct-to-S3 edge asset storage via signed URLs. Client devices and agents upload directly to edge buckets without routing gigabytes through intermediary backend servers."
      />

      <h2>Subcommands</h2>

      <h3>1. Upload Local File</h3>
      <p>
        Requests a presigned PUT URL and streams the binary directly to edge S3
        storage:
      </p>
      <DocPanel
        title="Upload"
        code="combo asset upload ./hero.png --folder images"
      />

      <h3>2. Generate Presigned URL</h3>
      <p>
        Generates a short-lived presigned upload token for client-side uploads:
      </p>
      <DocPanel
        title="Presign"
        code="combo asset presign avatar.jpg --folder users --expires 3600 --json"
      />

      <h3>3. Upload from Remote URL</h3>
      <p>Pulls an asset from a remote HTTP link and archives it to your CDN:</p>
      <DocPanel
        title="Upload URL"
        code="combo asset upload-url https://example.com/art.png --folder generated"
      />

      <h3>4. List Stored Assets</h3>
      <p>Lists stored files matching an optional prefix:</p>
      <DocPanel
        title="List"
        code="combo asset list --prefix images/ --limit 50"
      />

      <h2>Command Flags</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>Flag</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>--folder</code>
            </td>
            <td>string</td>
            <td>default</td>
            <td>Target subfolder in the bucket (e.g. media, audio)</td>
          </tr>
          <tr>
            <td>
              <code>--expires</code>
            </td>
            <td>number</td>
            <td>3600</td>
            <td>Presigned token validity in seconds</td>
          </tr>
          <tr>
            <td>
              <code>--json</code>
            </td>
            <td>boolean</td>
            <td>false</td>
            <td>Emit raw machine-readable JSON to stdout</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
