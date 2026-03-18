# Task: Start — Onboarding do CDR Design Squad

**Task ID:** start
**Version:** 1.0.0
**Execution Type:** Hybrid
**Purpose:** Onboarding inicial do squad — configurar contexto da marca e apresentar capacidades
**Executor:** cdr-design-chief
**Estimated Time:** 5-10 min

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `brand_name` | string | No | Nome da marca (default: CDR Group) |
| `instagram_handle` | string | No | @ do Instagram |
| `brand_context` | string | No | Contexto adicional sobre a marca |

---

## Preconditions

- [ ] cdr-design-chief agent ativo
- [ ] Acesso ao knowledge base (data/cdr-design-kb.md)

---

## Steps

### Step 1: Greeting e Contextualizacao

**Executor:** cdr-design-chief
**Action:** Apresentar o squad e suas capacidades

```
Fala! Eu sou o CDR Design Chief — coordeno um time de 9 especialistas
de elite em design, branding, copy e estrategia de conteudo.

Meu squad pode te ajudar com:

  🎨 Feed Posts + Carrosseis — design visual de alta qualidade
  📱 Stories + Reels Covers — artes para formatos verticais
  🏷️ Identidade Visual — paleta, tipografia, guidelines
  ✍️ Copies Visuais — texto persuasivo integrado ao design
  📅 Planejamento Semanal — calendario de conteudo estruturado

Comandos disponiveis:
  *criar-post         — Criar feed post
  *criar-carrossel    — Criar carrossel educativo/promocional
  *criar-stories      — Criar kit de stories
  *criar-reels-cover  — Criar capa de reels
  *planejar-semana    — Planejar conteudo da semana
  *diagnostico        — Diagnosticar identidade visual da marca
  *review             — Revisar qualidade visual de uma peca

Ja tenho o contexto da CDR carregado. Quer comecar com o que?
```

### Step 2: Verificar Brand Context

**Executor:** cdr-design-chief
**Action:** Checar se o brand context esta configurado

```yaml
brand_context_check:
  has_colors: true  # Verde #A8D600 + Preto #0A0A0A
  has_logo: true    # Seta verde em circulo escuro
  has_typography: true  # Sans-serif bold
  has_style: true   # Dark theme, green neon
  has_references: true  # Lever + Haus

  IF all_true:
    → "Contexto da CDR ja esta carregado. Pronto pra criar!"
  ELSE:
    → "Preciso configurar o contexto da marca primeiro."
    → Redirecionar para task diagnose-brand
```

### Step 3: Identificar Necessidade

**Executor:** cdr-design-chief
**Action:** Perguntar o que o usuario precisa e rotear

```yaml
routing_logic:
  IF user mentions "post" OR "feed":
    → Route to *criar-post
  IF user mentions "carrossel" OR "carousel":
    → Route to *criar-carrossel
  IF user mentions "stories" OR "story":
    → Route to *criar-stories
  IF user mentions "reels" OR "cover" OR "capa":
    → Route to *criar-reels-cover
  IF user mentions "semana" OR "planejar" OR "calendario":
    → Route to *planejar-semana
  IF user mentions "marca" OR "brand" OR "identidade":
    → Route to *diagnostico
  IF user mentions "review" OR "revisar" OR "checar":
    → Route to *review
  ELSE:
    → Ask for clarification
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Greeting displayed | text | Squad apresentado ao usuario |
| Brand context verified | boolean | Contexto da marca confirmado |
| Next action routed | string | Proximo comando/task identificado |

---

## Anti-Patterns

1. **NUNCA iniciar sem greeting completo** — Nao pular direto para routing sem apresentar o squad
2. **NUNCA criar conteudo sem brand context verificado** — Se brand_context_check falhar, OBRIGATORIO redirecionar para diagnose-brand antes de qualquer criacao
3. **NUNCA assumir a necessidade do usuario** — Se o input nao bater com nenhum trigger do routing_logic, PERGUNTAR em vez de assumir
4. **NUNCA listar menos que 7 comandos no greeting** — O usuario precisa ver TODAS as opcoes disponiveis
5. **NUNCA ignorar contexto adicional** — Se o usuario passar brand_name ou instagram_handle, usar esses dados no brand_context_check

---

## Examples

### Exemplo 1: Roteamento direto
**Input:**
> "Preciso criar um carrossel sobre CRO"

**Output esperado:**
1. Greeting exibido (se primeira interacao)
2. Brand context verificado → OK
3. Roteamento: `*criar-carrossel` com tema "CRO"

### Exemplo 2: Brand context ausente
**Input:**
> "Quero criar conteudo para minha marca nova"

**Output esperado:**
1. Greeting exibido
2. Brand context verificado → FAIL (marca nova, sem contexto)
3. Roteamento: `*diagnostico` (task diagnose-brand) ANTES de qualquer criacao
4. Mensagem: "Antes de criar, preciso conhecer sua marca. Vou fazer um diagnostico rapido."

### Exemplo 3: Input ambiguo
**Input:**
> "Preciso de ajuda com o Instagram"

**Output esperado:**
1. Greeting exibido
2. Brand context verificado → OK
3. Roteamento: NENHUM (input ambiguo)
4. Resposta: "Posso te ajudar com varias coisas! Voce quer: criar conteudo (post, carrossel, stories), planejar a semana, ou revisar algo que ja tem?"

---

## Error Handling

```yaml
error_scenarios:
  brand_context_file_missing:
    condition: "data/cdr-design-kb.md nao encontrado"
    action: "Informar usuario e executar diagnostico basico com inputs manuais"
    message: "Nao encontrei o knowledge base da marca. Vou coletar as informacoes diretamente com voce."

  routing_no_match:
    condition: "Nenhum trigger do routing_logic corresponde ao input"
    action: "Pedir esclarecimento com opcoes concretas"
    max_retries: 2
    fallback: "Listar todos os comandos e pedir escolha direta"

  agent_unavailable:
    condition: "Agente destino nao responde ou arquivo nao carrega"
    action: "Tentar agente alternativo do mesmo tier ou escalar para cdr-design-chief"
    message: "Tive um problema ao rotear. Vou resolver por outra via."
```

---

## Acceptance Criteria

- [ ] Greeting exibido com TODOS os 7 comandos (*criar-post, *criar-carrossel, *criar-stories, *criar-reels-cover, *planejar-semana, *diagnostico, *review)
- [ ] Brand context verificado com resultado booleano (true: 5/5 checks | false: redirect para diagnose-brand)
- [ ] Routing executado corretamente: input do usuario mapeado para 1 dos 7 comandos OU pergunta de esclarecimento feita
- [ ] Em caso de input ambiguo: usuario recebeu lista de opcoes (nao ficou sem resposta)
- [ ] Em caso de brand context ausente: usuario foi redirecionado para *diagnostico ANTES de qualquer criacao

---

## Quality Gate

```yaml
gate: QG-001
name: "Request Classification"
type: routing
blocking: false
criteria:
  - greeting_displayed: true
  - brand_context_loaded: true
  - next_action_identified: true
```
