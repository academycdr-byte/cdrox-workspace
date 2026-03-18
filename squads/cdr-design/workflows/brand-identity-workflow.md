# Workflow: Brand Identity — Construcao de Identidade Visual

**Workflow ID:** brand-identity-workflow
**Version:** 1.0.0
**Purpose:** Construir ou reconstruir a identidade visual completa de uma marca
**Phases:** 5 (baseado nas 5 Fases de Alina Wheeler)
**Agentes Envolvidos:** alina-wheeler (T0), marty-neumeier (T1), chris-do (T1), ellen-lupton (T1), robin-williams (T2)

---

## Overview

```
PESQUISA → ESTRATEGIA → DESIGN → TOUCHPOINTS → GESTAO
```

Workflow completo de branding baseado no processo de 5 fases de Alina Wheeler.
Acionado quando uma marca precisa de identidade visual nova ou reformulada.

---

## Phase 1: CONDUCTING RESEARCH (Pesquisa)

**Executor:** alina-wheeler (Tier 0)
**Duration:** 10-15 min
**Task:** diagnose-brand

### Actions:

1. **Aplicar Mantra de Diagnostico:**
   - Quem voce e?
   - Quem precisa saber?
   - Por que devem se importar?
   - Como vao descobrir?

2. **Analise Visual:**
   - Auditoria do Instagram atual
   - Analise de concorrentes/referencias
   - Identificacao de gaps

3. **Analise de Mercado:**
   - Posicionamento atual vs. concorrentes
   - Oportunidades visuais nao exploradas

### Checkpoint: Diagnostico Completo

```yaml
criteria:
  - mantra_questions_answered: true
  - visual_audit_complete: true
  - market_analysis_done: true
output: "Brand Diagnosis Report"
```

---

## Phase 2: CLARIFYING STRATEGY (Estrategia)

**Executor:** marty-neumeier (Tier 1)
**Duration:** 5-10 min
**Task:** create-brand-guidelines (parcial)

### Actions:

1. **5 Disciplinas do Branding:**
   - Differentiation: O que torna unico?
   - Collaboration: Como trabalha com clientes?
   - Innovation: O que faz de diferente?
   - Validation: Como prova que funciona?
   - Cultivation: Como a marca evolui?

2. **Teste Onlyness:**
   - "{Brand} e a UNICA _____ que _____"

3. **Definir personalidade da marca:**
   - Se fosse pessoa, como seria?
   - 3-5 adjetivos definidores
   - Tom de voz

### Checkpoint: Estrategia Definida

```yaml
criteria:
  - onlyness_statement: true
  - five_disciplines_mapped: true
  - brand_personality_defined: true
output: "Brand Strategy Document"
```

---

## Phase 3: DESIGNING IDENTITY (Design)

**Executor:** chris-do (Tier 1) + ellen-lupton (Tier 1)
**Duration:** 10-15 min
**Task:** create-brand-guidelines (completo)

### Actions:

1. **Chris Do — Brand Personality Pyramid:**
   - Core Functionality → Benefits → Emotional Response → Personality → Essence

2. **Chris Do — Sistema Visual:**
   - Paleta de cores (primaria, secundaria, neutros)
   - Logo usage rules
   - Estilo fotografico
   - Elementos graficos

3. **Ellen Lupton — Sistema Tipografico:**
   - Font families e weights
   - Hierarquia (H1, H2, H3, body, caption)
   - Regras de uso
   - Grid systems

### Checkpoint: Identity System Completo

```yaml
criteria:
  - color_palette_defined: true
  - typography_system_defined: true
  - logo_rules_defined: true
  - photography_style_defined: true
output: "Brand Identity System"
```

---

## Phase 4: CREATING TOUCHPOINTS

**Executor:** chris-do (Tier 1) + robin-williams (Tier 2)
**Duration:** 5-10 min

### Actions:

1. **Criar templates para Instagram:**
   - Template feed post
   - Template carrossel
   - Template stories
   - Template reels cover
   - Highlight covers

2. **CRAP Review dos templates:**
   - Cada template passa pelo checklist CRAP
   - Score minimo: 28/40

### Checkpoint: Templates Aprovados

```yaml
criteria:
  - all_templates_created: true
  - crap_scores_passed: true
output: "Template Library"
```

---

## Phase 5: MANAGING ASSETS (Gestao)

**Executor:** cdr-design-chief
**Duration:** 2-3 min

### Actions:

1. **Documentar tudo:**
   - Brand Guidelines completo
   - Arquivo de templates
   - Regras de uso

2. **Atualizar knowledge base:**
   - Salvar guidelines no data/cdr-design-kb.md
   - Atualizar config.yaml se necessario

3. **Handoff:**
   - Apresentar resultado ao usuario
   - Explicar proximos passos
   - Squad pronto para criar conteudo

---

## Rework Rules

```yaml
rework_policy:
  max_iterations_per_phase: 2
  max_total_iterations: 4

  phase_rework_triggers:
    phase_1:
      trigger: "Diagnostico contradiz brief do usuario OU dados insuficientes"
      action: "Retornar a Phase 1 com perguntas adicionais ao usuario"
      escalation: "Se apos 2 tentativas dados ainda insuficientes, escalar para cdr-design-chief"

    phase_2:
      trigger: "Onlyness statement nao passa nos 4 criterios (verdadeira, relevante, defensavel, memoravel)"
      action: "Iterar Onlyness com feedback especifico de qual criterio falhou"
      max_retries: 2
      escalation: "Se apos 2 iteracoes nao aprovar, simplificar scope para brand essentials"

    phase_3:
      trigger: "Sistema visual nao reflete personalidade definida na Phase 2"
      action: "Retornar para Phase 3 (design), manter estrategia da Phase 2 intacta"
      note: "NUNCA voltar para Phase 2 por problemas visuais — o problema e de execucao, nao de estrategia"

    phase_4:
      trigger: "CRAP Score < 28/40 em qualquer template"
      action: "Retornar template para Robin Williams com feedback especifico de quais dimensoes falharam"
      max_retries: 2
      escalation: "Se apos 2 revisoes score < 28, escalar para cdr-design-chief para decisao"

    phase_5:
      trigger: "Documentacao incompleta ou inconsistente"
      action: "Completar gaps antes de entregar — NUNCA entregar documentacao parcial"

  conflict_resolution:
    diagnosis_vs_perception:
      trigger: "Phase 1 revela gaps que contradizem a percepcao do dono da marca"
      action: "Apresentar dados objetivos (Wheeler framework) + perguntar se deseja prosseguir com insights ou com percepcao original"
      authority: "alina-wheeler (Tier 0) tem autoridade para recomendar, usuario tem autoridade para decidir"

    strategy_vs_design:
      trigger: "Phase 3 design nao consegue traduzir Phase 2 strategy visualmente"
      action: "Reunir chris-do + marty-neumeier para alinhar — estrategia e autoridade, design e execucao"
      authority: "marty-neumeier define direcao, chris-do executa com liberdade criativa dentro dos limites"
```

---

## Artifacts Checklist (Phase 5 Delivery)

```yaml
required_artifacts:
  - name: "Brand Diagnosis Report"
    source: "Phase 1"
    format: "Markdown"
    contains:
      - Mantra de Diagnostico (4 perguntas respondidas)
      - Auditoria visual (achados + screenshots)
      - Analise de mercado (posicionamento)
      - Brand Scorecard (5 dimensoes pontuadas)

  - name: "Brand Strategy Document"
    source: "Phase 2"
    format: "Markdown"
    contains:
      - Onlyness Statement validada (4 criterios)
      - 5 Disciplinas mapeadas
      - Personalidade da marca (3-5 adjetivos + tom de voz)

  - name: "Identity System Specification"
    source: "Phase 3"
    format: "Markdown + YAML"
    contains:
      - Paleta de cores: primaria (1) + secundaria (1-2) + neutros (3-5) + accent (1) = minimo 6 cores
      - Tipografia: 1 font family + min 2 weights + hierarquia 5 niveis (H1-H4, body, caption)
      - Logo rules: uso, sizing, clear space, variacoes de cor (min 3 regras)
      - Estilo fotografico: diretrizes + exemplos
      - Elementos graficos: patterns, icones, overlays

  - name: "Template Library"
    source: "Phase 4"
    format: "Markdown + imagens"
    contains:
      - Min 5 templates (feed, carousel, stories, reels cover, highlight)
      - CRAP score >= 28/40 para cada template
      - Exemplo aplicado de cada template

  - name: "Brand Guidelines Final"
    source: "Phase 5"
    format: "Markdown"
    contains:
      - Compilacao de todos os artifacts acima
      - Regras de uso resumidas
      - Quick reference card (1 pagina)
```

---

## Risk Mitigation

```yaml
risks:
  research_contradicts_brief:
    probability: "MEDIUM"
    impact: "HIGH"
    mitigation: "Apresentar dados Wheeler de forma diplomatica, oferecer 2 caminhos: seguir dados ou seguir percepcao"
    owner: "alina-wheeler"

  strategy_too_abstract:
    probability: "MEDIUM"
    impact: "MEDIUM"
    mitigation: "Marty Neumeier traduz estrategia em exemplos concretos antes de passar para Chris Do"
    owner: "marty-neumeier"

  design_inconsistency:
    probability: "LOW"
    impact: "HIGH"
    mitigation: "Robin Williams faz CRAP check em cada template — score < 28 bloqueia entrega"
    owner: "robin-williams"

  scope_creep:
    probability: "HIGH"
    impact: "MEDIUM"
    mitigation: "Definir escopo na Phase 1 e NEGAR adicoes apos Phase 3 — novas necessidades viram novo workflow"
    owner: "cdr-design-chief"

  timeline_overrun:
    probability: "MEDIUM"
    impact: "LOW"
    mitigation: "Se ultrapassar 2 rework cycles, simplificar scope para brand essentials (cores + tipo + 3 templates)"
    owner: "cdr-design-chief"
```

---

## Acceptance Criteria

- [ ] Diagnostico completo: Mantra respondido + Brand Scorecard com 5 dimensoes pontuadas (Phase 1)
- [ ] Estrategia definida: Onlyness statement que passa nos 4 criterios + personalidade com 3-5 adjetivos (Phase 2)
- [ ] Sistema visual completo: min 6 cores + 1 font family com hierarquia 5 niveis + min 3 regras de logo (Phase 3)
- [ ] Templates criados: min 5 templates com CRAP Score >= 28/40 cada (Phase 4)
- [ ] Documentacao entregue: todos os 5 artifacts obrigatorios presentes e salvos em data/ (Phase 5)
- [ ] Nenhum rework pendente: todas as fases aprovadas nos checkpoints
