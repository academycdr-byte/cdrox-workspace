# Task: Criar Carrossel para Instagram

**Task ID:** create-carousel
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Criar um carrossel completo para Instagram com design visual e copy integrados
**Executor Primario:** ellen-lupton (Tier 1 — design visual) + eugene-schwartz (Tier 2 — copy)
**Quality Gate:** robin-williams (Tier 2 — CRAP review)
**Estimated Time:** 10-20 min

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `topic` | string | Yes | Tema do carrossel |
| `category` | enum | Yes | educativo, resultado, autoridade, oferta, tendencia |
| `slides_count` | number | No | Numero de slides (default: 8) |
| `cta` | string | No | CTA desejado (default: "Agende sua analise gratuita") |
| `awareness_level` | enum | No | unaware, problem, solution, product, most (default: problem) |
| `reference` | string | No | Referencia visual ou de conteudo |

---

## Preconditions

- [ ] Brand context carregado (paleta CDR, tipografia, estilo)
- [ ] Knowledge base acessivel
- [ ] Topico e categoria definidos

---

## Steps

### Step 1: Briefing e Estrutura (Chief)

**Executor:** cdr-design-chief
**Action:** Definir briefing completo do carrossel

```yaml
briefing:
  topic: "{topic}"
  category: "{category}"
  target_audience: "Donos de e-commerce que buscam performance"
  awareness_level: "{awareness_level}"
  desired_outcome: "O que o leitor deve sentir/fazer apos ler"
  cta: "{cta}"
  brand_voice: "Direto, data-driven, profissional mas acessivel"
  visual_style: "Dark theme, verde CDR (#A8D600), bold typography"
```

### Step 2: Estrutura de Copy (Eugene Schwartz)

**Executor:** eugene-schwartz (Tier 2)
**Action:** Criar copy para cada slide baseado no nivel de consciencia

```yaml
copy_structure:
  slide_1_hook:
    purpose: "Parar o scroll — headline que gera curiosidade"
    awareness_approach: |
      IF unaware: "Headline que revela um problema escondido"
      IF problem: "Headline que nomeia a dor"
      IF solution: "Headline que promete o metodo"
      IF product: "Headline com prova social"
      IF most: "Headline com oferta direta"
    format: "6-8 palavras MAX, fonte grande, bold"
    example: "9 em 10 e-commerces erram ISSO"

  slide_2_context:
    purpose: "Contextualizar o problema"
    format: "Texto curto que valida a dor do leitor"
    example: "Voce investe em trafego, mas a conversao nao acompanha..."

  slides_3_to_N_content:
    purpose: "Entregar valor (dicas, passos, insights)"
    format: "1 ponto por slide, headline + explicacao curta"
    rules:
      - "Cada slide = 1 ideia"
      - "Headline do slide em negrito"
      - "Explicacao em 2-3 linhas"
      - "Numeracao visual (1/8, 2/8, etc.)"

  slide_penultimo_summary:
    purpose: "Resumir os pontos principais"
    format: "Lista visual dos pontos-chave"

  slide_final_cta:
    purpose: "Chamada para acao"
    format: "CTA + branding CDR"
    elements:
      - "CTA principal em destaque"
      - "Logo CDR"
      - "@ ou link"
```

### Step 3: Messaging Framework (Donald Miller)

**Executor:** donald-miller (Tier 2)
**Action:** Garantir que a narrativa segue SB7

```yaml
sb7_check:
  character: "O leitor (dono de e-commerce) e o heroi?"
  problem: "O problema esta claramente nomeado?"
  guide: "A CDR aparece como guia, nao como heroi?"
  plan: "Existe um plano claro e simples?"
  cta: "O CTA e direto e especifico?"
  failure: "Fica claro o que acontece se nao agir?"
  success: "A transformacao esta implicita?"
```

### Step 4: Design Visual (Ellen Lupton)

**Executor:** ellen-lupton (Tier 1)
**Action:** Definir especificacoes visuais de cada slide

```yaml
design_specs:
  format: "1080x1350 (4:5 vertical)"
  background: "#0A0A0A (near-black)"

  typography:
    headline: "Sans-serif Bold, 48-64px, #FFFFFF"
    subheadline: "Sans-serif Semi-bold, 32-40px, #B0B0B0"
    body: "Sans-serif Regular, 24-28px, #FFFFFF"
    accent: "Sans-serif Bold, color #A8D600"
    numbering: "Sans-serif Black, 72px, #A8D600 (com opacidade)"

  layout:
    header_bar: "CDR GROUP — topo, 40px, #A8D600 com fundo #1A1A1A"
    content_area: "Centro, com padding de 60px"
    footer: "Logo CDR + numeracao do slide"
    grid: "Margem 60px, grid de 4 colunas"

  elements:
    dividers: "#A8D600 com 2px de espessura"
    icons: "Line icons, stroke #A8D600"
    highlight_box: "Background #1A1A1A com borda #A8D600"
    glow_effect: "Sutil, verde, atras de elementos-chave"

  slide_1_special:
    - "Background pode ter gradient sutil"
    - "Headline ocupa 60% do espaco"
    - "Elemento visual de apoio (icone ou imagem)"

  slide_final_special:
    - "CTA em destaque (box verde com texto preto)"
    - "Logo CDR maior"
    - "@ do Instagram"
```

### Step 5: CRAP Quality Review (Robin Williams)

**Executor:** robin-williams (Tier 2)
**Action:** Revisar cada slide nos 4 principios CRAP

```yaml
crap_review:
  per_slide:
    contrast:
      - "Headline se destaca do body?"
      - "CTA se destaca dos demais elementos?"
      - "Hierarquia visual clara?"
    repetition:
      - "Paleta CDR respeitada?"
      - "Tipografia consistente entre slides?"
      - "Header bar presente em todos?"
    alignment:
      - "Elementos alinhados com grid?"
      - "Margens consistentes?"
      - "Nada parece desalinhado?"
    proximity:
      - "Headline proximo do contexto?"
      - "CTA separado do conteudo?"
      - "Agrupamento logico?"

  scoring:
    minimum_per_dimension: 7
    minimum_total: 28/40
    blocking: true

  IF score < 28:
    → Return to Step 4 with specific feedback
  IF score >= 28:
    → PASS to output
```

### Step 6: Caption (Eugene Schwartz + Donald Miller)

**Executor:** eugene-schwartz + donald-miller
**Action:** Escrever a legenda do post

```yaml
caption_structure:
  hook: "Primeira linha que para o scroll (aparece no preview)"
  body: "3-5 linhas expandindo o tema do carrossel"
  cta: "Chamada para acao final"
  hashtags: "5-10 hashtags relevantes"

  rules:
    - "Hook = 1 linha poderosa (nivel de consciencia correto)"
    - "Body nao repete o carrossel — complementa"
    - "CTA especifico: 'Salva esse post' ou 'Comenta X'"
    - "Hashtags: mix de volume alto + nicho"
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Carousel Copy | markdown | Texto de cada slide (headline + body) |
| Design Specs | yaml | Especificacoes visuais detalhadas |
| Caption | text | Legenda completa do post |
| CRAP Score | number | Score de qualidade visual (X/40) |
| Hashtags | list | Lista de hashtags sugeridas |

---

## Output Template

```markdown
# Carrossel: {topic}

## Categoria: {category}
## Awareness Level: {awareness_level}
## CRAP Score: {score}/40

---

### Slide 1 — HOOK
**Headline:** {headline}
**Visual:** {visual_description}

### Slide 2 — CONTEXTO
**Headline:** {headline}
**Body:** {body}

### Slides 3-{N} — CONTEUDO
**Slide {n}:**
- Headline: {headline}
- Body: {body}

### Slide {N-1} — RESUMO
**Pontos-chave:** {summary}

### Slide {N} — CTA
**CTA:** {cta}
**Branding:** Logo CDR + @cdrgroup.assessoria

---

## Design Specs
{design_specs}

---

## Caption
{caption}

## Hashtags
{hashtags}
```

---

## Acceptance Criteria

- [ ] Hook do slide 1 e thumb-stopping (headline bold, 6-8 palavras)
- [ ] Cada slide tem 1 ideia clara
- [ ] Copy segue nivel de consciencia correto (Schwartz)
- [ ] Narrativa segue SB7 (Miller) — cliente e heroi, CDR e guia
- [ ] Design specs seguem paleta CDR (verde + preto)
- [ ] Header bar CDR presente em todos os slides
- [ ] CRAP Score >= 28/40
- [ ] Caption completa com hook + body + CTA + hashtags
- [ ] CTA e especifico e acionavel

---

## Quality Gates

```yaml
gates:
  - id: QG-003
    name: "Design Brief Approved"
    transition: "Briefing -> Criacao"
    blocking: true

  - id: QG-004
    name: "CRAP Visual Check"
    transition: "Design -> Output"
    blocking: true
    threshold: 28/40

  - id: QG-005
    name: "Copy Review"
    transition: "Copy -> Output"
    blocking: false
```
