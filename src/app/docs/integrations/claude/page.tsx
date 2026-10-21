import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "Claude Desktop Integration • COMBO Docs",
  description:
    "Equip Claude Desktop with tools to upload assets, synthesize voice, and transcribe audio.",
};

const claudeConfig = `{
  "mcpServers": {
    "combo": {
      "command": "combo",
      "args": ["mcp"]
    }
  }
}`;

export default function ClaudeIntegrationPage() {
  return (
    <div>
      <DocHeader
        category="Agent Integrations"
        title="Claude Desktop"
        lead="Equip Anthropic's Claude Desktop app with native media cloud tools via the Model Context Protocol (MCP)."
      />

      <h2>Setup Instructions</h2>
      <p>
        1. Open your Claude Desktop configuration file at{" "}
        <code>
          ~/Library/Application Support/Claude/claude_desktop_config.json
        </code>{" "}
        (macOS) or <code>%APPDATA%\Claude\claude_desktop_config.json</code>{" "}
        (Windows).
      </p>
      <p>
        2. Add Combo to the <code>mcpServers</code> dictionary (or use{" "}
        <code>command: "npx", args: ["-y", "@combo-sh/cli", "mcp"]</code> to run
        without global install):
      </p>

      <DocPanel title="claude_desktop_config.json" code={claudeConfig} />

      <p>3. Restart Claude Desktop. You will see the tools registered:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>
          <code>get_asset_upload_url</code>: Allows Claude to upload generated
          images, charts, or files to edge storage.
        </li>
        <li>
          <code>synthesize_speech</code>: Allows Claude to narrate written text
          and return a playable CDN audio stream.
        </li>
        <li>
          <code>transcribe_audio</code>: Allows Claude to ingest audio URLs and
          extract text and timestamps.
        </li>
      </ul>

      <h2>Prompt Examples</h2>
      <div data-slot="docs-panel">
        <pre>{`User: "Synthesize this explanation as an audio clip using Alexis' voice and share the public URL."

Claude: "Calling tool: synthesize_speech with text and voice..."
Claude: "Here is your generated audio: https://cdn.combo.sh/audio/speech-alexis-892f.mp3"`}</pre>
      </div>
    </div>
  );
}
