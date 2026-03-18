#!/usr/bin/env node

/**
 * CDR Design Squad — Create Post (One Command)
 *
 * Gera post Instagram completo em 1 comando.
 * Pipeline: Gemini API + grain + upscale -> pronto pra postar.
 *
 * Formatos:
 *   Feed post:    1080x1350 (4:5) — padrao
 *   Reels cover:  1080x1920 (9:16) — com --reels
 *
 * Uso:
 *   node create-post.mjs "DADOS|FALAM.|FEELING|NAO."
 *   node create-post.mjs "RESULTADO|FALA.|GURU|NAO." --output meu-post.png
 *   node create-post.mjs "VALIDADO|NO CAMPO.|NAO NO|SLIDE." --grain 120
 *   node create-post.mjs "SUA LOJA|COM O|TEMA|CDR GROUP🥇" --reels
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'output');
const DEFAULT_REF = join(__dirname, '..', 'data', 'style-ref', 'ivan-approved-style.png');
const EMOJI_DIR = join(__dirname, '..', 'assets', 'emojis');
const EMOJI_MAP_PATH = join(EMOJI_DIR, 'emoji-map.json');

// --- Load .env ---
try {
  const envPath = join(__dirname, '..', '..', '..', '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const val = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
} catch {}

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-3-pro-image-preview';

// --- Parse args ---
const args = process.argv.slice(2);
let textInput = '';
let outputPath = '';
let grainIntensity = 100;
let vignetteStrength = 0.80;
let warmth = 20;
let skipGrain = false;
let skipUpscale = false;
let customRef = '';
let reelsMode = false;
let logoPath = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--output' && args[i + 1]) outputPath = args[++i];
  else if (args[i] === '--grain' && args[i + 1]) grainIntensity = parseInt(args[++i]);
  else if (args[i] === '--vignette' && args[i + 1]) vignetteStrength = parseFloat(args[++i]);
  else if (args[i] === '--warmth' && args[i + 1]) warmth = parseInt(args[++i]);
  else if (args[i] === '--no-grain') skipGrain = true;
  else if (args[i] === '--no-upscale') skipUpscale = true;
  else if (args[i] === '--ref' && args[i + 1]) customRef = args[++i];
  else if (args[i] === '--reels') reelsMode = true;
  else if (args[i] === '--logo' && args[i + 1]) logoPath = args[++i];
  else if (!textInput) textInput = args[i];
}

// Format config based on mode
const FORMAT = reelsMode
  ? { width: 1080, height: 1920, ratio: '9:16', label: 'Reels cover', prefix: 'cdr-reels' }
  : { width: 1080, height: 1350, ratio: '4:5', label: 'Feed post', prefix: 'cdr-post' };

if (!textInput) {
  console.log(`
  CDR Design — Criar Post Instagram

  Uso:
    node create-post.mjs "LINHA1|LINHA2|LINHA3|LINHA4"

  Exemplos:
    node create-post.mjs "RESULTADO|FALA.|GURU|NAO."
    node create-post.mjs "DADOS|FALAM.|FEELING|NAO."
    node create-post.mjs "VALIDADO|NO CAMPO.|NAO NO|SLIDE."
    node create-post.mjs "CONSTANCIA|E DADOS|GERAM|RESULTADO."

  Opcoes:
    --reels                 Gera capa de Reels 1080x1920 (9:16) com safe zone
    --output meu-post.png   Define o arquivo de saida
    --grain 120             Intensidade do grain (padrao: 100)
    --no-grain              Pula o grain
    --no-upscale            Mantem resolucao original
    --ref imagem.png        Usa referencia customizada
  `);
  process.exit(0);
}

if (!API_KEY) {
  console.error('ERRO: GEMINI_API_KEY nao encontrada.');
  console.error('Configure no arquivo .env na raiz do projeto.');
  process.exit(1);
}

// --- Setup ---
const lines = textInput.split('|').map(s => s.trim().toUpperCase());
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const slug = lines[0].toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);

if (!outputPath) {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
  outputPath = join(OUTPUT_DIR, `${FORMAT.prefix}-${slug}-${timestamp}.png`);
}

const refImage = customRef || DEFAULT_REF;
if (!existsSync(refImage)) {
  console.error(`ERRO: Referencia nao encontrada: ${refImage}`);
  process.exit(1);
}

// --- Detect emojis & load Apple references ---
function loadEmojiMap() {
  try {
    if (existsSync(EMOJI_MAP_PATH)) {
      return JSON.parse(readFileSync(EMOJI_MAP_PATH, 'utf8'));
    }
  } catch {}
  return {};
}

function detectEmojis(text) {
  const emojiMap = loadEmojiMap();
  const found = [];
  for (const [emoji, info] of Object.entries(emojiMap)) {
    if (text.includes(emoji)) {
      const pngPath = join(EMOJI_DIR, info.file);
      if (existsSync(pngPath)) {
        found.push({ emoji, ...info, path: pngPath });
      }
    }
  }
  return found;
}

const detectedEmojis = detectEmojis(textInput);

// --- Build prompt ---
const lineDescriptions = lines.map((l, i) => `  Line ${i + 1}: ${l}`).join('\n');

const styleBlock = `STYLE TO COPY EXACTLY:
- CONDENSED angular bold font (Impact/Dharma Gothic style — tall, narrow, sharp corners, NOT rounded or bubbly)
- THICK dark green outline/stroke (4-6px) around every letter
- Warm cream/off-white text fill color
- Deep SOLID BLACK block shadow behind each letter, offset 8-10px to bottom-right (hard edges, no blur)
- Dark moody green gradient background (smooth flow from near-black top-left to bright lime bottom-right)
- Heavy vintage film grain texture across entire image
- Strong dark vignette on corners (especially top-left)
- Rounded card frame with dark border, pure black outside`;

const emojiBlock = detectedEmojis.length > 0 ? `

EMOJI RENDERING — CRITICAL:
${detectedEmojis.map(e => `The "${e.emoji}" (${e.name}) MUST look EXACTLY like the provided Apple iOS emoji reference image — ${e.desc}. Match the Apple iOS emoji style precisely: same colors, same 3D shading, same proportions. Do NOT use a flat/cartoon style, it MUST be the photorealistic Apple iOS style as shown in the reference.`).join('\n')}

EMOJI PLACEMENT RULES (NON-NEGOTIABLE):
- Each emoji must be placed AFTER the last letter/character on its line, with a CLEAR GAP (at least 15-20px spacing) between the last letter and the emoji.
- The emoji MUST NOT overlap, touch, or be inside any letter. It sits NEXT TO the text, never ON TOP of it.
- The emoji should be sized proportionally to the text (roughly 80-90% of the text line height).
- The emoji is a SEPARATE element from the text — treat it like a standalone icon floating beside the word.` : '';

const logoBlock = (logoPath && existsSync(logoPath)) ? `

LOGO — CRITICAL:
A logo image is provided as reference. Place it centered below the main text block, sized at roughly 20-25% of the card width. The logo MUST receive the EXACT SAME text treatment as the headline letters:
- SAME thick dark green outline/stroke (4-6px) around the logo shape
- SAME solid black block shadow behind the logo, offset 8-10px to bottom-right (hard edges, no blur)
- SAME warm cream/off-white fill if applicable
The logo must look like it belongs to the same typographic system as the text — same weight, same depth, same 3D effect. Do NOT leave the logo flat or without effects.
The logo should be sized at roughly the same height as one line of text — it is a MAJOR visual element, not a small watermark.` : '';

const prompt = reelsMode
  ? `Look at this reference image. Copy ONLY the visual style (font, colors, shadows, gradient, grain, layout) on a taller 9:16 canvas for a Reels cover. The text in the reference image is IRRELEVANT — COMPLETELY IGNORE any words/letters visible in the reference. Generate ONLY the text I specify below. If the image you generate contains ANY word not listed below, it is WRONG.

${styleBlock}

TEXT — EXACTLY ${lines.length} lines, each fills 95% of card width (SAME sizing as the reference):
${lineDescriptions}

ABSOLUTE RULE — TEXT ACCURACY: The image MUST contain ONLY the ${lines.length} lines listed above. Do NOT add, invent, or copy any text from the reference image. Every word in the output MUST match the text above EXACTLY — no extra words, no missing words, no substitutions.

CRITICAL SAFE ZONE RULES — Instagram will center-crop this to a SQUARE on the profile grid:
- Canvas is 1080x1920 (9:16 portrait)
- The CENTER 1080x1080 area (from y=420 to y=1500) is the VISIBLE ZONE on the profile grid
- ALL text, emojis, @handle, logo, and CTA MUST be INSIDE this center square
- Top 420px = background only (dark gradient, no content)
- Bottom 420px = background only (dark gradient, no content)
- Text block fills 80-85% of the center square height (same density as reference)
- @cdrgroup.assessoria — inside center square, top-left
- C in circle — inside center square, top-right
- CONTEUDO AO LADO with arrow — inside center square, bottom-left
- Per-line sizing is CRITICAL: each line must fill the same 95% width regardless of character count

UNIFORM WIDTH RULE — THIS IS THE MOST IMPORTANT RULE:
Every single line of text MUST span the EXACT SAME horizontal width (approximately 95% of the card width). If one line has fewer characters (e.g. "CASE" vs "NOSSO"), you MUST increase that line's font-size/letter-spacing/horizontal scale so it stretches to match the width of the other lines. Think of it like a justified text block where every line is stretched to the same left-right edges. NO line should appear narrower than any other line. This is NON-NEGOTIABLE.

IMPORTANT: Generate at exactly 1080x1920 pixels. Imagine the reference image placed in the center of a taller canvas with matching gradient extending above and below.${emojiBlock}${logoBlock}`
  : `Look at this reference image. Copy ONLY the visual style (font, colors, shadows, gradient, grain, layout). The text in the reference image is IRRELEVANT — COMPLETELY IGNORE any words/letters visible in the reference. Generate ONLY the text I specify below. If the image you generate contains ANY word not listed below, it is WRONG.

${styleBlock}
- Text fills 80-85% of the card height vertically

TEXT — EXACTLY ${lines.length} lines, each fills 95% of card width:
${lineDescriptions}

ABSOLUTE RULE #1 — TEXT ACCURACY: The image MUST contain ONLY the ${lines.length} lines listed above. Do NOT add, invent, or copy any text from the reference image. Every word in the output MUST match the text above EXACTLY — no extra words, no missing words, no substitutions.

ABSOLUTE RULE #2 — LINE COUNT: The text has EXACTLY ${lines.length} visual lines. If a line contains multiple words (e.g. "MAIOR CASE"), ALL words MUST stay on the SAME single line — NEVER break a line into two. Shrink the font size for that line if needed to fit, but keep all words together on one line. The number of visual text lines MUST equal exactly ${lines.length}.

LAYOUT (same as reference):
- @cdrgroup.assessoria (top-left, small white)
- C in circle (top-right, small white)
- CONTEUDO AO LADO with arrow (bottom-left, small white with arrow circle)

Per-line sizing is CRITICAL: each line must fill the same 95% width regardless of character count.

UNIFORM WIDTH RULE — THIS IS THE MOST IMPORTANT RULE:
Every single line of text MUST span the EXACT SAME horizontal width (approximately 95% of the card width). If one line has fewer characters (e.g. "CASE" vs "NOSSO"), you MUST increase that line's font-size/letter-spacing/horizontal scale so it stretches to match the width of the other lines. Think of it like a justified text block where every line is stretched to the same left-right edges. NO line should appear narrower than any other line. This is NON-NEGOTIABLE.

IMPORTANT: Generate at 1080x1350 pixels (portrait Instagram 4:5) aspect ratio.${emojiBlock}${logoBlock}`;

// --- Grain generator (inline) ---
function generateGrainBuffer(width, height, intensity, warmthVal) {
  const channels = 4;
  const buf = Buffer.alloc(width * height * channels);
  let seed1 = 42, seed2 = 137, seed3 = 2903;
  function rand1() { seed1 = (seed1 * 16807) % 2147483647; return seed1 / 2147483647; }
  function rand2() { seed2 = (seed2 * 48271) % 2147483647; return seed2 / 2147483647; }
  function rand3() { seed3 = (seed3 * 69621) % 2147483647; return seed3 / 2147483647; }

  const bw = Math.ceil(width / 3), bh = Math.ceil(height / 3);
  const coarseGrain = new Float32Array(bw * bh);
  for (let i = 0; i < coarseGrain.length; i++) coarseGrain[i] = (rand2() - 0.5) * intensity * 0.7;

  const mw = Math.ceil(width / 2), mh = Math.ceil(height / 2);
  const medGrain = new Float32Array(mw * mh);
  for (let i = 0; i < medGrain.length; i++) medGrain[i] = (rand3() - 0.5) * intensity * 0.4;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const fine = (rand1() - 0.5) * intensity * 0.6;
      const coarse = coarseGrain[Math.floor(y / 3) * bw + Math.floor(x / 3)];
      const med = medGrain[Math.floor(y / 2) * mw + Math.floor(x / 2)];
      const combined = fine + coarse + med;

      buf[idx] = Math.max(0, Math.min(255, 128 + combined + warmthVal * 0.5));
      buf[idx + 1] = Math.max(0, Math.min(255, 128 + combined + warmthVal * 0.15));
      buf[idx + 2] = Math.max(0, Math.min(255, 128 + combined - warmthVal * 0.35));
      buf[idx + 3] = Math.min(255, Math.abs(combined) * 1.5 + 15);
    }
  }
  return buf;
}

function generateVignetteBuffer(width, height, strength) {
  const channels = 4;
  const buf = Buffer.alloc(width * height * channels);
  const cx = width * 0.50, cy = height * 0.45;
  const clearRadius = Math.min(width, height) * 0.40;
  const maxDist = Math.sqrt(width * width + height * height) * 0.55;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const normalDist = Math.max(0, (dist - clearRadius)) / (maxDist - clearRadius);
      let alpha = Math.pow(normalDist, 1.8) * strength;

      const tlDist = Math.sqrt(x * x + y * y) / (width * 0.65);
      alpha = Math.min(1, alpha + Math.max(0, 1 - tlDist) * strength * 0.35);
      const trDist = Math.sqrt((width - x) ** 2 + y ** 2) / (width * 0.75);
      alpha = Math.min(1, alpha + Math.max(0, 1 - trDist) * strength * 0.15);

      buf[idx] = 0; buf[idx + 1] = 0; buf[idx + 2] = 0;
      buf[idx + 3] = Math.round(alpha * 255);
    }
  }
  return buf;
}

// --- Main ---
async function main() {
  console.log('');
  console.log(`=== CDR Design — ${FORMAT.label} ===`);
  console.log('');
  console.log(`Formato: ${FORMAT.width}x${FORMAT.height} (${FORMAT.ratio})`);
  console.log(`Texto: ${lines.join(' | ')}`);
  console.log(`Linhas: ${lines.length}`);
  console.log('');

  // Step 1: Call Gemini API
  console.log('[1/3] Gerando imagem com Gemini...');

  const imgBuffer = readFileSync(refImage);
  const ext = extname(refImage).toLowerCase();
  const mimeMap = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
  const mimeType = mimeMap[ext] || 'image/png';

  const parts = [
    { inlineData: { mimeType, data: imgBuffer.toString('base64') } },
  ];

  // Add logo reference image
  if (logoPath && existsSync(logoPath)) {
    console.log(`   Logo: ${logoPath}`);
    const logoBuffer = readFileSync(logoPath);
    const logoExt = extname(logoPath).toLowerCase();
    const logoMime = mimeMap[logoExt] || 'image/png';
    parts.push({ inlineData: { mimeType: logoMime, data: logoBuffer.toString('base64') } });
  }

  // Add Apple emoji reference images
  if (detectedEmojis.length > 0) {
    console.log(`   Emojis detectados: ${detectedEmojis.map(e => `${e.emoji} (${e.name})`).join(', ')}`);
    for (const emojiInfo of detectedEmojis) {
      const emojiBuffer = readFileSync(emojiInfo.path);
      parts.push({ inlineData: { mimeType: 'image/png', data: emojiBuffer.toString('base64') } });
    }
  }

  parts.push({ text: prompt });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`ERRO Gemini API (${response.status}):`, errText.slice(0, 200));
    process.exit(1);
  }

  const data = await response.json();
  let rawImageBuffer = null;

  for (const part of (data.candidates?.[0]?.content?.parts || [])) {
    if (part.inlineData) {
      rawImageBuffer = Buffer.from(part.inlineData.data, 'base64');
      break;
    }
  }

  if (!rawImageBuffer) {
    console.error('ERRO: Gemini nao retornou imagem.');
    process.exit(1);
  }
  console.log('   OK!');

  // Step 2: Apply grain
  let processedBuffer;
  if (!skipGrain) {
    console.log(`[2/3] Aplicando grain (${grainIntensity}) + vinheta (${vignetteStrength})...`);
    const meta = await sharp(rawImageBuffer).metadata();
    const { width, height } = meta;

    const grainBuf = generateGrainBuffer(width, height, grainIntensity, warmth);
    const vignetteBuf = generateVignetteBuffer(width, height, vignetteStrength);

    const grainOverlay = await sharp(grainBuf, { raw: { width, height, channels: 4 } }).png().toBuffer();
    const vignetteOverlay = await sharp(vignetteBuf, { raw: { width, height, channels: 4 } }).png().toBuffer();

    processedBuffer = await sharp(rawImageBuffer)
      .composite([
        { input: grainOverlay, blend: 'overlay', top: 0, left: 0 },
        { input: vignetteOverlay, blend: 'over', top: 0, left: 0 },
      ])
      .png()
      .toBuffer();
    console.log('   OK!');
  } else {
    processedBuffer = rawImageBuffer;
    console.log('[2/3] Grain pulado.');
  }

  // Step 3: Upscale to target format
  if (!skipUpscale) {
    console.log(`[3/3] Upscaling para ${FORMAT.width}x${FORMAT.height}...`);
    const finalBuffer = await sharp(processedBuffer)
      .resize(FORMAT.width, FORMAT.height, { fit: 'cover', position: 'center' })
      .png()
      .toBuffer();
    writeFileSync(outputPath, finalBuffer);
    console.log('   OK!');
  } else {
    writeFileSync(outputPath, processedBuffer);
    console.log('[3/3] Upscale pulado.');
  }

  console.log('');
  console.log(`Pronto! Imagem salva em:`);
  console.log(`  ${outputPath}`);
  console.log('');
  console.log(`${FORMAT.width}x${FORMAT.height} — Instagram ${FORMAT.label} (${FORMAT.ratio})`);
}

main().catch(err => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
