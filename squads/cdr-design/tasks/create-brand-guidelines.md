# Task: Criar Brand Guidelines

**Task ID:** create-brand-guidelines
**Version:** 1.0.0
**Execution Type:** Hybrid
**Purpose:** Criar documento de diretrizes visuais completo para a marca
**Executor Primario:** marty-neumeier (Tier 1 — estrategia) + chris-do (Tier 1 — design) + ellen-lupton (Tier 1 — tipografia)
**Estimated Time:** 20-30 min

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `brand_name` | string | Yes | Nome da marca |
| `diagnosis_report` | file | No | Relatorio de diagnostico (de diagnose-brand) |
| `reference_profiles` | list | No | Perfis de referencia |

---

## Steps

### Step 1: Estrategia de Marca (Neumeier)

**Executor:** marty-neumeier
**Action:** Definir posicionamento e diferenciacao

```yaml
brand_strategy:
  onlyness_statement:
    template: "CDR e a UNICA _____ que _____"
    exercise: "Completar com o diferencial real"

  five_disciplines:
    differentiation: "O que torna CDR diferente de outras assessorias?"
    collaboration: "Como CDR trabalha com seus clientes?"
    innovation: "O que CDR faz que ninguem mais faz?"
    validation: "Como provar que funciona? (dados, cases)"
    cultivation: "Como a marca evolui e se fortalece?"

  brand_personality:
    if_person: "Se CDR fosse uma pessoa, como seria?"
    adjectives: "3-5 adjetivos que definem CDR"
    tone: "Tom de voz (formal/informal, tecnico/acessivel)"
```

### Step 2: Design Identity (Chris Do)

**Executor:** chris-do
**Action:** Definir sistema de identidade visual

```yaml
identity_system:
  brand_personality_pyramid:
    core_functionality: "Performance e escala para e-commerces"
    benefits: "Mais receita, menos desperdicio, decisoes baseadas em dados"
    emotional_response: "Seguranca, confianca, parceria"
    personality: "Inteligente, direto, confiavel, tech-savvy"
    essence: "Inteligencia que gera resultado"

  visual_identity:
    logo:
      primary: "Seta verde em circulo escuro"
      variations: "Mono, invertido, minimo"
      clear_space: "Espaco minimo ao redor do logo"
      minimum_size: "Tamanho minimo para legibilidade"

    colors:
      primary: "#A8D600 (Verde CDR)"
      secondary: "#0A0A0A (Preto CDR)"
      accent: "#B5E300 (Verde brilhante)"
      neutral: "#FFFFFF, #B0B0B0, #1A1A1A"
      usage_rules: "Verde para destaques e CTAs. Preto para fundos. Branco para texto."

    photography:
      style: "Dark mood, iluminacao dramatica, acentos de verde"
      do: "Fotos profissionais da equipe, dados em tela, resultados reais"
      dont: "Stock photos genericas, imagens muito claras, fundos brancos"
```

### Step 3: Sistema Tipografico (Lupton)

**Executor:** ellen-lupton
**Action:** Definir sistema completo de tipografia

```yaml
typography_system:
  primary_font:
    name: "Inter, Montserrat, ou similar sans-serif"
    weights: "Regular (400), Semi-bold (600), Bold (700), Black (900)"
    use: "Headlines, body text, UI elements"

  hierarchy:
    h1: "Black, 64-96px (headlines principais)"
    h2: "Bold, 48-64px (subheadlines)"
    h3: "Semi-bold, 32-40px (section headers)"
    body: "Regular, 24-28px (texto corrido)"
    caption: "Regular, 18-20px (metadata, creditos)"
    accent: "Bold, cor #A8D600 (destaques)"

  rules:
    - "Max 2 familias tipograficas por peca"
    - "Hierarquia clara: headline > sub > body > caption"
    - "Contraste minimo: 2x de tamanho entre niveis"
    - "Kerning ajustado para headlines grandes"
    - "Line-height: 1.2 para headlines, 1.5 para body"

  instagram_specific:
    feed_headline: "56-72px, Black weight"
    carousel_headline: "48-64px, Bold weight"
    stories_text: "40-56px, Bold weight"
    caption_text: "N/A (texto nativo do Instagram)"
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Brand Guidelines | markdown | Documento completo de diretrizes |
| Color Palette | yaml | Paleta de cores com codigos |
| Typography System | yaml | Sistema tipografico completo |
| Brand Personality | markdown | Personalidade e posicionamento |

---

## Acceptance Criteria

- [ ] Onlyness statement definido
- [ ] 5 disciplinas de branding mapeadas
- [ ] Brand Personality Pyramid completa
- [ ] Paleta de cores com codigos hex e regras de uso
- [ ] Sistema tipografico com hierarquia definida
- [ ] Regras de fotografia/imagem
- [ ] Exemplos de uso correto e incorreto
