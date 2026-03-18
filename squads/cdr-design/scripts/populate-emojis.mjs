#!/usr/bin/env node

/**
 * CDR Design Squad — Populate Emoji Library
 *
 * Reads emoji-datasource-apple and populates:
 *   - assets/emojis/ with individual Apple PNG files (64px)
 *   - assets/emojis/emoji-map.json with full mapping
 *
 * Usage:
 *   node squads/cdr-design/scripts/populate-emojis.mjs
 *
 * Skips: skin tone variations, Component category
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EMOJI_DIR = join(__dirname, '..', 'assets', 'emojis');
const SOURCE_DIR = join(__dirname, '..', '..', '..', 'node_modules', 'emoji-datasource-apple');
const IMG_DIR = join(SOURCE_DIR, 'img', 'apple', '64');
const DATA_PATH = join(SOURCE_DIR, 'emoji.json');
const MAP_PATH = join(EMOJI_DIR, 'emoji-map.json');

// Convert unified code (e.g. "1F525") to emoji character
function unifiedToEmoji(unified) {
  return unified.split('-').map(cp => String.fromCodePoint(parseInt(cp, 16))).join('');
}

// Build a human-readable description from name
function buildDesc(name, category, subcategory) {
  const cleanName = name.toLowerCase().replace(/_/g, ' ');
  return `${cleanName}, ${subcategory || category}, Apple iOS photorealistic 3D style`;
}

console.log('=== CDR Design — Populate Emoji Library ===\n');

// Load emoji data
const emojiData = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
console.log(`Emoji data loaded: ${emojiData.length} entries`);

// Ensure output dir exists
if (!existsSync(EMOJI_DIR)) mkdirSync(EMOJI_DIR, { recursive: true });

// Load existing map to preserve custom entries
let existingMap = {};
if (existsSync(MAP_PATH)) {
  try {
    existingMap = JSON.parse(readFileSync(MAP_PATH, 'utf8'));
    console.log(`Existing map loaded: ${Object.keys(existingMap).length} entries`);
  } catch {}
}

const newMap = {};
let copied = 0;
let skipped = 0;
let noImage = 0;

for (const emoji of emojiData) {
  // Skip if no Apple image
  if (!emoji.has_img_apple) { noImage++; continue; }

  // Skip Component category (skin tone modifiers, hair components, etc.)
  if (emoji.category === 'Component') { skipped++; continue; }

  const emojiChar = unifiedToEmoji(emoji.unified);
  const code = emoji.unified.toLowerCase().replace(/-fe0f/g, '').replace(/-/g, '-');
  const shortName = emoji.short_name.replace(/_/g, '-');
  const fileName = emoji.image; // e.g. "1f525.png"
  const srcPath = join(IMG_DIR, fileName);
  const destPath = join(EMOJI_DIR, fileName);

  // Skip if source doesn't exist
  if (!existsSync(srcPath)) { noImage++; continue; }

  // Copy PNG if not already there
  if (!existsSync(destPath)) {
    copyFileSync(srcPath, destPath);
    copied++;
  }

  // Use existing description if we had a custom one, otherwise generate
  if (existingMap[emojiChar]) {
    newMap[emojiChar] = existingMap[emojiChar];
    // Ensure file path is correct
    newMap[emojiChar].file = fileName;
  } else {
    newMap[emojiChar] = {
      file: fileName,
      code: emoji.unified.toLowerCase(),
      name: emoji.short_name.replace(/_/g, ' '),
      desc: buildDesc(emoji.name, emoji.category, emoji.subcategory)
    };
  }
}

// Write new map
writeFileSync(MAP_PATH, JSON.stringify(newMap, null, 2) + '\n');

console.log(`\nResultado:`);
console.log(`  PNGs copiados: ${copied}`);
console.log(`  Skipped (Component): ${skipped}`);
console.log(`  Sem imagem Apple: ${noImage}`);
console.log(`  Total no emoji-map.json: ${Object.keys(newMap).length}`);
console.log(`\nPronto! Todos os emojis Apple iOS estao disponiveis.`);
