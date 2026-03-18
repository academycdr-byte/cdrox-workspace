#!/usr/bin/env node
/**
 * scrape-instagram.mjs — Scraper de perfis Instagram via Apify
 *
 * Uso:
 *   node scripts/scrape-instagram.mjs --profile hausperformance
 *   node scripts/scrape-instagram.mjs --profile hausperformance --limit 30
 *   node scripts/scrape-instagram.mjs --profile lever.ecomm --download
 *
 * Requer: APIFY_TOKEN no .env (ou variavel de ambiente)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

// ── Load .env ──
function loadEnv() {
  const paths = [
    resolve(ROOT, '.env'),
    resolve(ROOT, '../../.env'),
  ];
  for (const p of paths) {
    if (existsSync(p)) {
      const lines = readFileSync(p, 'utf8').split('\n');
      for (const line of lines) {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const val = match[2].trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const APIFY_TOKEN = process.env.APIFY_TOKEN;
if (!APIFY_TOKEN) {
  console.error('Erro: APIFY_TOKEN nao encontrado no .env');
  process.exit(1);
}

// ── Parse args ──
const args = process.argv.slice(2);
function getArg(name, fallback) {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  return args[i + 1] || fallback;
}

const profile = getArg('profile', null);
const limit = parseInt(getArg('limit', '20'), 10);
const download = args.includes('--download');
const outputDir = resolve(ROOT, 'data', 'instagram-research');

if (!profile) {
  console.error('Uso: node scripts/scrape-instagram.mjs --profile <username> [--limit N] [--download]');
  process.exit(1);
}

console.log(`\n🔍 Scraping @${profile} (limit: ${limit} posts)...\n`);

// ── Apify API helpers ──
const API_BASE = 'https://api.apify.com/v2';

async function startActor(actorId, input) {
  const url = `${API_BASE}/acts/${actorId}/runs?token=${APIFY_TOKEN}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apify start failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function waitForRun(runId, maxWait = 300000) {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    const res = await fetch(`${API_BASE}/actor-runs/${runId}?token=${APIFY_TOKEN}`);
    const data = await res.json();
    const status = data.data?.status;

    if (status === 'SUCCEEDED') return data.data;
    if (status === 'FAILED' || status === 'ABORTED') {
      throw new Error(`Actor run ${status}: ${JSON.stringify(data.data?.statusMessage)}`);
    }

    process.stdout.write('.');
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('Timeout esperando actor completar');
}

async function getDataset(datasetId) {
  const res = await fetch(`${API_BASE}/datasets/${datasetId}/items?token=${APIFY_TOKEN}&format=json&clean=true`);
  if (!res.ok) throw new Error(`Dataset fetch failed: ${res.status}`);
  return res.json();
}

async function downloadImage(url, filepath) {
  const res = await fetch(url);
  if (!res.ok) return null;
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(filepath, buffer);
  return filepath;
}

// ── Main ──
async function main() {
  mkdirSync(outputDir, { recursive: true });

  // Usar apify/instagram-scraper (o mais popular e confiavel)
  const actorId = 'apify~instagram-scraper';

  const input = {
    directUrls: [`https://www.instagram.com/${profile}/`],
    resultsType: 'posts',
    resultsLimit: limit,
    searchType: 'user',
    searchLimit: 1,
    addParentData: false,
  };

  console.log('Iniciando actor apify/instagram-scraper...');
  const runResponse = await startActor(actorId, input);
  const runId = runResponse.data?.id;

  if (!runId) {
    throw new Error('Nao consegui iniciar o actor: ' + JSON.stringify(runResponse));
  }

  console.log(`Run ID: ${runId}`);
  process.stdout.write('Aguardando resultados');
  const runData = await waitForRun(runId);
  console.log('\n\nActor concluido!');

  // Buscar resultados
  const datasetId = runData.defaultDatasetId;
  const posts = await getDataset(datasetId);

  console.log(`\nTotal de posts coletados: ${posts.length}`);

  // Processar e salvar
  const analysis = {
    profile: `@${profile}`,
    scrapedAt: new Date().toISOString(),
    totalPosts: posts.length,
    posts: posts.map((post, i) => ({
      index: i + 1,
      type: post.type || 'unknown',
      caption: post.caption?.substring(0, 300) || '',
      likes: post.likesCount || 0,
      comments: post.commentsCount || 0,
      timestamp: post.timestamp || post.takenAt || '',
      imageUrl: post.displayUrl || post.imageUrl || '',
      videoUrl: post.videoUrl || null,
      isCarousel: post.childPosts?.length > 0 || post.type === 'Sidecar',
      carouselCount: post.childPosts?.length || 0,
      hashtags: (post.caption?.match(/#\w+/g) || []).slice(0, 10),
      mentions: (post.caption?.match(/@\w+/g) || []).slice(0, 10),
      dimensions: post.dimensionsWidth && post.dimensionsHeight
        ? { w: post.dimensionsWidth, h: post.dimensionsHeight }
        : null,
    })),
  };

  // Estatisticas
  const totalLikes = analysis.posts.reduce((s, p) => s + p.likes, 0);
  const totalComments = analysis.posts.reduce((s, p) => s + p.comments, 0);
  const carousels = analysis.posts.filter(p => p.isCarousel).length;
  const videos = analysis.posts.filter(p => p.type === 'Video').length;
  const images = analysis.posts.filter(p => p.type === 'Image').length;

  analysis.stats = {
    avgLikes: Math.round(totalLikes / (posts.length || 1)),
    avgComments: Math.round(totalComments / (posts.length || 1)),
    engagementBreakdown: {
      images,
      carousels,
      videos,
      other: posts.length - images - carousels - videos,
    },
    topPosts: analysis.posts
      .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
      .slice(0, 5)
      .map(p => ({ index: p.index, likes: p.likes, comments: p.comments, type: p.type })),
  };

  // Salvar JSON completo
  const jsonPath = resolve(outputDir, `${profile}-feed.json`);
  writeFileSync(jsonPath, JSON.stringify(analysis, null, 2));
  console.log(`\nDados salvos: ${jsonPath}`);

  // Salvar resumo markdown
  const mdPath = resolve(outputDir, `${profile}-analysis.md`);
  const md = `# Instagram Analysis: @${profile}

**Scraped:** ${analysis.scrapedAt}
**Posts analisados:** ${analysis.totalPosts}

## Metricas

| Metrica | Valor |
|---------|-------|
| Media de Likes | ${analysis.stats.avgLikes} |
| Media de Comments | ${analysis.stats.avgComments} |
| Posts tipo Imagem | ${images} |
| Carrosseis | ${carousels} |
| Videos | ${videos} |

## Top 5 Posts (por engajamento)

${analysis.stats.topPosts.map((p, i) => `${i + 1}. **Post #${p.index}** — ${p.likes} likes, ${p.comments} comments (${p.type})`).join('\n')}

## Posts Detalhados

${analysis.posts.slice(0, 10).map(p => `### Post #${p.index} (${p.type})
- **Likes:** ${p.likes} | **Comments:** ${p.comments}
- **Caption:** ${p.caption?.substring(0, 150)}...
- **Hashtags:** ${p.hashtags.join(', ') || 'nenhuma'}
${p.imageUrl ? `- **Imagem:** ${p.imageUrl}` : ''}
`).join('\n')}
`;

  writeFileSync(mdPath, md);
  console.log(`Analise salva: ${mdPath}`);

  // Download de imagens (se --download)
  if (download) {
    const imgDir = resolve(outputDir, `${profile}-images`);
    mkdirSync(imgDir, { recursive: true });
    console.log(`\nBaixando imagens em ${imgDir}...`);

    for (const post of analysis.posts) {
      if (post.imageUrl) {
        const ext = 'jpg';
        const fname = `${profile}-post-${String(post.index).padStart(3, '0')}.${ext}`;
        const filepath = resolve(imgDir, fname);
        try {
          await downloadImage(post.imageUrl, filepath);
          process.stdout.write('✓');
        } catch {
          process.stdout.write('✗');
        }
      }
    }
    console.log(`\n${analysis.posts.filter(p => p.imageUrl).length} imagens baixadas.`);
  }

  // Resumo final
  console.log(`
═══════════════════════════════════════
  @${profile} — Scraping Completo
═══════════════════════════════════════
  Posts: ${analysis.totalPosts}
  Media likes: ${analysis.stats.avgLikes}
  Media comments: ${analysis.stats.avgComments}
  Carrosseis: ${carousels} | Videos: ${videos} | Imagens: ${images}

  Arquivos:
  → ${jsonPath}
  → ${mdPath}
═══════════════════════════════════════
`);
}

main().catch(err => {
  console.error('\nErro:', err.message);
  process.exit(1);
});
