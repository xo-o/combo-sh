import { type NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, contentType, folder = "images", expiresIn } = body;

    if (!filename || typeof filename !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing required 'filename' string" },
        { status: 400 },
      );
    }

    const presigned = await getPresignedUploadUrl({
      filename,
      contentType,
      folder,
      expiresIn: typeof expiresIn === "number" ? expiresIn : undefined,
    });

    return NextResponse.json({
      success: true,
      data: presigned,
    });
  } catch (error: unknown) {
    console.error("Presigned URL generation error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate presigned upload URL";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
