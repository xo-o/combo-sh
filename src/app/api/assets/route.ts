import { type NextRequest, NextResponse } from "next/server";
import { deleteAsset, listAssets } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const prefix = searchParams.get("prefix") || undefined;
    const limitParam = searchParams.get("limit");
    const cursor = searchParams.get("cursor") || undefined;

    const limit = limitParam ? Number.parseInt(limitParam, 10) : 50;

    const result = await listAssets({
      prefix,
      limit: Number.isNaN(limit) ? 50 : limit,
      cursor,
    });

    return NextResponse.json({
      success: true,
      assets: result.assets,
      nextCursor: result.nextCursor,
    });
  } catch (error: unknown) {
    console.error("List assets error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to list assets";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    let keyOrUrl: string | null = null;

    // Check query param first
    keyOrUrl =
      request.nextUrl.searchParams.get("key") ||
      request.nextUrl.searchParams.get("url");

    // If not in query params, inspect JSON body
    if (
      !keyOrUrl &&
      request.headers.get("content-type")?.includes("application/json")
    ) {
      try {
        const body = await request.json();
        keyOrUrl = body.key || body.url || null;
      } catch {
        // ignore JSON parse error
      }
    }

    if (!keyOrUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required 'key' or 'url' parameter in query or body",
        },
        { status: 400 },
      );
    }

    const result = await deleteAsset(keyOrUrl);

    return NextResponse.json({
      success: true,
      deletedKey: result.key,
    });
  } catch (error: unknown) {
    console.error("Delete asset error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete asset";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
