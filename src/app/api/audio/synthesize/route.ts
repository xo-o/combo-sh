import { type NextRequest, NextResponse } from "next/server";
import { synthesizeSpeech } from "@/lib/deepgram";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      text,
      voice = "flux-alexis-en",
      speed,
      expressivity,
      encoding = "mp3",
      saveToStorage = true,
      folder = "audio/tts",
      filename,
    } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required 'text' string parameter" },
        { status: 400 },
      );
    }

    const acceptHeader = request.headers.get("accept") || "";
    const wantsRawAudio = !saveToStorage || acceptHeader.startsWith("audio/");

    const result = await synthesizeSpeech({
      text,
      voice,
      speed: typeof speed === "number" ? speed : undefined,
      expressivity: typeof expressivity === "number" ? expressivity : undefined,
      encoding,
      saveToStorage: !wantsRawAudio,
      folder,
      filename,
    });

    if (wantsRawAudio && result.buffer) {
      const buffer = result.buffer;
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": result.contentType,
          "Content-Length": buffer.byteLength.toString(),
          "X-Voice": result.voice,
          "X-Character-Count": result.characterCount.toString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        audioUrl: result.audioUrl,
        key: result.key,
        contentType: result.contentType,
        size: result.size,
        voice: result.voice,
        text: result.text,
        characterCount: result.characterCount,
        durationSecondsEstimate: result.durationSecondsEstimate,
      },
    });
  } catch (error: unknown) {
    console.error("Synthesize error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to synthesize speech";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
