# Task: Criar Cover de Reels

**Task ID:** create-reels-cover
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Criar capa/thumbnail para Reels do Instagram
**Executor Primario:** chris-do (Tier 1) + eugene-schwartz (Tier 2)
**Quality Gate:** robin-williams (Tier 2)
**Estimated Time:** 3-5 min

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reel_topic` | string | Yes | Tema do reel |
| `reel_category` | enum | Yes | educativo, resultado, bastidores, engajamento, oferta |
| `has_thumbnail_frame` | boolean | No | Se tem frame especifico do video para usar |

---

## Steps

### Step 1: Headline do Cover (Schwartz)

**Executor:** eugene-schwartz
**Action:** Criar headline que comunica o tema em 3-6 palavras

```yaml
cover_headline_rules:
  max_words: 6
  style: "Bold, curto, comunica o assunto instantaneamente"
  rule: "Alguem olhando o grid deve entender do que se trata o reel sem assistir"

  examples:
    - "COMO TRIPLICAR SEU ROAS"
    - "ERRO FATAL NO E-COMMERCE"
    - "RESULTADO: R$400K/MES"
    - "3 DICAS DE CONVERSAO"
```

### Step 2: Design do Cover (Chris Do)

**Executor:** chris-do
**Action:** Design visual do cover

```yaml
cover_design:
  format: "1080x1920 (9:16)"
  display_format: "Aparece como 1080x1350 no grid do perfil"

  options:
    text_only:
      background: "#0A0A0A"
      headline: "Centro, Sans-serif Black, 72-96px, #FFFFFF"
      accent: "Keyword em #A8D600"
      logo: "Canto inferior, seta CDR"

    text_over_frame:
      background: "Frame do video com overlay 50-60%"
      headline: "Centro-inferior, Sans-serif Black, 64-80px, #FFFFFF"
      accent: "Box highlight em #A8D600"
      logo: "Canto inferior, seta CDR"

  consistency_rules:
    - "TODAS as covers devem seguir o mesmo estilo"
    - "O grid de reels deve parecer uma colecao coesa"
    - "Mesmo peso tipografico, mesma paleta, mesmo posicionamento"
```

### Step 3: CRAP Review (Robin Williams)

**Executor:** robin-williams
**Action:** Review de qualidade rapido

```yaml
cover_crap:
  minimum_score: 28/40
  critical: "Cover precisa funcionar em tamanho miniatura no grid"
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Cover Design | yaml | Especificacoes visuais |
| Headline | text | Texto do cover |
| CRAP Score | number | Score de qualidade |

---

## Acceptance Criteria

- [ ] Headline max 6 palavras
- [ ] Legivel em tamanho miniatura (grid do perfil)
- [ ] Paleta CDR respeitada
- [ ] Consistente com outros covers no grid
- [ ] Logo CDR presente
