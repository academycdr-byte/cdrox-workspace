#!/usr/bin/env node

/**
 * CDR Design Squad — Premium Image Renderer v5
 *
 * BRANDBOOK-DRIVEN render engine com:
 * - 8 templates variados (editorial, composite, bold-statement, data-metrics, etc.)
 * - Decorativos configuraveis (gradient-top, corner-accent, ticker, grid, glow, none)
 * - Footers configuraveis (bar, minimal, none)
 * - Paletas dinamicas (dark, green, split, red, blue, white, custom)
 * - Tipografia dual (DM Serif Display + Plus Jakarta Sans)
 *
 * Uso:
 *   node render-post.mjs --config config.json --output-dir ./output/
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ================================================================
// PALETTES
// ================================================================

const PALETTES = {
  dark: {
    bg: '#08080A', bgAlt: '#0C0C10',
    surface: '#131316', card: '#111114', cardBorder: '#1C1C20',
    primary: '#A8D600', primaryRGB: '168,214,0',
    accent: '#B5E300', accentRGB: '181,227,0',
    text: '#EAEAEA', textBright: '#FFFFFF', textOff: '#D4D4D4',
    textMuted: '#888888', textDim: '#555555',
    hlBg: '#A8D600', hlText: '#08080A',
    footerBg: 'linear-gradient(90deg, #A8D600 0%, #B5E300 100%)', footerText: '#08080A',
    checkBg: '#A8D600', checkText: '#08080A',
    glowRGB: '168,214,0', gridRGB: '168,214,0',
    decoAlpha: '0.20', noiseAlpha: '0.03',
  },
  green: {
    bg: '#1A3500', bgAlt: '#1F3D00',
    surface: 'rgba(0,0,0,0.15)', card: 'rgba(0,0,0,0.20)', cardBorder: 'rgba(168,214,0,0.15)',
    primary: '#C2F000', primaryRGB: '194,240,0',
    accent: '#FFFFFF', accentRGB: '255,255,255',
    text: '#FFFFFF', textBright: '#FFFFFF', textOff: 'rgba(255,255,255,0.92)',
    textMuted: 'rgba(255,255,255,0.65)', textDim: 'rgba(255,255,255,0.35)',
    hlBg: '#08080A', hlText: '#C2F000',
    footerBg: 'rgba(0,0,0,0.30)', footerText: '#FFFFFF',
    checkBg: '#FFFFFF', checkText: '#1A3500',
    glowRGB: '194,240,0', gridRGB: '255,255,255',
    decoAlpha: '0.15', noiseAlpha: '0.025',
  },
  split: {
    bg: '#08080A', bgAlt: '#0C0C10',
    surface: '#131316', card: '#111114', cardBorder: '#1C1C20',
    primary: '#A8D600', primaryRGB: '168,214,0',
    accent: '#B5E300', accentRGB: '181,227,0',
    text: '#EAEAEA', textBright: '#FFFFFF', textOff: '#D4D4D4',
    textMuted: '#888888', textDim: '#555555',
    hlBg: '#A8D600', hlText: '#08080A',
    footerBg: '#A8D600', footerText: '#08080A',
    checkBg: '#A8D600', checkText: '#08080A',
    glowRGB: '168,214,0', gridRGB: '168,214,0',
    decoAlpha: '0.20', noiseAlpha: '0.03',
    splitColor: '#A8D600', splitTextColor: '#08080A',
  },
  red: {
    bg: '#C62828', bgAlt: '#B71C1C',
    surface: 'rgba(0,0,0,0.12)', card: 'rgba(0,0,0,0.18)', cardBorder: 'rgba(255,255,255,0.06)',
    primary: '#FFFFFF', primaryRGB: '255,255,255',
    accent: '#FFCDD2', accentRGB: '255,205,210',
    text: '#FFFFFF', textBright: '#FFFFFF', textOff: 'rgba(255,255,255,0.92)',
    textMuted: 'rgba(255,255,255,0.72)', textDim: 'rgba(255,255,255,0.4)',
    hlBg: 'rgba(0,0,0,0.30)', hlText: '#FFFFFF',
    footerBg: 'rgba(0,0,0,0.20)', footerText: '#FFFFFF',
    checkBg: '#FFFFFF', checkText: '#C62828',
    glowRGB: '255,255,255', gridRGB: '255,255,255',
    decoAlpha: '0.10', noiseAlpha: '0.02',
  },
  blue: {
    bg: '#0D1B2A', bgAlt: '#1B2838',
    surface: '#1B2838', card: '#162232', cardBorder: '#2A3E55',
    primary: '#4FC3F7', primaryRGB: '79,195,247',
    accent: '#81D4FA', accentRGB: '129,212,250',
    text: '#E3F2FD', textBright: '#FFFFFF', textOff: '#BBDEFB',
    textMuted: '#78909C', textDim: '#546E7A',
    hlBg: '#4FC3F7', hlText: '#0D1B2A',
    footerBg: 'linear-gradient(90deg, #4FC3F7 0%, #81D4FA 100%)', footerText: '#0D1B2A',
    checkBg: '#4FC3F7', checkText: '#0D1B2A',
    glowRGB: '79,195,247', gridRGB: '79,195,247',
    decoAlpha: '0.15', noiseAlpha: '0.03',
  },
  white: {
    bg: '#FAFAFA', bgAlt: '#F0F0F0',
    surface: '#FFFFFF', card: '#FFFFFF', cardBorder: '#E0E0E0',
    primary: '#222222', primaryRGB: '34,34,34',
    accent: '#A8D600', accentRGB: '168,214,0',
    text: '#333333', textBright: '#111111', textOff: '#555555',
    textMuted: '#888888', textDim: '#BBBBBB',
    hlBg: '#A8D600', hlText: '#111111',
    footerBg: '#111111', footerText: '#FFFFFF',
    checkBg: '#A8D600', checkText: '#111111',
    glowRGB: '168,214,0', gridRGB: '0,0,0',
    decoAlpha: '0.08', noiseAlpha: '0.015',
  },
};

// ================================================================
// STYLE PRESETS — Estilos visuais completos (Haus-inspired etc.)
// ================================================================

const STYLES = {
  // --- CDR Dark (padrao atual) ---
  'cdr-dark': {
    palette: 'dark',
    font: 'serif',
    extraCSS: '',
  },

  // --- CDR Editorial (inspirado Haus Performance + identidade CDR) ---
  'cdr-editorial': {
    palette: {
      bg: '#F5EDE3', bgAlt: '#EDE4D8',
      surface: '#FFFFFF', card: '#FFFFFF', cardBorder: '#D4C9BB',
      primary: '#0F2B1A', primaryRGB: '15,43,26',
      accent: '#A8D600', accentRGB: '168,214,0',
      text: '#0F2B1A', textBright: '#000000', textOff: '#1A3A2A',
      textMuted: '#6B5E50', textDim: '#9B8E80',
      hlBg: '#A8D600', hlText: '#0F2B1A',
      footerBg: '#0F2B1A', footerText: '#F5EDE3',
      checkBg: '#A8D600', checkText: '#0F2B1A',
      glowRGB: '168,214,0', gridRGB: '15,43,26',
      decoAlpha: '0.06', noiseAlpha: '0.015',
    },
    font: 'editorial',
    extraCSS: `
/* ===== CDR EDITORIAL STYLE (Haus-inspired) ===== */

/* Header brand strip */
.editorial-header-strip {
  position: absolute; top: 0; left: 0; right: 0; z-index: 20;
  display: flex; justify-content: space-between;
  padding: 18px 32px;
  font-family: var(--font-body);
  font-weight: 800; font-size: 11px;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-muted);
}

/* Highlight bar — retangulo solido com texto */
.editorial-bar {
  display: inline;
  background: var(--accent);
  color: var(--primary);
  padding: 4px 16px;
  font-family: var(--font-body);
  font-weight: 800; font-size: 14px;
  letter-spacing: 0.06em; text-transform: uppercase;
  box-decoration-break: clone; -webkit-box-decoration-break: clone;
}

/* Script decorativo no fundo */
.editorial-script-bg {
  position: absolute;
  bottom: 8%; left: -5%;
  z-index: 5;
  font-family: 'DM Serif Display', Georgia, serif;
  font-style: italic;
  font-size: 160px;
  font-weight: 400;
  color: rgba(168, 214, 0, 0.12);
  white-space: nowrap;
  pointer-events: none;
  line-height: 1;
}

/* Overrides para editorial sobre fundo claro */
.slide.editorial-style {
  background: var(--bg);
}
.slide.editorial-style::before {
  background:
    radial-gradient(ellipse 120% 80% at 50% 0%, var(--bg-alt) 0%, transparent 60%),
    linear-gradient(180deg, var(--bg) 0%, var(--bg-alt) 100%);
}
/* Textura papel sutil */
.slide.editorial-style::after {
  opacity: 0.025;
}

/* Headline editorial: serif bold escuro */
.slide.editorial-style h1 {
  color: var(--primary);
  text-shadow: none;
}
.slide.editorial-style h1 .hl {
  background: var(--accent);
  color: var(--primary);
  padding: 2px 14px;
}
.slide.editorial-style h1 .b {
  color: var(--accent);
}

/* Subtitle editorial */
.slide.editorial-style .subtitle {
  color: var(--text-off);
}

/* Checklist panel editorial — fundo branco, borda sutil */
.slide.editorial-style .composite-checklist-panel {
  background: rgba(15, 43, 26, 0.06);
  border: 1px solid rgba(15, 43, 26, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.slide.editorial-style .composite-checklist-panel::before {
  background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 40%);
}
.slide.editorial-style .composite-checklist-panel .checklist li {
  color: var(--text);
}
.slide.editorial-style .composite-checklist-panel .checklist li strong {
  color: var(--text-bright);
}

/* Bottom text editorial */
.slide.editorial-style .composite-bottom p {
  color: var(--text);
}
.slide.editorial-style .composite-bottom p .hl {
  background: var(--accent);
  color: var(--primary);
}

/* Handle editorial */
.slide.editorial-style .composite-handle {
  color: var(--text-muted);
}

/* Device mockup overrides — sombras mais leves no fundo claro */
.slide.editorial-style .mockup-phone {
  box-shadow: -1px -1px 0 0 rgba(212,214,216,0.5), 1px 1px 0 0 rgba(107,109,112,0.5),
    inset 0 0 0 1px #7a7d81,
    0 2px 4px rgba(0,0,0,0.10),
    0 4px 8px rgba(0,0,0,0.08),
    0 8px 16px rgba(0,0,0,0.06),
    0 16px 32px rgba(0,0,0,0.04);
}
.slide.editorial-style .mockup-laptop .mockup-lid {
  box-shadow: 0 2px 4px rgba(0,0,0,0.10),
    0 4px 8px rgba(0,0,0,0.08),
    0 8px 16px rgba(0,0,0,0.06),
    0 16px 32px rgba(0,0,0,0.04);
}

/* Green glow mais sutil no claro */
.slide.editorial-style .composite-devices::before {
  background: radial-gradient(ellipse, rgba(168,214,0,0.04) 0%, transparent 70%);
}
.slide.editorial-style .devices-stack::after {
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.03) 0%, transparent 70%);
}

/* Glow deco adapts */
.slide.editorial-style .bg-layer-glow,
.slide.editorial-style .bg-layer-glow2 {
  opacity: 0.03;
}
`,
  },

  // --- CDR Magazine (variacao editorial — fundo verde escuro + cores quentes) ---
  'cdr-magazine': {
    palette: {
      bg: '#0F2B1A', bgAlt: '#163322',
      surface: 'rgba(0,0,0,0.15)', card: 'rgba(0,0,0,0.20)', cardBorder: 'rgba(168,214,0,0.12)',
      primary: '#F5EDE3', primaryRGB: '245,237,227',
      accent: '#A8D600', accentRGB: '168,214,0',
      text: '#F5EDE3', textBright: '#FFFFFF', textOff: 'rgba(245,237,227,0.88)',
      textMuted: 'rgba(245,237,227,0.55)', textDim: 'rgba(245,237,227,0.35)',
      hlBg: '#A8D600', hlText: '#0F2B1A',
      footerBg: 'rgba(0,0,0,0.25)', footerText: '#F5EDE3',
      checkBg: '#A8D600', checkText: '#0F2B1A',
      glowRGB: '168,214,0', gridRGB: '245,237,227',
      decoAlpha: '0.12', noiseAlpha: '0.02',
    },
    font: 'editorial',
    extraCSS: `
/* ===== CDR MAGAZINE STYLE (verde escuro + creme) ===== */

.editorial-header-strip {
  position: absolute; top: 0; left: 0; right: 0; z-index: 20;
  display: flex; justify-content: space-between;
  padding: 18px 32px;
  font-family: var(--font-body);
  font-weight: 800; font-size: 11px;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-muted);
}

.editorial-bar {
  display: inline;
  background: var(--accent);
  color: #0F2B1A;
  padding: 4px 16px;
  font-family: var(--font-body);
  font-weight: 800; font-size: 14px;
  letter-spacing: 0.06em; text-transform: uppercase;
  box-decoration-break: clone; -webkit-box-decoration-break: clone;
}

.editorial-script-bg {
  position: absolute;
  bottom: 8%; left: -5%;
  z-index: 5;
  font-family: 'DM Serif Display', Georgia, serif;
  font-style: italic;
  font-size: 160px;
  font-weight: 400;
  color: rgba(168, 214, 0, 0.08);
  white-space: nowrap;
  pointer-events: none;
  line-height: 1;
}
`,
  },
};

function resolveStyle(styleName) {
  if (!styleName) return null;
  return STYLES[styleName] || null;
}

function resolvePalette(input) {
  if (!input) return PALETTES.dark;
  if (typeof input === 'string') return PALETTES[input] || PALETTES.dark;
  return { ...PALETTES.dark, ...input };
}

// ================================================================
// CSS BUILDER
// ================================================================

function buildCSSVars(p, font = 'sans') {
  const isSerif = font === 'serif' || font === 'editorial';
  const fontHL = isSerif
    ? "'DM Serif Display', Georgia, serif"
    : "'Plus Jakarta Sans', 'Inter', sans-serif";
  const hlTransform = isSerif ? 'none' : 'uppercase';
  const hlSpacing = isSerif ? '-0.01em' : '-0.035em';

  return `:root {
    --font-hl: ${fontHL};
    --font-body: 'Plus Jakarta Sans', 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
    --hl-transform: ${hlTransform};
    --hl-spacing: ${hlSpacing};
    --bg: ${p.bg}; --bg-alt: ${p.bgAlt};
    --surface: ${p.surface}; --card: ${p.card}; --card-border: ${p.cardBorder};
    --primary: ${p.primary}; --primary-rgb: ${p.primaryRGB};
    --accent: ${p.accent}; --accent-rgb: ${p.accentRGB};
    --text: ${p.text}; --text-bright: ${p.textBright}; --text-off: ${p.textOff};
    --text-muted: ${p.textMuted}; --text-dim: ${p.textDim};
    --hl-bg: ${p.hlBg}; --hl-text: ${p.hlText};
    --footer-bg: ${p.footerBg}; --footer-text: ${p.footerText};
    --check-bg: ${p.checkBg}; --check-text: ${p.checkText};
    --glow-rgb: ${p.glowRGB}; --grid-rgb: ${p.gridRGB};
    --deco-alpha: ${p.decoAlpha}; --noise-alpha: ${p.noiseAlpha};
  }`;
}

const CSS_BASE = `
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  width: 100%; height: 100%; overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: 'liga' 1, 'calt' 1;
}

/* ======== SLIDE BASE ======== */
.slide {
  position: relative;
  width: 1080px; height: 1080px;
  background: var(--bg);
  overflow: hidden;
  font-family: var(--font-body);
  color: var(--text);
}
.slide.vertical { height: 1920px; }
.slide.portrait { height: 1350px; }

/* ======== BACKGROUND LAYERS ======== */
.slide::before {
  content: ''; position: absolute; inset: 0; z-index: 1;
  background:
    radial-gradient(ellipse 120% 80% at 50% 0%, var(--bg-alt) 0%, transparent 60%),
    radial-gradient(ellipse 100% 60% at 0% 100%, rgba(var(--primary-rgb),0.015) 0%, transparent 50%),
    linear-gradient(180deg, var(--bg) 0%, var(--bg-alt) 100%);
}
.slide::after {
  content: ''; position: absolute; inset: 0; z-index: 2;
  opacity: var(--noise-alpha);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* ======== DECORATIVE: gradient-top ======== */
.deco-gradient-top {
  position: absolute; top: 0; left: 0; right: 0; height: 4px; z-index: 20;
  background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 40%, rgba(var(--accent-rgb),0.3) 70%, transparent 100%);
}

/* ======== DECORATIVE: corner-accent ======== */
.deco-corner-tl, .deco-corner-br {
  position: absolute; z-index: 20; width: 60px; height: 60px;
}
.deco-corner-tl {
  top: 32px; left: 32px;
  border-top: 3px solid var(--primary);
  border-left: 3px solid var(--primary);
}
.deco-corner-br {
  bottom: 32px; right: 32px;
  border-bottom: 3px solid var(--primary);
  border-right: 3px solid var(--primary);
}

/* ======== DECORATIVE: ticker ======== */
.deco-ticker {
  position: absolute; top: 0; left: 0; right: 0; z-index: 20;
  overflow: hidden; white-space: nowrap;
  padding: 10px 0;
  background: rgba(var(--primary-rgb),0.06);
  border-bottom: 1px solid rgba(var(--primary-rgb),0.10);
}
.deco-ticker span {
  font-family: var(--font-body);
  font-weight: 700; font-size: 11px;
  letter-spacing: 0.35em; text-transform: uppercase;
  color: rgba(var(--primary-rgb),0.25);
}

/* ======== DECORATIVE: glow ======== */
.bg-layer-glow {
  position: absolute; z-index: 3;
  width: 800px; height: 800px;
  top: 5%; left: 50%; transform: translateX(-50%);
  background: radial-gradient(circle, rgba(var(--glow-rgb),0.08) 0%, rgba(var(--glow-rgb),0.02) 40%, transparent 65%);
  filter: blur(30px);
}
.bg-layer-glow2 {
  position: absolute; z-index: 3;
  width: 400px; height: 400px;
  top: -80px; right: -60px;
  background: radial-gradient(circle, rgba(var(--glow-rgb),0.05) 0%, transparent 70%);
  filter: blur(40px);
}

/* ======== DECORATIVE: grid-lines ======== */
.bg-layer-grid {
  position: absolute; inset: 0; z-index: 3;
  background-image:
    linear-gradient(rgba(var(--grid-rgb),0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--grid-rgb),0.03) 1px, transparent 1px);
  background-size: 54px 54px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 40%, black 20%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 40%, black 20%, transparent 75%);
}

/* ======== HUD FRAME SYSTEM — CDR Signature Element ======== */

/* Frame border */
.hud-frame {
  position: absolute; z-index: 5;
  inset: 24px;
  border: 1.5px solid rgba(var(--primary-rgb), 0.20);
  pointer-events: none;
}
.hud-frame::before {
  content: '';
  position: absolute; inset: -1px;
  border: 1.5px solid rgba(var(--primary-rgb), 0.06);
  filter: blur(4px);
}

/* Corner brackets — L-shaped with glow */
.hud-corner {
  position: absolute; z-index: 6;
  width: 28px; height: 28px;
  pointer-events: none;
}
.hud-corner::before, .hud-corner::after {
  content: '';
  position: absolute;
  background: var(--primary);
  box-shadow: 0 0 8px rgba(var(--primary-rgb), 0.4), 0 0 20px rgba(var(--primary-rgb), 0.15);
}
.hud-corner.tl { top: 20px; left: 20px; }
.hud-corner.tl::before { top: 0; left: 0; width: 28px; height: 3px; }
.hud-corner.tl::after  { top: 0; left: 0; width: 3px; height: 28px; }
.hud-corner.tr { top: 20px; right: 20px; }
.hud-corner.tr::before { top: 0; right: 0; width: 28px; height: 3px; }
.hud-corner.tr::after  { top: 0; right: 0; width: 3px; height: 28px; }
.hud-corner.bl { bottom: 20px; left: 20px; }
.hud-corner.bl::before { bottom: 0; left: 0; width: 28px; height: 3px; }
.hud-corner.bl::after  { bottom: 0; left: 0; width: 3px; height: 28px; }
.hud-corner.br { bottom: 20px; right: 20px; }
.hud-corner.br::before { bottom: 0; right: 0; width: 28px; height: 3px; }
.hud-corner.br::after  { bottom: 0; right: 0; width: 3px; height: 28px; }

/* HUD Grid background */
.hud-grid {
  position: absolute; inset: 0; z-index: 1;
  background-image:
    linear-gradient(rgba(var(--primary-rgb), 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--primary-rgb), 0.025) 1px, transparent 1px);
  background-size: 54px 54px;
  pointer-events: none;
}

/* HUD Scan line */
.hud-scanline {
  position: absolute;
  top: 0; left: 24px; right: 24px;
  height: 1px; z-index: 6;
  background: linear-gradient(90deg, transparent, rgba(var(--primary-rgb), 0.5) 20%, rgba(var(--primary-rgb), 0.5) 80%, transparent);
  box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.25), 0 0 60px rgba(var(--primary-rgb), 0.08);
  animation: hud-scan 4s ease-in-out infinite;
  pointer-events: none;
}
@keyframes hud-scan {
  0%, 100% { top: 80px; }
  50% { top: 1000px; }
}

/* HUD Ambient glow */
.hud-glow {
  position: absolute;
  width: 500px; height: 500px;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(var(--primary-rgb), 0.05) 0%, transparent 70%);
  z-index: 0; pointer-events: none;
}

/* ======== CDR GREEN SLASH — Proprietary Signature v2.0 ======== */
.cdr-slash {
  position: absolute;
  z-index: 7;
  pointer-events: none;
  border-radius: 2px;
}
/* Base slash (accent — default for feed posts) */
.cdr-slash.slash-accent {
  width: 6px; height: 140px;
  background: linear-gradient(180deg, var(--primary), rgba(var(--primary-rgb), 0.0));
  transform: rotate(135deg);
  box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.5), 0 0 60px rgba(var(--primary-rgb), 0.15);
  top: 60px; right: 80px;
}
/* Bold slash (hook, CTA, stories) */
.cdr-slash.slash-bold {
  width: 8px; height: 180px;
  background: linear-gradient(180deg, var(--primary) 10%, rgba(var(--primary-rgb), 0.0));
  transform: rotate(135deg);
  box-shadow: 0 0 30px rgba(var(--primary-rgb), 0.6), 0 0 80px rgba(var(--primary-rgb), 0.2);
  top: 50px; right: 70px;
}
/* Ghost slash (minimal, photo overlay, carousel content) */
.cdr-slash.slash-ghost {
  width: 3px; height: 100px;
  background: linear-gradient(180deg, rgba(var(--primary-rgb), 0.25), rgba(var(--primary-rgb), 0.0));
  transform: rotate(135deg);
  box-shadow: 0 0 12px rgba(var(--primary-rgb), 0.15);
  top: 60px; right: 80px;
}
/* Double slash (premium, institutional, CTA slides) */
.cdr-slash.slash-double {
  width: 5px; height: 140px;
  background: linear-gradient(180deg, var(--primary) 5%, rgba(var(--primary-rgb), 0.0));
  transform: rotate(135deg);
  box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.5), 0 0 60px rgba(var(--primary-rgb), 0.15);
  top: 60px; right: 80px;
}
.cdr-slash.slash-double::after {
  content: '';
  position: absolute;
  width: 5px; height: 140px;
  background: linear-gradient(180deg, rgba(var(--primary-rgb), 0.6), rgba(var(--primary-rgb), 0.0));
  border-radius: 2px;
  top: 0; left: 14px;
  box-shadow: 0 0 12px rgba(var(--primary-rgb), 0.3);
}

/* Corner terminal dots — v2 visibility boost */
.hud-corner .dot {
  position: absolute;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 12px rgba(var(--primary-rgb), 0.6), 0 0 24px rgba(var(--primary-rgb), 0.2);
}
.hud-corner.tl .dot { top: -4px; left: -4px; }
.hud-corner.tr .dot { top: -4px; right: -4px; }
.hud-corner.bl .dot { bottom: -4px; left: -4px; }
.hud-corner.br .dot { bottom: -4px; right: -4px; }

/* Metric highlight — JetBrains Mono with green underline */
.metric-highlight {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--primary);
  text-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3);
  border-bottom: 2px solid rgba(var(--primary-rgb), 0.5);
  padding-bottom: 2px;
}

/* Glass Panel v2 — verde border */
.glass-panel {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(var(--primary-rgb), 0.12);
  border-radius: 12px;
  padding: 28px;
}

/* Status Pill v2 — bordered capsule */
.hud-status-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 4px 14px;
  border: 1px solid rgba(var(--primary-rgb), 0.15);
  border-radius: 20px;
  background: rgba(var(--primary-rgb), 0.05);
  font-family: var(--font-mono);
  font-size: 10px; letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(var(--primary-rgb), 0.6);
}
.hud-status-pill .dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 8px rgba(var(--primary-rgb), 0.6);
  animation: hud-pulse 2s ease-in-out infinite;
}

/* HUD Status indicator */
.hud-status {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-mono);
  font-size: 11px; color: rgba(var(--primary-rgb), 0.5);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.hud-status-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 8px rgba(var(--primary-rgb), 0.6);
  animation: hud-pulse 2s ease-in-out infinite;
}
@keyframes hud-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* HUD Tag badge */
.hud-tag {
  display: inline-block;
  background: var(--primary);
  color: var(--bg);
  font-family: var(--font-body);
  font-size: 11px; font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 6px 16px;
}

/* HUD Metrics (JetBrains Mono) */
.hud-metric {
  text-align: center;
}
.hud-metric-value {
  font-family: var(--font-mono);
  font-weight: 700; font-size: 36px;
  color: var(--primary); line-height: 1;
  text-shadow: 0 0 20px rgba(var(--primary-rgb), 0.2);
}
.hud-metric-label {
  font-family: var(--font-mono);
  font-size: 10px; font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  margin-top: 6px;
}
.hud-metric-bar {
  width: 80px; height: 3px;
  background: rgba(var(--primary-rgb), 0.1);
  margin: 8px auto 0;
  border-radius: 2px;
  overflow: hidden;
}
.hud-metric-bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
  box-shadow: 0 0 6px rgba(var(--primary-rgb), 0.4);
}

/* HUD Metrics row layout */
.hud-metrics-bar {
  display: flex; justify-content: space-between;
  padding: 24px 0 0;
  border-top: 1px solid rgba(var(--primary-rgb), 0.15);
}

/* HUD Top bar */
.hud-top-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 16px;
  flex-shrink: 0;
}
.hud-brand {
  display: flex; align-items: center; gap: 14px;
}
.hud-brand-logo {
  width: 52px; height: 52px;
}
.hud-brand-logo img { width: 100%; height: 100%; object-fit: contain; }
.hud-brand-text {
  font-family: var(--font-body);
  font-weight: 800; font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(var(--primary-rgb), 0.6);
}

/* HUD CTA button v2 (outline + mini-slash) */
.hud-cta {
  display: inline-flex; align-items: center; gap: 12px;
  border: 1.5px solid rgba(var(--primary-rgb), 0.4);
  background: rgba(var(--primary-rgb), 0.08);
  color: var(--primary);
  font-family: var(--font-mono);
  font-weight: 700; font-size: 13px;
  padding: 14px 32px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.1), inset 0 0 20px rgba(var(--primary-rgb), 0.05);
}
.hud-cta::after {
  content: '';
  display: inline-block;
  width: 3px; height: 16px;
  background: var(--primary);
  transform: rotate(135deg);
  box-shadow: 0 0 8px rgba(var(--primary-rgb), 0.4);
  border-radius: 1px;
}

/* HUD Bottom handle */
.hud-handle {
  font-family: var(--font-body);
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.25);
  padding-top: 16px;
}

/* ======== DECORATIVE: side-lines ======== */
.deco-vline {
  position: absolute; z-index: 4; width: 1px;
  background: linear-gradient(180deg, rgba(var(--primary-rgb), var(--deco-alpha)) 0%, transparent 100%);
}
.deco-vline-left { left: 59px; top: 0; height: 200px; }
.deco-vline-right { right: 59px; top: 160px; height: 140px;
  background: linear-gradient(180deg, transparent 0%, rgba(var(--primary-rgb),0.12) 50%, transparent 100%);
}

.deco-bignumber {
  position: absolute; z-index: 3;
  font-family: var(--font-hl);
  font-weight: 800; font-size: 420px; line-height: 1;
  color: rgba(var(--primary-rgb),0.025);
  top: 60px; left: -30px;
  user-select: none; pointer-events: none;
}

/* ======== CONTENT WRAPPER ======== */
.content {
  position: relative; z-index: 10;
  display: flex; flex-direction: column;
  height: 100%; padding: 60px;
}

/* ======== HEADER BAR (glassmorphism) ======== */
.header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 24px; margin: 0 -12px 32px;
  background: rgba(var(--primary-rgb),0.04);
  border: 1px solid rgba(var(--primary-rgb),0.08);
  border-radius: 12px;
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  flex-shrink: 0;
}
.header .brand-name {
  font-family: var(--font-body);
  font-weight: 800; font-size: 14px;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--text);
}
.header .topic-tag {
  font-family: var(--font-body);
  font-weight: 600; font-size: 11px;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--primary);
  padding: 6px 14px;
  border: 1px solid rgba(var(--primary-rgb),0.20);
  border-radius: 100px;
  background: rgba(var(--primary-rgb),0.06);
}

/* ======== FOOTER STYLES ======== */

/* footer-bar: solid color bar (the green one) */
.footer-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 22px 32px; margin: 0 -60px -60px;
  background: var(--footer-bg);
  flex-shrink: 0;
}
.footer-bar span {
  font-family: var(--font-body);
  font-weight: 800; font-size: 17px;
  letter-spacing: 0.08em; color: var(--footer-text); text-transform: uppercase;
}
.footer-bar .counter {
  font-family: var(--font-body);
  font-weight: 700; font-size: 19px;
  letter-spacing: 0.02em; color: var(--footer-text); opacity: 0.7;
}
.footer-bar .handle {
  font-family: var(--font-body);
  font-weight: 600; font-size: 15px;
  letter-spacing: 0.02em; color: var(--footer-text);
}

/* footer-minimal: just text, no bar */
.footer-minimal {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 0 0;
  flex-shrink: 0;
}
.footer-minimal .brand-text {
  font-family: var(--font-body);
  font-weight: 700; font-size: 13px;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--text-dim);
}
.footer-minimal .handle {
  font-family: var(--font-body);
  font-weight: 500; font-size: 16px;
  color: var(--text-muted);
  letter-spacing: 0.01em;
}

/* footer-line: thin line + text */
.footer-line {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 0 0;
  border-top: 1px solid rgba(var(--primary-rgb),0.15);
  flex-shrink: 0;
}
.footer-line .brand-text {
  font-family: var(--font-body);
  font-weight: 800; font-size: 14px;
  letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--primary);
}
.footer-line .handle {
  font-family: var(--font-body);
  font-weight: 500; font-size: 16px;
  color: var(--text-muted);
}

/* footer-bar-v2: translucent gradient + mini-slash accent */
.footer-bar-v2 {
  position: relative;
  display: flex; justify-content: space-between; align-items: center;
  padding: 22px 32px; margin: 0 -60px -60px;
  background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.08), rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.08));
  border-top: 1px solid rgba(var(--primary-rgb), 0.2);
  flex-shrink: 0;
}
.footer-bar-v2::before {
  content: '';
  position: absolute; left: 24px; top: -8px;
  width: 3px; height: 24px;
  background: var(--primary);
  transform: rotate(135deg);
  box-shadow: 0 0 8px rgba(var(--primary-rgb), 0.4);
  border-radius: 1px;
}
.footer-bar-v2 span {
  font-family: var(--font-body);
  font-weight: 800; font-size: 17px;
  letter-spacing: 0.08em; color: var(--text-bright); text-transform: uppercase;
}
.footer-bar-v2 .handle {
  font-family: var(--font-body);
  font-weight: 600; font-size: 15px;
  letter-spacing: 0.02em; color: var(--text-muted);
}
.footer-bar-v2 .counter {
  font-family: var(--font-body);
  font-weight: 700; font-size: 19px;
  letter-spacing: 0.02em; color: var(--text-bright); opacity: 0.7;
}

/* ======== MAIN AREA ======== */
.main { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.main.top-aligned { justify-content: flex-start; padding-top: 8px; }
.main.center-aligned { justify-content: center; align-items: center; text-align: center; }

/* ======== SLIDE NUMBER ======== */
.slide-num {
  font-family: var(--font-hl);
  font-weight: 800; font-size: 100px; line-height: 1;
  background: linear-gradient(180deg, var(--primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
  filter: drop-shadow(0 0 30px rgba(var(--primary-rgb),0.20));
  letter-spacing: -0.02em;
}

/* ======== HEADLINES ======== */
h1 {
  font-family: var(--font-hl);
  font-weight: 800; line-height: 1.0;
  letter-spacing: var(--hl-spacing);
  color: var(--text-bright);
  text-transform: var(--hl-transform);
}
.h1-cover { font-size: 92px; margin-bottom: 32px; }
.h1-content { font-size: 52px; margin-bottom: 32px; }
.h1-cta { font-size: 84px; margin-bottom: 28px; }
.h1-post { font-size: 76px; margin-bottom: 28px; }
.h1-composite { font-size: 62px; margin-bottom: 20px; line-height: 1.05; }
.h1-editorial { font-size: 80px; margin-bottom: 24px; line-height: 1.05; }
.h1-bold { font-size: 72px; margin-bottom: 20px; line-height: 1.1; }
.h1-data { font-size: 56px; margin-bottom: 32px; line-height: 1.05; }

/* Bold emphasis in headlines */
h1 .b { color: var(--primary); }

/* Highlight box — CDR Neon Signature v2.0 (sharp edges + offset shadow) */
h1 .hl, .hl {
  display: inline;
  background: var(--hl-bg);
  color: var(--hl-text);
  padding: 4px 16px;
  border-radius: 0;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.45), 0 0 50px rgba(var(--primary-rgb), 0.18), 4px 4px 0 rgba(var(--primary-rgb), 0.12);
  border: 1px solid rgba(var(--primary-rgb), 0.3);
}

/* ======== LABEL ======== */
.label {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-body);
  font-weight: 600; font-size: 13px;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--primary); margin-bottom: 20px;
}
.label::before {
  content: ''; width: 24px; height: 2px;
  background: var(--primary); border-radius: 1px;
}

/* ======== SUBTITLE ======== */
.subtitle {
  font-family: var(--font-body);
  font-weight: 400; font-size: 26px;
  color: var(--text-muted); line-height: 1.45;
  max-width: 750px;
}
.subtitle .b { color: var(--text-bright); font-weight: 700; }

/* ======== DESCRIPTION ======== */
.desc {
  font-family: var(--font-body);
  font-weight: 400; font-size: 24px;
  color: var(--text-muted); line-height: 1.50;
  max-width: 700px;
}
.desc .b { color: var(--primary); font-weight: 600; }

/* ======== BULLETS — Card Style ======== */
.bullets {
  list-style: none; display: flex; flex-direction: column; gap: 16px;
}
.bullets li {
  display: flex; align-items: flex-start; gap: 20px;
  padding: 22px 28px;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-left: 3px solid var(--primary);
  border-radius: 12px;
  font-family: var(--font-body);
  font-weight: 400; font-size: 24px;
  color: var(--text-off); line-height: 1.40;
}
.bullets li .marker {
  flex-shrink: 0; width: 8px; height: 8px; border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 8px rgba(var(--primary-rgb),0.50), 0 0 20px rgba(var(--primary-rgb),0.15);
  margin-top: 10px;
}
.bullets li strong { font-weight: 700; color: var(--text-bright); }

/* ======== CHECKLIST ======== */
.checklist {
  list-style: none; display: flex; flex-direction: column; gap: 14px;
}
.checklist li {
  display: flex; align-items: flex-start; gap: 14px;
  font-family: var(--font-body);
  font-weight: 400; font-size: 18px;
  color: var(--text-off); line-height: 1.40;
}
.checklist li .check-icon { flex-shrink: 0; margin-top: 1px; }
.checklist li strong { font-weight: 700; color: var(--text-bright); }
.checklist.checklist-lg li { font-size: 22px; gap: 16px; }

/* ======== DIVIDER ======== */
.divider {
  width: 48px; height: 3px; border-radius: 2px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  margin: 20px 0;
}
.divider.center { align-self: center; }
.divider.wide { width: 80px; }

/* ======== CTA BUTTON ======== */
.cta-btn {
  position: relative;
  display: inline-flex; align-items: center; justify-content: center;
  padding: 28px 64px; border-radius: 60px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  font-family: var(--font-body);
  font-weight: 800; font-size: 28px;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--bg);
  box-shadow:
    0 0 50px rgba(var(--primary-rgb),0.30),
    0 8px 32px rgba(0,0,0,0.5);
}

/* ======== HANDLE TAG ======== */
.handle-tag {
  font-family: var(--font-body);
  font-weight: 500; font-size: 20px;
  color: var(--text-muted); margin-top: 28px;
  letter-spacing: 0.02em;
}

/* ======== METRIC CARD ======== */
.metric-card {
  text-align: center;
  padding: 32px;
}
.metric-value {
  font-family: var(--font-hl);
  font-weight: 800; font-size: 80px; line-height: 1;
  color: var(--primary);
  margin-bottom: 8px;
}
.metric-label {
  font-family: var(--font-body);
  font-weight: 500; font-size: 18px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.metrics-grid {
  display: flex; justify-content: center; gap: 24px;
  flex-wrap: wrap;
}
.metrics-grid .metric-card {
  flex: 1; min-width: 200px;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: 16px;
}
.metric-divider {
  width: 40px; height: 2px; margin: 12px auto;
  background: var(--primary); border-radius: 1px;
  opacity: 0.5;
}

/* ======== DEVICE MOCKUPS — iPhone 15 Pro + MacBook Pro (Premium) ======== */

/* --- iPhone 15 Pro (Natural Titanium) --- */
.mockup-phone {
  position: relative; display: inline-block;
  border-radius: 38px;
  background: linear-gradient(135deg, #8a8d91 0%, #a1a4a8 20%, #c5c8cc 40%, #9b9ea2 60%, #87898d 80%, #a1a4a8 100%);
  padding: 7px;
  box-sizing: border-box;
  box-shadow:
    -1px -1px 0 0 rgba(212,214,216,0.5),
    1px 1px 0 0 rgba(107,109,112,0.5),
    inset 0 0 0 1px #7a7d81,
    0 0 0 1px rgba(255,255,255,0.03),
    0 1px 2px rgba(0,0,0,0.35),
    0 2px 4px rgba(0,0,0,0.30),
    0 4px 8px rgba(0,0,0,0.25),
    0 8px 16px rgba(0,0,0,0.20),
    0 16px 32px rgba(0,0,0,0.15),
    0 32px 64px rgba(0,0,0,0.10);
}
.mockup-phone .mockup-bezel {
  width: 100%; height: 100%;
  background: #111;
  border-radius: 32px;
  overflow: hidden;
}
.mockup-phone .mockup-screen {
  position: relative;
  width: 100%; height: 100%;
  background: #000;
  border-radius: 32px;
  overflow: hidden;
}
.mockup-phone .mockup-screen img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  position: relative; z-index: 1;
}
/* Dynamic Island */
.mockup-island {
  position: absolute;
  top: 8px; left: 50%; transform: translateX(-50%);
  width: 80px; height: 24px;
  background: #000; border-radius: 14px;
  z-index: 10;
  box-shadow: inset 0 0 3px rgba(0,0,0,0.8), 0 0 1px rgba(0,0,0,0.5);
}
.mockup-island::before {
  content: '';
  position: absolute;
  right: 12px; top: 50%; transform: translateY(-50%);
  width: 6px; height: 6px; border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #3a3d5c, #1e1f2e 40%, #0d0e14);
  box-shadow: inset 0 0 2px rgba(100,120,200,0.3);
}
/* Screen glare (static diagonal reflection) */
.mockup-phone .mockup-screen::after {
  content: '';
  position: absolute; inset: 0;
  border-radius: 32px; z-index: 20;
  pointer-events: none;
  background: linear-gradient(115deg,
    transparent 30%,
    rgba(255,255,255,0.03) 35%,
    rgba(255,255,255,0.07) 42%,
    rgba(255,255,255,0.03) 48%,
    transparent 52%
  );
}
/* Placeholder (no image) */
.mockup-phone .mockup-placeholder { aspect-ratio: 9/19.5; }
.mockup-placeholder .ph-bar {
  height: 8%; margin: 14% 6% 0; border-radius: 4px;
  background: rgba(255,255,255,0.08);
}
.mockup-placeholder .ph-hero {
  height: 30%; margin: 4% 6% 0; border-radius: 8px;
  background: linear-gradient(135deg, rgba(var(--primary-rgb),0.15), rgba(var(--primary-rgb),0.05));
}
.mockup-placeholder .ph-cards { display: flex; gap: 4%; margin: 4% 6% 0; }
.mockup-placeholder .ph-card {
  flex: 1; aspect-ratio: 3/4; border-radius: 6px;
  background: rgba(255,255,255,0.05);
}

/* --- MacBook Pro (Space Gray) --- */
.mockup-laptop { position: relative; display: inline-block; }
.mockup-laptop .mockup-lid {
  position: relative;
  margin: 0 auto;
  border-radius: 14px 14px 0 0;
  background: #2d2d2f;
  padding: 7px 7px 5px;
  box-sizing: border-box;
  box-shadow:
    inset 0 0 0 1.5px #1a1a1c,
    0 0 0 1px #454548,
    inset 0 1px 0 rgba(255,255,255,0.05),
    0 0 0 2px rgba(255,255,255,0.03),
    0 1px 2px rgba(0,0,0,0.30),
    0 2px 4px rgba(0,0,0,0.25),
    0 4px 8px rgba(0,0,0,0.20),
    0 8px 16px rgba(0,0,0,0.15),
    0 16px 32px rgba(0,0,0,0.10);
}
.mockup-laptop .mockup-screen {
  position: relative;
  width: 100%; height: 100%;
  border-radius: 7px;
  overflow: hidden;
  background: #000;
}
.mockup-laptop .mockup-screen img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  position: relative; z-index: 1;
}
/* Camera notch (MacBook style) */
.mockup-cam-notch {
  position: absolute;
  top: 0; left: 50%; transform: translateX(-50%);
  width: 120px; height: 16px;
  background: #2d2d2f;
  border-radius: 0 0 8px 8px;
  z-index: 10;
  box-shadow: inset 0 -1px 0 rgba(255,255,255,0.03);
}
.mockup-cam-notch::before {
  content: '';
  position: absolute;
  top: 5px; left: 50%; transform: translateX(-50%);
  width: 4px; height: 4px; border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, #3a4a6a, #1a2030 50%, #0a0e14);
  box-shadow: inset 0 0 1px rgba(80,120,200,0.2);
}
/* Screen glare (static diagonal reflection) */
.mockup-laptop .mockup-screen::after {
  content: '';
  position: absolute; inset: 0;
  border-radius: 7px; z-index: 20;
  pointer-events: none;
  background: linear-gradient(115deg,
    transparent 30%,
    rgba(255,255,255,0.02) 35%,
    rgba(255,255,255,0.05) 42%,
    rgba(255,255,255,0.02) 48%,
    transparent 52%
  );
}
/* Realistic base / hinge */
.mockup-laptop .mockup-base {
  position: relative;
  width: 115%; margin-left: -7.5%;
  height: 10px;
  background: linear-gradient(180deg, #3a3a3c, #2c2c2e 40%, #222224);
  border-radius: 0 0 6px 6px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.5);
}
/* Hinge gap line */
.mockup-laptop .mockup-base::before {
  content: '';
  position: absolute;
  top: 0; left: 50%; transform: translateX(-50%);
  width: 90%; height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.8) 15%, #0a0a0a 50%, rgba(0,0,0,0.8) 85%, transparent);
}
/* Base front indent */
.mockup-laptop .mockup-base-notch {
  position: absolute;
  bottom: 0; left: 50%; transform: translateX(-50%);
  width: 50px; height: 3px;
  border-radius: 0 0 3px 3px;
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
}
/* Laptop placeholder */
.mockup-laptop .mockup-lp-placeholder { aspect-ratio: 16/10; }
.mockup-lp-placeholder .ph-nav {
  height: 6%; margin: 0; padding: 0 3%;
  background: rgba(255,255,255,0.04);
  display: flex; align-items: center; gap: 2%;
}
.mockup-lp-placeholder .ph-nav-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: rgba(255,255,255,0.15);
}
.mockup-lp-placeholder .ph-banner {
  height: 35%; margin: 2% 3% 0; border-radius: 4px;
  background: linear-gradient(135deg, rgba(var(--primary-rgb),0.12), rgba(var(--primary-rgb),0.04));
}
.mockup-lp-placeholder .ph-grid { display: flex; gap: 2%; margin: 3% 3% 0; flex-wrap: wrap; }
.mockup-lp-placeholder .ph-grid-item {
  flex: 0 0 30%; aspect-ratio: 4/5; border-radius: 4px;
  background: rgba(255,255,255,0.04);
}

/* ======== COMPOSITE LAYOUT v3 (Premium / Final) ======== */
.composite-layout {
  position: relative; z-index: 10;
  display: flex; flex-direction: column;
  height: 100%; padding: 0;
}

/* --- Top: logo + headline + subtitle --- */
.composite-top {
  text-align: center;
  padding: 28px 48px 4px;
  flex-shrink: 0;
}
.composite-logo {
  width: 110px; height: 110px; margin: 0 auto 14px;
  display: flex; align-items: center; justify-content: center;
}
.composite-logo svg { width: 100%; height: 100%; }
.composite-logo img {
  width: 100%; height: 100%; object-fit: contain;
}
.composite-top h1 {
  font-size: 44px; line-height: 1.22; margin-bottom: 10px;
}
.composite-top .subtitle {
  font-size: 18px; margin: 0 auto;
  max-width: 680px; text-align: center;
  line-height: 1.45;
}

/* --- Middle: devices (left) + checklist (right) --- */
.composite-middle {
  display: flex;
  padding: 0 24px;
  gap: 12px;
  flex: 1;
  align-items: stretch;
  position: relative;
  min-height: 0;
}
.composite-devices {
  flex: 1.25;
  position: relative;
  min-height: 0;
  overflow: visible;
}
/* Green ambient glow behind devices — adds depth */
.composite-devices::before {
  content: '';
  position: absolute;
  width: 75%; height: 50%;
  top: 25%; left: 15%;
  background: radial-gradient(ellipse, rgba(var(--primary-rgb),0.07) 0%, transparent 70%);
  filter: blur(50px);
  z-index: 0;
  pointer-events: none;
}
.composite-checklist {
  flex: 0.75;
  display: flex; flex-direction: column;
  justify-content: center;
}

/* Glass panel — Apple HIG glassmorphism */
.composite-checklist-panel {
  position: relative;
  background: rgba(255,255,255,0.06);
  border-radius: 20px;
  padding: 24px 20px;
  border: 1px solid rgba(255,255,255,0.10);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow:
    0 8px 32px rgba(0,0,0,0.40),
    inset 0 1px 0 rgba(255,255,255,0.10);
}
.composite-checklist-panel::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 40%);
  pointer-events: none;
}
.composite-checklist-panel .checklist { gap: 11px; }
.composite-checklist-panel .checklist li {
  font-size: 15px; gap: 11px; line-height: 1.38;
  color: rgba(255,255,255,0.88);
}
.composite-checklist-panel .checklist li .check-icon svg {
  width: 20px; height: 20px;
}
.composite-checklist-panel .checklist li strong {
  color: #FFFFFF; font-weight: 700;
}

/* --- Bottom: serif italic text + handle --- */
.composite-bottom {
  text-align: center;
  padding: 8px 52px 0;
  flex-shrink: 0;
}
.composite-handle {
  text-align: center;
  padding: 10px 0 22px;
  font-family: var(--font-body);
  font-weight: 500; font-size: 13px;
  letter-spacing: 0.04em;
  color: var(--text-dim);
}
.composite-bottom p {
  font-family: var(--font-hl);
  font-style: italic;
  font-weight: 400; font-size: 20px;
  color: var(--text-off); line-height: 1.4;
}
.composite-bottom p .b {
  font-weight: 800; color: var(--text-bright);
  font-style: normal;
}
.composite-bottom p .hl {
  display: inline;
  background: var(--hl-bg); color: var(--hl-text);
  padding: 2px 14px; border-radius: 5px;
  font-style: normal;
  box-decoration-break: clone; -webkit-box-decoration-break: clone;
}

/* --- Devices stack: phone front-left, laptop back-right --- */
.devices-stack {
  position: relative; width: 100%; height: 100%;
}
.devices-stack .mockup-phone {
  position: absolute; left: 0;
  top: 50%; transform: translateY(-50%);
  z-index: 3;
}
.devices-stack .mockup-laptop {
  position: absolute; left: 20%;
  top: 50%; transform: translateY(-55%);
  z-index: 1;
}
/* Screen glow spill on dark surface (green tint from CDR brand) */
.devices-stack::after {
  content: '';
  position: absolute;
  bottom: 0; left: 10%; right: 30%;
  height: 60px;
  background: radial-gradient(ellipse at center, rgba(var(--primary-rgb),0.06) 0%, transparent 70%);
  filter: blur(20px);
  pointer-events: none; z-index: 0;
}

.devices-single {
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 100%;
}

/* ======== SPLIT LAYOUT ======== */
.split-layout {
  position: relative; z-index: 10;
  display: flex; height: 100%;
}
.split-left {
  flex: 1; display: flex; flex-direction: column;
  justify-content: center; padding: 56px;
}
.split-right {
  flex: 1; display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 40px;
  background: var(--primary);
}
.split-right-dark {
  background: var(--bg-alt);
}

/* ======== EDITORIAL LAYOUT ======== */
.editorial-layout {
  position: relative; z-index: 10;
  display: flex; flex-direction: column;
  height: 100%; padding: 60px;
  justify-content: center;
}
.editorial-layout h1 {
  font-size: 80px; line-height: 1.05; margin-bottom: 28px;
}
.editorial-layout .subtitle {
  font-size: 28px; max-width: 800px;
}

/* ======== BOLD STATEMENT ======== */
.bold-layout {
  position: relative; z-index: 10;
  display: flex; flex-direction: column;
  height: 100%; padding: 80px;
  justify-content: center; align-items: center;
  text-align: center;
}
.bold-layout h1 {
  font-size: 72px; line-height: 1.1; margin-bottom: 24px;
  max-width: 900px;
}
.bold-layout .subtitle {
  font-size: 28px; text-align: center;
  max-width: 700px;
}

/* ======== DATA / METRICS ======== */
.data-layout {
  position: relative; z-index: 10;
  display: flex; flex-direction: column;
  height: 100%; padding: 60px;
}
.data-top {
  flex-shrink: 0; margin-bottom: 40px;
}
.data-metrics-area {
  flex: 1; display: flex; align-items: center; justify-content: center;
}

/* ======== FONT LOADER ======== */
body { opacity: 0; transition: opacity 0.15s ease; }
body.ready { opacity: 1; }
`;

function buildCSS(paletteInput, font = 'sans', extraCSS = '') {
  const p = resolvePalette(paletteInput);
  return buildCSSVars(p, font) + '\n' + CSS_BASE + '\n' + extraCSS;
}

// ================================================================
// SVG ICONS
// ================================================================

const SVG_CHECK = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill="var(--check-bg)"/><path d="M7 11l3 3 5-6" stroke="var(--check-text)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const SVG_ARROW = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill="var(--check-bg)"/><path d="M9 7l5 4-5 4" stroke="var(--check-text)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const SVG_STAR = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill="var(--check-bg)"/><path d="M11 6l1.5 3.1 3.4.5-2.5 2.4.6 3.4L11 13.9l-3 1.5.6-3.4L6.1 9.6l3.4-.5L11 6z" fill="var(--check-text)"/></svg>';

const SVG_CDR_LOGO = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
  <circle cx="24" cy="24" r="23" fill="var(--bg)" stroke="var(--primary)" stroke-width="1.5"/>
  <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(var(--primary-rgb),0.08)" stroke-width="0.5"/>
  <path d="M20 30L24 15L28 30" stroke="var(--primary)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M24 15L30 19" stroke="var(--primary)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="24" r="23" fill="none" stroke="rgba(var(--primary-rgb),0.04)" stroke-width="4"/>
</svg>`;

const ICON_MAP = { check: SVG_CHECK, arrow: SVG_ARROW, star: SVG_STAR };

// ================================================================
// HTML WRAPPER
// ================================================================

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Anton&family=Bungee&family=Lilita+One&family=Titan+One&family=Luckiest+Guy&family=Modak&family=Coiny&family=Chango&family=Passion+One:wght@400;700;900&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&display=swap';

function wrapHTML(title, bodyHTML, opts = {}) {
  const { isVertical = false, isPortrait = false, palette = 'dark', font = 'sans', style = null, extraCSS: optsExtraCSS = '' } = opts;
  const sizeClass = isVertical ? 'vertical' : (isPortrait ? 'portrait' : '');

  // Resolve style preset — style overrides palette/font if provided
  const stylePreset = resolveStyle(style);
  const finalPalette = stylePreset ? stylePreset.palette : palette;
  const finalFont = stylePreset ? stylePreset.font : font;
  const extraCSS = (stylePreset ? stylePreset.extraCSS : '') + optsExtraCSS;
  const isEditorial = style === 'cdr-editorial' || style === 'cdr-magazine';
  const styleClass = isEditorial ? 'editorial-style' : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1080">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONT_URL}" rel="stylesheet">
<style>${buildCSS(finalPalette, finalFont, extraCSS)}</style>
</head>
<body>
<div class="slide ${sizeClass} ${styleClass}">
  ${bodyHTML}
</div>
<script>
document.fonts.ready.then(() => document.body.classList.add('ready'));
setTimeout(() => document.body.classList.add('ready'), 3000);
</script>
</body>
</html>`;
}

// ================================================================
// DECORATIVE RENDERER
// ================================================================

/**
 * Render CDR Green Slash — proprietary signature element v2.0
 * @param {'bold'|'accent'|'ghost'|'double'} variant - Slash intensity
 * @param {{top?,right?,left?,bottom?}} position - Override default position
 */
function renderSlash(variant = 'accent', position = {}) {
  const posStyle = Object.entries(position).map(([k, v]) => `${k}:${v}`).join(';');
  return `<div class="cdr-slash slash-${variant}"${posStyle ? ` style="${posStyle}"` : ''}></div>`;
}

/** Render HUD corners with terminal dots (v2.0) */
function renderHudCorners(count = 4) {
  const dot = '<span class="dot"></span>';
  if (count === 4) {
    return `<div class="hud-corner tl">${dot}</div><div class="hud-corner tr">${dot}</div>
      <div class="hud-corner bl">${dot}</div><div class="hud-corner br">${dot}</div>`;
  }
  // Diagonal pair: TL + BR
  return `<div class="hud-corner tl">${dot}</div><div class="hud-corner br">${dot}</div>`;
}

/** Check if a decorative type already includes the CDR slash */
function decorativeHasSlash(type) {
  return type && type.startsWith('hud-');
}

function renderDecorative(type) {
  if (!type || type === 'none') return '';

  switch (type) {
    case 'gradient-top':
      return '<div class="deco-gradient-top"></div>';

    case 'corner-accent':
      return '<div class="deco-corner-tl"></div><div class="deco-corner-br"></div>';

    case 'ticker':
      const t = 'CDR GROUP &nbsp;&bull;&nbsp; ';
      return `<div class="deco-ticker"><span>${t.repeat(12)}</span></div>`;

    case 'glow':
      return '<div class="bg-layer-glow"></div><div class="bg-layer-glow2"></div>';

    case 'grid-lines':
      return '<div class="bg-layer-grid"></div>';

    case 'side-lines':
      return '<div class="deco-vline deco-vline-left"></div><div class="deco-vline deco-vline-right"></div>';

    case 'full':
      return '<div class="deco-gradient-top"></div><div class="bg-layer-glow"></div><div class="bg-layer-grid"></div>';

    // ---- HUD Frame variants (CDR Signature v2.0 — with terminal dots + slash) ----

    case 'hud-full':
      // Frame + 4 corners (dots) + grid + scan line + glow + slash-bold
      return `<div class="hud-frame"></div>
        ${renderHudCorners(4)}
        <div class="hud-grid"></div>
        <div class="hud-scanline"></div>
        <div class="hud-glow"></div>
        ${renderSlash('bold')}`;

    case 'hud-frame':
      // Frame + 4 corners (dots) + glow + slash-accent
      return `<div class="hud-frame"></div>
        ${renderHudCorners(4)}
        <div class="hud-glow"></div>
        ${renderSlash('accent')}`;

    case 'hud-corners':
      // Only 4 corners with dots + slash-ghost
      return `${renderHudCorners(4)}
        ${renderSlash('ghost')}`;

    case 'hud-corner-pair':
      // Only 2 diagonal corners (TL + BR) with dots
      return renderHudCorners(2);

    default:
      return '';
  }
}

// ================================================================
// HUD COMPONENT RENDERERS
// ================================================================

function renderHudTopBar(opts = {}) {
  const { logoImage, statusText = 'PERFORMANCE ONLINE', tag } = opts;
  const logoHTML = logoImage
    ? `<div class="hud-brand-logo"><img src="${logoImage}" alt="CDR"></div>`
    : '';
  const tagHTML = tag
    ? `<div class="hud-tag">${escapeHTML(tag)}</div>`
    : `<div class="hud-status"><div class="hud-status-dot"></div>${escapeHTML(statusText)}</div>`;
  return `<div class="hud-top-bar">
    <div class="hud-brand">${logoHTML}<div class="hud-brand-text">CDR Group</div></div>
    ${tagHTML}
  </div>`;
}

function renderHudMetrics(metrics) {
  if (!metrics || metrics.length === 0) return '';
  const items = metrics.map(m => {
    const barHTML = m.bar != null
      ? `<div class="hud-metric-bar"><div class="hud-metric-bar-fill" style="width:${m.bar}%"></div></div>`
      : '';
    return `<div class="hud-metric">
      <div class="hud-metric-value">${escapeHTML(m.value)}</div>
      <div class="hud-metric-label">${escapeHTML(m.label)}</div>
      ${barHTML}
    </div>`;
  }).join('\n');
  return `<div class="hud-metrics-bar">${items}</div>`;
}

// ================================================================
// FOOTER RENDERER
// ================================================================

function renderFooter(style, opts = {}) {
  const { handle = '@cdrgroup.assessoria', counter = '', brandName = 'CDR GROUP' } = opts;

  if (!style || style === 'none') return '';

  switch (style) {
    case 'bar':
      return `<div class="footer-bar">
        <span>${escapeHTML(brandName)}</span>
        ${counter ? `<span class="counter">${escapeHTML(counter)}</span>` : `<span class="handle">${escapeHTML(handle)}</span>`}
      </div>`;

    case 'minimal':
      return `<div class="footer-minimal">
        <span class="brand-text">${escapeHTML(brandName)}</span>
        <span class="handle">${escapeHTML(handle)}</span>
      </div>`;

    case 'line':
      return `<div class="footer-line">
        <span class="brand-text">${escapeHTML(brandName)}</span>
        <span class="handle">${escapeHTML(handle)}</span>
      </div>`;

    case 'bar-v2':
      return `<div class="footer-bar-v2">
        <span>${escapeHTML(brandName)}</span>
        ${counter ? `<span class="counter">${escapeHTML(counter)}</span>` : `<span class="handle">${escapeHTML(handle)}</span>`}
      </div>`;

    default:
      return '';
  }
}

// ================================================================
// DEVICE MOCKUP RENDERERS
// ================================================================

function renderPhoneMockup(device = {}, widthPx = 220) {
  const img = device.image
    ? `<img src="${device.image}" alt="">`
    : `<div class="mockup-placeholder">
        <div class="ph-bar"></div>
        <div class="ph-hero"></div>
        <div class="ph-cards"><div class="ph-card"></div><div class="ph-card"></div><div class="ph-card"></div></div>
      </div>`;

  // iPhone 15 Pro structure: titanium frame → bezel → screen + Dynamic Island
  return `<div class="mockup-phone" style="width:${widthPx}px;">
    <div class="mockup-bezel">
      <div class="mockup-screen">
        <div class="mockup-island"></div>
        ${img}
      </div>
    </div>
  </div>`;
}

function renderLaptopMockup(device = {}, widthPx = 480) {
  const img = device.image
    ? `<img src="${device.image}" alt="">`
    : `<div class="mockup-lp-placeholder">
        <div class="ph-nav"><div class="ph-nav-dot"></div><div class="ph-nav-dot"></div><div class="ph-nav-dot"></div></div>
        <div class="ph-banner"></div>
        <div class="ph-grid"><div class="ph-grid-item"></div><div class="ph-grid-item"></div><div class="ph-grid-item"></div></div>
      </div>`;

  // MacBook Pro structure: aluminum lid + screen + cam notch + realistic base/hinge
  return `<div class="mockup-laptop">
    <div class="mockup-lid" style="width:${widthPx}px;">
      <div class="mockup-screen">
        <div class="mockup-cam-notch"></div>
        ${img}
      </div>
    </div>
    <div class="mockup-base"><div class="mockup-base-notch"></div></div>
  </div>`;
}

function renderPopupMockup(device = {}, widthPx = 180) {
  const img = device.image
    ? `<img src="${device.image}" alt="" style="width:${widthPx}px;">`
    : `<div class="popup-placeholder">
        <div class="ph-popup-header"></div>
        <div class="ph-popup-image"></div>
        <div class="ph-popup-line"></div>
        <div class="ph-popup-line short"></div>
        <div class="ph-popup-btn"></div>
      </div>`;

  return `<div class="mockup-popup">
    <div class="mockup-screen">${img}</div>
  </div>`;
}

function renderDevices(devices = [], opts = {}) {
  if (!devices || devices.length === 0) return '';
  const hasPhone = devices.find(d => d.type === 'phone');
  const hasLaptop = devices.find(d => d.type === 'laptop');
  const hasPopup = devices.find(d => d.type === 'popup');
  const autoPopup = opts.autoPopup !== false;

  if (hasPhone && hasLaptop) {
    // 3-device stack: phone front-left, popup center (if image), laptop back-right
    const popupHTML = hasPopup
      ? renderPopupMockup(hasPopup, 180)
      : (autoPopup && hasPopup?.image ? renderPopupMockup({}, 180) : '');

    return `<div class="devices-stack">
      ${renderLaptopMockup(hasLaptop, 500)}
      ${popupHTML}
      ${renderPhoneMockup(hasPhone, 240)}
    </div>`;
  }
  if (hasPhone) return `<div class="devices-single">${renderPhoneMockup(hasPhone, 220)}</div>`;
  if (hasLaptop) return `<div class="devices-single">${renderLaptopMockup(hasLaptop, 420)}</div>`;
  return '';
}

// ================================================================
// CHECKLIST RENDERER
// ================================================================

function renderChecklist(items = [], icon = 'check', size = '') {
  const svg = ICON_MAP[icon] || SVG_CHECK;
  const sizeClass = size === 'lg' ? ' checklist-lg' : '';
  const lis = items.map(item =>
    `<li><span class="check-icon">${svg}</span><span>${formatBulletText(item)}</span></li>`
  ).join('\n    ');
  return `<ul class="checklist${sizeClass}">\n    ${lis}\n  </ul>`;
}

// ================================================================
// TEMPLATE 1: EDITORIAL
// ================================================================

function editorialPost(data) {
  const { headline, subtitle, label, handle, decorative = 'corner-accent', footerStyle = 'line', palette, font } = data;

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('accent') : ''}

  <div class="editorial-layout">
    ${label ? `<div class="label">${escapeHTML(label)}</div>` : ''}
    <h1 class="h1-editorial">${formatHeadline(headline)}</h1>
    ${subtitle ? `<p class="subtitle">${formatSubtitle(subtitle)}</p>` : ''}
    ${renderFooter(footerStyle, { handle })}
  </div>`;

  return wrapHTML('Editorial — CDR', body, { palette, font });
}

// ================================================================
// TEMPLATE 2: COMPOSITE (Case/Resultado)
// ================================================================

function compositePost(data) {
  const {
    headline, subtitle, devices, checklist, checkIcon,
    bottomText, handle, showLogo, logoImage, decorative = 'glow', footerStyle = 'none',
    palette, font, style, scriptText, brandName = 'CDRGROUP®',
  } = data;

  const isEditorial = style === 'cdr-editorial' || style === 'cdr-magazine';

  const devicesHTML = devices && devices.length > 0 ? renderDevices(devices) : '';
  const checklistHTML = checklist && checklist.length > 0
    ? renderChecklist(checklist, checkIcon || 'check') : '';
  const hasMiddle = devicesHTML || checklistHTML;

  // Checklist goes inside dark semi-transparent panel (Lever-style)
  const checklistPanelHTML = checklistHTML
    ? `<div class="composite-checklist-panel">${checklistHTML}</div>` : '';

  const middleHTML = hasMiddle ? `
    <div class="composite-middle">
      ${devicesHTML ? `<div class="composite-devices">${devicesHTML}</div>` : ''}
      ${checklistPanelHTML ? `<div class="composite-checklist">${checklistPanelHTML}</div>` : ''}
    </div>` : '';

  // Bottom text uses serif italic (Lever-style) — NO footer bar by default
  const bottomHTML = bottomText
    ? `<div class="composite-bottom"><p>${formatDescription(bottomText)}</p></div>` : '';

  // Optional footer (default: none for Lever-style clean look)
  let footerHTML = '';
  if (footerStyle === 'bar') {
    footerHTML = `<div style="padding:14px 32px; background:var(--footer-bg); display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
      <span style="font-family:var(--font-body); font-weight:800; font-size:15px; letter-spacing:0.08em; color:var(--footer-text); text-transform:uppercase;">CDR GROUP</span>
      <span style="font-family:var(--font-body); font-weight:600; font-size:14px; color:var(--footer-text); letter-spacing:0.02em;">${escapeHTML(handle || '@cdrgroup.assessoria')}</span>
    </div>`;
  } else if (footerStyle === 'line') {
    footerHTML = `<div style="padding:0 52px 20px;">${renderFooter('line', { handle })}</div>`;
  } else if (footerStyle === 'minimal') {
    footerHTML = `<div style="padding:0 52px 20px;">${renderFooter('minimal', { handle })}</div>`;
  }

  // Editorial elements (header strip + script watermark)
  const headerStripHTML = isEditorial
    ? `<div class="editorial-header-strip"><span>${escapeHTML(brandName)}</span><span>${escapeHTML(brandName)}</span><span>${escapeHTML(brandName)}</span></div>`
    : '';
  const scriptBgHTML = isEditorial && scriptText
    ? `<div class="editorial-script-bg">${escapeHTML(scriptText)}</div>`
    : '';

  const effectiveDecorative = isEditorial ? 'none' : decorative;
  const body = `
  ${renderDecorative(effectiveDecorative)}
  ${!decorativeHasSlash(effectiveDecorative) ? renderSlash('accent') : ''}
  ${headerStripHTML}
  ${scriptBgHTML}

  <div class="composite-layout">
    <div class="composite-top" ${isEditorial ? 'style="padding-top: 52px;"' : ''}>
      ${showLogo ? `<div class="composite-logo">${logoImage ? `<img src="${logoImage}" alt="CDR">` : SVG_CDR_LOGO}</div>` : ''}
      <h1 class="h1-composite">${formatHeadline(headline)}</h1>
      ${subtitle ? `<p class="subtitle">${formatSubtitle(subtitle)}</p>` : ''}
    </div>

    ${middleHTML}

    ${bottomHTML}

    ${handle && footerStyle === 'none' ? `<div class="composite-handle">${escapeHTML(handle)}</div>` : ''}

    ${footerHTML}
  </div>`;

  return wrapHTML('Composite — CDR', body, { palette, font, style });
}

// ================================================================
// TEMPLATE 3: SPLIT
// ================================================================

function splitPost(data) {
  const { headline, subtitle, rightContent, checklist, checkIcon, devices,
    handle, decorative = 'none', footerStyle = 'none', palette, font } = data;

  const p = resolvePalette(palette);

  let rightHTML = '';
  if (devices && devices.length > 0) {
    rightHTML = renderDevices(devices);
  } else if (checklist && checklist.length > 0) {
    rightHTML = renderChecklist(checklist, checkIcon || 'check', 'lg');
  } else if (rightContent) {
    rightHTML = `<div style="font-family:var(--font-hl); font-weight:800; font-size:120px; color:${p.splitTextColor || 'var(--bg)'}; line-height:1;">${escapeHTML(rightContent)}</div>`;
  }

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('ghost') : ''}

  <div class="split-layout">
    <div class="split-left">
      <h1 class="h1-bold">${formatHeadline(headline)}</h1>
      ${subtitle ? `<p class="subtitle">${formatSubtitle(subtitle)}</p>` : ''}
      ${handle ? `<p class="handle-tag" style="margin-top:auto; padding-bottom:12px;">${escapeHTML(handle)}</p>` : ''}
    </div>
    <div class="split-right ${devices ? 'split-right-dark' : ''}">
      ${rightHTML}
    </div>
  </div>`;

  return wrapHTML('Split — CDR', body, { palette, font });
}

// ================================================================
// TEMPLATE 4: BOLD STATEMENT
// ================================================================

function boldStatementPost(data) {
  const { headline, subtitle, handle, decorative = 'none', footerStyle = 'minimal', palette, font } = data;

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('ghost') : ''}

  <div class="bold-layout">
    <h1 class="h1-bold">${formatHeadline(headline)}</h1>
    ${subtitle ? `<div class="divider center wide"></div><p class="subtitle">${formatSubtitle(subtitle)}</p>` : ''}
    ${renderFooter(footerStyle, { handle })}
  </div>`;

  return wrapHTML('Bold Statement — CDR', body, { palette, font });
}

// ================================================================
// TEMPLATE 5: CHECKLIST / LISTA
// ================================================================

function checklistPost(data) {
  const { headline, checklist, checkIcon, handle,
    decorative = 'glow', footerStyle = 'line', palette, font } = data;

  const checklistHTML = checklist && checklist.length > 0
    ? renderChecklist(checklist, checkIcon || 'check', 'lg') : '';

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('accent') : ''}

  <div class="content">
    <div style="flex-shrink:0; margin-bottom:32px;">
      <h1 class="h1-content">${formatHeadline(headline)}</h1>
    </div>

    <div class="main top-aligned">
      ${checklistHTML}
    </div>

    ${renderFooter(footerStyle, { handle })}
  </div>`;

  return wrapHTML('Checklist — CDR', body, { palette, font });
}

// ================================================================
// TEMPLATE 6: DATA / METRICAS
// ================================================================

function dataMetricsPost(data) {
  const { headline, metrics, handle, decorative = 'grid-lines', footerStyle = 'line', palette, font } = data;

  const metricsHTML = (metrics || []).map(m => `
    <div class="metric-card">
      <div class="metric-value">${escapeHTML(m.value)}</div>
      <div class="metric-divider"></div>
      <div class="metric-label">${escapeHTML(m.label)}</div>
    </div>`).join('\n');

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('accent') : ''}

  <div class="data-layout">
    <div class="data-top">
      <h1 class="h1-data">${formatHeadline(headline)}</h1>
    </div>

    <div class="data-metrics-area">
      <div class="metrics-grid">
        ${metricsHTML}
      </div>
    </div>

    ${renderFooter(footerStyle, { handle })}
  </div>`;

  return wrapHTML('Data Metrics — CDR', body, { palette, font });
}

// ================================================================
// TEMPLATE 7: TICKER / BRAND
// ================================================================

function tickerBrandPost(data) {
  const { headline, subtitle, handle, decorative = 'ticker', footerStyle = 'minimal', palette, font } = data;

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('ghost') : ''}

  <div class="content" style="padding-top:80px;">
    <div class="main center-aligned">
      <h1 class="h1-editorial">${formatHeadline(headline)}</h1>
      ${subtitle ? `<div class="divider center wide"></div><p class="subtitle" style="text-align:center;">${formatSubtitle(subtitle)}</p>` : ''}
    </div>

    ${renderFooter(footerStyle, { handle })}
  </div>`;

  return wrapHTML('Ticker Brand — CDR', body, { palette, font });
}

// ================================================================
// TEMPLATE 8: PHOTO OVERLAY
// ================================================================

function photoOverlayPost(data) {
  const { headline, subtitle, backgroundImage, label, handle,
    decorative = 'corner-accent', footerStyle = 'minimal', palette, font } = data;

  const bgStyle = backgroundImage
    ? `background-image: linear-gradient(rgba(8,8,10,0.65), rgba(8,8,10,0.80)), url('${backgroundImage}'); background-size: cover; background-position: center;`
    : '';

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('ghost') : ''}

  <div class="content" style="${bgStyle}">
    <div class="main">
      ${label ? `<div class="label">${escapeHTML(label)}</div>` : ''}
      <h1 class="h1-editorial">${formatHeadline(headline)}</h1>
      ${subtitle ? `<p class="subtitle">${formatSubtitle(subtitle)}</p>` : ''}
    </div>

    ${renderFooter(footerStyle, { handle })}
  </div>`;

  return wrapHTML('Photo Overlay — CDR', body, { palette, font });
}

// ================================================================
// CAROUSEL TEMPLATES (kept from v4 with decorative support)
// ================================================================

function carouselCover(data) {
  const { headline, subtitle, topic, totalSlides, backgroundImage,
    decorative = 'glow', palette, font } = data;

  const bgStyle = backgroundImage
    ? `style="background-image: linear-gradient(rgba(8,8,10,0.80), rgba(8,8,10,0.88)), url('${backgroundImage}'); background-size: cover; background-position: center;"`
    : '';

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('bold') : ''}

  <div class="content" ${bgStyle}>
    <div class="main center-aligned">
      <div class="label">${escapeHTML(topic)}</div>
      <h1 class="h1-cover">${formatHeadline(headline)}</h1>
      <div class="divider center wide"></div>
      <p class="subtitle" style="text-align:center;">${formatSubtitle(subtitle)}</p>
    </div>

    ${renderFooter('bar', { counter: `1/${totalSlides}` })}
  </div>`;

  return wrapHTML(`Cover — ${topic}`, body, { palette, font });
}

function carouselContent(data) {
  const { number, headline, bullets, topic, slideIndex, totalSlides,
    backgroundImage, decorative = 'grid-lines', palette, font } = data;

  const bgStyle = backgroundImage
    ? `style="background-image: linear-gradient(rgba(8,8,10,0.85), rgba(8,8,10,0.92)), url('${backgroundImage}'); background-size: cover; background-position: center;"`
    : '';

  const bulletsHTML = bullets
    .map(b => `<li><span class="marker"></span><span>${formatBulletText(b)}</span></li>`)
    .join('\n        ');

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('ghost') : ''}
  <div class="deco-bignumber">${number}</div>

  <div class="content" ${bgStyle}>
    <div class="header">
      <span class="brand-name">CDR GROUP</span>
      <span class="topic-tag">${escapeHTML(topic)}</span>
    </div>

    <div class="main top-aligned">
      <div class="slide-num">${number}</div>
      <h1 class="h1-content">${formatHeadline(headline)}</h1>
      <ul class="bullets">
        ${bulletsHTML}
      </ul>
    </div>

    ${renderFooter('bar', { counter: `${slideIndex}/${totalSlides}` })}
  </div>`;

  return wrapHTML(`Slide ${slideIndex} — ${topic}`, body, { palette, font });
}

function carouselCTA(data) {
  const { headline, description, ctaText, handle, topic, totalSlides,
    backgroundImage, decorative = 'corner-accent', palette, font } = data;

  const bgStyle = backgroundImage
    ? `style="background-image: linear-gradient(rgba(8,8,10,0.80), rgba(8,8,10,0.88)), url('${backgroundImage}'); background-size: cover; background-position: center;"`
    : '';

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('double') : ''}
  <div class="bg-layer-glow" style="top:25%"></div>

  <div class="content" ${bgStyle}>
    <div class="header">
      <span class="brand-name">CDR GROUP</span>
    </div>

    <div class="main center-aligned">
      <h1 class="h1-cta">${formatHeadline(headline)}</h1>
      <div class="divider center wide"></div>
      <p class="desc" style="text-align:center; margin-bottom:40px;">${formatDescription(description)}</p>
      <div class="cta-btn">${escapeHTML(ctaText)}</div>
      <p class="handle-tag">${escapeHTML(handle)}</p>
    </div>

    ${renderFooter('bar', { counter: `${totalSlides}/${totalSlides}` })}
  </div>`;

  return wrapHTML(`CTA — ${topic}`, body, { palette, font });
}

// ================================================================
// LEGACY TEMPLATES (backward compat)
// ================================================================

function feedPost(data) {
  const { headline, subtitle, description, backgroundImage,
    decorative = 'gradient-top', footerStyle = 'bar', handle, palette, font } = data;

  const bgStyle = backgroundImage
    ? `style="background-image: linear-gradient(rgba(8,8,10,0.75), rgba(8,8,10,0.88)), url('${backgroundImage}'); background-size: cover; background-position: center;"`
    : '';

  const descHTML = description
    ? `<div class="divider"></div><p class="desc">${formatDescription(description)}</p>`
    : '';

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('accent') : ''}
  <div class="bg-layer-glow"></div>

  <div class="content" ${bgStyle}>
    <div class="main">
      <h1 class="h1-post">${formatHeadline(headline)}</h1>
      ${subtitle ? `<p class="subtitle">${formatSubtitle(subtitle)}</p>` : ''}
      ${descHTML}
    </div>

    ${renderFooter(footerStyle, { handle })}
  </div>`;

  return wrapHTML('Feed Post — CDR', body, { palette, font });
}

function storiesPost(data) {
  const { headline, subtitle, ctaText, backgroundImage, label,
    decorative = 'hud-frame', handle, palette, font } = data;

  const bgStyle = backgroundImage
    ? `background-image: linear-gradient(rgba(8,8,10,0.65), rgba(8,8,10,0.82)), url('${backgroundImage}'); background-size: cover; background-position: center;`
    : '';

  const labelHTML = label
    ? `<div class="label" style="justify-content:center; margin-bottom:28px;"><span>${escapeHTML(label)}</span></div>`
    : '';

  const body = `
  ${renderDecorative(decorative)}
  <div class="hud-grid"></div>

  <div class="content" style="padding: 80px 60px; ${bgStyle}">
    <div style="height:160px;"></div>
    <div class="main center-aligned">
      ${labelHTML}
      <h1 class="h1-cover" style="font-size:78px;">${formatHeadline(headline)}</h1>
      ${subtitle ? `<div class="divider center wide"></div><p class="subtitle" style="text-align:center;">${formatSubtitle(subtitle)}</p>` : ''}
    </div>
    ${ctaText ? `<div style="text-align:center; margin-bottom:220px;"><div class="hud-cta">${escapeHTML(ctaText)}</div></div>` : '<div style="height:220px;"></div>'}
    ${renderFooter('bar', { handle, brandName: 'CDR GROUP' })}
  </div>`;

  return wrapHTML('Stories — CDR', body, { isVertical: true, palette, font });
}

// ================================================================
// HELPERS
// ================================================================

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function formatHeadline(text) {
  if (!text) return '';
  return escapeHTML(text)
    .replace(/==(.+?)==/g, '<span class="hl">$1</span>')
    .replace(/\*\*(.+?)\*\*/g, '<span class="b">$1</span>');
}

function formatSubtitle(text) {
  if (!text) return '';
  return escapeHTML(text)
    .replace(/\*\*(.+?)\*\*/g, '<span class="b">$1</span>');
}

function formatBulletText(text) {
  return escapeHTML(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function formatDescription(text) {
  return escapeHTML(text)
    .replace(/==(.+?)==/g, '<span class="hl">$1</span>')
    .replace(/\*\*(.+?)\*\*/g, '<span class="b">$1</span>');
}

// ================================================================
// TEMPLATE 9: HUD DASHBOARD (CDR Signature — Full HUD aesthetic)
// ================================================================

function hudDashboardPost(data) {
  const {
    headline, subtitle, metrics, logoImage,
    statusText, tag, handle, cta,
    decorative = 'hud-full', palette = 'dark', font = 'serif',
  } = data;

  const topBar = renderHudTopBar({ logoImage, statusText, tag });
  const metricsHTML = renderHudMetrics(metrics);

  const ctaHTML = cta
    ? `<div style="text-align:center; padding-top:24px;"><div class="hud-cta">${escapeHTML(cta)}</div></div>`
    : '';

  const handleHTML = handle
    ? `<div class="hud-handle">${escapeHTML(handle)}</div>`
    : '';

  const body = `
  ${renderDecorative(decorative)}

  <div class="content">
    ${topBar}

    <div class="main center-aligned">
      <h1 class="h1-post">${formatHeadline(headline)}</h1>
      ${subtitle ? `<div class="hud-status" style="justify-content:center; margin-top:8px; font-size:14px; letter-spacing:0.1em;">${escapeHTML(subtitle)}</div>` : ''}
    </div>

    ${metricsHTML}
    ${ctaHTML}
    ${handleHTML}
  </div>`;

  return wrapHTML('HUD Dashboard — CDR', body, { palette, font });
}

// ================================================================
// TEMPLATE 10: HUD COMPOSITE (Case + HUD Frame)
// ================================================================

function hudCompositePost(data) {
  const {
    headline, subtitle, devices, checklist, checkIcon,
    bottomText, metrics, logoImage, statusText, tag,
    handle, decorative = 'hud-frame', palette = 'dark', font = 'serif',
    variant = 'clean',
  } = data;

  // --- Shared: Top bar (logo 80px + tag/status) ---
  const logoHTML = logoImage
    ? `<div style="width:80px; height:80px; flex-shrink:0;"><img src="${logoImage}" alt="CDR" style="width:100%; height:100%; object-fit:contain;"></div>`
    : '';
  const tagHTML = tag
    ? `<div class="hud-tag">${escapeHTML(tag)}</div>`
    : `<div class="hud-status"><div class="hud-status-dot"></div>${escapeHTML(statusText || 'PERFORMANCE ONLINE')}</div>`;

  const topBarHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:32px 48px 0; flex-shrink:0;">
      <div style="display:flex; align-items:center; gap:16px;">
        ${logoHTML}
        <div style="font-family:var(--font-body); font-weight:800; font-size:13px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(var(--primary-rgb),0.6);">CDR Group</div>
      </div>
      ${tagHTML}
    </div>`;

  // --- Shared: Headline ---
  const headlineHTML = `
    <div style="text-align:center; padding:20px 52px 0; flex-shrink:0;">
      <h1 class="h1-composite" style="font-size:42px; margin-bottom:8px;">${formatHeadline(headline)}</h1>
      ${subtitle ? `<p style="font-family:var(--font-body); font-weight:400; font-size:17px; color:var(--text-muted); line-height:1.45; max-width:680px; margin:0 auto;">${formatSubtitle(subtitle)}</p>` : ''}
    </div>`;

  // --- Shared: Bottom text + handle ---
  const bottomHTML = bottomText
    ? `<p style="font-family:var(--font-hl); font-style:italic; font-weight:400; font-size:19px; color:var(--text-off); line-height:1.4; text-align:center;">${formatDescription(bottomText)}</p>`
    : '';
  const handleHTML = handle
    ? `<div style="text-align:center; font-family:var(--font-body); font-size:12px; font-weight:600; letter-spacing:0.1em; color:rgba(255,255,255,0.25); padding-top:8px;">${escapeHTML(handle)}</div>`
    : '';

  // --- Devices ---
  const devicesHTML = devices && devices.length > 0 ? renderDevices(devices) : '';

  let middleHTML = '';
  let bottomZoneHTML = '';

  if (variant === 'metrics-panel') {
    // ============================================================
    // VARIANTE B: Devices esquerda + Metrics panel direita (glass)
    // ============================================================
    const metricsPanelItems = (metrics || []).map(m => `
      <div style="display:flex; align-items:baseline; gap:12px; padding:12px 0; border-bottom:1px solid rgba(var(--primary-rgb),0.08);">
        <div style="font-family:var(--font-mono); font-weight:700; font-size:36px; color:var(--primary); line-height:1; text-shadow:0 0 20px rgba(var(--primary-rgb),0.15);">${escapeHTML(m.value)}</div>
        <div style="font-family:var(--font-mono); font-size:10px; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,255,255,0.35);">${escapeHTML(m.label)}</div>
      </div>`).join('\n');

    const rightPanelHTML = metricsPanelItems
      ? `<div class="composite-checklist-panel" style="padding:20px 24px;">
          <div style="font-family:var(--font-mono); font-size:9px; font-weight:600; letter-spacing:0.25em; text-transform:uppercase; color:rgba(var(--primary-rgb),0.4); margin-bottom:8px;">RESULTADOS</div>
          ${metricsPanelItems}
        </div>` : '';

    middleHTML = `
    <div style="display:flex; padding:16px 28px 0; gap:16px; flex:1; align-items:stretch; min-height:0;">
      ${devicesHTML ? `<div style="flex:1.2; position:relative; min-height:0; overflow:visible;">
        <div style="position:absolute; width:75%; height:50%; top:25%; left:15%; background:radial-gradient(ellipse, rgba(var(--primary-rgb),0.06) 0%, transparent 70%); filter:blur(50px); z-index:0; pointer-events:none;"></div>
        ${devicesHTML}
      </div>` : ''}
      <div style="flex:0.75; display:flex; flex-direction:column; justify-content:center;">${rightPanelHTML}</div>
    </div>`;

    bottomZoneHTML = `
    <div style="padding:16px 52px 28px; flex-shrink:0;">
      ${bottomHTML}
      ${handleHTML}
    </div>`;

  } else {
    // ============================================================
    // VARIANTE A (clean): Devices esquerda + Checklist direita, sem metricas
    // ============================================================
    const trimmedChecklist = checklist ? checklist.slice(0, 4) : [];
    const checklistHTML = trimmedChecklist.length > 0
      ? renderChecklist(trimmedChecklist, checkIcon || 'check') : '';
    const checklistPanelHTML = checklistHTML
      ? `<div class="composite-checklist-panel">${checklistHTML}</div>` : '';

    middleHTML = (devicesHTML || checklistPanelHTML) ? `
    <div style="display:flex; padding:16px 28px 0; gap:14px; flex:1; align-items:stretch; min-height:0;">
      ${devicesHTML ? `<div style="flex:1.2; position:relative; min-height:0; overflow:visible;">
        <div style="position:absolute; width:75%; height:50%; top:25%; left:15%; background:radial-gradient(ellipse, rgba(var(--primary-rgb),0.06) 0%, transparent 70%); filter:blur(50px); z-index:0; pointer-events:none;"></div>
        ${devicesHTML}
      </div>` : ''}
      ${checklistPanelHTML ? `<div style="flex:0.8; display:flex; flex-direction:column; justify-content:center;">${checklistPanelHTML}</div>` : ''}
    </div>` : '';

    bottomZoneHTML = `
    <div style="padding:16px 52px 28px; flex-shrink:0;">
      ${bottomHTML}
      ${handleHTML}
    </div>`;
  }

  const body = `
  ${renderDecorative(decorative)}

  <div style="position:relative; z-index:10; display:flex; flex-direction:column; height:100%; padding:0;">
    ${topBarHTML}
    ${headlineHTML}
    ${middleHTML}
    ${bottomZoneHTML}
  </div>`;

  return wrapHTML('HUD Composite — CDR', body, { palette, font });
}

// ================================================================
// TEMPLATE: TESTIMONIAL (depoimento/prova social)
// ================================================================

function testimonialPost(data) {
  const { headline, quote, authorName, authorRole, authorPhoto,
    metricValue, metricLabel, handle, decorative = 'hud-corners',
    footerStyle = 'bar-v2', palette, font } = data;

  const photoHTML = authorPhoto
    ? `<img src="${authorPhoto}" alt="" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--primary); box-shadow: 0 0 20px rgba(var(--primary-rgb),0.3);">`
    : `<div style="width:80px; height:80px; border-radius:50%; background:rgba(var(--primary-rgb),0.15); border:2px solid var(--primary); display:flex; align-items:center; justify-content:center; font-family:var(--font-hl); font-size:32px; color:var(--primary);">${(authorName || '?')[0]}</div>`;

  const metricHTML = metricValue
    ? `<div style="margin-top:32px; text-align:center;">
        <div class="metric-highlight" style="font-size:42px;">${escapeHTML(metricValue)}</div>
        ${metricLabel ? `<div style="font-family:var(--font-mono); font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:var(--text-dim); margin-top:8px;">${escapeHTML(metricLabel)}</div>` : ''}
      </div>`
    : '';

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('ghost') : ''}

  <div class="content" style="padding: 60px;">
    <div class="main center-aligned">
      <div style="margin-bottom:24px;">${photoHTML}</div>
      <h1 class="h1-editorial" style="font-size:52px; font-style:italic; max-width:800px;">${formatHeadline(quote || headline)}</h1>
      <div style="margin-top:20px;">
        <div style="font-family:var(--font-body); font-weight:700; font-size:18px; color:var(--text-bright);">${escapeHTML(authorName || '')}</div>
        ${authorRole ? `<div style="font-family:var(--font-body); font-size:14px; color:var(--text-muted); margin-top:4px;">${escapeHTML(authorRole)}</div>` : ''}
      </div>
      ${metricHTML}
    </div>

    ${renderFooter(footerStyle, { handle })}
  </div>`;

  return wrapHTML('Testimonial — CDR', body, { palette, font });
}

// ================================================================
// TEMPLATE: COMPARISON (antes/depois, errado/certo)
// ================================================================

function comparisonPost(data) {
  const { leftLabel = 'ANTES', rightLabel = 'DEPOIS', leftItems = [], rightItems = [],
    headline, handle, decorative = 'hud-frame', footerStyle = 'bar-v2', palette, font } = data;

  const renderSide = (items, isRight) => items.map(item =>
    `<div style="display:flex; align-items:flex-start; gap:12px; margin-bottom:16px;">
      <span style="flex-shrink:0; font-size:18px; line-height:1.4;">${isRight ? '<span style="color:var(--primary);">&#10003;</span>' : '<span style="color:#FF4444;">&#10007;</span>'}</span>
      <span style="font-family:var(--font-body); font-size:18px; color:${isRight ? 'var(--text-bright)' : 'var(--text-muted)'}; line-height:1.4;">${escapeHTML(item)}</span>
    </div>`
  ).join('');

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('accent') : ''}

  <div class="content" style="padding: 60px;">
    ${headline ? `<h1 class="h1-data" style="text-align:center; margin-bottom:40px;">${formatHeadline(headline)}</h1>` : ''}

    <div style="display:flex; gap:24px; flex:1; align-items:stretch;">
      <div style="flex:1; padding:28px; border-radius:12px; background:rgba(255,68,68,0.06); border:1px solid rgba(255,68,68,0.12);">
        <div style="font-family:var(--font-mono); font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:#FF4444; margin-bottom:20px;">${escapeHTML(leftLabel)}</div>
        ${renderSide(leftItems, false)}
      </div>
      <div style="width:2px; background:linear-gradient(180deg, transparent, rgba(var(--primary-rgb),0.3), transparent); flex-shrink:0;"></div>
      <div style="flex:1; padding:28px; border-radius:12px; background:rgba(var(--primary-rgb),0.04); border:1px solid rgba(var(--primary-rgb),0.12);">
        <div style="font-family:var(--font-mono); font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:var(--primary); margin-bottom:20px;">${escapeHTML(rightLabel)}</div>
        ${renderSide(rightItems, true)}
      </div>
    </div>

    ${renderFooter(footerStyle, { handle })}
  </div>`;

  return wrapHTML('Comparison — CDR', body, { palette, font });
}

// ================================================================
// TEMPLATE: METRIC HERO (numero gigante central)
// ================================================================

function metricHeroPost(data) {
  const { value, label, headline, subtitle, handle,
    decorative = 'hud-full', footerStyle = 'bar-v2', palette, font } = data;

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('bold') : ''}

  <div class="content" style="padding: 60px;">
    <div class="main center-aligned">
      ${headline ? `<div style="font-family:var(--font-mono); font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:var(--text-dim); margin-bottom:24px;">${escapeHTML(headline)}</div>` : ''}
      <div style="font-family:var(--font-mono); font-weight:700; font-size:128px; color:var(--primary); line-height:1; text-shadow: 0 0 40px rgba(var(--primary-rgb),0.3), 0 0 120px rgba(var(--primary-rgb),0.1);">${escapeHTML(value || '0')}</div>
      ${label ? `<div style="font-family:var(--font-mono); font-size:14px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-top:16px;">${escapeHTML(label)}</div>` : ''}
      ${subtitle ? `<p class="subtitle" style="text-align:center; margin-top:32px; max-width:600px;">${formatSubtitle(subtitle)}</p>` : ''}
    </div>

    ${renderFooter(footerStyle, { handle })}
  </div>`;

  return wrapHTML('Metric Hero — CDR', body, { palette, font });
}

// ================================================================
// TEMPLATE: REELS COVER (1080x1920 vertical com play button)
// ================================================================

function reelsCoverPost(data) {
  const { headline, subtitle, topic, backgroundImage, handle,
    decorative = 'hud-corners', palette, font } = data;

  const bgStyle = backgroundImage
    ? `background-image: linear-gradient(rgba(8,8,10,0.55), rgba(8,8,10,0.78)), url('${backgroundImage}'); background-size: cover; background-position: center;`
    : '';

  const body = `
  ${renderDecorative(decorative)}
  ${!decorativeHasSlash(decorative) ? renderSlash('accent') : ''}

  <div class="content" style="padding: 80px 60px; ${bgStyle}">
    <div style="height:200px;"></div>

    <div class="main center-aligned">
      ${topic ? `<div class="label" style="justify-content:center; margin-bottom:20px;"><span>${escapeHTML(topic)}</span></div>` : ''}
      <h1 class="h1-cover" style="font-size:72px;">${formatHeadline(headline)}</h1>
      ${subtitle ? `<div class="divider center wide"></div><p class="subtitle" style="text-align:center;">${formatSubtitle(subtitle)}</p>` : ''}

      <div style="margin-top:48px; width:80px; height:80px; border-radius:50%; background:rgba(var(--primary-rgb),0.12); border:2px solid rgba(var(--primary-rgb),0.4); display:flex; align-items:center; justify-content:center; box-shadow: 0 0 30px rgba(var(--primary-rgb),0.2);">
        <div style="width:0; height:0; border-top:14px solid transparent; border-bottom:14px solid transparent; border-left:22px solid var(--primary); margin-left:4px;"></div>
      </div>
    </div>

    <div style="height:160px;"></div>
    ${renderFooter('bar-v2', { handle, brandName: 'CDR GROUP' })}
  </div>`;

  return wrapHTML('Reels Cover — CDR', body, { isVertical: true, palette, font });
}

// ================================================================
// TEMPLATE: BRUTALIST HEADLINE v9 (replica @design.descomplicado)
// PIXEL-PERFECT: organic gradient + cream text + green 3D extrusion
// Canvas grain (3 layers) + vignette + corner darkening + frame card
// ================================================================

function brutalistCalcLineSize(line, targetWidth = 1040) {
  const W = { // character width weights for Luckiest Guy uppercase
    'I':0.42,'J':0.48,'L':0.50,'!':0.35,'.':0.35,',':0.35,' ':0.30,
    '1':0.42,':':0.35,';':0.35,"'":0.28,'"':0.45,'?':0.62,
    'M':0.82,'W':0.82,'Q':0.78,'O':0.76,'D':0.72,'G':0.74,
    'N':0.72,'H':0.70,'U':0.70,'B':0.68,'R':0.68,'P':0.65,
    'K':0.68,'X':0.68,'V':0.68,'Y':0.65,'Z':0.65,'C':0.70,
    'E':0.62,'F':0.58,'S':0.65,'T':0.62,'A':0.72,
    '\u00C3':0.72,'\u00C1':0.72,'\u00C9':0.65,'\u00CA':0.65,
    '\u00CD':0.42,'\u00D3':0.76,'\u00DA':0.72,'\u00C7':0.72,
    '\u00C2':0.72,'\u00D5':0.76,'\u00C0':0.72,
  };
  let total = 0;
  for (const c of line.toUpperCase()) total += W[c] || 0.67;
  return Math.round(targetWidth / total);
}

function brutalistHeadlinePost(data) {
  const {
    headline,
    handle = '@cdrgroup.assessoria',
    footerCta = 'CONTE\u00DADO AO LADO',
  } = data;

  // Split headline into lines and calculate per-line font size
  const lines = headline.replace(/==|(\*\*)|__/g, '').split('\n').filter(l => l.trim());
  const widthSizes = lines.map(l => brutalistCalcLineSize(l.trim()));

  // Height-fill logic: text block should fill ~70% of usable height (1350 - 120 = 1230px)
  const targetHeight = 860;
  const lineH = 0.82;
  const currentHeight = widthSizes.reduce((s, sz) => s + sz * lineH, 0);
  let vScale = 1;
  if (currentHeight < targetHeight) {
    vScale = Math.min(1.35, targetHeight / currentHeight); // max 35% scale-up
  }

  const lineHTML = lines.map((line, i) => {
    let sz = Math.round(widthSizes[i] * vScale);
    sz = Math.min(420, Math.max(120, sz));
    return `<span class="brt-line" style="font-size:${sz}px">${escapeHTML(line.trim())}</span>`;
  }).join('\n      ');

  // Generate complete standalone HTML (bypasses wrapHTML for pixel-perfect control)
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; height: 1350px; overflow: hidden; background: #000; }

  .card {
    position: relative; width: 1080px; height: 1350px;
    border-radius: 26px; overflow: hidden;
    border: 4px solid rgba(0,0,0,0.72);
    box-shadow: 0 0 22px 6px rgba(0,0,0,0.60);
  }

  /* === ORGANIC GRADIENT BACKGROUND (green blobs) === */
  .bg-base { position: absolute; inset: 0; background: #3D6000; }
  .blob-dark-corner {
    position: absolute; top: -20%; left: -18%; width: 85%; height: 72%;
    background: radial-gradient(ellipse at 28% 32%, rgba(3,8,0,0.98) 0%, rgba(12,22,0,0.80) 25%, rgba(25,40,0,0.40) 50%, transparent 66%);
    z-index: 2;
  }
  .blob-mid {
    position: absolute; top: 20%; left: 10%; width: 80%; height: 55%;
    background: radial-gradient(ellipse, #4A7200 0%, #3D6000 35%, transparent 70%);
    z-index: 1;
  }
  .blob-warm {
    position: absolute; top: 30%; right: -10%; width: 68%; height: 55%;
    background: radial-gradient(ellipse, #6B9200 0%, #5A8000 30%, transparent 65%);
    z-index: 2;
  }
  .blob-bright {
    position: absolute; bottom: -22%; right: -16%; width: 90%; height: 75%;
    background: radial-gradient(ellipse at 60% 55%, #C8E800 0%, #B0D400 10%, #8FB800 25%, #6B9200 45%, transparent 72%);
    z-index: 3;
  }
  .blob-hot {
    position: absolute; bottom: -12%; right: -10%; width: 55%; height: 48%;
    background: radial-gradient(circle, #DDFF30 0%, #C8E800 14%, #B0D400 32%, transparent 56%);
    z-index: 4; filter: blur(12px);
  }
  .blob-subtle {
    position: absolute; bottom: 10%; left: 15%; width: 45%; height: 38%;
    background: radial-gradient(circle, rgba(140,190,0,0.35) 0%, rgba(100,150,0,0.10) 45%, transparent 65%);
    z-index: 3; filter: blur(30px);
  }

  /* === 3D BLOCK LETTER TEXT === */
  .text-wrapper {
    position: absolute; top: 50%; left: 10px; right: 10px;
    transform: translateY(-48%); z-index: 30;
  }
  .brt-line {
    display: block;
    font-family: 'Luckiest Guy', cursive;
    text-transform: uppercase;
    color: #F2E2C4;
    line-height: 0.82;
    letter-spacing: -0.025em;
    paint-order: stroke fill;
    -webkit-text-stroke: 8px #0E0C06;
    text-shadow:
      2px 2px 0 #7CB800, 3px 3px 0 #7CB800,
      4px 4px 0 #7CB800, 5px 5px 0 #7CB800,
      6px 6px 0 #7CB800, 7px 7px 0 #7CB800,
      8px 8px 0 #7CB800, 9px 9px 0 #7CB800,
      10px 10px 0 #6BA600, 11px 11px 0 #5A9400,
      12px 12px 0 #4A8200, 13px 13px 0 #3A7000,
      14px 14px 0 #0A0800, 15px 15px 0 #0A0800,
      16px 16px 0 #080600, 17px 17px 0 #060400,
      18px 18px 0 #050300, 19px 19px 0 #040200,
      20px 20px 0 #030100, 21px 21px 0 #020100;
  }
  .brt-line + .brt-line { margin-top: 0; }

  /* === HEADER === */
  .header {
    position: absolute; top: 26px; left: 30px; right: 30px;
    display: flex; justify-content: space-between; align-items: center; z-index: 120;
  }
  .handle {
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700;
    color: rgba(255,255,255,0.22); letter-spacing: 0.01em;
  }
  .logo-icon {
    width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800;
    font-size: 13px; color: rgba(255,255,255,0.25);
  }

  /* === FOOTER === */
  .footer {
    position: absolute; bottom: 26px; left: 30px; z-index: 120;
    display: flex; align-items: center; gap: 8px;
  }
  .cta-text {
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 700;
    color: rgba(255,255,255,0.20); letter-spacing: 0.06em; text-transform: uppercase;
  }
  .cta-circle {
    width: 22px; height: 22px; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.16); background: transparent;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; color: rgba(255,255,255,0.24);
    font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* === POST-PROCESSING === */
  .vignette {
    position: absolute; inset: 0; z-index: 90; pointer-events: none;
    box-shadow:
      inset 0 0 130px 45px rgba(0,0,0,0.50),
      inset 0 0 260px 85px rgba(0,0,0,0.20),
      inset 0 0 420px 105px rgba(0,0,0,0.08);
  }
  .corner-dark {
    position: absolute; inset: 0; z-index: 89; pointer-events: none;
    background:
      radial-gradient(ellipse at 0% 0%, rgba(0,0,0,0.52) 0%, transparent 48%),
      radial-gradient(ellipse at 100% 0%, rgba(0,0,0,0.38) 0%, transparent 42%),
      radial-gradient(ellipse at 0% 100%, rgba(0,0,0,0.30) 0%, transparent 42%),
      radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.08) 0%, transparent 35%);
  }
  #grain-canvas {
    position: absolute; inset: 0; z-index: 100;
    pointer-events: none; mix-blend-mode: overlay; opacity: 0.36;
  }
  #grain-canvas-2 {
    position: absolute; inset: 0; z-index: 101;
    pointer-events: none; mix-blend-mode: soft-light; opacity: 0.22;
  }
  #grain-canvas-3 {
    position: absolute; inset: 0; z-index: 102;
    pointer-events: none; mix-blend-mode: multiply; opacity: 0.07;
  }
  .inner-border {
    position: absolute; inset: 0; border-radius: 24px;
    box-shadow: inset 0 0 4px 1px rgba(0,0,0,0.42);
    z-index: 110; pointer-events: none;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="bg-base"></div>
    <div class="blob-dark-corner"></div>
    <div class="blob-mid"></div>
    <div class="blob-warm"></div>
    <div class="blob-bright"></div>
    <div class="blob-hot"></div>
    <div class="blob-subtle"></div>

    <div class="header">
      <span class="handle">${escapeHTML(handle)}</span>
      <div class="logo-icon">C</div>
    </div>

    <div class="text-wrapper">
      ${lineHTML}
    </div>

    <div class="footer">
      <span class="cta-text">${escapeHTML(footerCta)}</span>
      <div class="cta-circle">\u2192</div>
    </div>

    <div class="corner-dark"></div>
    <div class="vignette"></div>
    <canvas id="grain-canvas" width="1080" height="1350"></canvas>
    <canvas id="grain-canvas-2" width="1080" height="1350"></canvas>
    <canvas id="grain-canvas-3" width="1080" height="1350"></canvas>
    <div class="inner-border"></div>
  </div>

  <script>
    function gaussRandom() {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
    function generateFilmGrain(canvasId, opts) {
      const { mean, stddev, clumpSize, contrast } = opts;
      const canvas = document.getElementById(canvasId);
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      const noise = new Float32Array(w * h);
      for (let i = 0; i < noise.length; i++) noise[i] = mean + gaussRandom() * stddev;
      if (clumpSize > 1) {
        const temp = new Float32Array(noise.length);
        const half = Math.floor(clumpSize / 2);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            let sum = 0, count = 0;
            for (let dy = -half; dy <= half; dy++) {
              for (let dx = -half; dx <= half; dx++) {
                const nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < w && ny >= 0 && ny < h) { sum += noise[ny * w + nx]; count++; }
              }
            }
            temp[y * w + x] = sum / count;
          }
        }
        for (let i = 0; i < noise.length; i++) noise[i] = temp[i] * 0.6 + noise[i] * 0.4;
      }
      for (let i = 0; i < noise.length; i++) {
        let val = ((noise[i] - 128) * contrast) + 128;
        val = Math.max(0, Math.min(255, val));
        const pi = i * 4;
        data[pi] = val; data[pi+1] = val; data[pi+2] = val; data[pi+3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    }
    document.fonts.ready.then(() => {
      generateFilmGrain('grain-canvas', { mean: 128, stddev: 52, clumpSize: 1, contrast: 1.4 });
      generateFilmGrain('grain-canvas-2', { mean: 128, stddev: 46, clumpSize: 3, contrast: 1.2 });
      generateFilmGrain('grain-canvas-3', { mean: 108, stddev: 62, clumpSize: 4, contrast: 1.6 });
    });
  </script>
</body>
</html>`;
}

// ================================================================
// TEMPLATE ROUTER
// ================================================================

const TEMPLATE_MAP = {
  'editorial': editorialPost,
  'composite': compositePost,
  'split': splitPost,
  'bold-statement': brutalistHeadlinePost,   // PADRAO: redireciona para brutalist (texto preenche tudo)
  'checklist': checklistPost,
  'data-metrics': dataMetricsPost,
  'ticker-brand': tickerBrandPost,
  'photo-overlay': photoOverlayPost,
  'feed-post': brutalistHeadlinePost,        // PADRAO: redireciona para brutalist (texto preenche tudo)
  'stories': storiesPost,
  'hud-dashboard': hudDashboardPost,
  'hud-composite': hudCompositePost,
  'testimonial': testimonialPost,
  'comparison': comparisonPost,
  'metric-hero': metricHeroPost,
  'reels-cover': reelsCoverPost,
  'brutalist-headline': brutalistHeadlinePost,
};

// ================================================================
// MAIN
// ================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  let configPath = '';
  let outputDir = join(__dirname, '..', 'output');

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' && args[i + 1]) configPath = args[++i];
    else if (args[i] === '--output-dir' && args[i + 1]) outputDir = args[++i];
  }

  return { configPath, outputDir };
}

async function readConfig(configPath) {
  if (configPath) {
    const absPath = resolve(configPath);
    return JSON.parse(readFileSync(absPath, 'utf-8'));
  }
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString());
}

async function main() {
  const { configPath, outputDir } = parseArgs();
  const config = await readConfig(configPath);

  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const globalPalette = config.palette || 'dark';
  const globalFont = config.font || 'sans';
  const files = [];

  if (config.type === 'carousel') {
    // Carousel with multiple slides
    const { topic, slides } = config;
    const total = slides.length;
    const prefix = config.prefix || 'carousel';

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      let html;
      const common = { palette: globalPalette, font: globalFont };

      if (slide.type === 'cover') {
        html = carouselCover({ ...common, headline: slide.headline, subtitle: slide.subtitle, topic, totalSlides: total, backgroundImage: slide.backgroundImage, decorative: slide.decorative });
      } else if (slide.type === 'cta') {
        html = carouselCTA({ ...common, headline: slide.headline, description: slide.description, ctaText: slide.ctaText, handle: slide.handle || '@cdrgroup.assessoria', topic, totalSlides: total, backgroundImage: slide.backgroundImage, decorative: slide.decorative });
      } else {
        html = carouselContent({ ...common, number: slide.number || String(i).padStart(2, '0'), headline: slide.headline, bullets: slide.bullets || [], topic, slideIndex: i + 1, totalSlides: total, backgroundImage: slide.backgroundImage, decorative: slide.decorative });
      }

      const fileName = `${prefix}-slide-${i + 1}.html`;
      const filePath = join(outputDir, fileName);
      writeFileSync(filePath, html, 'utf-8');
      files.push(filePath);
      console.log(`HTML gerado: ${filePath}`);
    }
  } else {
    // Single post — route to correct template
    const templateFn = TEMPLATE_MAP[config.type];

    if (!templateFn) {
      console.error(`Tipo de template desconhecido: "${config.type}"`);
      console.error(`Templates disponiveis: ${Object.keys(TEMPLATE_MAP).join(', ')}`);
      process.exit(1);
    }

    const html = templateFn({
      ...config,
      palette: globalPalette,
      font: globalFont,
    });

    const fileName = `${config.prefix || config.type}.html`;
    const filePath = join(outputDir, fileName);
    writeFileSync(filePath, html, 'utf-8');
    files.push(filePath);
    console.log(`HTML gerado: ${filePath}`);
  }

  console.log(`\nTotal: ${files.length} arquivo(s) HTML gerado(s).`);
  console.log('Proximo passo: use Playwright para screenshot em 1080x1080.');
}

main().catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});
