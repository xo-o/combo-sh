import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "Direct Edge Storage • COMBO Docs",
  description: "Presigned direct-to-S3 uploads with global CDN edge caching.",
};

export default function StorageCapabilityPage() {
  return (
    <div>
      <DocHeader
        category="Core Capabilities"
        title="Direct Edge S3 Storage"
        lead="Traditional web architectures bottleneck application servers by streaming gigabytes of media files through web proxies. Combo flips this model by negotiating short-lived presigned PUT tokens directly with S3 buckets."
      />

      <h2>How It Works</h2>
      <ol className="list-decimal pl-6 space-y-2 mb-6">
        <li>
          The client or agent requests a presigned upload token from the Combo
          gateway.
        </li>
        <li>
          A cryptographically signed PUT URL is generated with exact
          content-type and expiration constraints in &lt; 45ms.
        </li>
        <li>
          The client binary streams directly to the edge S3 / Cloudflare R2
          bucket over HTTPS PUT.
        </li>
        <li>
          The asset is immediately available on global CDN edge nodes at{" "}
          <code>cdn.combo.sh/folder/filename.ext</code>.
        </li>
      </ol>

      <h2>Edge Architecture Benefits</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>
          <strong>Zero Server Memory Overhead:</strong> Your API servers never
          buffer incoming multi-megabyte audio or image payloads.
        </li>
        <li>
          <strong>Unlimited Concurrency:</strong> Client uploads scale directly
          with AWS S3 and Cloudflare R2 bandwidth limits.
        </li>
        <li>
          <strong>Fast Global Delivery:</strong> Edge caching rules ensure
          sub-second static content delivery worldwide.
        </li>
      </ul>

      <DocPanel
        title="Example CLI Upload"
        code="combo asset upload ./asset.png --folder images"
      />
    </div>
  );
}
