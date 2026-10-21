import { type NextRequest, NextResponse } from "next/server";
import { listVoices } from "@/lib/deepgram";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const engineParam = searchParams.get("engine");
    const engine =
      engineParam === "flux" || engineParam === "aura-2"
        ? engineParam
        : undefined;

    const genderParam = searchParams.get("gender");
    const gender =
      genderParam === "female" || genderParam === "male"
        ? genderParam
        : undefined;

    const language = searchParams.get("language") || undefined;
    const accent = searchParams.get("accent") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";
    const query =
      searchParams.get("query") || searchParams.get("q") || undefined;

    const voices = listVoices({
      engine,
      gender,
      language,
      accent,
      featuredOnly,
      query,
    });

    return NextResponse.json({
      success: true,
      count: voices.length,
      voices,
    });
  } catch (error: unknown) {
    console.error("List voices error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to list voices";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
