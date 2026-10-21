import crypto from "node:crypto";
import fs from "node:fs";
import https from "node:https";
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { getEnv } from "./config";

let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    const env = getEnv();

    let requestHandler: NodeHttpHandler | undefined;
    try {
      const caPath =
        process.env.NODE_EXTRA_CA_CERTS || "/etc/ssl/certs/ca-certificates.crt";
      if (fs.existsSync(/*turbopackIgnore: true*/ caPath)) {
        const ca = fs.readFileSync(/*turbopackIgnore: true*/ caPath);
        requestHandler = new NodeHttpHandler({
          httpsAgent: new https.Agent({ ca }),
        });
      }
    } catch {
      // Use default handler if CA not readable
    }

    s3ClientInstance = new S3Client({
      region: "auto",
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
      requestHandler,
    });
  }
  return s3ClientInstance;
}

export interface UploadOptions {
  folder?: string;
  filename?: string;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface StoredAsset {
  key: string;
  url: string;
  size: number;
  contentType: string;
  etag?: string;
  lastModified?: Date;
}

export interface PresignedUrlResult {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  expiresIn: number;
  contentType: string;
}

export interface ListAssetsOptions {
  prefix?: string;
  limit?: number;
  cursor?: string;
}

export interface ListAssetsResult {
  assets: StoredAsset[];
  nextCursor?: string;
}

export const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/wave": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/flac": "flac",
  "audio/aac": "aac",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "text/vtt": "vtt",
  "application/x-subrip": "srt",
  "text/plain": "txt",
  "application/json": "json",
};

export const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  flac: "audio/flac",
  aac: "audio/aac",
  mp4: "video/mp4",
  webm: "video/webm",
  vtt: "text/vtt",
  srt: "application/x-subrip",
  txt: "text/plain",
  json: "application/json",
};

export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateStorageKey(options: {
  folder?: string;
  filename?: string;
  extension?: string;
}): string {
  const folder = (options.folder || "assets")
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
  const randomSuffix = crypto.randomBytes(6).toString("hex");
  const timestamp = Date.now();

  let baseName = "";
  let ext = options.extension || "";

  if (options.filename) {
    const cleanName = sanitizeFilename(options.filename);
    const lastDotIndex = cleanName.lastIndexOf(".");
    if (lastDotIndex > 0) {
      baseName = cleanName.substring(0, lastDotIndex);
      if (!ext) ext = cleanName.substring(lastDotIndex + 1);
    } else {
      baseName = cleanName;
    }
  }

  const finalPrefix = baseName
    ? `${baseName}-${randomSuffix}`
    : `${timestamp}-${randomSuffix}`;
  const finalFilename = ext ? `${finalPrefix}.${ext}` : finalPrefix;

  return folder ? `${folder}/${finalFilename}` : finalFilename;
}

export function getPublicUrl(key: string): string {
  const env = getEnv();
  const cleanKey = key.replace(/^\/+/, "");
  return `${env.R2_PUBLIC_DOMAIN}/${cleanKey}`;
}

export function extractKeyFromUrl(keyOrUrl: string): string {
  const env = getEnv();
  const domain = env.R2_PUBLIC_DOMAIN;

  if (keyOrUrl.startsWith(domain)) {
    return keyOrUrl.slice(domain.length).replace(/^\/+/, "");
  }

  if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://")) {
    try {
      const parsed = new URL(keyOrUrl);
      return parsed.pathname.replace(/^\/+/, "");
    } catch {
      return keyOrUrl;
    }
  }

  return keyOrUrl.replace(/^\/+/, "");
}

/**
 * Upload a raw buffer to Cloudflare R2
 */
export async function uploadAsset(
  data: Buffer | Uint8Array,
  options: UploadOptions = {},
): Promise<StoredAsset> {
  const env = getEnv();
  const s3 = getS3Client();

  let contentType = options.contentType || "application/octet-stream";
  let ext = "";

  if (options.filename) {
    const parts = options.filename.split(".");
    if (parts.length > 1) {
      ext = parts.pop()?.toLowerCase() || "";
      if (!options.contentType && EXT_TO_MIME[ext]) {
        contentType = EXT_TO_MIME[ext];
      }
    }
  }

  if (!ext && MIME_TO_EXT[contentType]) {
    ext = MIME_TO_EXT[contentType];
  }

  const key = generateStorageKey({
    folder: options.folder,
    filename: options.filename,
    extension: ext,
  });

  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    Body: data,
    ContentType: contentType,
    Metadata: options.metadata,
  });

  const response = await s3.send(command);

  return {
    key,
    url: getPublicUrl(key),
    size: data.byteLength,
    contentType,
    etag: response.ETag?.replace(/"/g, ""),
  };
}

/**
 * Download an asset from a remote URL and store it in R2
 */
export async function uploadFromUrl(
  url: string,
  options: UploadOptions = {},
): Promise<StoredAsset> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; MiloCloudApi/1.0)",
      Accept: "*/*",
    },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch image from URL: ${response.status} ${response.statusText}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const headerContentType = response.headers
    .get("content-type")
    ?.split(";")[0]
    ?.trim();
  const contentType =
    options.contentType || headerContentType || "application/octet-stream";

  let inferredFilename = options.filename;
  if (!inferredFilename) {
    try {
      const parsedUrl = new URL(url);
      const pathnameParts = parsedUrl.pathname.split("/").filter(Boolean);
      const lastSegment = pathnameParts.pop();
      if (lastSegment?.includes(".")) {
        inferredFilename = lastSegment;
      }
    } catch {
      // ignore
    }
  }

  return uploadAsset(buffer, {
    ...options,
    filename: inferredFilename,
    contentType,
  });
}

/**
 * Decode a base64 / data URL string and upload to R2
 */
export async function uploadFromBase64(
  base64String: string,
  options: UploadOptions = {},
): Promise<StoredAsset> {
  let cleanBase64 = base64String.trim();
  let contentType = options.contentType;

  // Check if data URL format: data:<mime>;base64,<data>
  const match = cleanBase64.match(
    /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/,
  );
  if (match) {
    contentType = contentType || match[1];
    cleanBase64 = match[2];
  }

  const buffer = Buffer.from(cleanBase64, "base64");
  return uploadAsset(buffer, {
    ...options,
    contentType: contentType || "application/octet-stream",
  });
}

/**
 * Generate a presigned PUT URL for direct client-side upload to R2
 */
export async function getPresignedUploadUrl(options: {
  filename: string;
  contentType?: string;
  folder?: string;
  expiresIn?: number;
}): Promise<PresignedUrlResult> {
  const env = getEnv();
  const s3 = getS3Client();

  const expiresIn = options.expiresIn || 3600; // 1 hour default
  let ext = "";
  const parts = options.filename.split(".");
  if (parts.length > 1) {
    ext = parts.pop()?.toLowerCase() || "";
  }

  const contentType =
    options.contentType ||
    (ext ? EXT_TO_MIME[ext] : "application/octet-stream") ||
    "application/octet-stream";

  const key = generateStorageKey({
    folder: options.folder,
    filename: options.filename,
    extension: ext,
  });

  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn });

  return {
    uploadUrl,
    publicUrl: getPublicUrl(key),
    key,
    expiresIn,
    contentType,
  };
}

/**
 * Delete an asset from R2 by key or public URL
 */
export async function deleteAsset(
  keyOrUrl: string,
): Promise<{ success: boolean; key: string }> {
  const env = getEnv();
  const s3 = getS3Client();
  const key = extractKeyFromUrl(keyOrUrl);

  const command = new DeleteObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
  });

  await s3.send(command);

  return { success: true, key };
}

/**
 * List assets in R2 bucket
 */
export async function listAssets(
  options: ListAssetsOptions = {},
): Promise<ListAssetsResult> {
  const env = getEnv();
  const s3 = getS3Client();

  const prefix = options.prefix ? options.prefix.replace(/^\/+/, "") : "";
  const limit = Math.min(options.limit || 50, 200);

  const command = new ListObjectsV2Command({
    Bucket: env.R2_BUCKET_NAME,
    Prefix: prefix,
    MaxKeys: limit,
    ContinuationToken: options.cursor,
  });

  const response = await s3.send(command);

  const assets: StoredAsset[] = (response.Contents || []).map((item) => {
    const key = item.Key || "";
    const ext = key.split(".").pop()?.toLowerCase() || "";
    return {
      key,
      url: getPublicUrl(key),
      size: item.Size || 0,
      contentType: EXT_TO_MIME[ext] || "application/octet-stream",
      etag: item.ETag?.replace(/"/g, ""),
      lastModified: item.LastModified,
    };
  });

  return {
    assets,
    nextCursor: response.NextContinuationToken,
  };
}
