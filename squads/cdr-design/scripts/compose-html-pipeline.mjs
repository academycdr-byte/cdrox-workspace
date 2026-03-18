#!/usr/bin/env node

/**
 * CDR Design Squad — HTML Hybrid Pipeline
 *
 * Complete pipeline: Gemini bg + Playwright text rendering + grain post-processing
 *
 * Usage:
 *   node compose-html-pipeline.mjs --bg <bg.png> --text "LINE1|LINE2|LINE3" --output <out.png>
 *
 * Options:
 *   --bg          Background image (Gemini-generated, bg-only)
 *   --text        Text lines separated by | (e.g. "RESULTADO|FALA.|GURU|NAO.")
 *   --output      Output path
 *   --grain       Grain intensity (default: 100)
 *   --vignette    Vignette strength (default: 0.80)
 *   --warmth      Grain warmth (default: 20)
 *   --no-grain    Skip grain post-processing
 *   --upscale     Upscale to 1080x1350 (Instagram 4:5)
 *   --text-color  Text color (default: #F2E2C4)
 *   --fill        Target fill percentage (default: 0.92)
 */

import { chromium } from 'playwright';
import sharp from 'sharp';
import { writeFileSync, existsSync } from 'node:fs';
import { dirname, basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Parse args ---
const args = process.argv.slice(2);
let bgPath = '', textLines = [], outputPath = '';
let grainIntensity = 100, vignetteStrength = 0.80, warmth = 20;
let skipGrain = false, upscale = false;
let textColor = '#F2E2C4', targetFill = 0.92;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--bg' && args[i + 1]) bgPath = args[++i];
  else if (args[i] === '--text' && args[i + 1]) textLines = args[++i].split('|').map(s => s.trim().toUpperCase());
  else if (args[i] === '--output' && args[i + 1]) outputPath = args[++i];
  else if (args[i] === '--grain' && args[i + 1]) grainIntensity = parseInt(args[++i]);
  else if (args[i] === '--vignette' && args[i + 1]) vignetteStrength = parseFloat(args[++i]);
  else if (args[i] === '--warmth' && args[i + 1]) warmth = parseInt(args[++i]);
  else if (args[i] === '--no-grain') skipGrain = true;
  else if (args[i] === '--upscale') upscale = true;
  else if (args[i] === '--text-color' && args[i + 1]) textColor = args[++i];
  else if (args[i] === '--fill' && args[i + 1]) targetFill = parseFloat(args[++i]);
}

if (!bgPath || !textLines.length || !outputPath) {
  console.error('Usage: node compose-html-pipeline.mjs --bg bg.png --text "LINE1|LINE2" --output out.png');
  process.exit(1);
}

// --- Detect card bounds ---
async function detectCardBounds(imagePath) {
  const { data, info } = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const threshold = 200;
  let left = 0, right = width - 1, top = 0, bottom = height - 1;
  const midY = Math.floor(height / 2), midX = Math.floor(width / 2);

  for (let x = 0; x < width; x++) {
    const idx = (midY * width + x) * channels;
    if (data[idx] < threshold && data[idx+1] < threshold && data[idx+2] < threshold) { left = x; break; }
  }
  for (let x = width - 1; x >= 0; x--) {
    const idx = (midY * width + x) * channels;
    if (data[idx] < threshold && data[idx+1] < threshold && data[idx+2] < threshold) { right = x; break; }
  }
  for (let y = 0; y < height; y++) {
    const idx = (y * width + midX) * channels;
    if (data[idx] < threshold && data[idx+1] < threshold && data[idx+2] < threshold) { top = y; break; }
  }
  for (let y = height - 1; y >= 0; y--) {
    const idx = (y * width + midX) * channels;
    if (data[idx] < threshold && data[idx+1] < threshold && data[idx+2] < threshold) { bottom = y; break; }
  }

  return { left, right, top, bottom, width, height };
}

// --- Generate text-shadow CSS ---
function generateTextShadow(depth = 14) {
  const layers = [];
  for (let i = 1; i <= depth; i++) {
    const t = i / depth;
    const r = Math.round(26 * (1 - t));
    const g = Math.round(85 * (1 - t));
    const px = i * 2;
    layers.push(`${px}px ${px}px 0 rgb(${r},${g},0)`);
  }
  // Extra blur layers for depth
  layers.push(`${(depth + 1) * 2}px ${(depth + 1) * 2}px 2px rgba(0,0,0,0.6)`);
  layers.push(`${(depth + 2) * 2}px ${(depth + 2) * 2}px 4px rgba(0,0,0,0.4)`);
  layers.push(`${(depth + 3) * 2}px ${(depth + 3) * 2}px 6px rgba(0,0,0,0.2)`);
  return layers.join(',\n      ');
}

// --- Main pipeline ---
async function main() {
  const bgMeta = await sharp(bgPath).metadata();
  const W = bgMeta.width, H = bgMeta.height;
  console.log(`[1/5] Background: ${W}x${H}`);

  // Detect card bounds
  const card = await detectCardBounds(bgPath);
  const cardW = card.right - card.left, cardH = card.bottom - card.top;
  const padding = 0.06;
  const textAreaLeft = Math.round(card.left + cardW * padding);
  const textAreaTop = Math.round(card.top + cardH * 0.12);
  const textAreaWidth = Math.round(cardW * (1 - 2 * padding));
  const textAreaHeight = Math.round(cardH * 0.78);
  console.log(`   Card: ${card.left},${card.top} → ${card.right},${card.bottom} (${cardW}x${cardH})`);

  // Build HTML with text lines
  const linesHtml = textLines.map(t => `    <div class="line">${t}</div>`).join('\n');
  const textShadow = generateTextShadow(14);

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: ${W}px; height: ${H}px; background: transparent; overflow: hidden; }
  .text-container {
    position: absolute;
    top: ${textAreaTop}px; left: ${textAreaLeft}px;
    width: ${textAreaWidth}px; height: ${textAreaHeight}px;
    display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 0;
  }
  .line {
    font-family: 'Luckiest Guy', 'Impact', cursive;
    color: ${textColor};
    text-align: center;
    line-height: 0.90;
    letter-spacing: 2px;
    white-space: nowrap;
    font-size: 100px;
    text-shadow: ${textShadow};
    -webkit-text-stroke: 2.5px #0a0a0a;
    paint-order: stroke fill;
  }
</style></head><body>
  <div class="text-container">
${linesHtml}
  </div>
</body></html>`;

  // Step 2: Render text with Playwright
  console.log(`[2/5] Rendering ${textLines.length} text lines with Playwright...`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: W, height: H } });

  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Wait for Google Fonts

  // Auto-size: measure at 100px, calculate optimal, apply scaleX for fine-tuning
  const sizing = await page.evaluate((targetFillPct) => {
    const container = document.querySelector('.text-container');
    const containerWidth = container.offsetWidth;
    const targetWidth = containerWidth * targetFillPct;
    const maxHeight = container.offsetHeight;
    const lines = document.querySelectorAll('.line');

    // Measure natural widths at 100px
    const measurements = [];
    lines.forEach(line => {
      const range = document.createRange();
      range.selectNodeContents(line);
      measurements.push({ el: line, widthAt100: range.getBoundingClientRect().width });
    });

    // Calculate ideal font sizes
    const idealSizes = measurements.map(m => Math.round(targetWidth / m.widthAt100 * 100));

    // Scale down if total height exceeds container
    const heightFactor = 0.90;
    const totalHeight = idealSizes.reduce((sum, fs) => sum + fs * heightFactor, 0);
    const scale = totalHeight > maxHeight ? maxHeight / totalHeight : 1.0;
    const finalSizes = idealSizes.map(fs => Math.round(fs * scale));

    // Apply sizes
    measurements.forEach((m, i) => { m.el.style.fontSize = finalSizes[i] + 'px'; });

    // Fine-tune with scaleX
    const results = [];
    measurements.forEach((m, i) => {
      const range = document.createRange();
      range.selectNodeContents(m.el);
      const newWidth = range.getBoundingClientRect().width;
      const scaleX = Math.min(Math.max(targetWidth / newWidth, 0.85), 1.15);
      m.el.style.transform = 'scaleX(' + scaleX.toFixed(4) + ')';
      results.push({
        text: m.el.textContent,
        fontSize: finalSizes[i],
        scaleX: parseFloat(scaleX.toFixed(3)),
        fillPct: Math.round(newWidth * scaleX / containerWidth * 100)
      });
    });

    return results;
  }, targetFill);

  sizing.forEach(s => console.log(`   "${s.text}": ${s.fontSize}px, scaleX=${s.scaleX}, fill=${s.fillPct}%`));

  // Screenshot with transparent background
  const textOverlayPath = outputPath.replace(/\.(png|jpg)$/i, '-_text.png');
  await page.screenshot({ path: textOverlayPath, type: 'png', omitBackground: true, scale: 'css' });
  await browser.close();

  // Step 3: Create black border mask
  console.log('[3/5] Compositing onto background with black border...');
  const r = 28;
  const cl = card.left, ct = card.top, cr = card.right, cb = card.bottom;
  const borderSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" fill="black" d="
      M0,0 H${W} V${H} H0 Z
      M${cl + r},${ct} H${cr - r} Q${cr},${ct} ${cr},${ct + r}
      V${cb - r} Q${cr},${cb} ${cr - r},${cb}
      H${cl + r} Q${cl},${cb} ${cl},${cb - r}
      V${ct + r} Q${cl},${ct} ${cl + r},${ct} Z
    "/>
  </svg>`;
  const blackBorder = await sharp(Buffer.from(borderSvg)).png().toBuffer();

  // Composite: bg + black border + text
  let result = await sharp(bgPath)
    .composite([
      { input: blackBorder, top: 0, left: 0, blend: 'over' },
      { input: textOverlayPath, top: 0, left: 0, blend: 'over' }
    ])
    .png()
    .toBuffer();

  // Step 4: Apply grain (optional)
  if (!skipGrain) {
    console.log(`[4/5] Applying grain (intensity=${grainIntensity}, vignette=${vignetteStrength})...`);
    const tempPath = outputPath.replace(/\.(png|jpg)$/i, '-_pre-grain.png');
    writeFileSync(tempPath, result);
    const grainScript = join(__dirname, 'add-grain.mjs');
    execSync(`node "${grainScript}" "${tempPath}" --output "${outputPath}" --grain ${grainIntensity} --vignette ${vignetteStrength} --warmth ${warmth}`, { stdio: 'pipe' });
  } else {
    console.log('[4/5] Grain skipped.');
    writeFileSync(outputPath, result);
  }

  // Step 5: Upscale (optional)
  if (upscale) {
    console.log('[5/5] Upscaling to 1080x1350...');
    const upscaled = await sharp(outputPath)
      .resize(1080, 1350, { fit: 'cover', position: 'center' })
      .png()
      .toBuffer();
    writeFileSync(outputPath, upscaled);
  } else {
    console.log('[5/5] Upscale skipped (use --upscale for 1080x1350).');
  }

  console.log(`\nOutput: ${outputPath}`);
  console.log('Pipeline complete!');
}

main().catch(err => {
  console.error('Pipeline error:', err.message);
  process.exit(1);
});
