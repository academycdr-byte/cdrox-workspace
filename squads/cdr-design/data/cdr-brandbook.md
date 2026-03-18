# CDR Group — Brandbook v2.0

> Identidade visual definitiva da CDR Group.
> Construido a partir de pesquisa de marca, analise competitiva e definicao de DNA visual com o fundador.

---

## 1. DNA da Marca

### Quem e a CDR

**Posicionamento:** Assessoria de performance para e-commerces. Trafego pago, CRO, automacoes, design.

**Personalidade:** Mix de profissional e acessivel. Serio quando precisa, humano sempre. Tipo Nubank — autoridade tecnica sem distancia. Nunca arrogante, nunca informal demais.

**Sentimento primario:** "Esses caras sao feras." — Admiracao tecnica. Eles entendem de dados, performance e resultados como ninguem.

**Referencia visual:** Nubank/Stripe — clean, digital-native, cor vibrante como assinatura, sem firula.

**Publico:** Mix de portes (PME a medio). Visual que impressiona o pequeno e gera confianca no medio.

### Principios Visuais

1. **Precisao** — Cada pixel tem proposito. Nada decorativo sem funcao.
2. **Dados sao design** — Numeros e metricas sao elementos visuais, nao so informacao.
3. **Verde e a assinatura** — #A8D600 e o equivalente ao roxo do Nubank. Voce ve e sabe que e CDR.
4. **O Frame e a marca** — O HUD Frame com corners verdes e o elemento assinatura. Aparece em tudo.
5. **Limpo, nao vazio** — Espaco negativo e intencional, mas o post nunca parece incompleto.

---

## 2. Elemento Assinatura — O HUD Frame

> Este e o DNA visual da CDR. O elemento que faz alguem ver e dizer "isso e da CDR".

### O que e

Um frame retangular sutil com **corners iluminados em verde** nos 4 cantos. Inspirado em interfaces de targeting/mira/dashboard de performance. Comunica: "estamos monitorando seus resultados".

### Especificacao Tecnica

```css
/* Frame principal */
.cdr-frame {
  position: absolute;
  inset: 24px;
  border: 1.5px solid rgba(168, 214, 0, 0.25);
}

/* Corner bracket — 4 cantos */
.cdr-corner {
  width: 28px; height: 28px;
  /* Duas linhas de 3px formando um L */
  /* Cor: #A8D600 */
  /* Glow: box-shadow 0 0 8px rgba(168,214,0,0.4) */
}
```

### Regras de Uso

| Regra | Detalhe |
|-------|---------|
| **Obrigatorio** | Presente em TODOS os posts do feed (variando intensidade) |
| **Posicao** | Sempre a 24px das bordas |
| **Opacidade do frame** | 15-30% (nunca dominante, sempre presente) |
| **Corners** | Sempre 100% opacidade com glow |
| **Variacao minima** | So corners sem frame (posts mais limpos) |
| **Variacao maxima** | Frame + corners + scan line (posts de dados/metricas) |

### Variacoes

1. **Full HUD** — Frame + corners + grid de fundo + scan line + Green Slash bold (posts de dados)
2. **Frame + Corners** — Frame sutil + corners com glow + Green Slash accent (padrao 70% dos posts)
3. **Corners Only** — Sem frame, so os 4 corners + Green Slash ghost (posts com foto/mockup)
4. **Corner Pair** — Apenas 2 corners opostos: top-left + bottom-right (minimalista)

### Upgrade v2.0: Terminal Dots

Cada corner agora inclui um **dot terminal** — um circulo de 8px com glow no vertice do bracket. Os dots garantem visibilidade em thumbnails pequenos (320px e menores), onde as linhas de 3px do bracket original ficam invisiveis.

---

## 2.5. Elemento Assinatura v2.0 — The Green Slash

> O ativo proprietario mais importante da CDR. Uma barra diagonal verde neon em 135 graus que aparece em TODAS as artes.

### O que e

Uma linha diagonal fina, verde neon, com gradiente fade-out e glow. Posicionada no canto superior-direito de cada post. E o elemento que faz qualquer arte ser instantaneamente reconhecida como CDR, mesmo sem ver o handle ou a foto do perfil.

### Diferencial Competitivo

- **@ogilvybrasil** usa faixa diagonal vermelha como PATTERN de fundo (largo, repetitivo)
- **CDR Slash** e um ELEMENTO discreto, fino, neon, com glow (tech aesthetic, nao branding classico)
- Nenhum concorrente direto no segmento assessoria/performance usa elemento neon diagonal

### 4 Variantes

| Variante | Width | Height | Glow | Uso |
|----------|-------|--------|------|-----|
| **slash-bold** | 8px | 180px | Forte (30px+80px) | Hook, CTA, stories, destaque |
| **slash-accent** | 6px | 140px | Medio (20px+60px) | Posts padrao, carrossel, feed |
| **slash-ghost** | 3px | 100px | Sutil (12px) | Minimal, foto overlay, carousel content |
| **slash-double** | 5px×2 | 140px | Medio | Premium, institucional, CTA slides |

### Posicao Padrao

- **Feed 1:1:** `top: 60px, right: 80px`
- **Stories 9:16:** `top: 100px, right: 60px` (adaptar para safe zone)
- **Carousel Cover:** `top: 60px, right: 80px`
- **Carousel Content:** `top: 60px, right: 80px` (ghost para nao competir com conteudo)
- **Reels Cover:** `top: 100px, right: 60px`

### Anti-Patterns do Slash

1. **NUNCA** horizontal — sempre 135 graus
2. **NUNCA** vermelho, azul ou outra cor — sempre verde CDR (#A8D600)
3. **NUNCA** com opacity acima de 100% — respeitar variantes definidas
4. **NUNCA** no centro do post — sempre canto superior-direito (exceto double em CTA)
5. **NUNCA** mais de 1 slash por post (exceto variante double que e 2 paralelas)

### Regra dos 5 Elementos

Todo post CDR DEVE ter pelo menos 3 dos 5 elementos de assinatura:

1. **Green Slash** (alguma variante)
2. **HUD Corners v2** (com terminal dots)
3. **Metric Typography** (JetBrains Mono + glow, se houver numeros)
4. **Footer Bar v2** (com mini-slash)
5. **Status Indicator** (pill com pulsing dot)

**Minimo obrigatorio em todo post:** Slash + Corners + Footer.

---

## 3. Logo e Marca

### Logo Principal
- Seta geometrica verde apontando 45° para cima-direita
- Representa: crescimento, performance, direcao
- **Arquivos:** `assets/cdr-logo-verde-neon.png` (dark bg) / `assets/cdr-logo-preta.png` (light bg)

### Regras de Uso
- Tamanho minimo: 40px de altura
- Espaco de respiro: 1x a altura do logo ao redor
- NUNCA distorcer, rotacionar ou mudar as cores
- Sobre fundo escuro: logo verde neon
- Sobre fundo claro: logo preto

### Posicionamento Padrao
- **Preferido:** Topo-esquerda dentro do frame, ao lado de "CDR Group"
- **Alternativa:** Centro-topo (para posts mais formais)
- **Tamanho padrao no post:** 48-52px

---

## 4. Sistema de Cores

### Paleta Core

| Token | Nome | Hex | Papel |
|-------|------|-----|-------|
| `--cdr-green` | Verde CDR | `#A8D600` | A COR da marca. CTAs, corners, destaques, glow |
| `--cdr-green-light` | Verde Claro | `#C2F000` | Hover, glow intenso |
| `--cdr-green-dark` | Verde Profundo | `#7BA300` | Sombras, bordas |
| `--cdr-black` | Preto CDR | `#06060A` | Fundo principal |
| `--cdr-surface` | Grafite | `#111114` | Cards, elevacoes |
| `--cdr-border` | Borda | `#1C1C20` | Divisorias, separadores |
| `--cdr-white` | Branco | `#FFFFFF` | Headlines, texto principal |
| `--cdr-gray` | Cinza | `#888888` | Texto secundario |
| `--cdr-dim` | Cinza Dim | `#555555` | Texto terciario, handles |

### Cor de Acento (uso pontual)

| Token | Nome | Hex | Quando |
|-------|------|-----|--------|
| `--accent-coral` | Coral | `#FF6B4A` | Alertas, urgencia |
| `--accent-gold` | Dourado | `#FFD700` | Premiacao, resultados recordes |
| `--accent-ice` | Azul Gelo | `#4ECDC4` | Analytics, tech |

### Regra de Cor

O verde CDR `#A8D600` deve estar presente em **todo post**, sempre. Seja nos corners, no highlight, no CTA, nos numeros — o verde e inegociavel. E a assinatura.

---

## 5. Tipografia

### Sistema de 3 Fontes

| Fonte | Familia | Pesos | Papel |
|-------|---------|-------|-------|
| **Editorial** | DM Serif Display | 400, Italic | Headlines de impacto, titulos de case |
| **Funcional** | Plus Jakarta Sans | 500-900 | Subtitulos, body, CTAs, labels |
| **Dados** | JetBrains Mono | 400-700 | Metricas, numeros, codigo, status |

### Hierarquia

```
HEADLINE (DM Serif Display, 60-88px, branco)
  Sub-headline (Plus Jakarta Sans Bold, 24-32px, verde ou branco)
    Body text (Plus Jakarta Sans Medium, 18-22px, cinza claro)
      Metrica (JetBrains Mono Bold, 36-56px, verde com glow)
        Label (JetBrains Mono, 10-12px, CAPS, 0.2em spacing, cinza)
          Status (JetBrains Mono, 11px, verde 50%, com dot pulsante)
```

### Regras

1. **Headlines:** DM Serif Display — elegante, editorial, premium
2. **Tudo funcional:** Plus Jakarta Sans — limpo, moderno
3. **Qualquer numero/metrica:** JetBrains Mono — tecnico, preciso, "terminal"
4. **Labels de metrica:** JetBrains Mono, 10-12px, CAPS, letter-spacing: 0.15-0.2em
5. **Nunca mais de 3 fontes** em um post

---

## 6. Layout System

### Grid Base
- Canvas: 1080x1080 (quadrado) ou 1080x1350 (4:5 vertical)
- Margem externa: 48px (area segura)
- Frame HUD: 24px das bordas (dentro da area segura)
- Grid interno: 12 colunas, gutters de 24px

### Hierarquia de Leitura (4 camadas)

1. **HOOK** (0-1s) — Headline ou numero gigante. Captura atencao.
2. **CONTEXTO** (1-3s) — Subtitulo explicando o hook.
3. **CONTEUDO** (3-10s) — Checklist, metricas, mockups, detalhes.
4. **ACAO** (10s+) — CTA, handle, direciona.

### Zonas do Post (1080x1080)

```
+--[CORNER]------------------------[CORNER]--+
|  Logo + Brand      [24px frame]      Status |  <- Topo (8%)
|                                              |
|  HEADLINE GIGANTE                            |  <- Hook (25%)
|  Subtitulo                                   |  <- Contexto (10%)
|                                              |
|  [Metricas / Mockups / Checklist]            |  <- Conteudo (40%)
|                                              |
|  CTA          handle                         |  <- Acao (10%)
|                                              |
+--[CORNER]------------------------[CORNER]--+
```

---

## 7. Componentes Visuais

### 7.1 Metricas (Data Cards)

Inspirado em dashboards de performance. Numeros sao protagonistas.

```
   12.4x          <- JetBrains Mono Bold, 36-56px, verde + glow
   ROAS           <- JetBrains Mono, 10px, CAPS, 0.2em, cinza 30%
   [========--]   <- Barra de progresso, 80px, verde sobre cinza
```

**Regras:**
- Numeros SEMPRE em JetBrains Mono
- Label SEMPRE em CAPS com letter-spacing largo
- Glow sutil no valor: `text-shadow: 0 0 20px rgba(168,214,0,0.2)`
- Barra de progresso opcional (3px altura, verde sobre cinza escuro)

### 7.2 Highlight Box

```css
.highlight {
  background: #A8D600;
  color: #06060A;
  padding: 2px 14px;
  font-weight: 800;
}
```

- Maximo 1-3 palavras por highlight
- Sintaxe JSON: `==texto==`
- Nunca usar em mais de 2 blocos por post

### 7.3 Tag/Badge

```css
.tag {
  background: #A8D600;
  color: #06060A;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 6px 16px;
}
```

- Uso: "CASE DE SUCESSO", "RESULTADO", "NOVO SERVICO"
- Posicao: topo-direita, dentro do frame

### 7.4 Status Indicator

```css
.status {
  font-family: 'JetBrains Mono';
  font-size: 11px;
  color: rgba(168,214,0,0.5);
  letter-spacing: 0.08em;
}
.status-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #A8D600;
  box-shadow: 0 0 8px rgba(168,214,0,0.6);
  /* Pulsa suavemente */
}
```

- Texto: "PERFORMANCE ONLINE", "LIVE DATA", "MONITORANDO"
- Posicao: topo-direita, ao lado do frame corner
- Reforca a mensagem "estamos sempre de olho nos dados"

### 7.5 CTA Button

```css
.cta {
  border: 2px solid #A8D600;
  color: #A8D600;
  font-weight: 800;
  font-size: 13px;
  padding: 14px 40px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  box-shadow: 0 0 20px rgba(168,214,0,0.1),
    inset 0 0 20px rgba(168,214,0,0.05);
}
```

**Variacoes:**
- **Outline** (padrao): Borda verde, texto verde, fundo transparente
- **Filled**: Fundo verde, texto preto — para CTAs primarios urgentes
- **Ghost**: Texto verde sem borda — para CTAs secundarios

### 7.6 Device Mockups (Premium)

**iPhone 15 Pro (Titanium):**
- Frame gradiente titanio (135deg: #8a8d91 → #c5c8cc → #87898d)
- Dynamic Island: 80x24px, preto, border-radius: 14px
- Sombra 3D: 6 camadas progressivas
- Screen glare: Gradiente diagonal 115deg

**MacBook Pro (Space Gray):**
- Frame: #2d2d2f, border-radius: 14px
- Cam Notch: 120x16px centralizado
- Base/Hinge: Gradiente vertical #3a3a3c → #222224
- Sombra 3D: 5 camadas progressivas

**Composicao:** Phone frente-esquerda (z:3), laptop atras-direita (z:1), overlap com glow.

### 7.7 Glass Panel (Glassmorphism)

- Background: `rgba(255,255,255,0.06)`
- Backdrop-filter: `blur(20px) saturate(180%)`
- Border: `1px solid rgba(255,255,255,0.10)`
- Border-radius: 20px
- Box-shadow: `0 8px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.10)`
- Uso: Paineis de checklist, cards de informacao

---

## 8. Templates

### Template 1: EDITORIAL
- Headline DM Serif ocupando 50%+ do slide
- Subtexto abaixo
- Highlight box em palavras-chave
- Frame + corners
- **Uso:** Hooks, educativo, provocacoes

### Template 2: COMPOSITE (Case/Resultado)
- Headline + devices + checklist em glass panel
- Metricas opcionais
- Logo no topo
- Frame + corners
- **Uso:** Cases de clientes, resultados com mockups

### Template 3: SPLIT
- Layout dividido (50/50 ou 60/40)
- Texto na esquerda, visual na direita
- Frame + corners
- **Uso:** Comparacoes, servicos, antes/depois

### Template 4: BOLD STATEMENT
- Frase gigante centralizada, DM Serif Italic
- Minimo de elementos
- Corners only
- **Uso:** Frases de autoridade, quotes

### Template 5: CHECKLIST
- Titulo + lista 4-6 itens com check icons
- Cards com borda esquerda verde
- Frame + corners
- **Uso:** Dicas, passos, servicos

### Template 6: DATA/METRICAS (Dashboard)
- Full HUD: frame + corners + grid + scan line
- 2-4 metricas gigantes em JetBrains Mono
- Barras de progresso
- Status indicator pulsante
- **Uso:** Resultados, KPIs, benchmarks

### Template 7: TICKER/BRAND
- Faixa "CDR GROUP" repetida no topo
- Conteudo principal
- Footer com handle
- Frame + corners
- **Uso:** Institucional, announcements

### Template 8: PHOTO OVERLAY
- Foto de fundo com overlay 70%
- Headline em branco
- Tag no topo
- Corners only
- **Uso:** Screenshots, eventos, bastidores

---

## 9. Variedade Obrigatoria

### Regras de Feed

| Regra | Detalhe |
|-------|---------|
| **Template** | Nunca repetir o mesmo template 2x consecutivas |
| **Background** | Nunca repetir o mesmo modo de background 3x seguidas |
| **Frame intensity** | Alternar entre full HUD, frame+corners, corners only |
| **Metricas** | Pelo menos 1 post com metricas a cada 5 posts |

### Modos de Background

| Modo | Hex | Frequencia |
|------|-----|------------|
| Dark (padrao) | `#06060A` | 45% |
| Deep green | `#0F2B1A` | 20% |
| Split (dark + verde) | 50/50 | 15% |
| Photo overlay | Imagem + 70% dark | 15% |
| Light (raro) | `#F5EDE3` | 5% |

---

## 10. Do's and Don'ts

### DO
- Frame HUD em todo post (variando intensidade)
- Metricas em JetBrains Mono, SEMPRE
- Verde #A8D600 presente em todo post
- Glow sutil nos elementos de destaque
- Dados como elemento de design
- Espaco negativo intencional

### DON'T
- Posts sem nenhum elemento CDR (frame, logo ou handle)
- Mais de 3 fontes num post
- Cores fora da paleta
- Texto menor que 18px (em 1080x1080)
- Mais de 2 elementos decorativos por post
- **JAMAIS travessoes na copy** — substituir por pontos ou virgulas
- **JAMAIS cores fora da paleta** sem aprovacao
- Copiar layout de concorrentes (Haus, Lever, etc.)
- Emojis no design visual (max 1-2 se inevitavel)

---

## 11. Formatos

| Formato | Dimensao | Ratio | Uso |
|---------|----------|-------|-----|
| Feed quadrado | 1080x1080 | 1:1 | Posts padrao, carrosseis |
| Feed vertical | 1080x1350 | 4:5 | Destaque (mais espaco) |
| Stories/Reels | 1080x1920 | 9:16 | Stories, covers |
| Highlight | 1080x1080 | 1:1 | Capas de destaques |

---

## 12. Checklist Pre-Publicacao

- [ ] Frame HUD presente (alguma variacao)?
- [ ] Verde #A8D600 visivel no post?
- [ ] Template diferente dos 2 anteriores?
- [ ] Hierarquia clara (hook → contexto → conteudo → acao)?
- [ ] Metricas em JetBrains Mono?
- [ ] Contraste suficiente para leitura?
- [ ] Logo OU handle presentes?
- [ ] Tipografia correta (Serif headlines, Jakarta body, Mono dados)?
- [ ] Dentro da paleta aprovada?
- [ ] Safe zones respeitadas (48px)?
- [ ] Sem travessoes na copy?

---

## 13. Resumo da Identidade

```
CDR Group = Precisao Tecnica Visual

Frame HUD + Corners Verdes = Assinatura (tipo roxo do Nubank)
JetBrains Mono = Metricas sempre em monospace
Verde #A8D600 = Presente em TUDO
DM Serif Display = Headlines premium
Preto #06060A = Base escura
Dados = Design, nao so informacao

"Voce ve o frame verde com os corners brilhando
 e ja sabe: isso e da CDR."
```

---

_Brandbook CDR Group v2.0 — Marco 2026_
_DNA definido com Ivan Furtado, CEO & Fundador_
_Criado por CDR Design Squad_
