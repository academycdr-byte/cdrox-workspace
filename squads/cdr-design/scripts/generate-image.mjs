#!/usr/bin/env node

/**
 * CDR Design Squad — Gemini Image Generator (Nano Banana)
 *
 * Gera imagens via Gemini API usando prompt otimizado.
 * Nao precisa de npm install — usa fetch nativo do Node 18+.
 *
 * Uso:
 *   node generate-image.mjs "prompt" [--output path] [--model id] [--aspect ratio]
 *
 * Exemplos:
 *   node generate-image.mjs "Post Instagram dark theme com titulo em verde neon"
 *   node generate-image.mjs "Carrossel slide 1" --output ./output/slide-1.png
 *   node generate-image.mjs "Feed post" --aspect 1:1
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Config ---
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_CHAIN = [
  'gemini-3-pro-image-preview',
  'gemini-3.1-flash-image-preview',
  'gemini-2.5-flash-image',
];
const DEFAULT_MODEL = process.env.GEMINI_MODEL || '';

// --- Parse args ---
const args = process.argv.slice(2);
let prompt = '';
let outputPath = '';
let model = DEFAULT_MODEL;
let aspect = '';
let refImages = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--output' && args[i + 1]) {
    outputPath = args[++i];
  } else if (args[i] === '--model' && args[i + 1]) {
    model = args[++i];
  } else if (args[i] === '--aspect' && args[i + 1]) {
    aspect = args[++i];
  } else if (args[i] === '--ref' && args[i + 1]) {
    refImages.push(args[++i]);
  } else {
    prompt += (prompt ? ' ' : '') + args[i];
  }
}

// --- Validation ---
if (!API_KEY) {
  console.error('ERROR: GEMINI_API_KEY nao configurada.');
  console.error('Adicione sua chave no arquivo .env:');
  console.error('  GEMINI_API_KEY=sua-chave-aqui');
  process.exit(1);
}

if (!prompt) {
  console.error('ERROR: Nenhum prompt fornecido.');
  console.error('Uso: node generate-image.mjs "seu prompt aqui" [--output path]');
  process.exit(1);
}

// --- Default output path ---
if (!outputPath) {
  const outputDir = join(__dirname, '..', 'output');
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  outputPath = join(outputDir, `cdr-${timestamp}.png`);
}

// Ensure output directory exists
const outDir = dirname(outputPath);
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// --- Build aspect ratio instruction ---
const aspectMap = {
  '1:1': '1080x1080 pixels (square Instagram feed post)',
  '4:5': '1080x1350 pixels (portrait Instagram feed post)',
  '9:16': '1080x1920 pixels (Instagram stories/reels)',
  '16:9': '1920x1080 pixels (landscape/YouTube thumbnail)',
};

let aspectInstruction = '';
if (aspect && aspectMap[aspect]) {
  aspectInstruction = `\n\nIMPORTANT: Generate the image at ${aspectMap[aspect]} aspect ratio.`;
} else if (aspect) {
  aspectInstruction = `\n\nIMPORTANT: Generate the image at ${aspect} aspect ratio.`;
}

const fullPrompt = prompt + aspectInstruction;

// --- Call Gemini API ---
console.log(`Gerando imagem com ${model}...`);
console.log(`Prompt: ${prompt.slice(0, 100)}${prompt.length > 100 ? '...' : ''}`);
if (aspect) console.log(`Aspect ratio: ${aspect}`);
if (refImages.length) console.log(`Referencias: ${refImages.join(', ')}`);

// --- Build parts (reference images + text) ---
const parts = [];

for (const refImage of refImages) {
  if (existsSync(refImage)) {
    const imgBuffer = readFileSync(refImage);
    const ext = extname(refImage).toLowerCase();
    const mimeMap = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
    const mimeType = mimeMap[ext] || 'image/jpeg';
    parts.push({
      inlineData: {
        mimeType,
        data: imgBuffer.toString('base64'),
      },
    });
    console.log(`Ref carregada: ${refImage} (${(imgBuffer.length / 1024).toFixed(0)}KB)`);
  }
}

parts.push({ text: fullPrompt });

const requestBody = JSON.stringify({
  contents: [{ parts }],
  generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
});

// --- Fallback chain: try best model first ---
const modelsToTry = (model || DEFAULT_MODEL) ? [model || DEFAULT_MODEL] : MODEL_CHAIN;
let apiData = null;
let usedModel = '';

for (const modelName of modelsToTry) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
  const timeout = modelName.includes('pro') ? 90_000 : 60_000;
  console.log(`Tentando ${modelName} (timeout ${timeout / 1000}s)...`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
      signal: AbortSignal.timeout(timeout),
    });

    if (response.status === 503) {
      console.log(`  ${modelName}: 503 (alta demanda), tentando proximo...`);
      continue;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`  ${modelName}: HTTP ${response.status}, tentando proximo...`);
      continue;
    }

    const data = await response.json();
    if (data.candidates?.[0]?.content?.parts) {
      apiData = data;
      usedModel = modelName;
      break;
    }
    console.log(`  ${modelName}: resposta sem conteudo, tentando proximo...`);
  } catch (e) {
    const reason = e.name === 'TimeoutError' ? 'timeout' : e.message;
    console.log(`  ${modelName}: ${reason}, tentando proximo...`);
    continue;
  }
}

if (!apiData) {
  console.error('ERRO: Nenhum modelo Gemini conseguiu gerar imagem.');
  console.error(`Modelos tentados: ${modelsToTry.join(', ')}`);
  process.exit(1);
}

console.log(`Modelo usado: ${usedModel}`);

try {
  // --- Extract images and text ---
  let imageCount = 0;
  let textResponse = '';

  for (const part of apiData.candidates[0].content.parts) {
    if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, 'base64');
      const mimeType = part.inlineData.mimeType || 'image/png';
      const ext = mimeType.includes('jpeg') || mimeType.includes('jpg') ? 'jpg' : 'png';

      const imgPath =
        imageCount === 0
          ? outputPath
          : outputPath.replace(/\.(png|jpg)$/i, `-${imageCount + 1}.$1`);

      writeFileSync(imgPath, buffer);
      imageCount++;
      console.log(`Imagem salva: ${imgPath}`);
    } else if (part.text) {
      textResponse += part.text;
    }
  }

  if (textResponse) {
    console.log(`\nResposta do Gemini:\n${textResponse}`);
  }

  if (imageCount === 0) {
    console.error('Nenhuma imagem gerada. Resposta completa:');
    console.error(JSON.stringify(apiData, null, 2));
    process.exit(1);
  }

  console.log(`\nTotal: ${imageCount} imagem(ns) gerada(s) com sucesso.`);
} catch (error) {
  if (error.code === 'ENOTFOUND' || error.cause?.code === 'ENOTFOUND') {
    console.error('ERROR: Sem conexao com a internet.');
  } else {
    console.error('ERROR:', error.message);
  }
  process.exit(1);
}
