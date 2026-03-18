# Task: Diagnosticar Identidade Visual da Marca

**Task ID:** diagnose-brand
**Version:** 1.0.0
**Execution Type:** Hybrid
**Purpose:** Analisar e diagnosticar a identidade visual atual da marca usando o processo de 5 fases de Alina Wheeler
**Executor:** alina-wheeler (Tier 0)
**Estimated Time:** 15-30 min

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `brand_name` | string | Yes | Nome da marca |
| `instagram_url` | string | Yes | URL do perfil Instagram |
| `website_url` | string | No | URL do site da marca |
| `competitors` | list | No | URLs de concorrentes/referencias |
| `brand_description` | string | No | Descricao da marca pelo usuario |

---

## Preconditions

- [ ] alina-wheeler agent ativo
- [ ] Acesso a WebSearch ou Playwright para analisar perfis
- [ ] Knowledge base carregado

---

## Steps

### Step 1: Conducao de Pesquisa (Fase 1 Wheeler)

**Executor:** alina-wheeler
**Action:** "Pensar como detetive, psicologo e cientista"

**1.1 Perguntas Diagnosticas (Mantra Wheeler):**

```
1. QUEM VOCE E?
   - Qual o proposito da marca?
   - Quais os valores fundamentais?
   - Qual a personalidade da marca (se fosse uma pessoa)?

2. QUEM PRECISA SABER?
   - Quem e o publico-alvo?
   - Onde esse publico esta?
   - O que esse publico ja sabe sobre voce?

3. POR QUE DEVEM SE IMPORTAR?
   - Qual o diferencial da marca?
   - Que problema resolve?
   - Por que escolher voce e nao o concorrente?

4. COMO VAO DESCOBRIR?
   - Quais canais de comunicacao?
   - Qual a frequencia de contato?
   - Qual a jornada de descoberta?
```

**1.2 Analise Visual do Instagram:**

```yaml
instagram_audit:
  profile:
    - foto_perfil: "Consistente com a marca?"
    - bio: "Clara, objetiva, com CTA?"
    - highlights: "Organizados e com capas consistentes?"
    - link_bio: "Funcionando e relevante?"

  feed:
    - paleta_cores: "Quais cores predominam?"
    - tipografia: "Consistente entre posts?"
    - estilo_visual: "Tem identidade propria?"
    - grid_harmony: "O grid como um todo e harmonioso?"
    - tipo_conteudo: "Qual o mix de formatos?"

  engagement:
    - likes_medio: "Qual a media?"
    - comentarios: "Qual o nivel de interacao?"
    - saves: "Conteudo esta sendo salvo?"
```

### Step 2: Clarificacao de Estrategia (Fase 2 Wheeler)

**Executor:** alina-wheeler
**Action:** Sintetizar pesquisa em diagnostico estrategico

```yaml
strategic_synthesis:
  brand_positioning:
    current: "Onde a marca esta hoje"
    desired: "Onde quer chegar"
    gap: "O que falta"

  visual_identity_audit:
    strengths:
      - "O que esta funcionando bem"
    weaknesses:
      - "O que precisa melhorar"
    opportunities:
      - "O que pode ser explorado"
    threats:
      - "O que pode prejudicar"

  consistency_score:
    paleta: "1-10"
    tipografia: "1-10"
    estilo: "1-10"
    messaging: "1-10"
    overall: "Media ponderada"
```

### Step 3: Recomendacoes (Fase 3 Wheeler — Direcionamento)

**Executor:** alina-wheeler
**Action:** Recomendar proximos passos baseado no diagnostico

```yaml
recommendations:
  immediate:
    - "Acoes urgentes (corrigir inconsistencias)"
  short_term:
    - "Melhorias para as proximas 2 semanas"
  long_term:
    - "Evolucao da identidade visual (1-3 meses)"

  routing:
    IF needs_full_rebrand:
      → Route to brand-identity-workflow
    IF needs_minor_adjustments:
      → Route to create-brand-guidelines
    IF identity_is_solid:
      → "Identidade visual esta solida. Pronto para criar conteudo."
      → Route back to cdr-design-chief
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Brand Diagnosis Report | markdown | Relatorio completo do diagnostico |
| Consistency Score | number | Score de consistencia visual (1-10) |
| Recommendations | list | Lista de recomendacoes priorizadas |
| Next Route | string | Proximo passo recomendado |

---

## Output Template

```markdown
# Diagnostico de Marca — {brand_name}

## 1. Perfil da Marca
- **Nome:** {brand_name}
- **Proposito:** {purpose}
- **Publico-alvo:** {target}
- **Diferencial:** {differentiator}

## 2. Auditoria Visual

### Paleta de Cores
- Cores identificadas: {colors}
- Consistencia: {score}/10
- Observacoes: {notes}

### Tipografia
- Fontes utilizadas: {fonts}
- Hierarquia: {score}/10
- Observacoes: {notes}

### Estilo Visual
- Padrao identificado: {pattern}
- Coerencia no feed: {score}/10
- Observacoes: {notes}

### Messaging
- Tom de voz: {tone}
- Consistencia: {score}/10
- Observacoes: {notes}

## 3. Score Geral: {overall}/10

## 4. SWOT Visual
- Forcas: {strengths}
- Fraquezas: {weaknesses}
- Oportunidades: {opportunities}
- Ameacas: {threats}

## 5. Recomendacoes
### Imediatas
{immediate_actions}

### Curto Prazo (2 semanas)
{short_term_actions}

### Longo Prazo (1-3 meses)
{long_term_actions}

## 6. Proximo Passo
{next_route}
```

---

## Acceptance Criteria

- [ ] 4 perguntas diagnosticas respondidas (Mantra Wheeler)
- [ ] Auditoria visual do Instagram realizada
- [ ] Score de consistencia calculado
- [ ] SWOT visual documentado
- [ ] Recomendacoes priorizadas em 3 niveis
- [ ] Proximo passo definido e roteado

---

## Quality Gate

```yaml
gate: QG-002
name: "Brand Context Set"
type: blocking
blocking: true
criteria:
  - all_diagnostic_questions_answered: true
  - visual_audit_complete: true
  - consistency_score_calculated: true
  - recommendations_provided: true
pass_threshold: "All criteria met"
```
