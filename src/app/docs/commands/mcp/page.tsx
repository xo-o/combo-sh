import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "combo mcp • COMBO Docs",
  description:
    "Model Context Protocol stdio server for Claude Desktop, Cursor, and agents.",
};

const mcpConfigExample = `{
  "mcpServers": {
    "combo": {
      "command": "combo",
      "args": ["mcp"]
    }
  }
}`;

export default function McpCommandPage() {
  return (
    <div>
      <DocHeader
        category="CLI Commands"
        title="combo mcp"
        lead="Start the Model Context Protocol stdio server. AI agents in Claude Desktop, Cursor, or autonomous pipelines can invoke asset storage, speech synthesis, and transcription tools directly in their prompt loops."
      />

      <h2>Claude Desktop Setup</h2>
      <p>
        Add Combo to your Claude Desktop configuration file at{" "}
        <code>
          ~/Library/Application Support/Claude/claude_desktop_config.json
        </code>
        :
      </p>
      <DocPanel title="claude_desktop_config.json" code={mcpConfigExample} />

      <h2>Available MCP Tools</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>Tool Name</th>
            <th>Input Parameters</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>get_asset_upload_url</code>
            </td>
            <td>
              <code>filename, folder, contentType</code>
            </td>
            <td>Generates a presigned PUT upload URL and CDN link</td>
          </tr>
          <tr>
            <td>
              <code>synthesize_speech</code>
            </td>
            <td>
              <code>text, voice, pace, expressivity</code>
            </td>
            <td>Generates speech audio and publishes to CDN storage</td>
          </tr>
          <tr>
            <td>
              <code>transcribe_audio</code>
            </td>
            <td>
              <code>audioUrl, format, wordsPerCard</code>
            </td>
            <td>Transcribes audio into word timestamps, SRT, or JSON</td>
          </tr>
        </tbody>
      </table>

      <h2>Starting Standalone</h2>
      <p>Run the stdio server directly from any terminal or subshell:</p>
      <DocPanel
        title="Terminal"
        code="combo mcp    # or: npx @combo-sh/cli mcp"
      />
    </div>
  );
}
