#!/usr/bin/env node

/**
 * Gemini Image Generation — Site Showcase
 *
 * Sends reference image + client assets to Gemini
 * and generates a visually similar composition.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'output');

// Load .env
const envPath = join(__dirname, '..', '..', '..', '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) process.env[match[1]] = match[2].trim();
  }
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY not found in .env');
  process.exit(1);
}

// Models to try (in order of preference for image generation)
const MODELS = [
  'gemini-2.0-flash-exp-image-generation',
];

// Iteration counter
const ITERATION = parseInt(process.argv[2] || '1');

async function loadImage(path, maxWidth = 1400) {
  console.log(`Loading: ${path}`);
  const buffer = readFileSync(path);
  const base64 = buffer.toString('base64');
  const isJpeg = path.toLowerCase().endsWith('.jpeg') || path.toLowerCase().endsWith('.jpg');
  return {
    inlineData: {
      mimeType: isJpeg ? 'image/jpeg' : 'image/png',
      data: base64,
    }
  };
}

async function generateWithModel(modelId, parts) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${API_KEY}`;

  console.log(`\nTrying model: ${modelId}`);

  const body = {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      temperature: 0.2,
    },
  };

  // Note: aspectRatio not supported in generationConfig for this endpoint

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err.substring(0, 500)}`);
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0]) {
    throw new Error(`No candidates in response: ${JSON.stringify(data).substring(0, 500)}`);
  }

  const candidate = data.candidates[0];

  if (candidate.finishReason === 'IMAGE_SAFETY') {
    throw new Error('Image blocked by safety filter');
  }

  const imagePart = candidate.content?.parts?.find(p => p.inlineData);
  const textPart = candidate.content?.parts?.find(p => p.text);

  if (textPart) {
    console.log(`Gemini says: ${textPart.text.substring(0, 200)}`);
  }

  if (!imagePart) {
    throw new Error(`No image in response. Parts: ${JSON.stringify(candidate.content?.parts?.map(p => Object.keys(p)))}`);
  }

  return imagePart.inlineData;
}

async function main() {
  const refPath = 'C:/Users/User/Downloads/projeto2.png';
  const logoPath = 'C:/Users/User/Downloads/472524377_1273215657242527_50156.png';
  const sitePath = 'C:/Users/User/Downloads/WhatsApp Image 2026-03-08 at 16.45.37.jpeg';

  // Check files exist
  for (const p of [refPath, logoPath, sitePath]) {
    if (!existsSync(p)) {
      console.error(`File not found: ${p}`);
      process.exit(1);
    }
  }

  // Load images
  const refImg = await loadImage(refPath);
  const logoImg = await loadImage(logoPath);
  const siteImg = await loadImage(sitePath);

  const prompt = `Edit Image 1 by making ONLY these two changes — keep EVERYTHING else identical:

1. REPLACE the website shown inside the browser mockup with the website from Image 2 (Bezutt's Sports e-commerce with football players). The new website must fill the exact same browser frame area.

2. REPLACE the logo inside BOTH glass spheres (the 3 horizontal bars logo) with the logo from Image 3 (white "B" with lightning bolt on purple). The new logo must appear as a 3D hologram inside the spheres, just like the original logo does.

DO NOT change ANYTHING else: keep the exact same background, glass spheres, metallic ribbons, glow effects, browser frame, teal glow line, purple ambient lighting, composition, and widescreen format. The output must look identical to Image 1 except with the new website and new logo.

Image 1 = Original showcase image (the template to edit)
Image 2 = New website screenshot to place inside the browser
Image 3 = New logo to place inside both glass spheres`;

  const parts = [
    { text: prompt },
    refImg,
    siteImg,
    logoImg,
  ];

  let result = null;
  let successModel = null;

  for (const model of MODELS) {
    try {
      result = await generateWithModel(model, parts);
      successModel = model;
      break;
    } catch (err) {
      console.error(`Model ${model} failed: ${err.message}`);
      continue;
    }
  }

  if (!result) {
    console.error('\nAll models failed. Exiting.');
    process.exit(1);
  }

  // Save the generated image
  const ext = result.mimeType?.includes('png') ? 'png' : 'png';
  const outputPath = join(OUTPUT_DIR, `bezutt-gemini-showcase-v${ITERATION}.${ext}`);
  const imageBuffer = Buffer.from(result.data, 'base64');
  writeFileSync(outputPath, imageBuffer);

  console.log(`\nSuccess! Model: ${successModel}`);
  console.log(`Image saved to: ${outputPath}`);
  console.log(`Size: ${(imageBuffer.length / 1024).toFixed(0)} KB`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
