import fs from "node:fs";
import { Agent, setGlobalDispatcher } from "undici";
import { z } from "zod";

let dispatcherConfigured = false;
function initSystemCa() {
  if (dispatcherConfigured) return;
  dispatcherConfigured = true;
  try {
    const caPath =
      process.env.NODE_EXTRA_CA_CERTS || "/etc/ssl/certs/ca-certificates.crt";
    if (fs.existsSync(/*turbopackIgnore: true*/ caPath)) {
      const ca = fs.readFileSync(/*turbopackIgnore: true*/ caPath);
      setGlobalDispatcher(new Agent({ connect: { ca } }));
    }
  } catch {
    // Ignore if not readable
  }
}

initSystemCa();

const envSchema = z.object({
  DEEPGRAM_API_KEY: z.string().min(1, "DEEPGRAM_API_KEY is required"),
  R2_ACCOUNT_ID: z.string().min(1, "R2_ACCOUNT_ID is required"),
  R2_ACCESS_KEY_ID: z.string().min(1, "R2_ACCESS_KEY_ID is required"),
  R2_SECRET_ACCESS_KEY: z.string().min(1, "R2_SECRET_ACCESS_KEY is required"),
  R2_BUCKET_NAME: z.string().default("combo"),
  R2_PUBLIC_DOMAIN: z.string().default("https://cdn.combo.sh"),
  GEMINI_API_KEY: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function getEnv(): EnvConfig {
  if (
    !process.env.DEEPGRAM_API_KEY &&
    typeof process.loadEnvFile === "function"
  ) {
    try {
      process.loadEnvFile();
    } catch {
      // Ignore if .env is missing or cannot be read
    }
  }

  const result = envSchema.safeParse({
    DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    R2_PUBLIC_DOMAIN: process.env.R2_PUBLIC_DOMAIN,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  });

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    throw new Error(`Environment configuration error: ${errorDetails}`);
  }

  return {
    ...result.data,
    R2_PUBLIC_DOMAIN: result.data.R2_PUBLIC_DOMAIN.replace(/\/+$/, ""),
  };
}
