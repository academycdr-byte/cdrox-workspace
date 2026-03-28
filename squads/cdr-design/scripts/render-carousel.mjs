#!/usr/bin/env node
/**
 * CDR Design — Animated Carousel Pipeline
 * Grava slides HTML como video MP4 pronto pro Instagram
 *
 * Uso:
 *   node render-carousel.mjs --config <path-to-carousel-config.json>
 *   node render-carousel.mjs --dir <path-to-slides-folder> [--duration 15] [--port 3458]
 *
 * O script:
 *   1. Serve os HTMLs via http-server
 *   2. Grava cada slide com Playwright (pagina preta primeiro)
 *   3. Converte WebM -> MP4 (H.264, trim inicio, duracao exata)
 *   4. Abre a pasta de output
 */
import { chromium } from 'playwright';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { readdir, mkdir, rename, unlink, readFile } from 'fs/promises';
import { execSync, spawn } from 'child_process';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// === PARSE ARGS ===
const args = process.argv.slice(2);
function getArg(name, defaultVal) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultVal;
}

const configPath = getArg('config', null);
const slidesDir = getArg('dir', null);
const duration = parseInt(getArg('duration', '15'), 10);
const port = parseInt(getArg('port', '3458'), 10);
const VIEWPORT = { width: 1080, height: 1080 };

// === RESOLVE CONFIG ===
let slides = [];
let outputDir = '';

if (configPath) {
  const config = JSON.parse(await readFile(resolve(configPath), 'utf-8'));
  const configDir = dirname(resolve(configPath));
  slides = config.slides.map(s => ({ file: s, name: basename(s, '.html') }));
  outputDir = resolve(configDir, config.output_dir || 'videos');
} else if (slidesDir) {
  const dir = resolve(slidesDir);
  const files = (await readdir(dir)).filter(f => f.endsWith('.html')).sort();
  slides = files.map(f => ({ file: f, name: basename(f, '.html') }));
  outputDir = resolve(dir, 'videos');
} else {
  console.error('Uso: node render-carousel.mjs --config <json> | --dir <folder>');
  process.exit(1);
}

// === FIND FFMPEG ===
const ffmpegPaths = [
  resolve(__dirname, '../../../node_modules/ffmpeg-static/ffmpeg.exe'),
  resolve(__dirname, '../../node_modules/ffmpeg-static/ffmpeg.exe'),
  resolve(__dirname, '../node_modules/ffmpeg-static/ffmpeg.exe'),
];
const ffmpeg = ffmpegPaths.find(p => existsSync(p));
if (!ffmpeg) {
  console.error('ffmpeg-static nao encontrado. Rode: npm install ffmpeg-static');
  process.exit(1);
}

// === START HTTP SERVER ===
console.log(`\n=== CDR Animated Carousel Pipeline ===\n`);
const serverDir = configPath ? dirname(resolve(configPath)) : resolve(slidesDir);
console.log(`Serving: ${serverDir} on port ${port}`);

const server = spawn('npx', ['-y', 'http-server', serverDir, '-p', String(port), '--cors', '-s'], {
  stdio: 'ignore', shell: true, detached: true,
});
server.unref();
await new Promise(r => setTimeout(r, 2000)); // wait for server

// === RECORD ===
await mkdir(outputDir, { recursive: true });

console.log(`\nRecording ${slides.length} slides (${duration}s each)...\n`);

for (const slide of slides) {
  console.log(`  [REC] ${slide.file}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: outputDir, size: VIEWPORT },
  });

  const page = await context.newPage();

  // Black page first — prevents white flash
  await page.setContent('<html><body style="background:#000;margin:0;width:1080px;height:1080px;"></body></html>');
  await page.waitForTimeout(500);

  // Navigate to slide
  await page.goto(`http://localhost:${port}/${slide.file}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500); // fonts + Three.js
  await page.waitForTimeout(duration * 1000); // slide duration

  await page.close();

  const video = page.video();
  if (video) {
    const videoPath = await video.path();
    const webmPath = resolve(outputDir, `${slide.name}.webm`);
    try {
      await rename(videoPath, webmPath);
    } catch {
      // file might already be in right place
    }
  }

  await context.close();
  await browser.close();
  console.log(`  [OK]  ${slide.name}.webm`);
}

// === CONVERT ===
console.log(`\nConverting to MP4 (H.264, ${duration}s, trim start)...\n`);

for (const slide of slides) {
  const webmPath = resolve(outputDir, `${slide.name}.webm`);
  const mp4Path = resolve(outputDir, `${slide.name}.mp4`);

  execSync([
    `"${ffmpeg}"`, '-y',
    '-ss', '3',              // skip white/loading frames
    '-i', `"${webmPath}"`,
    '-t', String(duration),  // exact duration
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-r', '30',
    '-vf', 'scale=1080:1080',
    '-an',                   // no audio
    `"${mp4Path}"`,
  ].join(' '), { stdio: 'ignore' });

  // Get duration for validation
  const probe = execSync(`"${ffmpeg}" -i "${mp4Path}" 2>&1 || true`, { encoding: 'utf-8' });
  const durationMatch = probe.match(/Duration: (\d+:\d+:\d+\.\d+)/);
  const size = execSync(`wc -c < "${mp4Path}"`, { encoding: 'utf-8' }).trim();
  const sizeMB = (parseInt(size, 10) / 1024 / 1024).toFixed(1);

  console.log(`  [MP4] ${slide.name}.mp4 — ${sizeMB}MB, ${durationMatch?.[1] || '??'}`);

  // Cleanup webm
  await unlink(webmPath).catch(() => {});
}

// === DONE ===
console.log(`\nPronto! ${slides.length} MP4s em: ${outputDir}`);
console.log('Formato: 1080x1080, H.264, 30fps, sem audio\n');

// Open folder (Windows)
try { execSync(`start "" "${outputDir.replace(/\//g, '\\\\')}"`); } catch {}

// Kill http-server
try { process.kill(-server.pid); } catch {}
