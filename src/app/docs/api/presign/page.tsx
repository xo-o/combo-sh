import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "POST /api/assets/presign • COMBO Docs",
  description:
    "Generate a presigned S3 PUT URL for direct client-to-storage uploads.",
};

const reqExample = `{
  "filename": "screenshot.png",
  "folder": "images",
  "contentType": "image/png"
}`;

const resExample = `{
  "uploadUrl": "https://bucket.s3.amazonaws.com/images/screenshot-a982.png?X-Amz-...",
  "publicUrl": "https://cdn.combo.sh/images/screenshot-a982.png",
  "key": "images/screenshot-a982.png",
  "expiresIn": 3600
}`;

export default function ApiPresignPage() {
  return (
    <div>
      <DocHeader
        category="REST API Reference"
        title="POST /api/assets/presign"
        lead="Generates a short-lived presigned PUT URL for direct S3 edge storage uploads."
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
              <code>filename</code>
            </td>
            <td>string</td>
            <td>Yes</td>
            <td>Original file name (extension used for MIME matching)</td>
          </tr>
          <tr>
            <td>
              <code>folder</code>
            </td>
            <td>string</td>
            <td>No</td>
            <td>Subfolder key prefix (default: default)</td>
          </tr>
          <tr>
            <td>
              <code>contentType</code>
            </td>
            <td>string</td>
            <td>No</td>
            <td>Explicit MIME type header to sign</td>
          </tr>
        </tbody>
      </table>

      <h2>Response Body (200 OK)</h2>
      <DocPanel title="application/json" code={resExample} />
    </div>
  );
}
