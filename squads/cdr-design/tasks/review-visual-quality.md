# Task: Review de Qualidade Visual (CRAP Check)

**Task ID:** review-visual-quality
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Revisar qualquer peca visual usando os principios CRAP de Robin Williams
**Executor:** robin-williams (Tier 2 — Quality Checker)
**Estimated Time:** 3-5 min por peca

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `piece_description` | string | Yes | Descricao da peca visual a ser revisada |
| `piece_type` | enum | Yes | feed_post, carousel, stories, reels_cover, highlight_cover |
| `design_specs` | object | No | Specs de design se disponiveis |
| `image_url` | string | No | URL/path da imagem para analise visual |

---

## Preconditions

- [ ] robin-williams agent ativo
- [ ] Peca visual criada ou descrita
- [ ] Brand guidelines CDR carregados

---

## Steps

### Step 1: Analise de Contrast (C)

**Executor:** robin-williams
**Action:** Avaliar contraste visual

```yaml
contrast_analysis:
  checklist:
    - id: C1
      check: "Headlines vs body text tem contraste FORTE de tamanho?"
      rule: "Headline deve ser pelo menos 2x o tamanho do body"
      weight: 3

    - id: C2
      check: "CTA se destaca visualmente de todos os outros elementos?"
      rule: "CTA deve ser o elemento mais visivel apos o headline"
      weight: 3

    - id: C3
      check: "Hierarquia visual esta clara? (O que ler primeiro e obvio)"
      rule: "Olho deve seguir: Headline → Subheadline → Body → CTA"
      weight: 2

    - id: C4
      check: "Cores tem contraste suficiente para legibilidade?"
      rule: "Texto branco (#FFF) sobre preto (#0A0A0A) = otimo. Verde (#A8D600) sobre preto = bom."
      weight: 2

  scoring: "Soma dos checks passed x peso / max possivel x 10"
  max_score: 10
```

### Step 2: Analise de Repetition (R)

**Executor:** robin-williams
**Action:** Avaliar consistencia visual

```yaml
repetition_analysis:
  checklist:
    - id: R1
      check: "Paleta CDR respeitada? (Verde #A8D600 + Preto #0A0A0A + Branco)"
      rule: "Nenhuma cor fora da paleta sem justificativa"
      weight: 3

    - id: R2
      check: "Tipografia consistente com padrao CDR?"
      rule: "Mesma familia tipografica, mesmos pesos"
      weight: 3

    - id: R3
      check: "Estilo visual alinhado com o feed existente?"
      rule: "Peca deve parecer parte do mesmo feed"
      weight: 2

    - id: R4
      check: "Logo/branding CDR presente e consistente?"
      rule: "Seta verde no canto inferior direito, tamanho padrao"
      weight: 2

  scoring: "Soma dos checks passed x peso / max possivel x 10"
  max_score: 10
```

### Step 3: Analise de Alignment (A)

**Executor:** robin-williams
**Action:** Avaliar alinhamento e organizacao

```yaml
alignment_analysis:
  checklist:
    - id: A1
      check: "Todos os elementos seguem um grid?"
      rule: "Nada pode parecer 'jogado' aleatoriamente"
      weight: 3

    - id: A2
      check: "Margens sao consistentes?"
      rule: "Mesmo espaco em todos os lados (60px padrao CDR)"
      weight: 2

    - id: A3
      check: "Texto alinhado com intencao? (esquerda, centro ou justificado)"
      rule: "Evitar mix de alinhamentos sem justificativa"
      weight: 3

    - id: A4
      check: "Elementos visuais se conectam visualmente?"
      rule: "Cada elemento deve ter uma 'linha invisivel' conectando a outro"
      weight: 2

  scoring: "Soma dos checks passed x peso / max possivel x 10"
  max_score: 10
```

### Step 4: Analise de Proximity (P)

**Executor:** robin-williams
**Action:** Avaliar agrupamento e espacamento

```yaml
proximity_analysis:
  checklist:
    - id: P1
      check: "Elementos relacionados estao proximos?"
      rule: "Titulo e subtitulo devem estar mais proximos entre si do que do body"
      weight: 3

    - id: P2
      check: "Elementos nao-relacionados estao separados?"
      rule: "Espaco claro entre blocos diferentes de informacao"
      weight: 3

    - id: P3
      check: "Nao ha amontoamento visual?"
      rule: "White space (ou dark space) e seu amigo — nao tenha medo"
      weight: 2

    - id: P4
      check: "CTA tem espaco proprio — nao compete com conteudo?"
      rule: "CTA deve ter 'ar' ao redor, isolado visualmente"
      weight: 2

  scoring: "Soma dos checks passed x peso / max possivel x 10"
  max_score: 10
```

### Step 5: Consolidar Score e Feedback

**Executor:** robin-williams
**Action:** Gerar score final e recomendacoes

```yaml
consolidation:
  total_score: "C + R + A + P = X/40"

  verdict:
    IF score >= 36: "EXCELENTE — Pronto para publicar"
    IF score >= 28: "BOM — Pode publicar, considere ajustes menores"
    IF score >= 20: "REGULAR — Precisa de ajustes antes de publicar"
    IF score < 20: "REPROVADO — Voltar para redesign"

  blocking_rules:
    - "Se qualquer dimensao < 5: BLOQUEADO (mesmo se total >= 28)"
    - "Se Contrast < 6: BLOQUEADO (legibilidade comprometida)"
    - "Se Repetition < 6: BLOQUEADO (fora da identidade CDR)"

  feedback_format:
    per_issue:
      - what: "O que esta errado"
      - why: "Por que e um problema"
      - fix: "Exatamente como corrigir"
      - example: "Antes vs Depois descritivo"
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| CRAP Score | object | Score por dimensao + total |
| Verdict | enum | EXCELENTE, BOM, REGULAR, REPROVADO |
| Issues | list | Lista de problemas encontrados |
| Fixes | list | Correcoes recomendadas |
| Report | markdown | Relatorio completo |

---

## Output Template

```markdown
# CRAP Review — {piece_type}

## Score: {total}/40 — {verdict}

| Dimensao | Score | Status |
|----------|-------|--------|
| Contrast | {c}/10 | {emoji} |
| Repetition | {r}/10 | {emoji} |
| Alignment | {a}/10 | {emoji} |
| Proximity | {p}/10 | {emoji} |

## Issues Encontrados

### {issue_1_title}
- **O que:** {what}
- **Por que:** {why}
- **Correcao:** {fix}

## Recomendacoes Finais
{recommendations}

## Veredicto: {verdict}
{final_note}
```

---

## Acceptance Criteria

- [ ] Todas as 4 dimensoes CRAP avaliadas
- [ ] Score calculado corretamente
- [ ] Issues tem descricao + motivo + correcao
- [ ] Verdict consistente com score
- [ ] Blocking rules aplicadas (dimensao < 5 = bloqueado)
