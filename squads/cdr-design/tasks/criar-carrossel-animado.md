# Task: Criar Carrossel Animado para Instagram

**Task ID:** criar-carrossel-animado
**Version:** 2.0.0
**Execution Type:** Hybrid (Agent + Bash)
**Purpose:** Criar carrossel de video animado com identidade CDR para Instagram
**Executor Primario:** cdr-design-chief (orquestrador)
**Copy Specialist:** eugene-schwartz (Tier 2 — copywriting)
**Quality Gate:** robin-williams (Tier 2 — CRAP review)
**Estimated Time:** 20-40 min

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `topic` | string | Yes | Tema do carrossel |
| `category` | enum | Yes | educativo, resultado, autoridade, oferta, tendencia |
| `slides_count` | number | No | Numero de slides (default: 8) |
| `slide_duration` | number | No | Duracao por slide em segundos (default: 15) |
| `profile` | enum | No | @ivanfurtado.cdr ou @cdrgroup.assessoria (default: @ivanfurtado.cdr) |
| `cta` | string | No | CTA do ultimo slide (default: "Siga para mais conteudo") |
| `stats` | object | No | Metricas do rodape (default: R$25M, 25+, 8.2x) |
| `reference` | string | No | URL de referencia visual |

---

## Preconditions

- [ ] Brand context CDR carregado (paleta, tipografia, logo 3D)
- [ ] Playwright instalado
- [ ] ffmpeg-static instalado (`node_modules/ffmpeg-static/ffmpeg.exe`)

---

## FASE 1: Copy (Aprovacao obrigatoria)

**Executor:** eugene-schwartz (via cdr-design-chief)
**Gate:** Ivan aprova copy de CADA slide antes de prosseguir

### Step 1.1: Elicitar Tema

**Action:** Perguntar ao usuario:
1. Qual o tema do carrossel?
2. Qual o objetivo? (educar, gerar autoridade, vender)
3. Quantos slides? (sugestao: 4 a 9 com capa + CTA)

### Step 1.2: Criar Estrutura de Slides com Graficos

**Action:** Eugene Schwartz cria a estrutura. Para CADA slide, definir:
- Copy (texto)
- Grafico/animacao sugerida (o que vai tornar o slide visual e interessante)

**Tipos de slide e graficos obrigatorios:**

| Tipo | Grafico/Animacao Obrigatoria |
|------|------------------------------|
| CAPA | Tag pill + titulo slide-up escalonado + cards glassmorphism com metricas |
| INDICE | Lista numerada com items deslizando da esquerda um a um |
| CONTEUDO | Numero grande pop-in + grafico contextual (funil, barras, gauge, checklist, timeline, comparativo) |
| CTA | Botao pulsante com rings de glow + metricas flutuantes |

**REGRA CRITICA:** Todo slide de CONTEUDO DEVE ter um grafico ou elemento visual animado alem do texto. Exemplos:
- Tema CRO → funil de conversao animado, barras de taxa
- Tema metricas → contadores animados, gauges, dashboards
- Tema erros → checklist com X aparecendo, alertas
- Tema resultados → graficos de barra crescendo, antes/depois
- Tema processo → timeline animada, steps conectados

**Regras de copy CDR:**
- Tom: autoridade tecnica + acessivel (NUNCA arrogante)
- Linguagem: portugues brasileiro, acentuacao correta obrigatoria
- Sem jargoes rebuscados, sem ingles desnecessario
- Dados reais sempre que possivel
- NUNCA usar travessoes na copy

### Step 1.3: Apresentar Copy para Aprovacao

**Action:** Mostrar a copy de CADA slide pro Ivan no formato:

```
SLIDE 1 (CAPA):
  Tag: [tag do tema]
  Titulo: [titulo principal]
  Subtitulo: [complemento]
  Visual: [descricao do grafico/animacao]

SLIDE 2 (CONTEUDO):
  Numero: 1
  Titulo: [titulo do topico]
  Descricao: [explicacao]
  Destaque: [dado ou insight]
  Visual: [descricao do grafico/animacao — ex: "funil de conversao animado"]

... (repetir para cada slide)

SLIDE FINAL (CTA):
  Texto: [chamada pra acao]
  Perfil: @ivanfurtado.cdr
  Visual: [botao pulsante + metricas flutuantes]
```

### Step 1.4: Aguardar Aprovacao

**GATE OBRIGATORIO:** Ivan deve aprovar a copy.
- Se aprovar → prosseguir para Fase 2
- Se pedir ajustes → voltar para Step 1.2 com feedback
- NUNCA gerar slides visuais sem copy aprovada

---

## FASE 2: Gerar Slides Visuais

**Executor:** cdr-design-chief
**Gate:** Todos os HTMLs renderizam corretamente

### Step 2.1: Gerar HTMLs

**Action:** Para cada slide aprovado, criar o HTML completo com:

**Elementos obrigatorios em TODOS os slides:**
- Logo CDR 3D via Three.js no canto superior direito (120x120) — OBRIGATORIO em TODOS os slides, nao apenas na capa. Usar o snippet Three.js padrao (ver secao "Logo 3D Three.js" abaixo). NUNCA usar SVG com CSS rotation como substituto.
- Grid pattern com dots verdes (sem animacao — visivel imediatamente)
- Background preto (#000) com glow verde radial (sem animacao — visivel imediatamente)
- Barra de progresso verde na base (animacao: preenche em {slide_duration}s)
- Header com label do tema + numero da pagina (X/N)
- `@ivanfurtado.cdr` no rodape esquerdo
- `CDR Group` no rodape direito
- Texto com animacoes slide-up escalonadas
- Grafico/elemento visual unico e animado

**REGRA ANTI-FLASH BRANCO:** Background (.bg-glow) e grid NUNCA devem ter `opacity: 0` ou animacao de fadeIn. Devem estar visiveis imediatamente quando a pagina carrega.

**Elementos obrigatorios na CAPA:**
- Tag pill com dot verde
- Cards de metricas com glassmorphism (blur 20px, saturate 180%)
- Valores em verde lima (#BEFF0A) bold italic, labels em branco uppercase centralizado

**Elementos obrigatorios no CTA (ultimo slide):**
- Botao pill verde pulsante com rings de glow infinitos
- Cards de metricas IDENTICOS aos da capa (mesmo CSS glassmorphism, mesmos valores, mesmos labels, mesmos pseudo-elements ::before e ::after)
- VETO se as metricas do CTA forem diferentes (tamanho, estilo, glassmorphism) das metricas da capa
- Posicao: bottom:100px com stats-bar flex horizontal, acima do bottom-row

**Catalogo de graficos animados por contexto:**

| Contexto | Grafico CSS | Animacao |
|----------|------------|----------|
| Conversao/CRO | Barras horizontais decrescentes (funil) | Cada barra cresce com delay escalonado |
| Pontos de atrito | Cards com icone X vermelho | Slides da esquerda, um a um |
| Resultado/impacto | Barra de progresso com % | Cresce ate o valor final |
| Metricas/dados | Contador numerico ou gauge | Numero sobe de 0 ao valor |
| Processo/etapas | Timeline vertical com dots | Dots acendem sequencialmente |
| Comparativo | Duas colunas antes/depois | Aparecem lado a lado |
| Checklist | Items com check verde | Checks aparecem um a um |
| CTA | Botao pill com rings pulsantes | Pulse infinito + glow |

### Step 2.2: Salvar HTMLs

**Action:** Salvar em `squads/cdr-design/output/animated-carousel-{slug}/`

```
output/animated-carousel-{slug}/
├── slide-01-capa.html
├── slide-02-conteudo-1.html
├── ...
├── slide-XX-cta.html
├── hdri.webp (copiar de templates/animated-carousel/)
└── carousel-config.json
```

---

## FASE 3: Preview Visual

**Executor:** Humano (Ivan)
**Gate:** Aprovacao visual dos slides

### Step 3.1: Servir e Mostrar

**Action:**
1. Iniciar http-server na pasta dos slides:
   ```bash
   cd squads/cdr-design/output/animated-carousel-{slug}
   npx -y http-server -p 3459 --cors -s &
   ```
2. Abrir cada slide no Playwright (viewport 1080x1080)
3. Esperar 4 segundos (animacoes)
4. Tirar screenshot e mostrar ao Ivan

### Step 3.2: Aguardar Aprovacao Visual

- Se aprovar → prosseguir para Fase 4
- Se pedir ajustes → corrigir HTML e repetir preview
- Ajustes comuns: tamanho de fonte, espacamento, cor, posicao, tipo de grafico

---

## FASE 4: Gravar e Converter

**Executor:** Bash inline (NAO usar render-carousel.mjs — tem bugs de path no Windows)
**Gate:** MP4 gerados, 0 frames brancos, duracao correta

### Step 4.1: Gravar WebM com Playwright

**Action:** Rodar inline via Node.js:

```bash
node -e "
import { chromium } from 'playwright';
import { resolve } from 'path';
import { mkdir } from 'fs/promises';

const DIR = 'squads/cdr-design/output/animated-carousel-{slug}';
const slides = ['slide-01-capa', 'slide-02-...', ...]; // lista dos slides
const VP = { width: 1080, height: 1080 };
await mkdir(resolve(DIR, 'videos'), { recursive: true });

for (const name of slides) {
  console.log('REC:', name);
  const b = await chromium.launch({ headless: true });
  const c = await b.newContext({ viewport: VP, recordVideo: { dir: resolve(DIR, 'videos'), size: VP } });
  const p = await c.newPage();

  // PAGINA PRETA PRIMEIRO — previne flash branco
  await p.setContent('<html><body style=\"background:#000;margin:0;width:1080px;height:1080px;\"></body></html>');
  await p.waitForTimeout(500);

  await p.goto('http://localhost:3459/' + name + '.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500); // fonts
  await p.waitForTimeout({slide_duration} * 1000);
  await p.close();
  await c.close();
  await b.close();
  console.log('  OK');
}
" --input-type=module
```

### Step 4.2: Renomear e Converter para MP4

**Action:** Os WebM saem com nomes hash. Renomear por ordem cronologica e converter:

```bash
FFMPEG="node_modules/ffmpeg-static/ffmpeg.exe"
DIR="squads/cdr-design/output/animated-carousel-{slug}/videos"
cd "$DIR"

# Renomear por ordem de criacao
files=($(ls -tr *.webm))
names=(slide-01-capa slide-02-... slide-XX-cta) # mesma ordem dos slides
for i in $(seq 0 $((${#names[@]}-1))); do
  mv "${files[$i]}" "${names[$i]}.webm" 2>/dev/null
done

# Converter cada WebM para MP4
for name in "${names[@]}"; do
  "$FFMPEG" -y -ss 3 -i "${name}.webm" \
    -t {slide_duration} \
    -c:v libx264 -preset slow -crf 18 \
    -pix_fmt yuv420p -r 30 \
    -vf "scale=1080:1080" -an \
    "${name}.mp4" 2>/dev/null
  rm -f "${name}.webm"
done
```

**Parametros ffmpeg:**
- `-ss 3` → corta os 3 primeiros segundos (carregamento)
- `-t {slide_duration}` → duracao exata do slide
- `-crf 18` → alta qualidade
- `-r 30` → 30fps
- `-an` → sem audio

### Step 4.3: Validar Output

**Checklist:**
- [ ] Todos os MP4 existem na pasta videos/
- [ ] Duracao de cada MP4 = {slide_duration}s (±1s)
- [ ] Nenhum frame branco no inicio (verificar primeiros 2 frames)
- [ ] Resolucao = 1080x1080
- [ ] Abrir pasta no Explorer pra Ivan conferir

---

## FASE 5: Entrega

**Executor:** cdr-design-chief

### Step 5.1: Abrir Pasta

```bash
start "" "C:\Users\User\academia-lendaria-aios\squads\cdr-design\output\animated-carousel-{slug}\videos"
```

### Step 5.2: Reportar

**Action:** Informar ao Ivan:
- Quantidade de MP4 gerados
- Duracao e tamanho de cada um
- Instrucoes: selecionar MP4 na ordem ao criar carrossel de video no Instagram

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Copy sem acentuacao correta | VETO — corrigir antes de gerar |
| Slide de conteudo SEM grafico/animacao visual | VETO — todo slide precisa de elemento visual animado |
| Frame branco no inicio do video | VETO — bg/grid devem ser imediatos (sem opacity animation) |
| Duracao fora do target (±1s) | VETO — ajustar -ss e -t no ffmpeg |
| Logo 3D nao aparece | VETO — Three.js obrigatorio em TODOS os slides. NUNCA usar SVG fallback |
| Cards sem glassmorphism | VETO — aplicar blur + saturate |
| Copy nao aprovada pelo Ivan | VETO — NUNCA gerar sem aprovacao |
| Travessoes na copy | VETO — regra anti-pattern CDR |
| Usar render-carousel.mjs | VETO — script tem bugs de path no Windows. Usar Bash inline |

---

## Identidade Visual CDR (Referencia)

### Cores
| Token | Valor | Uso |
|-------|-------|-----|
| Verde CDR | `#BEFF0A` | Destaques, numeros, glow, CTA |
| Background | `#000000` | Fundo de todos os slides |
| Card | `#111111` | Background de cards |
| Texto | `rgba(255,255,255,0.9)` | Texto principal |
| Muted | `rgba(255,255,255,0.5)` | Subtexto, labels |
| Borda verde | `rgba(190,255,10,0.25)` | Bordas de cards e elementos |
| Vermelho | `#FF4444` | Alertas, erros, X de atrito |

### Logo 3D Three.js (OBRIGATORIO em TODOS os slides)

**NUNCA usar SVG com CSS rotation.** A logo DEVE ser renderizada via Three.js com material metalico, HDRI e rotacao continua. Copiar o bloco abaixo em TODOS os HTMLs.

**HTML (container):**
```html
<div class="logo-3d-wrapper" id="logo3d" style="position:absolute;top:36px;right:36px;width:120px;height:120px;z-index:10;opacity:0;animation:fadeIn 0.8s ease-out 0.5s forwards;">
</div>
<!-- canvas fica 120x120 -->
<style>.logo-3d-wrapper canvas { width:120px !important; height:120px !important; }</style>
```

**JavaScript (antes de `</body>`):**
```html
<script type="importmap">
{ "imports": { "three": "https://esm.sh/three@0.170.0" } }
</script>
<script type="module">
import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
camera.position.z = 4;
scene.add(new THREE.AmbientLight('white', 1.5));
const d = new THREE.DirectionalLight('white', 2); d.position.set(5,5,5); scene.add(d);
const b = new THREE.DirectionalLight('#BEFF0A', 0.8); b.position.set(-3,-2,-5); scene.add(b);
const n = new THREE.PointLight('#BEFF0A', 3, 10); n.position.set(0,0,2); scene.add(n);
const r = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' });
r.setSize(120,120); r.setPixelRatio(2);
r.outputColorSpace = THREE.SRGBColorSpace;
r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.2;
document.getElementById('logo3d').appendChild(r.domElement);
new THREE.TextureLoader().load('hdri.webp', t => {
  t.mapping = THREE.EquirectangularReflectionMapping;
  const p = new THREE.PMREMGenerator(r);
  scene.environment = p.fromEquirectangular(t).texture;
  t.dispose(); p.dispose();
});
const S=1/260, tx=px=>(px-257)*S, ty=py=>(280-py)*S;
const lS = new THREE.Shape();
lS.moveTo(tx(12),ty(0));lS.lineTo(tx(502),ty(0));lS.quadraticCurveTo(tx(514),ty(0),tx(514),ty(12));
lS.lineTo(tx(514),ty(547));lS.quadraticCurveTo(tx(514),ty(559),tx(502),ty(559));
lS.lineTo(tx(347),ty(559));lS.quadraticCurveTo(tx(334),ty(559),tx(334),ty(547));
lS.lineTo(tx(334),ty(243));lS.quadraticCurveTo(tx(334),ty(225),tx(257),ty(225));
lS.lineTo(tx(12),ty(225));lS.quadraticCurveTo(tx(0),ty(225),tx(0),ty(213));
lS.lineTo(tx(0),ty(12));lS.quadraticCurveTo(tx(0),ty(0),tx(12),ty(0));lS.closePath();
const aS = new THREE.Shape();
aS.moveTo(tx(285),ty(255));aS.lineTo(tx(166),ty(549));aS.quadraticCurveTo(tx(166),ty(559),tx(155),ty(559));
aS.lineTo(tx(13),ty(559));aS.quadraticCurveTo(tx(0),ty(559),tx(0),ty(549));
aS.lineTo(tx(0),ty(404));aS.lineTo(tx(285),ty(255));aS.closePath();
const ext={depth:0.35,bevelEnabled:true,bevelThickness:0.04,bevelSize:0.04,bevelSegments:2};
const mat=new THREE.MeshStandardMaterial({color:0xBEFF0A,metalness:0.75,roughness:0.15,emissive:0x2a3500,emissiveIntensity:0.4,envMapIntensity:1.8});
const logo=new THREE.Group();
logo.add(new THREE.Mesh(new THREE.ExtrudeGeometry(lS,ext),mat));
logo.add(new THREE.Mesh(new THREE.ExtrudeGeometry(aS,ext),mat));
const box=new THREE.Box3().setFromObject(logo);
logo.position.sub(box.getCenter(new THREE.Vector3()));
const w=new THREE.Group(); w.add(logo); scene.add(w);
(function a(){requestAnimationFrame(a);w.rotation.y+=0.012;w.rotation.x=Math.sin(Date.now()*0.001)*0.15;r.render(scene,camera);})();
</script>
```

**Geometria:** Extraida de cdrgroup.com.br (webhub-clone)
**Material:** MeshStandardMaterial (metalness 0.75, roughness 0.15, emissive verde)
**Iluminacao:** Ambient branca + direcional branca + direcional verde traseira + point light neon verde
**HDRI:** `hdri.webp` (copiar de `templates/animated-carousel/` para cada output)
**Rotacao:** Y continua (0.012 rad/frame) + X oscilante (sin)

### Glassmorphism (Cards de metricas)
```css
.stat-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(190, 255, 10, 0.25);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
}
```

### Assets
- `templates/animated-carousel/shared-styles.css` — CSS completo
- `templates/animated-carousel/three-logo.js` — Three.js module (referencia, mas usar snippet inline nos HTMLs)
- `templates/animated-carousel/hdri.webp` — HDRI para reflexos

---

## Specs Tecnicas

| Parametro | Valor |
|-----------|-------|
| Resolucao | 1080x1080 |
| Codec | H.264 (libx264) |
| CRF | 18 (alta qualidade) |
| FPS | 30 |
| Audio | Nenhum |
| Duracao default | 15s por slide |
| Formato final | MP4 |
| Verde CDR | #BEFF0A |
| Background | #000000 (sem animacao) |
