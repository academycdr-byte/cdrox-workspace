# Task: Planejar Calendario de Conteudo Semanal

**Task ID:** plan-content-calendar
**Version:** 1.0.0
**Execution Type:** Hybrid
**Purpose:** Planejar toda a semana de conteudo do Instagram em uma unica sessao
**Executor Primario:** jasmine-star (Tier 3) + gary-vaynerchuk (Tier 3)
**Estimated Time:** 15-20 min

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `week_start` | date | Yes | Data de inicio da semana |
| `posts_per_week` | number | No | Numero de posts (default: 5) |
| `stories_per_day` | number | No | Stories por dia (default: 3) |
| `reels_per_week` | number | No | Reels por semana (default: 2) |
| `special_dates` | list | No | Datas especiais/eventos da semana |
| `current_focus` | string | No | Foco estrategico atual (ex: "lancamento novo servico") |
| `last_week_metrics` | object | No | Metricas da semana anterior para otimizacao |

---

## Preconditions

- [ ] jasmine-star e gary-vaynerchuk agents ativos
- [ ] Brand context carregado
- [ ] Knowledge base acessivel

---

## Steps

### Step 1: Definir Mix de Conteudo (Gary Vaynerchuk)

**Executor:** gary-vaynerchuk
**Action:** Aplicar JJJRH para definir proporcao valor vs. conversao

```yaml
jjjrh_planning:
  total_posts: "{posts_per_week}"

  jab_ratio: 75%  # 3/4 dos posts
  right_hook_ratio: 25%  # 1/4 dos posts

  jab_types:
    - educativo: "Dica, tutorial, como fazer"
    - engajamento: "Pergunta, enquete, debate"
    - inspiracao: "Caso de sucesso, motivacao com dados"
    - bastidores: "Dia a dia da equipe, processo de trabalho"

  right_hook_types:
    - oferta_direta: "Servico, consulta gratuita"
    - social_proof: "Depoimento + CTA"

  platform_native_rules:
    feed_posts: "Alta qualidade, thumb-stopping, save-worthy"
    carousels: "Educativos, valor puro, 7-10 slides"
    stories: "Autenticidade, interacao, bastidores"
    reels: "Hook em 1-2 segundos, entretenimento ou educacao"

  distribution:
    IF posts_per_week == 5:
      - "Seg: Jab (educativo) — Carrossel"
      - "Ter: Jab (engajamento) — Reel"
      - "Qua: Jab (bastidores) — Stories focus"
      - "Qui: Jab (autoridade) — Feed post"
      - "Sex: Right Hook (oferta) — Carrossel ou Reel"
```

### Step 2: Selecionar Categorias (Jasmine Star)

**Executor:** jasmine-star
**Action:** Aplicar sistema de categorias para cada dia

```yaml
category_selection:
  available_categories:
    - EDUCATIVO: "Tips sobre e-commerce, CRO, marketing"
    - RESULTADO: "Case studies com numeros (antes/depois)"
    - BASTIDORES: "Behind-the-scenes da equipe CDR"
    - DEPOIMENTO: "Testemunhos e reviews de clientes"
    - ENGAJAMENTO: "Perguntas, enquetes, conteudo interativo"
    - AUTORIDADE: "Insights de mercado, dados do setor"
    - CULTURA: "Cultura da equipe, valores, dia a dia"
    - OFERTA: "Pitch direto (servicos, analise gratuita)"
    - TENDENCIA: "Tendencias atuais em e-commerce"

  98_2_rule_check:
    audience_content: "{posts about audience} >= 98% of total"
    self_content: "{posts about CDR services} <= 2%"
    note: "Mesmo posts de RESULTADO sao sobre o CLIENTE, nao sobre a CDR"

  weekly_calendar:
    for_each_day:
      - caption_category: "{selected from above}"
      - visual_category: "{photo/graphic/video}"
      - format: "{feed/carousel/reel/story}"
      - jjjrh_type: "{jab/right_hook}"
      - topic_idea: "{specific topic}"
      - awareness_level: "{unaware/problem/solution/product/most}"
```

### Step 3: Planejar Stories (Jasmine Star)

**Executor:** jasmine-star
**Action:** Definir stories para cada dia

```yaml
stories_planning:
  daily_structure:
    morning: "Behind-the-scenes ou tip rapida"
    afternoon: "Interacao (enquete, pergunta, slider)"
    evening: "Repost de conteudo do feed ou insight"

  interactive_elements:
    - enquetes: "Min 2x por semana"
    - perguntas: "Min 1x por semana"
    - sliders: "Min 1x por semana"
    - countdowns: "Para eventos ou lancamentos"

  stories_themes:
    seg: "Motivacao + meta da semana"
    ter: "Dica rapida + enquete"
    qua: "Bastidores da equipe"
    qui: "Insight do mercado + pergunta"
    sex: "Resultado da semana + CTA"
```

### Step 4: Definir Reels (Gary Vaynerchuk)

**Executor:** gary-vaynerchuk
**Action:** Planejar reels da semana

```yaml
reels_planning:
  per_reel:
    hook: "Primeiros 1-2 segundos — frase ou visual que para"
    content: "Educativo ou entretenimento, 15-60 segundos"
    cta: "Final com CTA (seguir, salvar, comentar)"
    cover: "Thumbnail com texto bold sobre tema"
    audio: "Trending audio quando possivel"

  formats:
    talking_head: "Ivan ou equipe falando direto para camera"
    screen_share: "Mostrando dashboard, metricas, resultados"
    before_after: "Antes e depois de um cliente"
    tutorial_rapido: "Como fazer X em 30 segundos"
```

### Step 5: Gerar Calendario Final

**Executor:** jasmine-star + gary-vaynerchuk
**Action:** Consolidar tudo em calendario visual

```yaml
calendar_output:
  for_each_day:
    date: "{date}"
    posts:
      - type: "{feed/carousel/reel}"
        category: "{category}"
        topic: "{specific topic}"
        jjjrh: "{jab/right_hook}"
        awareness: "{level}"
        format: "{format specs}"
        best_time: "{optimal posting time}"
    stories:
      - time: "{morning/afternoon/evening}"
        content: "{description}"
        interactive: "{element type if any}"
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Weekly Calendar | markdown | Calendario completo da semana |
| Content Mix | yaml | Distribuicao JJJRH |
| Stories Plan | yaml | Plano diario de stories |
| Reels Plan | yaml | Plano de reels da semana |
| Execution Checklist | markdown | Lista de tarefas de criacao |

---

## Output Template

```markdown
# Calendario de Conteudo — Semana {week_start}

## Mix da Semana
- Jabs: {jab_count} ({jab_percentage}%)
- Right Hooks: {rh_count} ({rh_percentage}%)
- Total Posts: {total}
- Stories/dia: {stories_per_day}
- Reels: {reels_count}

---

## Segunda-feira {date}
### Post: {type}
- Categoria: {category}
- Topico: {topic}
- Copy Hook: "{hook_preview}"
- Formato: {format}
- Horario: {time}

### Stories
- AM: {morning_story}
- PM: {afternoon_story}
- Night: {evening_story}

## Terca-feira {date}
[... mesmo formato ...]

---

## Checklist de Criacao
- [ ] Seg: {task_description}
- [ ] Ter: {task_description}
- [ ] Qua: {task_description}
- [ ] Qui: {task_description}
- [ ] Sex: {task_description}
```

---

## Acceptance Criteria

- [ ] Proporcao JJJRH respeitada (75% jabs / 25% hooks)
- [ ] Regra 98/2 respeitada (98% sobre audiencia)
- [ ] Todas as categorias rotacionadas (sem repeticao excessiva)
- [ ] Stories com elementos interativos (min 2x/semana)
- [ ] Reels com hooks definidos
- [ ] Horarios otimos de postagem definidos
- [ ] Calendario visual completo e acionavel
- [ ] Checklist de criacao gerado
