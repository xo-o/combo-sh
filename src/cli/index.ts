#!/usr/bin/env tsx

import fs from "node:fs";
import path from "node:path";
import { getEnv } from "@/lib/config";
import { listVoices, synthesizeSpeech, transcribeAudio } from "@/lib/deepgram";
import {
  deleteAsset,
  EXT_TO_MIME,
  getPresignedUploadUrl,
  listAssets,
  uploadFromUrl,
} from "@/lib/storage";

// Load .env file if available
if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    // Ignore missing .env
  }
}

// Argument parsing helper
interface ParsedArgs {
  flags: Record<string, string | boolean>;
  positional: string[];
}

function parseArguments(args: string[]): ParsedArgs {
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      if (key.includes("=")) {
        const [k, v] = key.split("=");
        flags[k] = v;
      } else if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
        flags[key] = args[++i];
      } else {
        flags[key] = true;
      }
    } else if (arg.startsWith("-")) {
      const key = arg.slice(1);
      if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
        flags[key] = args[++i];
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }

  return { flags, positional };
}

// Colors helper with automatic TTY/JSON suppression
function getColors(enabled: boolean) {
  if (!enabled) {
    return {
      reset: "",
      bold: "",
      dim: "",
      underline: "",
      green: "",
      cyan: "",
      yellow: "",
      red: "",
      magenta: "",
      white: "",
      gray: "",
    };
  }
  return {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    underline: "\x1b[4m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    magenta: "\x1b[35m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
  };
}

const bannerText = `
 ██████╗ ██████╗ ███╗   ███╗██████╗  ██████╗ 
██╔════╝██╔═══██╗████╗ ████║██╔══██╗██╔═══██╗
██║     ██║   ██║██╔████╔██║██████╔╝██║   ██║
██║     ██║   ██║██║╚██╔╝██║██╔══██╗██║   ██║
╚██████╗╚██████╔╝██║ ╚═╝ ██║██████╔╝╚██████╔╝
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═════╝  ╚═════╝ 
COMBO CLI • Developer Cloud Kits & Agent Utilities (combo.sh)
`;

function printHelp(c: ReturnType<typeof getColors>) {
  console.log(bannerText);
  console.log(`${c.bold}USAGE:${c.reset}`);
  console.log(`  ${c.cyan}$ combo${c.reset} <kit> <action> [options]\n`);

  console.log(`${c.bold}ASSET KIT (Storage & Edge CDN):${c.reset}`);
  console.log(
    `  ${c.green}asset presign${c.reset} <filename>     Generate a presigned PUT URL for client-side upload`,
  );
  console.log(
    `  ${c.green}asset upload${c.reset}  <file|url>     Upload local file (via presigned PUT) or remote URL`,
  );
  console.log(
    `  ${c.green}asset list${c.reset}                 List assets stored in Cloudflare R2 edge storage`,
  );
  console.log(
    `  ${c.green}asset delete${c.reset} <key|url>      Delete an asset by key or public URL\n`,
  );

  console.log(`${c.bold}VOICE KIT (Speech Synthesis / TTS):${c.reset}`);
  console.log(
    `  ${c.green}voice generate${c.reset} "<text>"      Synthesize studio voiceover with Deepgram Flux/Aura`,
  );
  console.log(
    `  ${c.green}voice list${c.reset}                 Browse available voice models, accents, and engines\n`,
  );

  console.log(`${c.bold}TRANSCRIBE KIT (Speech-to-Text & Timings):${c.reset}`);
  console.log(
    `  ${c.green}transcribe audio${c.reset} <file|url> Transcribe audio to text, word timings, or SRT/VTT\n`,
  );

  console.log(`${c.bold}AGENT TOOLS & PROTOCOLS:${c.reset}`);
  console.log(
    `  ${c.green}mcp${c.reset}                          Launch Model Context Protocol server on stdio\n`,
  );

  console.log(`${c.bold}GLOBAL OPTIONS:${c.reset}`);
  console.log(
    `  ${c.yellow}--json${c.reset}                       Output clean machine-readable JSON (agent friendly)`,
  );
  console.log(
    `  ${c.yellow}-h, --help${c.reset}                   Show this reference\n`,
  );

  console.log(`${c.bold}EXAMPLES FOR AGENTS & SCRIPTS:${c.reset}`);
  console.log(
    `  $ combo asset presign photo.png --folder images --json\n` +
      `  $ combo asset upload ./clip.mp3 --json\n` +
      `  $ combo voice generate "System operational." --voice flux-alexis-en --json\n` +
      `  $ combo transcribe audio https://cdn.combo.sh/audio/sample.mp3 --format srt --words 4\n` +
      `  $ combo mcp\n`,
  );
}

// Fail fast helper for agents
function failWith(
  message: string,
  code: number,
  isJson: boolean,
  errorCode = "ERR_CLI",
): never {
  if (isJson) {
    console.error(
      JSON.stringify(
        {
          success: false,
          error: message,
          code: errorCode,
        },
        null,
        2,
      ),
    );
  } else {
    const c = getColors(true);
    console.error(`\n${c.red}❌ Error:${c.reset} ${message}\n`);
  }
  process.exit(code);
}

// -----------------------------------------------------------------------------
// COMMAND GROUP: ASSET
// -----------------------------------------------------------------------------
async function handleAsset(subArgs: string[]) {
  const { flags, positional } = parseArguments(subArgs);
  const action = positional[0]?.toLowerCase() || "help";
  const target = positional[1];
  const isJson = Boolean(flags.json);
  const c = getColors(Boolean(process.stdout.isTTY) && !isJson);

  // 1. asset presign <filename>
  if (action === "presign") {
    if (!target || flags.help || flags.h) {
      if (isJson) {
        failWith(
          "Missing required <filename> for presign",
          2,
          isJson,
          "ERR_MISSING_ARGUMENT",
        );
      }
      console.log(
        `\n${c.bold}Usage:${c.reset} combo asset presign <filename> [options]`,
      );
      console.log(
        `  --folder <name>         Destination folder (default: assets)`,
      );
      console.log(`  --content-type <mime>   MIME type override`);
      console.log(
        `  --expires <seconds>     URL expiration in seconds (default: 3600)`,
      );
      console.log(`  --json                  Output JSON response\n`);
      return;
    }

    try {
      const folder = (flags.folder as string) || "assets";
      const contentType = flags["content-type"] as string | undefined;
      const expiresIn = flags.expires
        ? Number.parseInt(flags.expires as string, 10)
        : 3600;

      const result = await getPresignedUploadUrl({
        filename: target,
        folder,
        contentType,
        expiresIn,
      });

      if (isJson) {
        console.log(JSON.stringify({ success: true, ...result }, null, 2));
        return;
      }

      console.log(`\n${c.green}✅ Presigned Upload URL Generated!${c.reset}`);
      console.log(`  ${c.bold}Upload URL (PUT):${c.reset} ${result.uploadUrl}`);
      console.log(
        `  ${c.bold}Public CDN URL:${c.reset}   ${c.cyan}${result.publicUrl}${c.reset}`,
      );
      console.log(`  ${c.bold}Storage Key:${c.reset}      ${result.key}`);
      console.log(
        `  ${c.bold}Content-Type:${c.reset}     ${result.contentType}`,
      );
      console.log(
        `  ${c.bold}Expires In:${c.reset}       ${result.expiresIn}s\n`,
      );
    } catch (err: unknown) {
      failWith(
        err instanceof Error ? err.message : String(err),
        1,
        isJson,
        "ERR_PRESIGN_FAILED",
      );
    }
    return;
  }

  // 2. asset upload <file|url> (via presigned URL direct PUT)
  if (action === "upload") {
    if (!target || flags.help || flags.h) {
      if (isJson) {
        failWith(
          "Missing required <file|url> for upload",
          2,
          isJson,
          "ERR_MISSING_ARGUMENT",
        );
      }
      console.log(
        `\n${c.bold}Usage:${c.reset} combo asset upload <file|url> [options]`,
      );
      console.log(
        `  --folder <name>         Target folder in R2 (default: inferred)`,
      );
      console.log(`  --filename <name>       Custom filename override`);
      console.log(`  --content-type <mime>   MIME type override`);
      console.log(`  --json                  Output JSON response\n`);
      return;
    }

    const isUrl = target.startsWith("http://") || target.startsWith("https://");
    const folder = (flags.folder as string) || (isUrl ? "images" : "assets");
    const filename = flags.filename as string | undefined;

    if (!isJson && process.stdout.isTTY) {
      console.log(`\n${c.cyan}📦 Uploading asset to edge storage...${c.reset}`);
      console.log(`${c.gray}Target: ${target}${c.reset}`);
    }

    try {
      let finalResult: {
        success: boolean;
        publicUrl: string;
        key: string;
        size: number;
        contentType: string;
      };

      if (isUrl) {
        const res = await uploadFromUrl(target, { folder, filename });
        finalResult = {
          success: true,
          publicUrl: res.url,
          key: res.key,
          size: res.size,
          contentType: res.contentType,
        };
      } else {
        const absolutePath = path.resolve(process.cwd(), target);
        if (!fs.existsSync(absolutePath)) {
          failWith(
            `File not found: ${absolutePath}`,
            2,
            isJson,
            "ERR_FILE_NOT_FOUND",
          );
        }

        const buffer = fs.readFileSync(absolutePath);
        const resolvedFilename = filename || path.basename(absolutePath);
        const ext = resolvedFilename.split(".").pop()?.toLowerCase() || "";
        const contentType =
          (flags["content-type"] as string) ||
          EXT_TO_MIME[ext] ||
          "application/octet-stream";

        // Step 1: Request presigned upload URL
        const presigned = await getPresignedUploadUrl({
          filename: resolvedFilename,
          folder,
          contentType,
        });

        // Step 2: Upload directly to R2 edge via HTTP PUT (zero server proxy)
        const putResponse = await fetch(presigned.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": contentType,
          },
          body: buffer,
        });

        if (!putResponse.ok) {
          throw new Error(
            `Presigned PUT upload failed (${putResponse.status} ${putResponse.statusText})`,
          );
        }

        finalResult = {
          success: true,
          publicUrl: presigned.publicUrl,
          key: presigned.key,
          size: buffer.byteLength,
          contentType,
        };
      }

      if (isJson) {
        console.log(JSON.stringify(finalResult, null, 2));
        return;
      }

      console.log(`\n${c.green}✅ Asset Published to Global CDN!${c.reset}`);
      console.log(
        `  ${c.bold}Public URL:${c.reset}    ${c.underline}${c.cyan}${finalResult.publicUrl}${c.reset}`,
      );
      console.log(`  ${c.bold}Storage Key:${c.reset}   ${finalResult.key}`);
      console.log(
        `  ${c.bold}Size:${c.reset}          ${(finalResult.size / 1024).toFixed(1)} KB`,
      );
      console.log(
        `  ${c.bold}Content-Type:${c.reset}  ${finalResult.contentType}\n`,
      );
    } catch (err: unknown) {
      failWith(
        err instanceof Error ? err.message : String(err),
        1,
        isJson,
        "ERR_UPLOAD_FAILED",
      );
    }
    return;
  }

  // 3. asset list
  if (action === "list") {
    try {
      const prefix = (flags.prefix as string) || "";
      const limit = Number.parseInt((flags.limit as string) || "50", 10);
      const result = await listAssets({ prefix, limit });

      if (isJson) {
        console.log(
          JSON.stringify(
            {
              success: true,
              count: result.assets.length,
              assets: result.assets,
              nextCursor: result.nextCursor,
            },
            null,
            2,
          ),
        );
        return;
      }

      console.log(
        `\n${c.bold}Assets in Cloudflare R2 (${result.assets.length}):${c.reset}\n`,
      );
      console.log(
        `  ${c.cyan}${"KEY".padEnd(42)}${c.reset} ${"SIZE".padEnd(12)} ${"PUBLIC URL"}${c.reset}`,
      );
      console.log(`  ${"-".repeat(84)}`);

      for (const a of result.assets) {
        const sizeStr = `${(a.size / 1024).toFixed(1)} KB`;
        console.log(
          `  ${a.key.padEnd(42)} ${c.gray}${sizeStr.padEnd(12)}${c.reset} ${c.underline}${a.url}${c.reset}`,
        );
      }
      console.log();
    } catch (err: unknown) {
      failWith(
        err instanceof Error ? err.message : String(err),
        1,
        isJson,
        "ERR_LIST_FAILED",
      );
    }
    return;
  }

  // 4. asset delete <key|url>
  if (action === "delete" || action === "rm") {
    if (!target) {
      failWith(
        "Please provide storage key or public URL to delete. Example: combo asset delete images/test.png",
        2,
        isJson,
        "ERR_MISSING_ARGUMENT",
      );
    }

    try {
      const res = await deleteAsset(target);
      if (isJson) {
        console.log(
          JSON.stringify({ success: true, deletedKey: res.key }, null, 2),
        );
        return;
      }
      console.log(`\n${c.green}✅ Deleted asset:${c.reset} ${res.key}\n`);
    } catch (err: unknown) {
      failWith(
        err instanceof Error ? err.message : String(err),
        1,
        isJson,
        "ERR_DELETE_FAILED",
      );
    }
    return;
  }

  // Default fallback
  console.log(`\n${c.bold}Usage:${c.reset} combo asset <action> [options]`);
  console.log(`  presign <filename>     Generate direct presigned PUT URL`);
  console.log(`  upload <file|url>      Upload file via presigned PUT`);
  console.log(`  list                   List assets in R2 bucket`);
  console.log(`  delete <key|url>       Delete asset from storage\n`);
}

// -----------------------------------------------------------------------------
// COMMAND GROUP: VOICE
// -----------------------------------------------------------------------------
async function handleVoice(subArgs: string[]) {
  const { flags, positional } = parseArguments(subArgs);
  const isJson = Boolean(flags.json);
  const c = getColors(Boolean(process.stdout.isTTY) && !isJson);

  const action = positional[0]?.toLowerCase();
  let text = "";

  if (action === "list" || action === "catalog") {
    const engine = (flags.engine as "flux" | "aura-2" | "all") || "all";
    const gender = flags.gender as "female" | "male" | undefined;
    const lang = flags.lang as string | undefined;
    const query = (flags.query as string) || (flags.q as string);

    const voices = listVoices({
      engine,
      gender,
      language: lang,
      query,
    });

    if (isJson) {
      console.log(
        JSON.stringify(
          {
            success: true,
            count: voices.length,
            voices,
          },
          null,
          2,
        ),
      );
      return;
    }

    console.log(
      `\n${c.bold}${c.white}Available Voices (${voices.length}):${c.reset}\n`,
    );
    console.log(
      `  ${c.cyan}${"ID".padEnd(22)}${c.reset} ${"NAME".padEnd(12)} ${"ENGINE".padEnd(8)} ${"LANG".padEnd(8)} ${"CHARACTER"}${c.reset}`,
    );
    console.log(`  ${"-".repeat(78)}`);

    for (const v of voices) {
      const traits = (v.character || []).slice(0, 3).join(", ");
      console.log(
        `  ${c.green}${v.id.padEnd(22)}${c.reset} ${v.name.padEnd(12)} ${c.gray}${v.engine.padEnd(8)}${c.reset} ${v.language.padEnd(8)} ${c.gray}${traits}${c.reset}`,
      );
    }
    console.log(
      `\n${c.gray}Use voice IDs with \`combo voice generate "<text>" --voice <id>\`${c.reset}\n`,
    );
    return;
  }

  if (action === "generate" || action === "speak" || action === "tts") {
    text = positional.slice(1).join(" ").trim();
  } else {
    // If user passed `combo voice "My text"` directly
    text = positional.join(" ").trim();
  }

  if (!text || flags.help || flags.h) {
    if (isJson) {
      failWith(
        "Missing required text for voice synthesis",
        2,
        isJson,
        "ERR_MISSING_ARGUMENT",
      );
    }
    console.log(
      `\n${c.bold}Usage:${c.reset} combo voice generate "<text>" [options]`,
    );
    console.log(
      `  -v, --voice <id>        Voice model (default: flux-alexis-en)`,
    );
    console.log(
      `  -s, --speed <float>     Speed multiplier 0.5-1.5 (default: 1.0)`,
    );
    console.log(`  -e, --expressive <int>  Expressivity -2 to +2 (default: 0)`);
    console.log(`  -o, --out <path>        Save audio to local file`);
    console.log(`  --json                  Output JSON response\n`);
    return;
  }

  const voice =
    (flags.voice as string) || (flags.v as string) || "flux-alexis-en";
  const speed = Number.parseFloat(
    (flags.speed as string) || (flags.s as string) || "1.0",
  );
  const expressivity = Number.parseInt(
    (flags.expressive as string) || (flags.e as string) || "0",
    10,
  );
  const outPath = (flags.out as string) || (flags.o as string);

  if (!isJson && process.stdout.isTTY) {
    console.log(`\n${c.cyan}🎙️ Synthesizing speech with Deepgram...${c.reset}`);
    console.log(
      `${c.gray}Voice: ${voice} | Speed: ${speed}x | Expressivity: ${expressivity}${c.reset}`,
    );
  }

  try {
    const result = await synthesizeSpeech({
      text,
      voice,
      speed,
      expressivity,
      saveToStorage: true,
    });

    if (outPath && result.audioUrl) {
      const res = await fetch(result.audioUrl);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        const fullOutPath = path.resolve(process.cwd(), outPath);
        fs.mkdirSync(path.dirname(fullOutPath), { recursive: true });
        fs.writeFileSync(fullOutPath, Buffer.from(arrayBuf));
        if (!isJson && process.stdout.isTTY) {
          console.log(`${c.gray}Saved locally to: ${fullOutPath}${c.reset}`);
        }
      }
    }

    if (isJson) {
      console.log(
        JSON.stringify(
          {
            success: true,
            audioUrl: result.audioUrl,
            key: result.key,
            durationSecondsEstimate: result.durationSecondsEstimate,
            voice: result.voice,
            characterCount: result.characterCount,
            sizeBytes: result.size,
          },
          null,
          2,
        ),
      );
      return;
    }

    console.log(`\n${c.green}✨ Audio Synthesized & Hosted!${c.reset}`);
    console.log(
      `  ${c.bold}Audio URL:${c.reset}     ${c.underline}${c.cyan}${result.audioUrl}${c.reset}`,
    );
    console.log(
      `  ${c.bold}Duration:${c.reset}      ~${result.durationSecondsEstimate}s`,
    );
    console.log(
      `  ${c.bold}File Size:${c.reset}     ${(result.size / 1024).toFixed(1)} KB`,
    );
    console.log(`  ${c.bold}Voice Model:${c.reset}   ${result.voice}`);
    if (outPath) {
      console.log(`  ${c.bold}Local File:${c.reset}    ${outPath}`);
    }
    console.log();
  } catch (err: unknown) {
    failWith(
      err instanceof Error ? err.message : String(err),
      1,
      isJson,
      "ERR_SYNTHESIS_FAILED",
    );
  }
}

// -----------------------------------------------------------------------------
// COMMAND GROUP: TRANSCRIBE (Audio -> Text / Word Timings)
// -----------------------------------------------------------------------------
async function handleTranscribe(subArgs: string[]) {
  const { flags, positional } = parseArguments(subArgs);
  const isJson = Boolean(flags.json);
  const c = getColors(Boolean(process.stdout.isTTY) && !isJson);

  let target = positional[0];
  if (target === "audio") {
    target = positional[1];
  }

  if (!target || flags.help || flags.h) {
    if (isJson) {
      failWith(
        "Missing required <file|url> for audio transcription",
        2,
        isJson,
        "ERR_MISSING_ARGUMENT",
      );
    }
    console.log(
      `\n${c.bold}Usage:${c.reset} combo transcribe audio <file|url> [options]`,
    );
    console.log(
      `  -f, --format <fmt>   Output format: json | txt | srt | vtt (default: json)`,
    );
    console.log(
      `  -w, --words <n>      Max words per segment chunk (default: 5)`,
    );
    console.log(`  --diarize            Enable speaker identification`);
    console.log(`  -o, --out <path>     Save output directly to local file`);
    console.log(
      `  --json               Output full machine-readable JSON result\n`,
    );
    return;
  }

  const format = (
    (flags.format as string) ||
    (flags.f as string) ||
    (isJson ? "json" : "txt")
  ).toLowerCase();
  const wordsPerLine = Number.parseInt(
    (flags.words as string) || (flags.w as string) || "5",
    10,
  );
  const diarize = Boolean(flags.diarize);
  const outPath = (flags.out as string) || (flags.o as string);

  const isUrl = target.startsWith("http://") || target.startsWith("https://");

  if (!isJson && process.stdout.isTTY) {
    console.log(`\n${c.cyan}📝 Transcribing audio with Deepgram...${c.reset}`);
    console.log(
      `${c.gray}Target: ${target} | Diarize: ${diarize} | Words per chunk: ${wordsPerLine}${c.reset}`,
    );
  }

  try {
    let audioUrl = target;

    // If local file: upload via presigned URL to R2 first, then transcribe the URL
    if (!isUrl) {
      const absPath = path.resolve(process.cwd(), target);
      if (!fs.existsSync(absPath)) {
        failWith(
          `Audio file not found: ${absPath}`,
          2,
          isJson,
          "ERR_FILE_NOT_FOUND",
        );
      }

      const fileBuffer = fs.readFileSync(absPath);
      const filename = path.basename(absPath);
      const ext = filename.split(".").pop()?.toLowerCase() || "";
      const contentType = EXT_TO_MIME[ext] || "audio/mpeg";

      const presigned = await getPresignedUploadUrl({
        filename,
        folder: "audio/transcriptions",
        contentType,
      });

      const putRes = await fetch(presigned.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: fileBuffer,
      });

      if (!putRes.ok) {
        throw new Error(
          `Presigned upload of audio file failed (${putRes.status} ${putRes.statusText})`,
        );
      }

      audioUrl = presigned.publicUrl;
    }

    const result = await transcribeAudio(audioUrl, {
      diarize,
      subtitleOptions: { maxWordsPerLine: wordsPerLine },
    });

    let outputContent = "";
    if (format === "srt") {
      outputContent = result.srt;
    } else if (format === "vtt") {
      outputContent = result.vtt;
    } else if (format === "txt" || format === "text") {
      outputContent = result.transcript;
    } else {
      outputContent = JSON.stringify(
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
      );
    }

    if (outPath) {
      const fullOut = path.resolve(process.cwd(), outPath);
      fs.mkdirSync(path.dirname(fullOut), { recursive: true });
      fs.writeFileSync(fullOut, outputContent, "utf8");
    }

    if (isJson || format === "json") {
      console.log(
        outputContent.startsWith("{")
          ? outputContent
          : JSON.stringify(
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
      );
      return;
    }

    console.log(`\n${c.green}✅ Transcription Completed!${c.reset}`);
    console.log(
      `  ${c.bold}Duration:${c.reset}      ${result.duration.toFixed(2)}s`,
    );
    console.log(`  ${c.bold}Word Count:${c.reset}    ${result.words.length}`);
    console.log(
      `  ${c.bold}Confidence:${c.reset}    ${(result.confidence * 100).toFixed(1)}%`,
    );
    if (outPath) {
      console.log(`  ${c.bold}Saved to:${c.reset}      ${outPath}\n`);
    } else {
      console.log(`\n${c.bold}Output (${format.toUpperCase()}):${c.reset}\n`);
      console.log(outputContent);
      console.log();
    }
  } catch (err: unknown) {
    failWith(
      err instanceof Error ? err.message : String(err),
      1,
      isJson,
      "ERR_TRANSCRIPTION_FAILED",
    );
  }
}

// -----------------------------------------------------------------------------
// COMMAND GROUP: MCP SERVER (Stdio)
// -----------------------------------------------------------------------------
async function handleMcp() {
  console.error(
    `\n⚡ Launching Combo Model Context Protocol Server (stdio)...\n`,
  );
  await import("../mcp/server");
}

// -----------------------------------------------------------------------------
// MAIN ROUTER
// -----------------------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase();
  const subArgs = args.slice(1);
  const { flags } = parseArguments(args);
  const isJson = Boolean(flags.json);
  const c = getColors(Boolean(process.stdout.isTTY) && !isJson);

  if (
    !command ||
    command === "help" ||
    command === "--help" ||
    command === "-h"
  ) {
    printHelp(c);
    return;
  }

  // Validate environment unless running help
  try {
    getEnv();
  } catch (err: unknown) {
    if (!isJson && process.stdout.isTTY) {
      console.error(
        `\n${c.yellow}⚠️ Warning: Missing environment variables:${c.reset}`,
      );
      console.error(`  ${err instanceof Error ? err.message : String(err)}`);
      console.error(
        `  Ensure DEEPGRAM_API_KEY and R2 credentials are set in .env\n`,
      );
    }
  }

  switch (command) {
    // 1. Asset kit & aliases
    case "asset":
    case "assets":
    case "storage":
      await handleAsset(subArgs);
      break;
    case "presign":
      await handleAsset(["presign", ...subArgs]);
      break;
    case "upload":
      await handleAsset(["upload", ...subArgs]);
      break;

    // 2. Voice kit & aliases
    case "voice":
    case "voices":
    case "speak":
    case "tts":
      await handleVoice(subArgs);
      break;

    // 3. Transcribe kit & aliases
    case "transcribe":
    case "captions":
    case "stt":
      await handleTranscribe(subArgs);
      break;

    // 4. MCP Agent server
    case "mcp":
      await handleMcp();
      break;

    default:
      failWith(
        `Unknown command "${command}". Run "combo --help" to view all available commands.`,
        2,
        isJson,
        "ERR_UNKNOWN_COMMAND",
      );
  }
}

main().catch((err) => {
  console.error(
    JSON.stringify(
      {
        success: false,
        error: err.message || String(err),
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
