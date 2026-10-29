// Render banyak still dari satu bundle. Pakai: node scripts/still-batch.mjs <outDir> <comp> <frame,frame,...> [<comp> <frames> ...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

const [outDir, ...rest] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const exe = path.join(os.homedir(), ".hermes/tools/chromium-1208/chrome-linux64/chrome");
const entry = path.join(process.cwd(), "src/index.ts");
const serveUrl = await bundle({ entryPoint: entry, webpackOverride: (c) => c });
for (let i = 0; i < rest.length; i += 2) {
  const id = rest[i];
  const frames = rest[i + 1].split(",").map(Number);
  const comp = await selectComposition({ serveUrl, id, browserExecutable: exe, chromiumOptions: { gl: "swangle" } });
  for (const f of frames) {
    const out = path.join(outDir, `${id}_${String(f).padStart(5, "0")}.png`);
    await renderStill({ composition: comp, serveUrl, frame: f, output: out, browserExecutable: exe, chromiumOptions: { gl: "swangle" }, imageFormat: "png", timeoutInMS: 120000 });
    console.log("ok", out);
  }
}
