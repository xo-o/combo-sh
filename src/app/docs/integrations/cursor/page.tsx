import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "Cursor & Windsurf Integration • COMBO Docs",
  description:
    "Enable AI coding agents in Cursor and Windsurf to call Combo tools.",
};

const cursorMcpConfig = `{
  "mcpServers": {
    "combo": {
      "command": "combo",
      "args": ["mcp"]
    }
  }
}`;

export default function CursorIntegrationPage() {
  return (
    <div>
      <DocHeader
        category="Agent Integrations"
        title="Cursor & Windsurf"
        lead="Enable autonomous developer agents in Cursor, Windsurf, or OpenCode to upload local test assets, generate audio clips for user flows, and transcribe media files autonomously."
      />

      <h2>Setup in Cursor / Windsurf</h2>
      <p>
        In Cursor Settings &gt; Features &gt; MCP, or your project's{" "}
        <code>.cursor/mcp.json</code> (supports <code>combo mcp</code> or{" "}
        <code>npx -y @combo-sh/cli mcp</code>):
      </p>

      <DocPanel title=".cursor/mcp.json" code={cursorMcpConfig} />

      <h2>Autonomous Workflow Capabilities</h2>
      <p>Agents working on your codebase can:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>
          Inspect failing visual test runs, upload screenshots to S3, and paste
          the public CDN link directly into PR descriptions.
        </li>
        <li>
          Generate test audio files for voice UI integrations or unit tests.
        </li>
        <li>
          Transcribe recorded bug reproduction clips to understand issues
          automatically.
        </li>
      </ul>
    </div>
  );
}
