# Task: Gerar Imagem para Instagram (Nano Banana / Gemini)

**Task ID:** generate-image
**Version:** 1.0.0
**Execution Type:** Hybrid
**Purpose:** Gerar imagens de alta qualidade para o Instagram da CDR usando Gemini API (Nano Banana)
**Executors:** cdr-design-chief (orquestra), chris-do (visual), ellen-lupton (tipografia), eugene-schwartz (copy), robin-williams (review)
**Estimated Time:** 2-5 min por imagem

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tipo` | enum | Yes | feed-post (4:5), carousel-slide (4:5), stories (9:16), reels-cover (9:16) |
| `topico` | string | Yes | Assunto/tema do conteudo |
| `texto_principal` | string | No | Headline ou texto que aparece na imagem |
| `texto_secundario` | string | No | Subtitulo ou texto de apoio |
| `categoria` | enum | No | educativo, resultado, bastidores, depoimento, engajamento, autoridade, cultura, oferta, tendencia |
| `estilo_extra` | string | No | Instrucoes adicionais de estilo |
| `num_slides` | number | No | Numero de slides (para carrossel, default: 8) |

---

## Preconditions

- [ ] GEMINI_API_KEY configurada no .env
- [ ] Brand context CDR carregado (cores, tipografia, estilo)

---

## Steps

### Step 1: Montar Briefing Visual

**Executor:** cdr-design-chief
**Action:** Combinar inputs do usuario com contexto da marca CDR

**REGRA:** O estilo padrao para TODOS os posts de texto e o **Brutalist Headline** — texto 3D gigante preenchendo toda a imagem, fundo gradiente verde organico, film grain.

```yaml
briefing:
  brand_context:
    style: "Brutalist Headline — 3D block letters, organic green gradient, film grain"
    background: "Gradiente verde organico com blobs radiais (dark green → bright lime)"
    text_color: "#F2E2C4 (creme/off-white)"
    text_3d: "Extrusao verde (#7CB800) degradando para preto, 21 camadas"
    text_stroke: "8px outline preto (#0E0C06)"
    typography: "Luckiest Guy (block letters, uppercase) para headlines"
    grain: "3 camadas de film grain (overlay + soft-light + multiply)"
    vignette: "Box-shadow inset com escurecimento nos cantos"
    card: "Border-radius 26px, inner border shadow"

  header_footer:
    header_left: "@cdrgroup.assessoria (sutil, branco 22% opacidade)"
    header_right: "Circulo com C (logo, branco 25% opacidade)"
    footer_left: "CONTEUDO AO LADO → (sutil, branco 20% opacidade)"

  reference_image: "squads/cdr-design/output/cdr-post-ele-2026-03-18T23-27-01.png"

  format_specs:
    feed-post:
      aspect: "4:5"
      dimensions: "1080x1350"
      text_fill: "Texto preenche 85-95% da area visual"
    carousel-slide:
      aspect: "4:5"
      dimensions: "1080x1350"
      text_fill: "Texto preenche 85-95% da area visual"
    stories:
      aspect: "9:16"
      dimensions: "1080x1920"
      text_fill: "Texto centralizado verticalmente, preenche largura total"
    reels-cover:
      aspect: "9:16"
      dimensions: "1080x1920"
      text_fill: "Texto centralizado, legivel como thumbnail"
```

### Step 2: Construir Prompt Otimizado

**Executor:** eugene-schwartz (copy curta) + cdr-design-chief (prompt visual)
**Action:** Criar headline curta e montar prompt com estilo brutalist

```yaml
headline_rules:
  max_words_per_line: 2
  max_lines: 4
  style: "Curto, direto, para o scroll"
  uppercase: true
  separador: "Cada palavra ou grupo curto em linha propria"
  emoji: "Opcional, inline no final da ultima linha"

prompt_structure:
  1_reference: >
    ALWAYS include --ref with the reference image.
    The Gemini MUST replicate the EXACT visual style of the reference.
  2_style: >
    Create an Instagram post in the EXACT same visual style as the reference image.
    Style: dark green organic gradient background with multiple radial blobs
    (dark green top-left, bright lime green bottom-right).
    Text in huge 3D block letters filling the ENTIRE card edge-to-edge.
    Text color: cream/off-white (#F2E2C4).
    3D extrusion: green (#7CB800) shadow layers behind each letter, fading to dark.
    Black outline stroke around letters.
    Film grain texture overlay. Rounded card corners with vignette darkening at edges.
  3_header_footer: >
    Header: '@cdrgroup.assessoria' top-left in subtle white (22% opacity),
    'C' logo circle top-right.
    Footer: 'CONTEUDO AO LADO →' bottom-left in subtle white (20% opacity).
  4_text: >
    The headline text MUST read exactly: "{texto_principal}"
    with each word on its own line filling the full width at different font sizes.
    The text MUST dominate the entire image leaving almost no empty space.
    SPELL EVERY WORD CORRECTLY — double-check the text.
  5_format: >
    Portrait format {dimensions} ({aspect}).
  6_restrictions: >
    NO clipart, NO stock photo look, NO busy backgrounds.
    NO text spelling errors. Keep text minimal and impactful.
    Professional Instagram quality.
```

### Step 3: Gerar Imagem via Gemini API

**Executor:** script generate-image.mjs
**Action:** Chamar a API do Gemini com o prompt construido + imagem de referencia

**OBRIGATORIO:** Sempre usar `--ref` com a imagem de referencia do estilo brutalist.

```bash
# Carregar .env
export $(grep -v '^#' .env | grep -v '^\s*$' | xargs -d '\n')

# Gerar imagem (SEMPRE com --ref para manter consistencia visual)
node squads/cdr-design/scripts/generate-image.mjs \
  "{prompt_otimizado}" \
  --ref squads/cdr-design/output/cdr-post-ele-2026-03-18T23-27-01.png \
  --aspect {aspect_ratio} \
  --output squads/cdr-design/output/{filename}.png
```

**IMPORTANTE:** Apos gerar, verificar se o Gemini escreveu o texto corretamente. Se errou o spelling, regenerar com enfase extra no prompt: "The text MUST read EXACTLY: ..."

### Step 4: Review Visual (CRAP Quick Check)

**Executor:** robin-williams (Tier 2)
**Action:** Avaliar rapidamente a imagem gerada

```yaml
quick_crap_check:
  contrast:
    - headline_stands_out: true/false
    - cta_visible: true/false
    - hierarchy_clear: true/false
  repetition:
    - brand_colors_present: true/false
    - style_consistent: true/false
  alignment:
    - elements_aligned: true/false
    - margins_adequate: true/false
  proximity:
    - related_grouped: true/false
    - spacing_good: true/false

  verdict:
    IF 7+ checks pass: "APROVADO"
    IF 5-6 checks pass: "AJUSTAR — regenerar com prompt refinado"
    IF < 5 checks pass: "REPROVAR — reescrever prompt"
```

### Step 5: Iterar ou Entregar

**Executor:** cdr-design-chief
**Action:** Loop de refinamento ou entrega final

```yaml
iteration_logic:
  IF verdict == "APROVADO":
    → Entregar imagem ao usuario
    → Mostrar path do arquivo salvo
  IF verdict == "AJUSTAR":
    → Refinar prompt com base no feedback CRAP
    → Voltar ao Step 3 (max 3 iteracoes)
  IF verdict == "REPROVAR":
    → Reescrever prompt completamente
    → Voltar ao Step 2 (max 2 vezes)
```

---

## Prompt Templates por Tipo

**REGRA:** TODOS os templates abaixo usam o estilo Brutalist Headline como base. SEMPRE incluir `--ref` com a imagem de referencia.

### Feed Post / Carousel Cover (1080x1350, 4:5)
```
Create an Instagram post in the EXACT same visual style as the reference image.
Portrait format, 1080x1350 pixels (4:5 aspect ratio).

VISUAL STYLE (copy EXACTLY from reference):
- Dark green organic gradient background with radial blobs (dark top-left → bright lime bottom-right)
- Huge 3D block letters filling the ENTIRE image edge-to-edge
- Text color: cream/off-white (#F2E2C4)
- 3D extrusion: green (#7CB800) shadow layers behind letters, fading to black
- Black outline stroke around each letter
- Film grain texture overlay (3 layers)
- Rounded card corners (26px radius) with vignette darkening at edges
- Header: '@cdrgroup.assessoria' top-left (subtle white), 'C' logo circle top-right
- Footer: 'CONTEUDO AO LADO →' bottom-left (subtle white)

TEXT CONTENT — The text MUST read EXACTLY (spell every word correctly):
"{texto_principal}"
Each word on its own line, filling the full width at dynamically sized fonts.
The text MUST dominate the image — almost zero empty space.

NO clipart, NO stock photos. Professional Instagram quality.
```

### Carousel Content Slide (1080x1350, 4:5)
```
Create an Instagram carousel content slide in the EXACT same visual style as the reference image.
Portrait format, 1080x1350 pixels (4:5 aspect ratio).
Slide {N} of {total} in a series. Maintain visual consistency.

VISUAL STYLE: Same as reference — dark green organic gradient, film grain, vignette,
rounded corners, '@cdrgroup.assessoria' header, 'C' logo.

TEXT: Headline in huge 3D block letters (cream, green extrusion, black stroke).
Below headline: {num_bullets} bullet points in white sans-serif (Plus Jakarta Sans, 24px).

Headline: "{slide_headline}"
Bullets: {slide_bullets}

Slide indicator: {N}/{total} bottom-right, subtle.
Text fills 80%+ of the image. No empty space.
```

### Stories (1080x1920, 9:16)
```
Create an Instagram story in the EXACT same visual style as the reference image.
Vertical format, 1080x1920 pixels (9:16 aspect ratio).

VISUAL STYLE: Same as reference — dark green organic gradient background,
3D block letters (cream text, green extrusion, black stroke),
film grain, vignette, rounded corners.

Header: '@cdrgroup.assessoria' top-left, 'C' logo top-right.
Main text: "{texto_principal}" — huge 3D block letters filling the center.
CTA: "{cta}" at bottom with subtle green accent.

Safe zones: top 150px and bottom 200px clear of main text.
Text dominates the middle section — bold, scroll-stopping.
```

### Reels Cover (1080x1920, 9:16)
```
Create an Instagram Reels cover in the EXACT same visual style as the reference image.
Vertical format, 1080x1920 pixels (9:16 aspect ratio).

VISUAL STYLE: Same as reference — dark green organic gradient,
3D block letters, film grain, vignette.

Headline: "{texto_principal}" — maximum 4 words, huge 3D block letters.
Must be readable as a SMALL THUMBNAIL in the Reels grid.

Center the text in the middle third. High contrast, zero clutter.
Header: '@cdrgroup.assessoria', Footer: 'CONTEUDO AO LADO →'.
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Imagem gerada | PNG file | Arquivo salvo em squads/cdr-design/output/ |
| Prompt usado | text | Prompt completo enviado ao Gemini |
| CRAP quick score | text | Avaliacao rapida da qualidade visual |
| Path do arquivo | string | Caminho absoluto da imagem gerada |

---

## Acceptance Criteria

- [ ] Imagem gerada com sucesso via Gemini API
- [ ] Estilo brutalist presente (gradiente verde organico, 3D block letters, film grain)
- [ ] Texto creme (#F2E2C4) com extrusao verde e stroke preto
- [ ] Formato correto (4:5 para feed, 9:16 para stories/reels)
- [ ] Texto CORRETO sem erros de spelling
- [ ] Texto preenche 85%+ da area visual (sem espacos vazios grandes)
- [ ] Header (@cdrgroup.assessoria + C logo) e footer (CONTEUDO AO LADO) presentes
- [ ] Vignette e film grain visiveis
- [ ] CRAP quick check aprovado (7+ de 9)
- [ ] Arquivo salvo no diretorio output

---

## Quality Gate

```yaml
gate: QG-IMG
name: "Image Generation Quality"
type: blocking
blocking: true
criteria:
  - image_generated: true
  - brutalist_style_present: true
  - green_gradient_background: true
  - 3d_block_letters: true
  - text_spelling_correct: true
  - text_fills_image: true
  - header_footer_present: true
  - film_grain_visible: true
  - crap_quick_pass: true
```

---

## Troubleshooting

| Erro | Causa | Solucao |
|------|-------|---------|
| GEMINI_API_KEY nao configurada | .env sem chave | Adicionar chave no .env |
| Modelo nao encontrado | Model ID errado | Trocar para gemini-3-pro-image-preview |
| Texto com spelling errado | Gemini errou o texto | Regenerar enfatizando: "SPELL EXACTLY: ..." Ou usar render engine HTML |
| Estilo diferente do reference | Gemini ignorou referencia | Verificar se --ref foi incluido. Regenerar com prompt mais descritivo |
| Texto pequeno / muito espaco | Gemini nao preencheu | Adicionar: "Text MUST fill 90%+ of the image, almost ZERO empty space" |
| Cores erradas | Prompt vago | Incluir hex codes: cream #F2E2C4, green #7CB800, gradient #3D6000 |
| Safety filter | Conteudo bloqueado | Reformular prompt, evitar termos ambiguos |
| Sem film grain | Gemini simplificou | Adicionar: "MUST include visible film grain texture overlay" |

---

## Quando Usar Gemini vs Render Engine HTML

| Situacao | Ferramenta | Motivo |
|----------|-----------|--------|
| Post de texto puro (headline) | **render-post.mjs** (HTML) | Texto pixel-perfect, zero erro de spelling |
| Post com elementos visuais (fotos, ilustracoes) | **Gemini API** | Gemini gera elementos visuais que HTML nao consegue |
| Post com mockup/device | **render-post.mjs** (composite) | Controle total do layout |
| Post com fundo fotografico | **Gemini API** | Gemini gera backgrounds realistas |
| Carrossel de conteudo (bullets) | **render-post.mjs** (checklist) | Tipografia precisa e consistente |

**REGRA:** Se o post e 100% texto, PREFERIR render engine HTML (brutalist-headline). Gemini e melhor quando precisa de elementos visuais que HTML nao produz.

---

## Modelos Disponiveis

| Model ID | Velocidade | Qualidade | Uso |
|----------|-----------|-----------|-----|
| `gemini-2.5-flash-image` | Rapido | Boa | Default — melhor custo-beneficio |
| `gemini-3.1-flash-image-preview` | Rapido | Muito boa | Posts importantes |
| `gemini-3-pro-image-preview` | Lento | Excelente | Branding, pecas premium |

---

_Task: generate-image v1.0.0_
_Integracao: Gemini API (Nano Banana)_
_CDR Design Squad_
