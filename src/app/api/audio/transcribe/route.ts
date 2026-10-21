import { type NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/deepgram";

export async function POST(request: NextRequest) {
  try {
    const format = request.nextUrl.searchParams.get("format"); // 'srt' | 'vtt' | 'text' | 'json'

    let body: {
      url?: string;
      model?: string;
      language?: string;
      diarize?: boolean;
      subtitleOptions?: {
        maxWordsPerLine?: number;
        maxDurationSeconds?: number;
      };
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid JSON body. Audio transcription expects { url: string }.",
        },
        { status: 400 },
      );
    }

    const { url } = body;
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required 'url' string parameter. Direct file uploads are not supported; provide an audio URL (e.g. from cdn.combo.sh).",
        },
        { status: 400 },
      );
    }

    const model = body.model || "nova-3";
    const language = body.language;
    const diarize = body.diarize !== undefined ? Boolean(body.diarize) : false;
    const maxWordsPerLine = body.subtitleOptions?.maxWordsPerLine ?? 5;
    const maxDurationSeconds = body.subtitleOptions?.maxDurationSeconds ?? 2.5;

    const result = await transcribeAudio(url, {
      model,
      language,
      diarize,
      subtitleOptions: {
        maxWordsPerLine,
        maxDurationSeconds,
      },
    });

    // Handle format overrides (e.g. download raw SRT or VTT)
    if (format === "srt") {
      return new NextResponse(result.srt, {
        headers: {
          "Content-Type": "application/x-subrip",
          "Content-Disposition": 'attachment; filename="captions.srt"',
        },
      });
    }

    if (format === "vtt") {
      return new NextResponse(result.vtt, {
        headers: {
          "Content-Type": "text/vtt",
          "Content-Disposition": 'attachment; filename="captions.vtt"',
        },
      });
    }

    if (format === "text") {
      return new NextResponse(result.transcript, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    console.error("Transcription error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to transcribe audio";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
