# @combo-sh/cli

Official CLI and Model Context Protocol (MCP) server for [combo.sh](https://combo.sh).

## Installation

```bash
# Global installation
npm install -g @combo-sh/cli
# or
pnpm add -g @combo-sh/cli
# or
bun install -g @combo-sh/cli
```

## Quick Start (npx)

Run commands directly without prior installation:

```bash
npx @combo-sh/cli --help
```

### Storage & Edge CDN
```bash
combo asset presign photo.png --folder images --json
combo asset upload ./banner.png --folder media
combo asset list --prefix images/
```

### Voice Generation (TTS)
```bash
combo voice generate "System operational." --voice flux-alexis-en
combo voice list
```

### Transcription (STT)
```bash
combo transcribe audio ./interview.mp3 --format srt --words 4
```

### MCP Server for AI Agents
Launch the MCP stdio server for Claude Desktop or Cursor:
```bash
combo mcp
# or directly via npx:
npx -y @combo-sh/cli mcp
```

