# Task: Criar Feed Post para Instagram

**Task ID:** create-feed-post
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Criar um feed post completo com design visual e copy integrados
**Executor Primario:** ellen-lupton (Tier 1) + eugene-schwartz (Tier 2)
**Quality Gate:** robin-williams (Tier 2)
**Estimated Time:** 5-10 min

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `topic` | string | Yes | Tema do post |
| `category` | enum | Yes | educativo, resultado, bastidores, depoimento, engajamento, autoridade, oferta, tendencia |
| `format` | enum | No | quadrado (1080x1080) ou vertical (1080x1350). Default: vertical |
| `cta` | string | No | CTA desejado |
| `awareness_level` | enum | No | unaware, problem, solution, product, most. Default: problem |
| `image_type` | enum | No | grafico, foto_com_overlay, texto_puro, mockup. Default: grafico |

---

## Preconditions

- [ ] Brand context carregado
- [ ] Topico e categoria definidos

---

## Steps

### Step 1: Definir Tipo de Post

**Executor:** cdr-design-chief
**Action:** Classificar o post e definir abordagem

```yaml
post_types:
  grafico:
    description: "Arte 100% grafica com headline e elementos visuais"
    when: "Dica rapida, estatistica, frase de impacto"
    example: "9 em cada 10 e-commerces..."

  foto_com_overlay:
    description: "Foto com overlay escuro e texto"
    when: "Case study, resultado, depoimento"
    example: "Foto do cliente + numeros de resultado"

  texto_puro:
    description: "Fundo solido com texto bold"
    when: "Frase de autoridade, insight, provocacao"
    example: "O problema nao e o trafego. E a conversao."

  mockup:
    description: "Mockup de celular/tela mostrando resultado"
    when: "Demonstracao de dashboard, metricas, antes/depois"
    example: "Dashboard mostrando ROAS de 8x"
```

### Step 2: Copy (Eugene Schwartz)

**Executor:** eugene-schwartz
**Action:** Criar headline e caption

```yaml
copy_creation:
  headline:
    max_words: 8
    style: "Bold, direto, para o scroll"
    awareness_mapping:
      unaware: "Revelar um problema escondido"
      problem: "Nomear a dor diretamente"
      solution: "Prometer o metodo/solucao"
      product: "Mostrar prova social"
      most: "Oferta direta"

  caption:
    hook: "Primeira linha que aparece no preview — DEVE gerar curiosidade"
    body: "2-4 paragrafos expandindo o tema"
    cta: "Chamada especifica e acionavel"
    hashtags: "5-10 relevantes"

  rules:
    - "A copy nao cria desejo — canaliza desejos existentes"
    - "Headline e TUDO. Se falha, nada mais importa"
    - "UM desejo por post. Nao tente abordar tudo"
```

### Step 3: Design Visual (Ellen Lupton)

**Executor:** ellen-lupton
**Action:** Especificar design do post

```yaml
design_specs:
  format: "{format}"
  background: "#0A0A0A"

  typography:
    headline: "Sans-serif Bold/Black, 56-72px, #FFFFFF"
    subline: "Sans-serif Medium, 28-36px, #B0B0B0"
    accent_text: "Sans-serif Bold, #A8D600"

  layout:
    margins: "60px em todos os lados"
    headline_position: "Centro ou topo"
    logo_position: "Canto inferior direito"
    cta_position: "Inferior, destaque"

  elements:
    logo: "CDR seta verde, tamanho discreto"
    divider: "Linha #A8D600, 2px"
    glow: "Efeito neon verde sutil atras de keywords"
    overlay: "IF foto: overlay preto 60-70% opacidade"

  grid:
    columns: 4
    gutter: 20px
    safe_area: "60px de margem"
```

### Step 4: CRAP Review (Robin Williams)

**Executor:** robin-williams
**Action:** Avaliar qualidade visual

```yaml
crap_check:
  contrast: "Headline vs background tem contraste suficiente?"
  repetition: "Segue padrao visual CDR?"
  alignment: "Todos elementos alinhados?"
  proximity: "Agrupamento logico?"

  score_minimum: 28/40
  IF pass: → Output
  IF fail: → Return to Step 3 with feedback
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Post Design Spec | yaml | Especificacoes visuais completas |
| Headline | text | Headline do post |
| Caption | text | Legenda completa |
| CRAP Score | number | Score de qualidade |
| Hashtags | list | Hashtags sugeridas |

---

## Output Template

```markdown
# Feed Post: {topic}

## Categoria: {category}
## Formato: {format}
## CRAP Score: {score}/40

### Headline
{headline}

### Design
- Background: {bg}
- Tipografia: {typography}
- Elementos: {elements}
- Layout: {layout_description}

### Caption
{caption}

### Hashtags
{hashtags}

### Horario Sugerido
{best_time}
```

---

## Acceptance Criteria

- [ ] Headline tem max 8 palavras e e thumb-stopping
- [ ] Design segue paleta CDR (verde + preto)
- [ ] Tipografia segue hierarquia definida
- [ ] CRAP Score >= 28/40
- [ ] Caption tem hook + body + CTA
- [ ] Logo CDR presente
- [ ] Formato correto (1080x1080 ou 1080x1350)
