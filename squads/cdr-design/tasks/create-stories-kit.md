# Task: Criar Kit de Stories para Instagram

**Task ID:** create-stories-kit
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Criar um kit de stories (3-5 slides) para Instagram
**Executor Primario:** ellen-lupton (Tier 1) + eugene-schwartz (Tier 2)
**Quality Gate:** robin-williams (Tier 2)
**Estimated Time:** 5-10 min

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `topic` | string | Yes | Tema dos stories |
| `story_type` | enum | Yes | dica_rapida, bastidores, enquete, depoimento, oferta, countdown |
| `slides_count` | number | No | Numero de slides (default: 3) |
| `interactive_element` | enum | No | enquete, pergunta, slider, quiz, link, none |
| `cta` | string | No | CTA final |

---

## Steps

### Step 1: Estrutura de Stories

**Executor:** cdr-design-chief
**Action:** Definir estrutura dos slides

```yaml
story_structures:
  dica_rapida:
    slide_1: "Hook — 'Voce sabia que...?' ou 'Dica rapida:'"
    slide_2: "Conteudo — A dica em si"
    slide_3: "CTA — 'Salva pra nao esquecer' ou interacao"

  bastidores:
    slide_1: "Contexto — 'Bastidores de hoje na CDR'"
    slide_2: "Conteudo — O que esta acontecendo"
    slide_3: "Engajamento — Enquete ou pergunta"

  enquete:
    slide_1: "Provocacao — Pergunta que gera debate"
    slide_2: "Enquete — Opcoes para votar"
    slide_3: "Resultado/insight — O que os dados mostram"

  depoimento:
    slide_1: "Setup — Contexto do cliente"
    slide_2: "Resultado — Numeros e transformacao"
    slide_3: "CTA — 'Quer o mesmo? Link na bio'"

  oferta:
    slide_1: "Problema — Nomear a dor"
    slide_2: "Solucao — Como a CDR resolve"
    slide_3: "CTA direto — 'Manda DM' ou 'Link na bio'"
```

### Step 2: Copy dos Stories (Schwartz)

**Executor:** eugene-schwartz
**Action:** Criar texto para cada slide

```yaml
story_copy_rules:
  max_words_per_slide: 20
  font_size_minimum: "24pt (legivel em mobile)"
  style: "Curto, punchy, conversacional"
  emoji_use: "Moderado (1-2 por slide)"

  hook_patterns:
    - "Voce sabia que...?"
    - "Erro #1 que e-commerces cometem:"
    - "Isso aqui mudou tudo para nosso cliente"
    - "Pergunta seria:"
    - "Se voce faz X, presta atencao"
```

### Step 3: Design Visual (Lupton)

**Executor:** ellen-lupton
**Action:** Especificar design dos stories

```yaml
stories_design:
  format: "1080x1920 (9:16 vertical)"
  background: "#0A0A0A ou gradient sutil com verde"

  typography:
    headline: "Sans-serif Bold, 48-64px, #FFFFFF"
    body: "Sans-serif Regular, 32-40px, #FFFFFF"
    accent: "Sans-serif Bold, #A8D600"

  layout:
    safe_zone: "150px topo (espaco para nome do perfil), 200px base (espaco para CTA nativo)"
    content_area: "Centro, com padding 80px"
    text_position: "Centro ou centro-inferior"

  elements:
    marca_dagua: "Logo CDR pequeno, canto inferior direito, 40% opacidade"
    sticker_area: "Area reservada para elementos interativos"
    swipe_indicator: "Se link: seta pra cima com texto"
```

### Step 4: CRAP Review (Robin Williams)

**Executor:** robin-williams
**Action:** Review rapido de qualidade

```yaml
stories_crap:
  simplified_check: true  # Stories sao mais simples que feed posts
  minimum_score: 24/40
  critical_checks:
    - "Texto legivel em mobile? (fonte grande o suficiente)"
    - "Contraste suficiente? (texto sobre background)"
    - "Nao ta poluido? (max 20 palavras por slide)"
    - "Paleta CDR? (verde + preto)"
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Stories Kit | markdown | Descricao de cada slide |
| Design Specs | yaml | Especificacoes visuais |
| Copy | text | Texto de cada slide |
| Interactive Elements | list | Elementos interativos sugeridos |

---

## Acceptance Criteria

- [ ] Max 20 palavras por slide
- [ ] Texto legivel em mobile (min 24pt)
- [ ] Paleta CDR respeitada
- [ ] Min 1 elemento interativo (enquete, pergunta, etc.)
- [ ] CTA no slide final
- [ ] Logo CDR presente (marca d'agua)
- [ ] Safe zones respeitadas (topo e base)
