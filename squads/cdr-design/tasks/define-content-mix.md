# Task: Definir Mix de Conteudo (JJJRH)

**Task ID:** define-content-mix
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Definir a proporcao ideal de conteudo de valor vs. conversao usando Jab Jab Jab Right Hook
**Executor:** gary-vaynerchuk (Tier 3)
**Estimated Time:** 5-10 min

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `period` | enum | Yes | week, month, quarter |
| `posts_count` | number | Yes | Total de posts no periodo |
| `business_goal` | enum | No | awareness, engagement, conversion, retention |
| `current_metrics` | object | No | Metricas atuais para otimizacao |

---

## Steps

### Step 1: Aplicar Framework JJJRH

**Executor:** gary-vaynerchuk
**Action:** Calcular mix ideal

```yaml
jjjrh_calculation:
  base_ratio: "3:1 (75% jabs, 25% right hooks)"

  adjustments:
    IF business_goal == "awareness":
      ratio: "4:1 (80% jabs, 20% hooks)"
    IF business_goal == "conversion":
      ratio: "2:1 (67% jabs, 33% hooks)"
    IF business_goal == "engagement":
      ratio: "4:1 com foco em interacao"
    IF business_goal == "retention":
      ratio: "3:1 com foco em comunidade"

  jab_distribution:
    educativo: 30%
    engajamento: 25%
    bastidores: 20%
    autoridade: 15%
    cultura: 10%

  right_hook_distribution:
    oferta_direta: 40%
    social_proof_com_cta: 35%
    urgencia_escassez: 25%
```

### Step 2: Platform-Native Mapping

**Executor:** gary-vaynerchuk
**Action:** Mapear formatos para cada tipo de conteudo

```yaml
format_mapping:
  feed_posts: "Jabs de autoridade, right hooks de oferta"
  carousels: "Jabs educativos (save-worthy)"
  reels: "Jabs de engajamento e bastidores"
  stories: "Mix de tudo, mais informal e interativo"
```

### Step 3: Document Don't Create Check

**Executor:** gary-vaynerchuk
**Action:** Incluir conteudo documentado (bastidores reais)

```yaml
documentation_opportunities:
  - "Reuniao de equipe CDR"
  - "Analise de campanha ao vivo"
  - "Bastidores de otimizacao de site"
  - "Celebracao de resultado de cliente"
  - "Setup de workspace"
  - "Processo de onboarding de novo cliente"
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Content Mix | yaml | Proporcao JJJRH calculada |
| Format Map | yaml | Mapeamento formato x tipo |
| Documentation Ideas | list | Oportunidades de bastidores |

---

## Acceptance Criteria

- [ ] Ratio JJJRH calculado e justificado
- [ ] Distribuicao de jab types definida
- [ ] Formatos mapeados para cada tipo
- [ ] Min 5 ideias de conteudo documentado
