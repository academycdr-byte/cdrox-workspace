#!/usr/bin/env node

/**
 * CDR Design Squad — Grain & Vignette Post-Processor
 *
 * Adiciona grain analogico pesado + vinheta forte sobre imagens Gemini.
 * Usa sharp para image manipulation.
 *
 * Uso:
 *   node add-grain.mjs <input.png> [--output path] [--grain 70] [--vignette 0.85]
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Parse args ---
const args = process.argv.slice(2);
let inputPath = '';
let outputPath = '';
let grainIntensity = 70;
let vignetteStrength = 0.85;
let warmth = 12;
let blendMode = 'overlay';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--output' && args[i + 1]) outputPath = args[++i];
  else if (args[i] === '--grain' && args[i + 1]) grainIntensity = parseInt(args[++i]);
  else if (args[i] === '--vignette' && args[i + 1]) vignetteStrength = parseFloat(args[++i]);
  else if (args[i] === '--warmth' && args[i + 1]) warmth = parseInt(args[++i]);
  else if (args[i] === '--blend' && args[i + 1]) blendMode = args[++i];
  else if (!inputPath) inputPath = args[i];
}

if (!inputPath || !existsSync(inputPath)) {
  console.error('Uso: node add-grain.mjs <input.png> [--output out.png] [--grain 70] [--vignette 0.85]');
  process.exit(1);
}

if (!outputPath) {
  const ext = extname(inputPath);
  const base = basename(inputPath, ext);
  outputPath = join(dirname(inputPath), `${base}-grain${ext}`);
}

console.log(`Input: ${inputPath}`);
console.log(`Grain: ${grainIntensity}, Vignette: ${vignetteStrength}, Warmth: ${warmth}, Blend: ${blendMode}`);

// --- Generate film-like grain buffer (3-layer analog simulation) ---
function generateGrainBuffer(width, height, intensity, warmthVal) {
  const channels = 4; // RGBA
  const buf = Buffer.alloc(width * height * channels);

  // Multiple seeded PRNGs for different grain layers
  let seed1 = 42, seed2 = 137, seed3 = 2903;
  function rand1() { seed1 = (seed1 * 16807) % 2147483647; return seed1 / 2147483647; }
  function rand2() { seed2 = (seed2 * 48271) % 2147483647; return seed2 / 2147483647; }
  function rand3() { seed3 = (seed3 * 69621) % 2147483647; return seed3 / 2147483647; }

  // Pre-generate coarse grain (3x3 blocks for film-like clusters)
  const bw = Math.ceil(width / 3);
  const bh = Math.ceil(height / 3);
  const coarseGrain = new Float32Array(bw * bh);
  for (let i = 0; i < coarseGrain.length; i++) {
    coarseGrain[i] = (rand2() - 0.5) * intensity * 0.7;
  }

  // Pre-generate medium grain (2x2 blocks)
  const mw = Math.ceil(width / 2);
  const mh = Math.ceil(height / 2);
  const medGrain = new Float32Array(mw * mh);
  for (let i = 0; i < medGrain.length; i++) {
    medGrain[i] = (rand3() - 0.5) * intensity * 0.4;
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;

      // Layer 1: Fine grain (per-pixel)
      const fine = (rand1() - 0.5) * intensity * 0.6;

      // Layer 2: Coarse grain (3x3 clusters — film halide clumps)
      const bx = Math.floor(x / 3);
      const by = Math.floor(y / 3);
      const coarse = coarseGrain[by * bw + bx];

      // Layer 3: Medium grain (2x2)
      const mx = Math.floor(x / 2);
      const my = Math.floor(y / 2);
      const med = medGrain[my * mw + mx];

      const combined = fine + coarse + med;

      // Warm-toned analog grain (slight sepia shift)
      const r = Math.max(0, Math.min(255, 128 + combined + warmthVal * 0.5));
      const g = Math.max(0, Math.min(255, 128 + combined + warmthVal * 0.15));
      const b = Math.max(0, Math.min(255, 128 + combined - warmthVal * 0.35));

      // Alpha: stronger in midtones (film grain is less visible in pure black/white)
      const alpha = Math.min(255, Math.abs(combined) * 1.5 + 15);

      buf[idx] = r;
      buf[idx + 1] = g;
      buf[idx + 2] = b;
      buf[idx + 3] = alpha;
    }
  }
  return buf;
}

// --- Generate vignette buffer (preserve text center, dark corners) ---
function generateVignetteBuffer(width, height, strength) {
  const channels = 4;
  const buf = Buffer.alloc(width * height * channels);

  // Center of text area (slightly above geometric center)
  const cx = width * 0.50;
  const cy = height * 0.45;
  // Large clear radius to preserve text readability
  const clearRadius = Math.min(width, height) * 0.40;
  const maxDist = Math.sqrt(width * width + height * height) * 0.55;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;

      // Distance from text center
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base vignette: starts softly after clear radius
      const normalDist = Math.max(0, (dist - clearRadius)) / (maxDist - clearRadius);
      let alpha = Math.pow(normalDist, 1.8) * strength;

      // Extra darkness in top-left corner (signature look)
      const tlDist = Math.sqrt(x * x + y * y) / (width * 0.65);
      const tlDark = Math.max(0, 1 - tlDist) * strength * 0.35;
      alpha = Math.min(1, alpha + tlDark);

      // Slight darkness in top-right corner
      const trDist = Math.sqrt((width - x) ** 2 + y ** 2) / (width * 0.75);
      const trDark = Math.max(0, 1 - trDist) * strength * 0.15;
      alpha = Math.min(1, alpha + trDark);

      // Bottom-left corner (subtle)
      const blDist = Math.sqrt(x * x + (height - y) ** 2) / (width * 0.8);
      const blDark = Math.max(0, 1 - blDist) * strength * 0.1;
      alpha = Math.min(1, alpha + blDark);

      buf[idx] = 0;
      buf[idx + 1] = 0;
      buf[idx + 2] = 0;
      buf[idx + 3] = Math.round(alpha * 255);
    }
  }
  return buf;
}

async function main() {
  const metadata = await sharp(inputPath).metadata();
  const { width, height } = metadata;
  console.log(`Image size: ${width}x${height}`);

  // Generate overlays
  console.log('Generating grain overlay...');
  const grainBuf = generateGrainBuffer(width, height, grainIntensity, warmth);

  console.log('Generating vignette overlay...');
  const vignetteBuf = generateVignetteBuffer(width, height, vignetteStrength);

  // Create grain overlay image
  const grainOverlay = await sharp(grainBuf, {
    raw: { width, height, channels: 4 }
  }).png().toBuffer();

  // Create vignette overlay image
  const vignetteOverlay = await sharp(vignetteBuf, {
    raw: { width, height, channels: 4 }
  }).png().toBuffer();

  // Composite: base + grain (overlay blend) + vignette (darken)
  console.log('Compositing layers...');
  const result = await sharp(inputPath)
    .composite([
      {
        input: grainOverlay,
        blend: blendMode,
        top: 0,
        left: 0,
      },
      {
        input: vignetteOverlay,
        blend: 'over',
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  writeFileSync(outputPath, result);
  console.log(`Output: ${outputPath}`);
  console.log('Done!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
