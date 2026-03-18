# Workflow: Content Creation — Fluxo de Criacao de Conteudo

**Workflow ID:** content-creation-workflow
**Version:** 1.0.0
**Purpose:** Fluxo completo de criacao de uma peca de conteudo para Instagram
**Phases:** 5
**Quality Gates:** 3 (QG-003, QG-004, QG-005)

---

## Overview

```
BRIEFING → COPY → DESIGN → REVIEW → ENTREGA
```

Este workflow e acionado sempre que alguem pede para criar qualquer peca de conteudo
(post, carrossel, stories, reels cover). O Chief roteia para o workflow correto baseado
no tipo de conteudo.

---

## Phase 1: BRIEFING

**Executor:** cdr-design-chief (Orchestrator)
**Duration:** 2-3 min
**Checkpoint:** Briefing completo

### Actions:

1. **Classificar o request**
   - Tipo: feed_post | carousel | stories | reels_cover | highlight_cover
   - Categoria: educativo | resultado | bastidores | depoimento | engajamento | autoridade | oferta | tendencia
   - Urgencia: normal | urgente

2. **Coletar inputs**
   - Topico
   - Mensagem principal
   - CTA desejado
   - Referencia visual (se houver)

3. **Definir awareness level** (com base no publico-alvo do post)
   - Unaware / Problem / Solution / Product / Most

4. **Verificar brand context**
   - Paleta CDR carregada?
   - Guidelines acessiveis?

### Quality Gate QG-003: Design Brief Approved

```yaml
checkpoint:
  gate: QG-003
  blocking: true
  criteria:
    - tipo_definido: true
    - categoria_definida: true
    - topico_claro: true
    - awareness_level_set: true
    - brand_context_loaded: true
```

---

## Phase 2: COPY

**Executores:** eugene-schwartz (headlines + copy) + donald-miller (messaging + narrativa)
**Duration:** 3-5 min
**Checkpoint:** Copy aprovada

### Actions:

1. **Eugene Schwartz — Headlines e Copy**
   - Analisar nivel de consciencia do publico
   - Criar headline (max 6-8 palavras)
   - Criar body copy (adaptado ao formato)
   - Criar CTA

2. **Donald Miller — Messaging SB7**
   - Validar: cliente e o heroi?
   - Problema nomeado (externo + interno)?
   - CDR como guia (nao heroi)?
   - CTA direto e especifico?

3. **Caption** (se aplicavel)
   - Hook (primeira linha)
   - Body (conteudo)
   - CTA
   - Hashtags

### Quality Gate QG-005: Copy Review

```yaml
checkpoint:
  gate: QG-005
  blocking: false  # Advisory
  criteria:
    - headline_is_thumb_stopping: true
    - sb7_check_min_5_of_7: true
    - awareness_level_applied: true
    - cta_is_specific: true
```

---

## Phase 3: DESIGN

**Executores:** ellen-lupton (tipografia + layout) + chris-do (identidade visual)
**Duration:** 3-5 min
**Checkpoint:** Design specs completos

### Actions:

1. **Ellen Lupton — Tipografia e Layout**
   - Definir hierarquia tipografica
   - Definir grid e margens
   - Definir tamanhos de fonte
   - Especificar alinhamento e spacing

2. **Chris Do — Identidade Visual** (quando aplicavel)
   - Garantir aderencia ao brand system
   - Sugerir elementos visuais de apoio
   - Definir uso de cores e logo

3. **Gerar Design Specs completos**
   - Formato (dimensoes)
   - Background
   - Tipografia por nivel
   - Layout/grid
   - Elementos visuais
   - Logo placement

---

## Phase 4: REVIEW (CRAP CHECK)

**Executor:** robin-williams (Quality Checker)
**Duration:** 2-3 min
**Checkpoint:** CRAP Score >= 28/40

### Actions:

1. **Aplicar checklist CRAP** em cada slide/peca:
   - Contrast (C): Score /10
   - Repetition (R): Score /10
   - Alignment (A): Score /10
   - Proximity (P): Score /10

2. **Calcular score total**: C + R + A + P = X/40

3. **Decisao:**
   ```
   IF score >= 36: EXCELENTE → Phase 5
   IF score >= 28: BOM → Phase 5 (com observacoes)
   IF score >= 20: REGULAR → Voltar Phase 3 com feedback
   IF score < 20: REPROVADO → Voltar Phase 3 com feedback detalhado
   ```

4. **Se reprovado:** Feedback especifico por dimensao com correcoes sugeridas

### Quality Gate QG-004: CRAP Visual Check

```yaml
checkpoint:
  gate: QG-004
  blocking: true
  criteria:
    - crap_score >= 28
    - no_dimension_below_5: true
    - contrast >= 6: true
    - repetition >= 6: true
  max_iterations: 2
  on_max_fail: "Entregar com warning + issues documentados"
```

---

## Phase 5: ENTREGA

**Executor:** cdr-design-chief
**Duration:** 1-2 min
**Checkpoint:** Entrega final

### Actions:

1. **Consolidar output:**
   - Copy completa (headline + body + CTA)
   - Design specs detalhados
   - Caption (se aplicavel)
   - CRAP Score
   - Hashtags

2. **Apresentar ao usuario:**
   - Resumo da peca criada
   - Score de qualidade
   - Proximos passos sugeridos

3. **Quality Gate QG-006: Final Delivery**

```yaml
checkpoint:
  gate: QG-006
  blocking: true
  criteria:
    - all_outputs_present: true
    - crap_score_passed: true
    - brand_guidelines_followed: true
```

---

## Error Handling

```yaml
error_handling:
  briefing_incomplete:
    action: "Pedir inputs faltantes ao usuario"
    blocking: true

  copy_fails_sb7:
    action: "Reescrever com feedback especifico"
    max_retries: 2

  design_fails_crap:
    action: "Ajustar design com feedback do Robin Williams"
    max_retries: 2

  repeated_failure:
    action: "Entregar com warnings documentados"
    notify: "usuario informado dos issues"
```

---

## Routing Table

| Tipo de Conteudo | Task Acionada | Agentes Envolvidos |
|-----------------|---------------|--------------------|
| Feed Post | create-feed-post | Schwartz, Lupton, Robin Williams |
| Carrossel | create-carousel | Schwartz, Miller, Lupton, Robin Williams |
| Stories | create-stories-kit | Schwartz, Lupton, Robin Williams |
| Reels Cover | create-reels-cover | Schwartz, Chris Do, Robin Williams |
| Highlight Covers | create-highlight-covers | Chris Do, Robin Williams |
| Caption apenas | write-caption | Schwartz, Miller |
