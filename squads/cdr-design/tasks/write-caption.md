# Task: Escrever Caption/Legenda para Instagram

**Task ID:** write-caption
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Criar legendas persuasivas para posts do Instagram usando frameworks de copy
**Executor Primario:** eugene-schwartz (Tier 2) + donald-miller (Tier 2)
**Estimated Time:** 5-10 min

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_topic` | string | Yes | Tema do post |
| `post_type` | enum | Yes | feed_post, carousel, reel |
| `category` | enum | Yes | educativo, resultado, bastidores, depoimento, engajamento, autoridade, oferta, tendencia |
| `awareness_level` | enum | No | unaware, problem, solution, product, most. Default: problem |
| `cta_type` | enum | No | salvar, comentar, compartilhar, link_bio, dm. Default: salvar |
| `tone` | enum | No | educativo, provocativo, inspiracional, direto. Default: direto |

---

## Steps

### Step 1: Analisar Nivel de Consciencia (Schwartz)

**Executor:** eugene-schwartz
**Action:** Definir abordagem de copy baseada no awareness level

```yaml
awareness_mapping:
  unaware:
    hook_style: "Revelar algo que o leitor nao sabia"
    example: "Voce sabia que 73% dos e-commerces perdem venda por causa de..."
    tone: "Curiosidade, revelacao"

  problem_aware:
    hook_style: "Nomear a dor diretamente"
    example: "Cansado de investir em trafego e nao ver retorno?"
    tone: "Empatia, validacao"

  solution_aware:
    hook_style: "Apresentar o metodo/abordagem"
    example: "Existe um metodo que nossos clientes usam para 3x o ROAS"
    tone: "Autoridade, especificidade"

  product_aware:
    hook_style: "Prova social e diferencial"
    example: "Por que 30+ e-commerces escolheram a CDR?"
    tone: "Confianca, dados"

  most_aware:
    hook_style: "Oferta direta com urgencia"
    example: "Vagas limitadas para analise gratuita esta semana"
    tone: "Urgencia, escassez"
```

### Step 2: Estruturar Narrativa (Donald Miller)

**Executor:** donald-miller
**Action:** Aplicar SB7 na caption

```yaml
sb7_caption_structure:
  hook:
    rule: "Primeira linha visivel no feed — DEVE parar o scroll"
    max_chars: 125
    technique: "Pergunta, dado chocante, provocacao, ou historia"

  character_validation:
    check: "O CLIENTE e o heroi da historia, nao a CDR"
    wrong: "Nos somos os melhores em performance"
    right: "Voce merece um e-commerce que funciona no piloto automatico"

  problem_naming:
    external: "Problema tangivel (ROAS baixo, conversao ruim)"
    internal: "Sentimento (frustacao, inseguranca, cansaco)"
    philosophical: "O que e justo (todo e-commerce merece performance)"

  guide_positioning:
    empathy: "Mostrar que entende a dor"
    authority: "Mostrar que tem competencia"
    example: "A gente vive isso todo dia. Ja ajudamos 30+ operacoes a sair dessa."

  plan:
    steps: 3
    format: "Simples e acionavel"
    example: "1. Agende sua analise → 2. Receba estrategia personalizada → 3. Escale seu faturamento"

  cta:
    direct: "Especifico e com verbo de acao"
    examples:
      salvar: "Salva esse post pra consultar depois"
      comentar: "Comenta '🔥' se voce ja passou por isso"
      compartilhar: "Manda pra aquele amigo que precisa ouvir isso"
      link_bio: "Link na bio pra agendar sua analise gratuita"
      dm: "Manda um 'QUERO' no direct"
```

### Step 3: Compor Caption Final

**Executor:** eugene-schwartz + donald-miller
**Action:** Escrever a caption completa

```yaml
caption_composition:
  structure:
    line_1: "HOOK — para o scroll (max 125 chars)"
    line_2: ""  # Linha em branco
    line_3_to_N: "BODY — conteudo principal"
    line_N_plus_1: ""  # Linha em branco
    line_N_plus_2: "CTA — chamada para acao"
    line_N_plus_3: "."  # Separador
    line_N_plus_4: "HASHTAGS"

  formatting_rules:
    - "Quebrar em paragrafos curtos (2-3 linhas max)"
    - "Usar emojis com moderacao (1 por paragrafo max)"
    - "Negrito e italico nao funcionam no Instagram — usar CAPS para enfase"
    - "Linha em branco entre blocos (usar ponto final como separador)"
    - "Hashtags no final, separadas por ponto"

  length_guidelines:
    educativo: "800-1500 caracteres (texto rico)"
    resultado: "500-800 caracteres (foco nos numeros)"
    bastidores: "300-600 caracteres (leve, conversacional)"
    engajamento: "200-400 caracteres (curto, pergunta)"
    oferta: "500-800 caracteres (claro e direto)"

  hashtag_strategy:
    total: "8-12 hashtags"
    mix:
      high_volume: "3-4 (ex: #ecommerce #marketingdigital)"
      medium_volume: "3-4 (ex: #lojavirtual #vendasonline)"
      niche: "2-4 (ex: #assessoriaperformance #croecommerce)"
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Caption | text | Legenda completa formatada |
| Hook | text | Primeira linha (para preview) |
| Hashtags | list | Lista de hashtags |
| Awareness Level | enum | Nivel de consciencia aplicado |
| SB7 Check | object | Validacao dos 7 elementos |

---

## Output Template

```markdown
# Caption — {post_topic}

## Awareness Level: {level}
## Categoria: {category}

---

### Caption Completa:

{hook_line}

{body_paragraphs}

{cta_line}

.
.
.
{hashtags}

---

### SB7 Check
- Character (heroi = cliente): ✅/❌
- Problem (nomeado): ✅/❌
- Guide (CDR como mentor): ✅/❌
- Plan (passos claros): ✅/❌
- CTA (direto): ✅/❌
- Failure (implicito): ✅/❌
- Success (transformacao): ✅/❌
```

---

## Acceptance Criteria

- [ ] Hook para o scroll (max 125 chars, gera curiosidade)
- [ ] Nivel de consciencia correto aplicado
- [ ] SB7 checklist: min 5/7 elementos presentes
- [ ] Cliente e o heroi (nao a CDR)
- [ ] CTA especifico e acionavel
- [ ] Hashtags relevantes (8-12, mix de volumes)
- [ ] Formatacao correta (paragrafos curtos, separadores)
