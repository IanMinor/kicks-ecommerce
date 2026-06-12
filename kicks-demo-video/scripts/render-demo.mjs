import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const ffmpegDir = dirname(ffmpegPath);
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const env = {
  ...process.env,
  PATH: `${ffmpegDir}${process.platform === "win32" ? ";" : ":"}${process.env.PATH || ""}`,
};

const args = [
  "--yes",
  "hyperframes@0.6.91",
  "render",
  "--output",
  "renders/kicks-store-demo.mp4",
  "--quality",
  "standard",
];

const child = spawn(npxCommand, args, {
  cwd: dirname(fileURLToPath(import.meta.url)).replace(/[\\/]scripts$/, ""),
  env,
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
