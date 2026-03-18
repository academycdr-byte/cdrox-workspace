# CDR Design Squad

Squad de design e conteudo visual para o Instagram da CDR Group.

## Overview

Squad composto por **9 mentes elite** de design, branding, tipografia, copywriting e estrategia de social media. Cria conteudo visual de alta qualidade para o Instagram da CDR Group — assessoria de performance para e-commerces.

### Capacidades

- Feed Posts + Carrosseis educativos e promocionais
- Stories + Reels Covers
- Identidade Visual / Branding
- Copies visuais (texto persuasivo integrado ao design)
- Planejamento semanal de conteudo

## Quick Start

```
# Ativar o squad
@cdr-design

# Ou usar um comando especifico
/cdrDesign:tasks:start
/cdrDesign:tasks:create-carousel
/cdrDesign:tasks:plan-content-calendar
```

## Agents (10)

### Orchestrator
| Agent | Papel |
|-------|-------|
| `cdr-design-chief` | Coordena o squad, roteia requests, gerencia qualidade |

### Tier 0 — Diagnostico
| Agent | Papel | Framework Principal |
|-------|-------|---------------------|
| `alina-wheeler` | Diagnostico de marca | 5 Fases de Brand Identity |

### Tier 1 — Mestres
| Agent | Papel | Framework Principal |
|-------|-------|---------------------|
| `marty-neumeier` | Estrategia de branding | 5 Disciplinas do Branding, Teste Onlyness |
| `chris-do` | Design + identidade visual | Brand Personality Pyramid, 3 Pilares |
| `ellen-lupton` | Tipografia + design visual | Framework Tripartido (Letter-Text-Grid) |

### Tier 2 — Sistematizadores
| Agent | Papel | Framework Principal |
|-------|-------|---------------------|
| `robin-williams` | Quality checker (CRAP) | Contrast, Repetition, Alignment, Proximity |
| `eugene-schwartz` | Copywriting + headlines | 5 Niveis de Consciencia |
| `donald-miller` | Messaging + storytelling | SB7 StoryBrand Framework |

### Tier 3 — Especialistas
| Agent | Papel | Framework Principal |
|-------|-------|---------------------|
| `jasmine-star` | Estrategia de conteudo IG | 9 Categorias, Regra 98/2 |
| `gary-vaynerchuk` | Social media strategy | Jab Jab Jab Right Hook |

## Tasks (13)

| Task | Descricao | Agentes |
|------|-----------|---------|
| `start` | Onboarding do squad | Chief |
| `diagnose-brand` | Diagnosticar identidade visual | Wheeler |
| `create-brand-guidelines` | Criar diretrizes de marca | Neumeier, Chris Do, Lupton |
| `create-feed-post` | Criar feed post | Lupton, Schwartz, Robin Williams |
| `create-carousel` | Criar carrossel | Lupton, Schwartz, Miller, Robin Williams |
| `create-stories-kit` | Criar kit de stories | Lupton, Schwartz, Robin Williams |
| `create-reels-cover` | Criar cover de reels | Chris Do, Schwartz, Robin Williams |
| `plan-content-calendar` | Planejar semana | Jasmine Star, GaryVee |
| `review-visual-quality` | Review CRAP | Robin Williams |
| `write-caption` | Escrever legenda | Schwartz, Miller |
| `define-content-mix` | Definir mix JJJRH | GaryVee |
| `create-highlight-covers` | Criar capas destaques | Chris Do, Robin Williams |
| `generate-image` | Gerar imagem via Gemini AI (Nano Banana) | Chief, Chris Do, Lupton, Robin Williams |

## Workflows (3)

| Workflow | Descricao | Phases |
|----------|-----------|--------|
| `content-creation-workflow` | Fluxo completo de criacao | Briefing → Copy → Design → Review → Entrega |
| `weekly-planning-workflow` | Planejamento semanal | Analise → Mix → Calendario → Checklist |
| `brand-identity-workflow` | Construcao de identidade | Pesquisa → Estrategia → Design → Touchpoints → Gestao |

## Quality Gates (6)

| Gate | Nome | Tipo | Blocking |
|------|------|------|----------|
| QG-001 | Request Classification | Routing | No |
| QG-002 | Brand Context Set | Blocking | Yes |
| QG-003 | Design Brief Approved | Blocking | Yes |
| QG-004 | CRAP Visual Check (28/40 min) | Blocking | Yes |
| QG-005 | Copy Review | Advisory | No |
| QG-006 | Final Delivery | Blocking | Yes |

## Brand Identity CDR

| Elemento | Valor |
|----------|-------|
| Cor primaria | `#A8D600` (Verde lima) |
| Background | `#0A0A0A` (Near-black) |
| Accent | `#B5E300` (Verde brilhante) |
| Logo | Seta verde em circulo escuro |
| Tipografia | Sans-serif bold (headlines) / regular (body) |
| Estilo | Dark theme, green neon/glow, tech/moderno |

## Agencias Referencia

- **@lever.ecomm** — Bold typography, brand name repetition, high-energy
- **@hausperformance** — Editorial design, header bar branding, content-rich carousels

## Estrutura de Arquivos

```
squads/cdr-design/
├── agents/
│   ├── cdr-design-chief.md      # Orchestrator
│   ├── alina-wheeler.md          # Tier 0 — Diagnostico
│   ├── marty-neumeier.md         # Tier 1 — Brand Strategy
│   ├── chris-do.md               # Tier 1 — Design + Strategy
│   ├── ellen-lupton.md           # Tier 1 — Typography
│   ├── robin-williams.md         # Tier 2 — CRAP Quality
│   ├── eugene-schwartz.md        # Tier 2 — Copywriting
│   ├── donald-miller.md          # Tier 2 — Messaging
│   ├── jasmine-star.md           # Tier 3 — IG Strategy
│   └── gary-vaynerchuk.md        # Tier 3 — Social Media
├── tasks/
│   ├── start.md
│   ├── diagnose-brand.md
│   ├── create-brand-guidelines.md
│   ├── create-feed-post.md
│   ├── create-carousel.md
│   ├── create-stories-kit.md
│   ├── create-reels-cover.md
│   ├── plan-content-calendar.md
│   ├── review-visual-quality.md
│   ├── write-caption.md
│   ├── define-content-mix.md
│   └── create-highlight-covers.md
├── workflows/
│   ├── content-creation-workflow.md
│   ├── weekly-planning-workflow.md
│   └── brand-identity-workflow.md
├── checklists/
│   ├── crap-review-checklist.md
│   └── content-quality-checklist.md
├── data/
│   └── cdr-design-kb.md          # Knowledge base
├── scripts/
│   ├── render-post.mjs              # HTML/CSS premium renderer
│   └── generate-image.mjs           # Gemini API image generator
├── output/                          # Generated images (gitignored)
├── templates/
├── docs/
├── config.yaml
└── README.md
```

## Uso Comum

### Criar um carrossel educativo
```
@cdr-design *criar-carrossel
Topico: 5 erros que matam a conversao do seu e-commerce
Categoria: educativo
```

### Planejar a semana
```
@cdr-design *planejar-semana
Semana: 03/03 a 07/03
Posts: 5
Reels: 2
```

### Diagnosticar a marca
```
@cdr-design *diagnostico
Instagram: @cdrgroup.assessoria
```

### Revisar qualidade visual
```
@cdr-design *review
[descrever ou anexar a peca visual]
```

### Gerar imagem com IA (Nano Banana)
```
@cdr-design *gerar-imagem
Tipo: feed-post
Topico: 5 estrategias de CRO para e-commerce
Headline: "Seu e-commerce esta perdendo dinheiro"
```

---

## Image Generation (Sistema Hibrido)

O squad usa um **sistema hibrido** para gerar imagens de qualidade profissional:

| Camada | Tecnologia | Funcao |
|--------|-----------|--------|
| Background/Visual | Gemini API (Nano Banana) | Fundos criativos e elementos visuais |
| Texto + Layout | HTML/CSS + Playwright | Tipografia real, acentos perfeitos, grid pixel-perfect |

### Scripts
- `scripts/render-post.mjs` — Renderiza HTML premium a partir de JSON config
- `scripts/generate-image.mjs` — Gera imagens via Gemini API (backgrounds)

### Fluxo
1. Montar JSON com conteudo (textos, bullets, tipo de slide)
2. `render-post.mjs` gera HTMLs pixel-perfect com CSS premium
3. Playwright faz screenshot em 1080x1080 (ou 1080x1920)
4. Imagem final pronta para publicar

### Modelos Gemini (para backgrounds)
| Modelo | Velocidade | Qualidade |
|--------|-----------|-----------|
| `gemini-3.1-flash-image-preview` | Rapido | Muito boa (default) |
| `gemini-2.5-flash-image` | Rapido | Boa |
| `gemini-3-pro-image-preview` | Lento | Excelente |

---

## Dependencies

### Runtime
| Dependencia | Versao Min | Uso |
|-------------|-----------|-----|
| Node.js | 18+ | Execucao de scripts (render, scrape, generate) |
| Playwright | 1.40+ | Screenshot HTML→PNG para posts |

### External Services
| Servico | Env Variable | Uso |
|---------|-------------|-----|
| Gemini API | `GEMINI_API_KEY` | Geracao de backgrounds criativos (Nano Banana) |
| Apify | `APIFY_TOKEN` | Scraping de perfis Instagram para pesquisa |

### Knowledge Base Files (obrigatorios)
| Arquivo | Descricao |
|---------|-----------|
| `data/cdr-brandbook.md` | Brandbook visual completo (cores, tipo, estilos) |
| `data/cdr-design-kb.md` | Knowledge base de design + regras de composicao |

### Setup Rapido
```bash
# 1. Verificar Node.js
node --version  # deve ser >= 18

# 2. Configurar env vars
export GEMINI_API_KEY="sua-chave-aqui"
export APIFY_TOKEN="seu-token-aqui"  # opcional, so pra scraping

# 3. Instalar Playwright (se nao tiver)
npx playwright install chromium
```

---

## Troubleshooting

### Imagem nao renderiza (render-post.mjs)
**Sintoma:** Script roda mas nao gera PNG
**Causa provavel:** Playwright nao instalado ou chromium ausente
**Fix:** `npx playwright install chromium` e tentar novamente

### Gemini API timeout
**Sintoma:** generate-image.mjs trava ou retorna erro de timeout
**Causa provavel:** Modelo lento (gemini-3-pro) ou quota excedida
**Fix:** Trocar para modelo flash em config.yaml: `default_model: "gemini-3.1-flash-image-preview"`. Se quota excedida, aguardar 24h ou verificar Google Cloud Console.

### CRAP Score inconsistente
**Sintoma:** Mesmo design recebe scores diferentes
**Causa provavel:** Subjetividade na avaliacao
**Fix:** Usar `checklists/crap-review-checklist.md` com os 20 itens quantificados. Cada dimensao tem criterios objetivos (1-10). Score deve ser reproduzivel.

### Brand context nao carrega
**Sintoma:** Agent diz que nao tem contexto da marca
**Causa provavel:** Arquivo `data/cdr-design-kb.md` ausente ou com formato invalido
**Fix:** Verificar se arquivo existe. Se corrompido, recriar via `*diagnostico` (task diagnose-brand) com dados manuais.

### Instagram scraping falha
**Sintoma:** scrape-instagram.mjs retorna erro
**Causa provavel:** APIFY_TOKEN invalido ou ator indisponivel
**Fix:** Verificar token com `echo $APIFY_TOKEN`. Se valido, testar ator no dashboard Apify. Alternativa: coletar dados manualmente.

### Cores erradas no output
**Sintoma:** Post renderizado com cores diferentes do brandbook
**Causa provavel:** Hex codes errados no JSON de input
**Fix:** Usar EXATAMENTE: primary `#A8D600`, bg `#0A0A0A`, text `#FFFFFF`, muted `#888888`. Copiar do `data/cdr-brandbook.md`.

---

## Changelog

### v1.1.0 (2026-03-01)
- Upgrade: 6 agents receberam voice_dna YAML formal + objection_algorithms
- Melhoria: start.md com anti-patterns, AC mensuraveis, exemplos e error handling
- Melhoria: Workflows com failure handling e rework rules
- Melhoria: Content quality checklist com correction guidance e severity matrix
- Novo: tool-registry.yaml documentando todas as integracoes
- Novo: Secoes Dependencies, Troubleshooting e Changelog no README
- Config: entry_agent explicito adicionado ao config.yaml

### v1.0.0 (2026-02-28)
- Lancamento inicial: 10 agents, 13 tasks, 3 workflows
- Sistema hibrido de geracao de imagem (Gemini API + Playwright)
- Scraper de Instagram via Apify
- 2 checklists de qualidade (CRAP + Content Quality)
- Research Score: 9/10 | Quality Score: 8.2/10

---

_CDR Design Squad v1.1.0_
_Criado por: Squad Creator + @squad-chief_
_Baseado em 9 mentes elite de design, branding e social media_
_Validation Score: 9.0+/10_
