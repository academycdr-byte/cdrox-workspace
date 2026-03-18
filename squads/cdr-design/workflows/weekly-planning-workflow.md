# Workflow: Weekly Planning — Planejamento Semanal de Conteudo

**Workflow ID:** weekly-planning-workflow
**Version:** 1.0.0
**Purpose:** Planejar toda a semana de conteudo do Instagram em uma unica sessao
**Phases:** 4
**Agentes Envolvidos:** jasmine-star (T3), gary-vaynerchuk (T3), cdr-design-chief

---

## Overview

```
ANALISE → MIX → CALENDARIO → CHECKLIST
```

Workflow acionado com `*planejar-semana`. Produz um calendario completo com todos os posts,
stories e reels da semana, incluindo categorias, formatos e briefings de criacao.

---

## Phase 1: ANALISE DA SEMANA

**Executor:** cdr-design-chief
**Duration:** 3-5 min

### Actions:

1. **Coletar contexto:**
   - Semana de referencia (datas)
   - Datas especiais ou eventos
   - Foco estrategico atual
   - Metricas da semana anterior (se disponiveis)

2. **Definir volume:**
   - Posts por semana (default: 5)
   - Stories por dia (default: 3)
   - Reels por semana (default: 2)

---

## Phase 2: DEFINIR MIX (JJJRH)

**Executor:** gary-vaynerchuk (Tier 3)
**Duration:** 3-5 min
**Task:** define-content-mix

### Actions:

1. **Calcular ratio Jab/Right Hook:**
   - Base: 75% jabs / 25% right hooks
   - Ajustar por objetivo de negocio

2. **Distribuir tipos de jab:**
   - Educativo: 30%
   - Engajamento: 25%
   - Bastidores: 20%
   - Autoridade: 15%
   - Cultura: 10%

3. **Mapear formatos:**
   - Que tipo de conteudo vai em que formato
   - Platform-native rules

4. **Document Don't Create:**
   - Identificar oportunidades de conteudo de bastidores

---

## Phase 3: MONTAR CALENDARIO

**Executor:** jasmine-star (Tier 3)
**Duration:** 5-10 min
**Task:** plan-content-calendar

### Actions:

1. **Selecionar categorias para cada dia:**
   - Aplicar sistema de 9 categorias
   - Respeitar regra 98/2
   - Rotacionar categorias (sem repeticao)

2. **Definir para cada dia:**
   - Tipo de post (feed/carousel/reel)
   - Categoria (educativo, resultado, etc.)
   - Topico especifico
   - Jab ou Right Hook
   - Awareness level
   - Hook sugerido

3. **Planejar stories diarios:**
   - AM: Bastidores/tip
   - PM: Interacao (enquete/pergunta)
   - Night: Repost/insight

4. **Planejar reels:**
   - Topicos
   - Hooks
   - Formato (talking head, screen share, etc.)

---

## Phase 4: GERAR CHECKLIST DE CRIACAO

**Executor:** cdr-design-chief
**Duration:** 2-3 min

### Actions:

1. **Converter calendario em tarefas:**
   - Para cada post: briefing de criacao
   - Para cada stories: roteiro
   - Para cada reel: script

2. **Priorizar criacao:**
   - O que precisa ser criado primeiro
   - O que pode ser feito em batch
   - O que precisa de foto/video novo

3. **Apresentar calendario final:**
   - Visao semanal
   - Detalhes por dia
   - Checklist de producao

---

## Output Template

```markdown
# Calendario Semanal — {week_start} a {week_end}

## Resumo
- Total posts: {count}
- Jabs: {jab_count} ({percentage}%)
- Right Hooks: {rh_count} ({percentage}%)
- Stories/dia: {count}
- Reels: {count}

---

## SEG {date}
### Post: Carrossel Educativo (JAB)
- Categoria: EDUCATIVO
- Topico: "{topic}"
- Hook: "{hook}"
- Formato: Carrossel 8 slides
- Horario: 11h

### Stories (3)
- 09h: Bastidores — Equipe chegando no escritorio
- 14h: Enquete — "Qual sua maior dor no e-commerce?"
- 19h: Tip rapida — CRO em 1 frase

---

## TER {date}
### Post: Reel (JAB)
[...]

---

## Checklist de Producao
- [ ] Seg: Criar carrossel "{topic}" (task: create-carousel)
- [ ] Ter: Gravar reel "{topic}" (task: create-reels-cover)
- [ ] Qua: Criar stories kit (task: create-stories-kit)
- [ ] Qui: Criar feed post "{topic}" (task: create-feed-post)
- [ ] Sex: Criar carrossel de oferta (task: create-carousel)
```

---

## Failure Handling

```yaml
phase_1_failures:
  insufficient_context:
    trigger: "Usuario nao informou datas ou foco estrategico"
    action: "Perguntar: 1) Semana de referencia, 2) Eventos/datas especiais, 3) Foco do mes"
    max_retries: 2
    fallback: "Usar semana corrente + foco generico (educativo)"

  no_metrics:
    trigger: "Metricas da semana anterior indisponiveis"
    action: "Prosseguir sem metricas, registrar nota no output"
    severity: "LOW — nao bloqueia"

phase_2_failures:
  invalid_jjjrh_ratio:
    trigger: "Ratio jabs/right hooks < 70/30 ou > 90/10"
    action: "Recalcular automaticamente para 75/25 e apresentar revisao"
    max_retries: 1
    fallback: "Usar 75/25 default"

  mix_exceeds_capacity:
    trigger: "Volume de posts nao comporta o mix definido"
    action: "Avisar usuario e sugerir reducao de categorias ou aumento de volume"
    max_retries: 2

phase_3_failures:
  category_repeat:
    trigger: "Mesma categoria em dias consecutivos"
    action: "Rotacionar automaticamente, logar ajuste"
    severity: "MEDIUM"

  scheduling_conflict:
    trigger: "Dois posts no mesmo horario ou dia sem stories"
    action: "Sinalizar conflito, sugerir redistribuicao"
    max_retries: 1

phase_4_failures:
  task_reference_invalid:
    trigger: "Briefing referencia task que nao existe"
    action: "Retornar para Phase 3 para correcao"
    severity: "HIGH"

  checklist_incomplete:
    trigger: "Menos de 80% dos dias com briefing completo"
    action: "Completar briefings faltantes antes de entregar"
    max_retries: 1
```

---

## Rework Rules

```yaml
rework_policy:
  max_iterations_per_phase: 3
  max_total_iterations: 5

  rollback_rules:
    phase_1_fail: "Recoletar contexto (nao avanca para Phase 2)"
    phase_2_fail: "Recalcular mix (nao volta para Phase 1)"
    phase_3_fail: "Remontar calendario (nao volta para Phase 2 a menos que mix esteja errado)"
    phase_4_fail: "Revalidar briefings (retorna para Phase 3 se task reference invalida)"

  user_change_requests:
    before_phase_4: "Aceitar mudanca, retornar para fase afetada"
    after_phase_4: "Pedir confirmacao — mudanca pos-checklist reinicia Phase 3→4"

  escalation:
    trigger: "max_iterations atingido OU usuario insatisfeito apos 2 revisoes"
    action: "Escalar para cdr-design-chief com contexto completo"
    message: "Precisei de mais iteracoes que o normal. Escalando pro Chief pra garantir qualidade."
```

---

## Checkpoints

```yaml
checkpoint_phase_1_to_2:
  name: "Contexto Coletado"
  criteria:
    - dates_defined: true
    - volume_defined: true
    - focus_defined: true
  on_fail: "Perguntar itens faltantes antes de prosseguir"

checkpoint_phase_2_to_3:
  name: "Mix Validado"
  criteria:
    - jjjrh_ratio_valid: true  # 70/30 a 90/10
    - categories_mapped: true
    - formats_assigned: true
  on_fail: "Recalcular mix (Phase 2 rework)"

checkpoint_phase_3_to_4:
  name: "Calendario Completo"
  criteria:
    - all_days_filled: true
    - no_category_collision: true
    - stories_planned: true
    - reels_planned: true
  on_fail: "Completar calendario (Phase 3 rework)"
```

---

## Acceptance Criteria

- [ ] Ratio JJJRH entre 70/30 e 90/10 (verificavel por contagem: jabs/total >= 0.70)
- [ ] Categorias rotacionadas: nenhuma categoria aparece em dias consecutivos
- [ ] Regra 98/2 respeitada: no maximo 1 right hook a cada 3-4 posts
- [ ] Cada dia da semana tem: 1 post (feed/carousel/reel) + 3 stories planejados
- [ ] Reels com hooks definidos (1 frase por reel, max 10 palavras)
- [ ] Checklist de producao com todas as tasks referenciando tasks validas do squad
- [ ] Nenhum checkpoint falhou sem resolucao documentada
