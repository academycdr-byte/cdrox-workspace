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

## Acceptance Criteria

- [ ] Usuario recebeu greeting com lista de comandos
- [ ] Brand context foi verificado
- [ ] Proximo passo foi identificado e roteado corretamente

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
