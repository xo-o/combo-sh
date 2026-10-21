import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { listVoices, synthesizeSpeech, transcribeAudio } from "../lib/deepgram";
import { deleteAsset, getPresignedUploadUrl, listAssets } from "../lib/storage";

const server = new McpServer({
  name: "combo-cloud-api",
  version: "1.0.0",
});

// Tool 1: get_asset_upload_url (Presigned PUT upload)
server.tool(
  "get_asset_upload_url",
  "Generate a presigned PUT URL for direct client-side upload to Cloudflare R2 CDN. All uploads must use this presigned URL. Returns the uploadUrl (execute HTTP PUT to this URL) and the resulting permanent public CDN URL.",
  {
    filename: z
      .string()
      .describe(
        "Target filename including extension (e.g. 'recording.mp3', 'image.png')",
      ),
    folder: z
      .string()
      .default("assets")
      .describe("Storage folder prefix (e.g. 'images', 'audio', 'assets')"),
    contentType: z
      .string()
      .optional()
      .describe("MIME type of the file to be uploaded"),
    expiresInSeconds: z
      .number()
      .default(3600)
      .describe("Presigned URL expiration in seconds (default 1 hour)"),
  },
  async ({ filename, folder, contentType, expiresInSeconds }) => {
    try {
      const presigned = await getPresignedUploadUrl({
        filename,
        folder,
        contentType,
        expiresIn: expiresInSeconds,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                uploadUrl: presigned.uploadUrl,
                publicUrl: presigned.publicUrl,
                key: presigned.key,
                expiresIn: presigned.expiresIn,
                contentType: presigned.contentType,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [
          { type: "text", text: `Failed to generate upload URL: ${message}` },
        ],
      };
    }
  },
);

// Tool 2: list_stored_assets
server.tool(
  "list_stored_assets",
  "List media assets stored in Cloudflare R2 CDN with optional prefix filtering (e.g. 'images/', 'audio/').",
  {
    prefix: z
      .string()
      .optional()
      .describe("Filter by folder prefix (e.g. 'images/', 'audio/')"),
    limit: z.number().default(50).describe("Maximum number of items to return"),
  },
  async ({ prefix, limit }) => {
    try {
      const result = await listAssets({ prefix, limit });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                count: result.assets.length,
                assets: result.assets,
                nextCursor: result.nextCursor,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: "text", text: `Failed to list assets: ${message}` }],
      };
    }
  },
);

// Tool 3: delete_asset
server.tool(
  "delete_asset",
  "Delete a media asset from Cloudflare R2 storage by its key or public URL.",
  {
    keyOrUrl: z
      .string()
      .describe(
        "The S3 key (e.g. 'images/my-image.png') or full public CDN URL",
      ),
  },
  async ({ keyOrUrl }) => {
    try {
      const result = await deleteAsset(keyOrUrl);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { success: true, deletedKey: result.key },
              null,
              2,
            ),
          },
        ],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: "text", text: `Delete failed: ${message}` }],
      };
    }
  },
);

// Tool 4: synthesize_speech
server.tool(
  "synthesize_speech",
  "Convert text to speech using Deepgram Flux TTS (v2) and store directly in Cloudflare R2 CDN. Returns the permanent public audio URL and estimated duration.",
  {
    text: z.string().min(1).describe("The text content to convert to speech"),
    voice: z
      .string()
      .default("flux-alexis-en")
      .describe(
        "Voice model ID (e.g. 'flux-alexis-en', 'flux-hannah-en', 'flux-cliff-en', 'flux-kit-en', 'aura-2-celeste-es')",
      ),
    speed: z
      .number()
      .min(0.5)
      .max(1.5)
      .optional()
      .describe("Speech rate multiplier (0.5 to 1.5, default 1.0)"),
    expressivity: z
      .number()
      .min(-2)
      .max(2)
      .optional()
      .describe(
        "Expressivity level: -2 (calm) to +2 (animated). Supported on Flux voices.",
      ),
    folder: z
      .string()
      .default("audio/tts")
      .describe("Storage folder prefix for generated audio file"),
    filename: z
      .string()
      .optional()
      .describe("Optional custom filename without extension"),
  },
  async ({ text, voice, speed, expressivity, folder, filename }) => {
    try {
      const result = await synthesizeSpeech({
        text,
        voice,
        speed,
        expressivity,
        saveToStorage: true,
        folder,
        filename,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                audioUrl: result.audioUrl,
                key: result.key,
                durationEstimateSeconds: result.durationSecondsEstimate,
                voice: result.voice,
                characterCount: result.characterCount,
                sizeBytes: result.size,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [
          { type: "text", text: `Speech synthesis failed: ${message}` },
        ],
      };
    }
  },
);

// Tool 5: transcribe_audio
server.tool(
  "transcribe_audio",
  "Transcribe audio from a URL using Deepgram Nova-3. Returns the full transcript, word-level timestamps, and SRT/WebVTT formatted text. (Note: does not render or burn video captions; provides transcription data only).",
  {
    url: z
      .string()
      .url()
      .describe("Public URL of the audio file to transcribe"),
    model: z
      .string()
      .default("nova-3")
      .describe("Deepgram speech model ('nova-3' or 'nova-2')"),
    language: z
      .string()
      .optional()
      .describe(
        "Audio language code (e.g. 'en', 'es', 'fr', or auto-detect if omitted)",
      ),
    diarize: z
      .boolean()
      .default(false)
      .describe("Whether to distinguish and label different speakers"),
    maxWordsPerSubtitle: z
      .number()
      .default(5)
      .describe("Max words per subtitle segment line"),
  },
  async ({ url, model, language, diarize, maxWordsPerSubtitle }) => {
    try {
      const result = await transcribeAudio(url, {
        model,
        language,
        diarize,
        subtitleOptions: {
          maxWordsPerLine: maxWordsPerSubtitle,
        },
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                transcript: result.transcript,
                durationSeconds: result.duration,
                confidence: result.confidence,
                wordsCount: result.words.length,
                words: result.words,
                srt: result.srt,
                vtt: result.vtt,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: "text", text: `Transcription failed: ${message}` }],
      };
    }
  },
);

// Tool 6: list_available_voices
server.tool(
  "list_available_voices",
  "List and filter available Deepgram Flux TTS and Aura-2 voices by engine, gender, accent, or style.",
  {
    engine: z
      .enum(["flux", "aura-2", "all"])
      .default("flux")
      .describe(
        "Filter by engine: 'flux' (English), 'aura-2' (Multilingual), or 'all'",
      ),
    gender: z
      .enum(["female", "male"])
      .optional()
      .describe("Filter by voice gender"),
    language: z
      .string()
      .optional()
      .describe(
        "Filter by language code (e.g. 'en', 'es', 'de', 'fr', 'it', 'ja')",
      ),
    accent: z
      .string()
      .optional()
      .describe(
        "Filter by accent (e.g. 'American', 'British', 'Australian', 'Irish', 'Indian')",
      ),
    query: z
      .string()
      .optional()
      .describe("Search keyword in voice name or character traits"),
  },
  async ({ engine, gender, language, accent, query }) => {
    try {
      const voices = listVoices({
        engine: engine === "all" ? undefined : engine,
        gender,
        language,
        accent,
        query,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                count: voices.length,
                voices,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: "text", text: `Failed to list voices: ${message}` }],
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Combo Cloud API MCP server running on stdio");
}

if (process.env.NODE_ENV !== "test") {
  main().catch((error) => {
    console.error("Fatal MCP server error:", error);
    process.exit(1);
  });
}
