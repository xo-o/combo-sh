#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist/cli.mjs");

if (fs.existsSync(distPath)) {
  await import(distPath);
} else {
  const { spawnSync } = await import("node:child_process");
  const cliPath = path.resolve(__dirname, "../src/cli/index.ts");
  const tsxBin = path.resolve(__dirname, "../node_modules/.bin/tsx");

  const result = spawnSync(tsxBin, [cliPath, ...process.argv.slice(2)], {
    stdio: "inherit",
    env: process.env,
  });

  process.exit(result.status ?? 0);
}
