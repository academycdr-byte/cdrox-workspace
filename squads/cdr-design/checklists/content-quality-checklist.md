# Content Quality Checklist — CDR Design Squad

**Version:** 1.1.0
**Aplicar em:** Todo conteudo antes da publicacao

---

## Severity Legend

| Icone | Nivel | Significado |
|-------|-------|-------------|
| **CRITICAL** | Bloqueia publicacao | Corrigir ANTES de publicar |
| **HIGH** | Recomendado corrigir | Pode publicar se justificado |
| **MEDIUM** | Melhoria desejavel | Nao bloqueia |

---

## 1. Brand Compliance (CRITICAL)

- [ ] Paleta de cores CDR respeitada (#A8D600, #0A0A0A, #FFFFFF)
  - ✗ FAILED? → Consultar `data/cdr-brandbook.md` secao Paleta. Trocar cores no design para hex exatos. Nao usar aproximacoes.
- [ ] Tipografia padrao CDR utilizada (Inter Bold/Regular, JetBrains Mono para dados)
  - ✗ FAILED? → Substituir fonte por Inter. Se nao disponivel, usar sans-serif geometrica bold. NUNCA serif.
- [ ] Logo CDR presente e no tamanho correto (min 40px, clear space = 1x altura do logo)
  - ✗ FAILED? → Inserir logo no canto inferior direito ou superior esquerdo. Verificar clear space.
- [ ] Tom de voz consistente (direto, data-driven, profissional)
  - ✗ FAILED? → Revisar copy com `agents/eugene-schwartz.md` — tom deve ser autoridade tecnica, nao casual/informal.
- [ ] Estilo visual dark theme mantido
  - ✗ FAILED? → Background DEVE ser #0A0A0A ou #111111. Backgrounds claros sao proibidos.

**Severity:** CRITICAL — Se qualquer item falhar, NAO publicar.

---

## 2. Copy Quality — Schwartz + Miller (HIGH)

- [ ] Headline e thumb-stopping (max 8 palavras)
  - ✗ FAILED? → Reescrever usando tecnica de Pattern Interrupt (Schwartz). Encurtar para 6-8 palavras. Testar: "Alguem pararia de scrollar pra ler isso?"
- [ ] Nivel de consciencia correto aplicado (Schwartz 5 Levels)
  - ✗ FAILED? → Mapear publico: Unaware→Problem Aware→Solution Aware→Product Aware→Most Aware. Ajustar linguagem ao nivel.
- [ ] Cliente e o heroi (nao a CDR) — SB7
  - ✗ FAILED? → Reescrever substituindo "nos" por "voce". CDR e o guia, cliente e o heroi. Consultar `agents/donald-miller.md` BrandScript.
- [ ] Problema nomeado (externo + interno)
  - ✗ FAILED? → Adicionar problema externo (o que acontece) + interno (como se sente). Ex: "Faturamento caiu" (externo) + "Voce sente que ta perdendo controle" (interno).
- [ ] CTA especifico e acionavel
  - ✗ FAILED? → Trocar CTAs genericos ("saiba mais") por especificos ("Baixe o checklist de CRO agora"). Acao + objeto + urgencia.
- [ ] Caption tem hook forte (primeira linha)
  - ✗ FAILED? → Primeira frase deve ser pergunta provocativa, dado chocante ou afirmacao contraintuitiva. Max 15 palavras.
- [ ] Hashtags relevantes (8-12)
  - ✗ FAILED? → Usar mix: 3 nicho (#ecommercebrasil), 3 mid (#marketingdigital), 3 broad (#empreendedorismo), 2-3 brand (#cdrgroup).

**Severity:** HIGH — Corrigir copy antes de publicar. Se urgente, pode publicar headline + CTA fracos mas REGISTRAR para revisao.

---

## 3. Visual Quality — CRAP (CRITICAL)

- [ ] CRAP Score >= 28/40
  - ✗ FAILED? → Executar `checklists/crap-review-checklist.md` completo. Identificar qual dimensao esta abaixo de 7 (Contrast, Repetition, Alignment, Proximity). Corrigir dimensao mais fraca primeiro.
- [ ] Hierarquia visual clara (headline > subheadline > body > caption)
  - ✗ FAILED? → Aumentar contraste de tamanho: headline min 2x o tamanho do body. Usar bold vs regular.
- [ ] Grid respeitado (elementos alinhados em eixos consistentes)
  - ✗ FAILED? → Ativar grid overlay, alinhar elementos aos eixos. Consultar `agents/ellen-lupton.md` Grid System.
- [ ] Espacamento adequado (breathing room entre elementos)
  - ✗ FAILED? → Adicionar padding min 40px nas bordas, 20px entre blocos de texto. Regra: na duvida, mais espaco.
- [ ] Nenhum elemento desalinhado
  - ✗ FAILED? → Verificar alinhamento horizontal e vertical de CADA elemento. Texto centralizado ou left-aligned, nunca misturar.

**Severity:** CRITICAL — Score CRAP < 28 bloqueia publicacao.

---

## 4. Content Strategy — Jasmine Star + GaryVee (HIGH)

- [ ] Post se encaixa em uma das 9 categorias definidas (Educativo, Resultado, Bastidores, Depoimento, Engajamento, Autoridade, Cultura, Oferta, Tendencia)
  - ✗ FAILED? → Classificar o post em 1 categoria. Se nao encaixa em nenhuma, provavelmente o conteudo esta vago demais.
- [ ] Proporcao JJJRH respeitada na semana (min 70% jabs / max 30% right hooks)
  - ✗ FAILED? → Contar posts da semana: se right hooks > 30%, substituir 1 right hook por jab educativo ou engajamento.
- [ ] Regra 98/2 respeitada (max 2% do conteudo e venda direta)
  - ✗ FAILED? → Se postagem e venda pura, adicionar valor educativo antes do pitch. Ou trocar por jab.
- [ ] Formato nativo da plataforma (platform-native)
  - ✗ FAILED? → Feed: 1080x1080 ou 1080x1350. Stories: 1080x1920. Reels: vertical 9:16. Nao reciclar formato de outra plataforma.

**Severity:** HIGH — Nao publicar post fora de categoria. JJJRH pode flexibilizar em semanas de lancamento.

---

## 5. Formato Tecnico (CRITICAL)

- [ ] Dimensoes corretas (1080x1080 feed, 1080x1350 portrait, 1080x1920 stories/reels)
  - ✗ FAILED? → Redimensionar para spec correta. NUNCA publicar com dimensao errada — Instagram corta/distorce.
- [ ] Safe zones respeitadas (stories: topo 150px livre, base 200px livre para CTA do IG)
  - ✗ FAILED? → Mover texto e elementos criticos para dentro da safe zone. Nada importante nos 150px superiores ou 200px inferiores.
- [ ] Texto legivel em mobile (corpo min 16px, headline min 32px em 1080px)
  - ✗ FAILED? → Aumentar tamanho da fonte. Testar: abrir no celular, segurar a 40cm — se nao le sem zoom, ta pequeno.
- [ ] Contraste suficiente para acessibilidade (ratio min 4.5:1 para texto)
  - ✗ FAILED? → Verificar com ferramenta de contraste (webaim.org/resources/contrastchecker). Aumentar opacidade do background ou mudar cor do texto.

**Severity:** CRITICAL — Formato tecnico errado = post com problemas visiveis.

---

## Score Rapido

| Categoria | Severity | OK? |
|-----------|----------|-----|
| 1. Brand Compliance | CRITICAL | [ ] |
| 2. Copy Quality | HIGH | [ ] |
| 3. Visual Quality (CRAP) | CRITICAL | [ ] |
| 4. Content Strategy | HIGH | [ ] |
| 5. Formato Tecnico | CRITICAL | [ ] |

**Resultado:** __ /5 categorias OK

---

## Remediation Flowchart

```
5/5 → PUBLICAR ✅

4/5 → Verificar qual falhou:
  → Se CRITICAL (Brand/CRAP/Formato): HALT — corrigir antes de publicar
  → Se HIGH (Copy/Strategy): Publicar com nota, agendar revisao

3/5 → AJUSTAR — Identificar falhas e rotear:
  → Brand/Visual failures → Robin Williams (*review CRAP)
  → Copy failures → Eugene Schwartz (*copy-review)
  → Strategy failures → Jasmine Star (*planejar-semana)
  → Formato failures → Ajuste tecnico (resize/reposition)

< 3/5 → REFAZER — Retornar ao criador com feedback especifico:
  → Listar CADA item que falhou + correcao sugerida
  → Definir qual agent deve revisar
  → Marcar como "Rework Required" no calendario
```
