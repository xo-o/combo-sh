import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "Installation • COMBO Docs",
  description: "Install the COMBO CLI globally or run on-demand with npx.",
};

export default function InstallationPage() {
  return (
    <div>
      <DocHeader
        category="Getting Started"
        title="Installation"
        lead="COMBO CLI is distributed through npm and can be executed globally or invoked on-demand in any CI/CD pipeline, Docker container, or AI agent loop."
      />

      <h2>Global Installation</h2>
      <p>
        Install the CLI globally across your development environment using your
        preferred package manager:
      </p>

      <DocPanel title="Terminal (npm)" code="npm install -g @combo-sh/cli" />

      <DocPanel
        title="Terminal (pnpm / bun)"
        code="pnpm add -g @combo-sh/cli   # or: bun install -g @combo-sh/cli"
      />

      <h2>Standalone Shell Script (curl)</h2>
      <p>
        For automated CI runners, container images, or servers without a global
        Node package setup:
      </p>

      <DocPanel
        title="Terminal (curl)"
        code="curl -fsSL https://combo.sh/install | bash"
      />

      <h2>One-off Execution with npx</h2>
      <p>Run any combo command directly without permanent installation:</p>

      <DocPanel title="Terminal (npx)" code="npx @combo-sh/cli --help" />

      <h2>System Requirements</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>Platform</th>
            <th>Runtime</th>
            <th>Architecture</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>macOS / Linux / Windows WSL</td>
            <td>Node.js &gt;= 18.0.0</td>
            <td>x64 / arm64 (Apple Silicon)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
