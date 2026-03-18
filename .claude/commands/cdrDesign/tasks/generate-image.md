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
| `tipo` | enum | Yes | feed-post, carousel-slide, stories, reels-cover, highlight-cover |
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

```yaml
briefing:
  brand_context:
    primary_color: "#A8D600 (verde lima)"
    background: "#0A0A0A (near-black)"
    accent: "#B5E300 (verde brilhante)"
    style: "Dark theme, green neon/glow effects, tech/moderno"
    typography: "Sans-serif bold (headlines), regular (body)"
    logo: "Seta verde em circulo escuro"

  format_specs:
    feed-post:
      aspect: "1:1"
      dimensions: "1080x1080"
      safe_zone: "All sides 60px margin"
    carousel-slide:
      aspect: "1:1"
      dimensions: "1080x1080"
      safe_zone: "All sides 60px margin"
    stories:
      aspect: "9:16"
      dimensions: "1080x1920"
      safe_zone: "Top 150px, Bottom 200px free"
    reels-cover:
      aspect: "9:16"
      dimensions: "1080x1920"
      safe_zone: "Center focus, top/bottom 150px free"
    highlight-cover:
      aspect: "1:1"
      dimensions: "1080x1080"
      safe_zone: "Central circle safe area"
```

### Step 2: Construir Prompt Otimizado

**Executor:** chris-do (visual) + ellen-lupton (tipografia) + eugene-schwartz (copy)
**Action:** Transformar o briefing em um prompt de geracao de imagem otimizado

```yaml
prompt_structure:
  1_format: "Create a {format} image at {dimensions} resolution"
  2_style: >
    Style: Dark premium design with near-black background (#0A0A0A).
    Use lime green (#A8D600) as the primary accent color with subtle
    neon glow effects. Modern, tech, professional aesthetic.
    Clean sans-serif bold typography for headlines.
  3_content: "Content: {topico}"
  4_text_elements: |
    Main headline text: "{texto_principal}" in large bold white or green text
    Secondary text: "{texto_secundario}" in smaller regular white text
  5_composition: >
    Composition: Clean layout with strong visual hierarchy.
    Clear contrast between elements. Generous spacing.
    Text must be legible at mobile size.
    {reference_style_patterns}
  6_brand: >
    Include subtle brand elements: green accent lines or shapes.
    Do NOT include a logo placeholder. Keep it minimal and premium.
  7_restrictions: >
    NO clipart, NO stock photo look, NO busy backgrounds.
    NO text spelling errors. Keep text minimal and impactful.
    Professional Instagram quality.
```

### Step 3: Gerar Imagem via Gemini API

**Executor:** script generate-image.mjs
**Action:** Chamar a API do Gemini com o prompt construido

```bash
# Carregar .env
export $(grep -v '^#' .env | xargs)

# Gerar imagem
node squads/cdr-design/scripts/generate-image.mjs \
  "{prompt_otimizado}" \
  --aspect {aspect_ratio} \
  --output squads/cdr-design/output/{filename}.png
```

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

### Feed Post (1080x1080)
```
Create a professional Instagram feed post (1080x1080 pixels, square format).
Dark background (#0A0A0A). Lime green (#A8D600) accent elements with subtle glow.
Modern, premium, tech aesthetic. Clean sans-serif bold typography.

Topic: {topico}
Main text: "{texto_principal}" — large, bold, white or green
Subtext: "{texto_secundario}" — smaller, regular, white

Layout: centered composition, strong visual hierarchy, generous margins (60px).
Style reference: Bold like @lever.ecomm, editorial quality like @hausperformance.
No clipart, no stock look. Professional Instagram quality.
```

### Carousel Slide (1080x1080)
```
Create an Instagram carousel slide (1080x1080 pixels, square format).
Slide {N} of {total} in a series. Maintain visual consistency across slides.
Dark background (#0A0A0A). Lime green (#A8D600) accents.
Modern, clean, educational design.

Slide content: {slide_content}
Text: "{texto_slide}" — bold headline, supporting bullet points if needed

Include a subtle header bar with brand identity at the top.
Slide number indicator: {N}/{total} in bottom corner.
Clean grid layout with clear text hierarchy.
```

### Stories (1080x1920)
```
Create an Instagram story (1080x1920 pixels, vertical 9:16 format).
Dark background (#0A0A0A). Lime green (#A8D600) accent color.
Bold, engaging, scroll-stopping design.

Topic: {topico}
Main text: "{texto_principal}" — large, centered, impactful
CTA: "{cta}" — bottom area with green accent

Safe zones: keep top 150px and bottom 200px clear of important content.
Full-screen vertical impact. Mobile-first design.
```

### Reels Cover (1080x1920)
```
Create an Instagram Reels cover image (1080x1920 pixels, vertical 9:16).
Dark cinematic background (#0A0A0A). Lime green (#A8D600) accent.
Eye-catching, click-worthy thumbnail design.

Topic: {topico}
Headline: "{texto_principal}" — large, bold, maximum 5 words
Must be readable as a small thumbnail in the grid.

High contrast, bold typography, minimal elements.
Center the key visual in the middle third of the image.
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
- [ ] Cores CDR presentes (#A8D600, #0A0A0A)
- [ ] Formato correto (dimensoes/aspect ratio)
- [ ] Texto legivel e sem erros
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
  - brand_colors_present: true
  - format_correct: true
  - text_legible: true
  - crap_quick_pass: true
```

---

## Troubleshooting

| Erro | Causa | Solucao |
|------|-------|---------|
| GEMINI_API_KEY nao configurada | .env sem chave | Adicionar chave no .env |
| Modelo nao encontrado | Model ID errado | Trocar para gemini-2.5-flash-preview-image-generation |
| Imagem sem texto | Gemini ignorou texto | Reforcar no prompt: "The text MUST read exactly: ..." |
| Cores erradas | Prompt vago | Incluir hex codes explicitos no prompt |
| Safety filter | Conteudo bloqueado | Reformular prompt, evitar termos ambiguos |

---

## Modelos Disponiveis

| Model ID | Velocidade | Qualidade | Uso |
|----------|-----------|-----------|-----|
| `gemini-2.5-flash-preview-image-generation` | Rapido | Boa | Default — melhor custo-beneficio |
| `gemini-3.1-flash-image-preview` | Rapido | Muito boa | Posts importantes |
| `gemini-3-pro-image-preview` | Lento | Excelente | Branding, pecas premium |

---

_Task: generate-image v1.0.0_
_Integracao: Gemini API (Nano Banana)_
_CDR Design Squad_
