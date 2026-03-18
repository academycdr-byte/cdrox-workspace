#!/usr/bin/env node

/**
 * CDR Design Squad — Hybrid Composer v2
 *
 * Composes text with perfect per-line sizing onto a Gemini-generated background.
 * Uses SVG text rendering via sharp for pixel-perfect typography control.
 *
 * Pipeline: Gemini bg-only → black canvas + bg → SVG text overlay → grain
 *
 * Usage:
 *   node compose-hybrid.mjs --bg <background.png> --text "LINE1|LINE2|LINE3" --output <out.png>
 *   node compose-hybrid.mjs --bg bg.png --text "RESULTADO|FALA.|GURU|NAO." --output out.png --shadow-depth 12
 */

import sharp from 'sharp';
import { writeFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Parse args ---
const args = process.argv.slice(2);
let bgPath = '';
let textLines = [];
let outputPath = '';
let textColor = '#F2E2C4';
let shadowColor1 = '#1a5500';
let shadowColor2 = '#000000';
let shadowDepth = 12;
let strokeWidth = 3;
let cardPadding = 0.06; // 6% padding from card edge to text

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--bg' && args[i + 1]) bgPath = args[++i];
  else if (args[i] === '--text' && args[i + 1]) textLines = args[++i].split('|');
  else if (args[i] === '--output' && args[i + 1]) outputPath = args[++i];
  else if (args[i] === '--shadow-depth' && args[i + 1]) shadowDepth = parseInt(args[++i]);
  else if (args[i] === '--text-color' && args[i + 1]) textColor = args[++i];
  else if (args[i] === '--stroke' && args[i + 1]) strokeWidth = parseInt(args[++i]);
  else if (args[i] === '--padding' && args[i + 1]) cardPadding = parseFloat(args[++i]);
}

if (!bgPath || !textLines.length || !outputPath) {
  console.error('Usage: node compose-hybrid.mjs --bg bg.png --text "LINE1|LINE2|LINE3" --output out.png');
  process.exit(1);
}

/**
 * Detect card bounds by analyzing the background image.
 * The card is the dark rectangle — the outer area is white/light.
 * We scan from edges to find where the card starts.
 */
async function detectCardBounds(imagePath) {
  const { data, info } = await sharp(imagePath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const threshold = 200; // pixels brighter than this are "outside" the card

  // Scan from left edge at vertical center
  let left = 0;
  const midY = Math.floor(height / 2);
  for (let x = 0; x < width; x++) {
    const idx = (midY * width + x) * channels;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    if (r < threshold && g < threshold && b < threshold) {
      left = x;
      break;
    }
  }

  // Scan from right edge
  let right = width - 1;
  for (let x = width - 1; x >= 0; x--) {
    const idx = (midY * width + x) * channels;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    if (r < threshold && g < threshold && b < threshold) {
      right = x;
      break;
    }
  }

  // Scan from top edge at horizontal center
  let top = 0;
  const midX = Math.floor(width / 2);
  for (let y = 0; y < height; y++) {
    const idx = (y * width + midX) * channels;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    if (r < threshold && g < threshold && b < threshold) {
      top = y;
      break;
    }
  }

  // Scan from bottom edge
  let bottom = height - 1;
  for (let y = height - 1; y >= 0; y--) {
    const idx = (y * width + midX) * channels;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    if (r < threshold && g < threshold && b < threshold) {
      bottom = y;
      break;
    }
  }

  return { left, right, top, bottom, width, height };
}

async function main() {
  const bgMeta = await sharp(bgPath).metadata();
  const W = bgMeta.width;
  const H = bgMeta.height;
  console.log(`Background: ${W}x${H}`);

  // Step 1: Detect card bounds
  console.log('Detecting card bounds...');
  const card = await detectCardBounds(bgPath);
  console.log(`Card bounds: left=${card.left}, top=${card.top}, right=${card.right}, bottom=${card.bottom}`);

  const cardW = card.right - card.left;
  const cardH = card.bottom - card.top;
  console.log(`Card size: ${cardW}x${cardH}`);

  // Step 2: Replace outer area (outside card) with pure black
  // Create a mask: white inside card rounded rect, black outside
  console.log('Creating black background with card mask...');
  const cardRadius = 28;
  // Use SVG path with even-odd fill to create black border with transparent card hole
  const r = cardRadius;
  const cl = card.left, ct = card.top, cr = card.right, cb = card.bottom;
  const blackBorderSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" fill="black" d="
      M0,0 H${W} V${H} H0 Z
      M${cl + r},${ct} H${cr - r} Q${cr},${ct} ${cr},${ct + r}
      V${cb - r} Q${cr},${cb} ${cr - r},${cb}
      H${cl + r} Q${cl},${cb} ${cl},${cb - r}
      V${ct + r} Q${cl},${ct} ${cl + r},${ct} Z
    "/>
  </svg>`;
  const blackBorder = await sharp(Buffer.from(blackBorderSvg)).png().toBuffer();

  const bgOnBlack = await sharp(bgPath)
    .composite([{ input: blackBorder, top: 0, left: 0, blend: 'over' }])
    .png()
    .toBuffer();

  // Step 3: Calculate text area within card bounds
  // The card has: handle area at top (~12% of card height), CTA at bottom (~10% of card height)
  const headerHeight = cardH * 0.12; // @cdrgroup.assessoria + logo area
  const footerHeight = cardH * 0.10; // CONTEUDO AO LADO area
  const textPadX = cardW * cardPadding;

  const textAreaTop = card.top + headerHeight;
  const textAreaBottom = card.bottom - footerHeight;
  const textAreaLeft = card.left + textPadX;
  const textAreaRight = card.right - textPadX;
  const textAreaWidth = textAreaRight - textAreaLeft;
  const textAreaHeight = textAreaBottom - textAreaTop;

  console.log(`Text area: ${Math.round(textAreaLeft)},${Math.round(textAreaTop)} → ${Math.round(textAreaRight)},${Math.round(textAreaBottom)}`);
  console.log(`Text area size: ${Math.round(textAreaWidth)}x${Math.round(textAreaHeight)}`);

  // Step 4: Calculate per-line font sizes
  // Each line fills ~92% of textAreaWidth — font size varies per line
  const targetFillWidth = textAreaWidth * 0.92;

  // Impact font metrics: measured char widths relative to font-size
  const charWidths = {
    'A': 0.62, 'B': 0.60, 'C': 0.60, 'D': 0.62, 'E': 0.55,
    'F': 0.52, 'G': 0.62, 'H': 0.62, 'I': 0.30, 'J': 0.45,
    'K': 0.60, 'L': 0.52, 'M': 0.72, 'N': 0.62, 'O': 0.62,
    'P': 0.58, 'Q': 0.62, 'R': 0.60, 'S': 0.55, 'T': 0.55,
    'U': 0.60, 'V': 0.58, 'W': 0.78, 'X': 0.58, 'Y': 0.55,
    'Z': 0.55, ' ': 0.25, '.': 0.28, ',': 0.28, '!': 0.30,
    '?': 0.52, '-': 0.35, "'": 0.22, '"': 0.38, 'Ã': 0.62,
    'Á': 0.62, 'É': 0.55, 'Í': 0.30, 'Ó': 0.62, 'Ú': 0.60,
    'Â': 0.62, 'Ê': 0.55, 'Ô': 0.62, 'Ç': 0.60,
  };
  const defaultCharWidth = 0.58;

  function estimateTextWidth(text, fontSize) {
    let width = 0;
    for (const char of text.toUpperCase()) {
      width += (charWidths[char] || defaultCharWidth) * fontSize;
    }
    width += (text.length - 1) * 2; // letter-spacing
    return width;
  }

  function findFontSize(text, targetWidth) {
    let lo = 10, hi = 500, best = 60;
    for (let iter = 0; iter < 30; iter++) {
      const mid = (lo + hi) / 2;
      const w = estimateTextWidth(text, mid);
      if (w < targetWidth) { best = mid; lo = mid; }
      else { hi = mid; }
    }
    return Math.floor(best);
  }

  // Calculate ideal font sizes for each line (no cap)
  const idealSizes = textLines.map(t => findFontSize(t.trim().toUpperCase(), targetFillWidth));
  console.log('Ideal font sizes:', idealSizes.join(', '));

  // Cap max font size to prevent vertical overflow
  // Max = textAreaHeight / numLines / capsHeightFactor — ensures vertical fit
  const capsHeightFactor = 0.75;
  const lineGapFactor = 0.08;
  const maxFontSize = Math.floor(textAreaHeight / textLines.length / capsHeightFactor * 0.92);
  console.log(`Max font size cap: ${maxFontSize}px`);

  const cappedSizes = idealSizes.map(fs => Math.min(fs, maxFontSize));

  // Calculate total height with capped sizes + shadow clearance
  const shadowClearance = shadowDepth * 2.5;
  const totalCappedHeight = cappedSizes.reduce((sum, fs) => sum + fs * (capsHeightFactor + lineGapFactor), 0) + shadowClearance;

  // Scale down if still too tall
  let scale = 1.0;
  if (totalCappedHeight > textAreaHeight) {
    scale = textAreaHeight / totalCappedHeight;
    console.log(`Scale factor: ${scale.toFixed(3)} (total ${Math.round(totalCappedHeight)}px > area ${Math.round(textAreaHeight)}px)`);
  }

  const fontSizes = cappedSizes.map(fs => Math.floor(fs * scale));

  // Report fill percentages
  for (let i = 0; i < textLines.length; i++) {
    const text = textLines[i].trim().toUpperCase();
    const fillWidth = estimateTextWidth(text, fontSizes[i]);
    const fillPct = (fillWidth / targetFillWidth * 100).toFixed(0);
    console.log(`  "${text}": ${fontSizes[i]}px → ${Math.round(fillWidth)}px / ${Math.round(targetFillWidth)}px = ${fillPct}% fill`);
  }
  console.log('Final font sizes:', fontSizes.join(', '));

  const fontFamily = "'Impact', 'Arial Black', 'Helvetica Neue', sans-serif";

  // Step 5: Build SVG with text layers
  // Calculate vertical positions based on actual font sizes
  const totalHeight = fontSizes.reduce((sum, fs) => sum + fs * (capsHeightFactor + lineGapFactor), 0);
  const startY = textAreaTop + (textAreaHeight - totalHeight) / 2; // center vertically

  let svgLines = '';
  let currentY = startY;

  for (let i = 0; i < textLines.length; i++) {
    const text = textLines[i].trim().toUpperCase();
    const finalFontSize = fontSizes[i];
    const lineHeight = finalFontSize * capsHeightFactor;

    // Baseline position
    currentY += lineHeight;
    const y = currentY;
    const x = card.left + cardW / 2;

    console.log(`Line "${text}": fontSize=${finalFontSize}px, y=${Math.round(y)}`);

    // 3D block shadow layers (from back to front)
    // Scale shadow depth with font size
    const lineShadowDepth = Math.max(6, Math.round(shadowDepth * (finalFontSize / 150)));
    for (let s = lineShadowDepth; s >= 1; s--) {
      const t = s / lineShadowDepth;
      const r1 = parseInt(shadowColor1.slice(1, 3), 16);
      const g1 = parseInt(shadowColor1.slice(3, 5), 16);
      const b1 = parseInt(shadowColor1.slice(5, 7), 16);
      const r2 = parseInt(shadowColor2.slice(1, 3), 16);
      const g2 = parseInt(shadowColor2.slice(3, 5), 16);
      const b2 = parseInt(shadowColor2.slice(5, 7), 16);
      const r = Math.round(r1 + (r2 - r1) * t);
      const g = Math.round(g1 + (g2 - g1) * t);
      const b = Math.round(b1 + (b2 - b1) * t);
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

      const ox = s * 2.0;
      const oy = s * 2.0;
      svgLines += `<text x="${x + ox}" y="${y + oy}" font-family="${fontFamily}" font-size="${finalFontSize}" font-weight="900" fill="${hex}" text-anchor="middle" letter-spacing="2">${escapeXml(text)}</text>\n`;
    }

    // Main text with dark outline
    svgLines += `<text x="${x}" y="${y}" font-family="${fontFamily}" font-size="${finalFontSize}" font-weight="900" fill="${textColor}" stroke="#111111" stroke-width="${strokeWidth}" paint-order="stroke" text-anchor="middle" letter-spacing="2">${escapeXml(text)}</text>\n`;

    // Add gap after this line
    currentY += finalFontSize * lineGapFactor;
  }

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
${svgLines}
</svg>`;

  console.log('Generating text overlay SVG...');
  const textOverlay = await sharp(Buffer.from(svg)).png().toBuffer();

  // Step 6: Composite text onto background
  console.log('Compositing: bg + black border + text...');
  const result = await sharp(bgOnBlack)
    .composite([
      { input: textOverlay, top: 0, left: 0, blend: 'over' }
    ])
    .png()
    .toBuffer();

  writeFileSync(outputPath, result);
  console.log(`Output: ${outputPath}`);
  console.log('Done! Next step: apply grain with add-grain.mjs');
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
