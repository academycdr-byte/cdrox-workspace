# Task: Capa Carrossel CDR (One Command)

**Task ID:** capa-carrossel-cdr
**Version:** 1.0.0
**Execution Type:** Script Wrapper
**Purpose:** Gerar imagem Instagram no estilo CDR aprovado pelo Ivan usando o pipeline create-post.mjs (Gemini + grain + upscale)
**Script:** `squads/cdr-design/scripts/create-post.mjs`
**Estimated Time:** 1-3 min por imagem

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `texto` | string | Yes | Texto separado por `\|` (pipe) — cada segmento = 1 linha na imagem. Ex: `DADOS\|FALAM.\|FEELING\|NAO.` |
| `formato` | enum | **Yes** | `feed` (1080x1350, 4:5) ou `reels` (1080x1920, 9:16) — SEMPRE perguntar |
| `grain` | number | No | Intensidade do grain (padrao: 100). Valores altos = mais textura |
| `sem_grain` | boolean | No | Pular grain completamente |
| `sem_upscale` | boolean | No | Manter resolucao original do Gemini |
| `referencia` | string | No | Caminho para imagem de referencia customizada (padrao: ivan-approved-style.png) |
| `logo` | string | No | Caminho para imagem de logo a incluir no post |
| `output` | string | No | Caminho de saida customizado (padrao: squads/cdr-design/output/) |

---

## Preconditions

- [ ] GEMINI_API_KEY configurada no `.env`
- [ ] Node.js instalado com `sharp` disponivel
- [ ] Arquivo de referencia existe (`squads/cdr-design/data/style-ref/ivan-approved-style.png`)

---

## Steps

### Step 1: Coletar Texto e Formato

**Action:** Perguntar ao usuario o texto E o formato da imagem (ambos obrigatorios)

```yaml
elicit: true
mandatory: true
prompt: |
  Preciso de duas informacoes:

  1. **Texto da imagem** — separe as linhas com | (barra):
     Exemplos:
       DADOS|FALAM.|FEELING|NAO.
       RESULTADO|FALA.|GURU|NAO.
       CONSTANCIA|E DADOS|GERAM|RESULTADO.
       SUA LOJA|COM O|TEMA|CDR GROUP🥇

  2. **Formato** — qual tipo de imagem?
     - **FEED** → 1080x1350 (4:5)
     - **REELS** → 1080x1920 (9:16)

  Dica: O script coloca tudo em MAIUSCULO automaticamente.
  Emojis sao suportados (ex: 🥇, 🏆).

  REGRA: SEMPRE perguntar o formato, mesmo que o usuario so mande o texto.
  Se o usuario nao informar o formato, pergunte antes de executar.
```

### Step 2: Opcoes Extras (Opcional)

**Action:** Perguntar opcoes extras apenas se relevante (pode pular se usuario quiser ir direto)

```yaml
elicit: false
skip_if: "usuario ja quer executar direto"
prompt: |
  Opcoes extras (todas opcionais — pule se nao precisar):
  - Grain customizado? (padrao: 100)
  - Sem grain? (imagem limpa)
  - Logo? (caminho do arquivo)
```

### Step 3: Executar Script

**Action:** Montar e executar o comando `create-post.mjs`

```yaml
execution:
  build_command: |
    Montar o comando baseado nos inputs coletados:

    # Comando base
    node squads/cdr-design/scripts/create-post.mjs "{texto}"

    # Adicionar flags conforme opcoes:
    #   formato == reels    → --reels
    #   grain != 100        → --grain {valor}
    #   sem_grain == true   → --no-grain
    #   sem_upscale == true → --no-upscale
    #   referencia          → --ref {caminho}
    #   logo                → --logo {caminho}
    #   output              → --output {caminho}

  run: |
    Executar o comando via Bash tool.
    O script lida com TUDO internamente:
    1. Chama Gemini API com referencia visual
    2. Aplica grain + vinheta (sharp)
    3. Upscale para dimensao final
    4. Salva PNG no output/

  CRITICAL: |
    NAO modifique o script.
    NAO tente replicar a logica do script manualmente.
    NAO gere prompts para o Gemini — o script ja tem o prompt otimizado internamente.
    APENAS execute o script como esta.
    A qualidade vem do script — respeite isso.
```

### Step 4: Verificar Resultado

**Action:** Confirmar que a imagem foi gerada com sucesso

```yaml
verification:
  check_output: |
    1. Verificar que o script terminou sem erro (exit code 0)
    2. Verificar que o arquivo PNG foi criado no path indicado
    3. Mostrar ao usuario:
       - Path completo do arquivo gerado
       - Formato (feed 1080x1350 ou reels 1080x1920)
       - Texto usado
    4. Perguntar se quer gerar outra variacao ou se esta satisfeito

  on_error: |
    Se o script falhar:
    - GEMINI_API_KEY missing → Orientar a configurar no .env
    - Referencia nao encontrada → Verificar path do style-ref
    - Gemini nao retornou imagem → Sugerir tentar novamente (API pode falhar)
    - sharp error → Verificar instalacao: npm ls sharp
```

### Step 5: Iteracao (Opcional)

**Action:** Oferecer opcoes de continuidade

```yaml
elicit: true
prompt: |
  Imagem gerada! O que quer fazer?

  1. Gerar outra imagem (novo texto)
  2. Gerar variacao (mesmo texto, opcoes diferentes)
  3. Gerar versao Reels do mesmo texto
  4. Pronto — finalizar
```

---

## Exemplos de Uso Rapido

```bash
# Feed post basico (4 linhas)
node squads/cdr-design/scripts/create-post.mjs "DADOS|FALAM.|FEELING|NAO."

# Reels cover
node squads/cdr-design/scripts/create-post.mjs "SUA LOJA|COM O|TEMA|CDR GROUP🥇" --reels

# Grain mais forte
node squads/cdr-design/scripts/create-post.mjs "RESULTADO|FALA.|GURU|NAO." --grain 120

# Sem grain (imagem limpa)
node squads/cdr-design/scripts/create-post.mjs "CONSTANCIA|E DADOS|GERAM|RESULTADO." --no-grain

# Com logo
node squads/cdr-design/scripts/create-post.mjs "VALIDADO|NO CAMPO." --logo path/to/logo.png

# Output customizado
node squads/cdr-design/scripts/create-post.mjs "TEXTO|AQUI" --output meu-post.png
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Imagem PNG | file | Post gerado em `squads/cdr-design/output/cdr-post-{slug}-{timestamp}.png` |
| Path do arquivo | string | Caminho completo da imagem salva |
| Comando executado | string | Comando exato que foi rodado (para reproducao) |

---

## Acceptance Criteria

- [ ] Script executado sem modificacoes
- [ ] Texto do usuario aparece corretamente (separado por linhas)
- [ ] Formato correto (feed 1080x1350 ou reels 1080x1920)
- [ ] Grain e vinheta aplicados (a menos que --no-grain)
- [ ] Arquivo PNG salvo no diretorio output
- [ ] Qualidade identica ao uso direto do script via terminal

---

## Quality Gate

```yaml
gate: QG-CAPA-CARROSSEL-CDR
name: "Capa Carrossel CDR Quality"
type: non-blocking
criteria:
  - script_executed_successfully: true
  - output_file_exists: true
  - format_matches_request: true
  - text_matches_input: true
note: |
  A qualidade visual e garantida pelo script create-post.mjs.
  Este gate verifica apenas a execucao correta, nao o design.
  O design ja foi aprovado pelo Ivan no proprio script.
```

---

## Troubleshooting

| Erro | Causa | Solucao |
|------|-------|---------|
| GEMINI_API_KEY nao encontrada | .env sem chave | Adicionar `GEMINI_API_KEY=...` no `.env` |
| Referencia nao encontrada | style-ref missing | Verificar `squads/cdr-design/data/style-ref/ivan-approved-style.png` |
| Gemini nao retornou imagem | API timeout/error | Tentar novamente — Gemini pode falhar esporadicamente |
| sharp error | Pacote nao instalado | `cd squads/cdr-design && npm install sharp` |
| Emoji nao renderizado | emoji-map.json incompleto | Adicionar emoji em `squads/cdr-design/assets/emojis/` |
| Imagem cortada/errada | Gemini gerou dimensao diferente | O upscale corrige automaticamente — se persistir, tentar novamente |

---

_Task: capa-carrossel-cdr v1.0.0_
_Wrapper: create-post.mjs (Gemini + grain + upscale)_
_CDR Design Squad_
