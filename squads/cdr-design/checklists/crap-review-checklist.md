# CRAP Review Checklist — CDR Design Squad

**Version:** 1.0.0
**Executor:** robin-williams (Tier 2 — Quality Checker)
**Aplicar em:** Toda peca visual antes da entrega

---

## Como Usar

1. Para cada peca visual criada, aplicar este checklist
2. Pontuar cada item de 1 a 10
3. Score minimo para aprovacao: 28/40
4. Se qualquer dimensao < 5: BLOQUEADO (independente do total)

---

## C — CONTRAST (Contraste)

| # | Check | Score (1-10) |
|---|-------|-------------|
| C1 | Headlines tem contraste FORTE de tamanho vs body text? (min 2x) | __ |
| C2 | CTA se destaca visualmente de TODOS os outros elementos? | __ |
| C3 | Hierarquia visual esta clara? (O que ler primeiro e obvio) | __ |
| C4 | Cores tem contraste suficiente para legibilidade? | __ |
| C5 | Nao existe "meio diferente"? (Se difere, difere MUITO) | __ |

**Subtotal Contrast:** __ /10

**Regra:** Se Contrast < 6 → BLOQUEADO (legibilidade comprometida)

---

## R — REPETITION (Repeticao)

| # | Check | Score (1-10) |
|---|-------|-------------|
| R1 | Paleta CDR respeitada? (Verde #A8D600 + Preto #0A0A0A) | __ |
| R2 | Tipografia consistente com padrao CDR? | __ |
| R3 | Estilo visual alinhado com o feed existente? | __ |
| R4 | Logo/branding CDR presente e consistente? | __ |
| R5 | Elementos visuais se repetem de forma intencional? | __ |

**Subtotal Repetition:** __ /10

**Regra:** Se Repetition < 6 → BLOQUEADO (fora da identidade CDR)

---

## A — ALIGNMENT (Alinhamento)

| # | Check | Score (1-10) |
|---|-------|-------------|
| A1 | Todos os elementos seguem um grid? | __ |
| A2 | Margens sao consistentes? (60px padrao CDR) | __ |
| A3 | Texto alinhado com intencao? (nao mix aleatorio) | __ |
| A4 | Elementos visuais se conectam por "linhas invisiveis"? | __ |
| A5 | Nada parece "jogado" aleatoriamente? | __ |

**Subtotal Alignment:** __ /10

---

## P — PROXIMITY (Proximidade)

| # | Check | Score (1-10) |
|---|-------|-------------|
| P1 | Elementos relacionados estao proximos? | __ |
| P2 | Elementos NAO-relacionados estao separados? | __ |
| P3 | Nao ha amontoamento visual? (white/dark space adequado) | __ |
| P4 | CTA tem espaco proprio? (isolado visualmente) | __ |
| P5 | Agrupamento logico? (blocos visuais claros) | __ |

**Subtotal Proximity:** __ /10

---

## Score Total

| Dimensao | Score | Status |
|----------|-------|--------|
| Contrast | __/10 | |
| Repetition | __/10 | |
| Alignment | __/10 | |
| Proximity | __/10 | |
| **TOTAL** | **__/40** | |

---

## Verdict

| Score | Veredicto | Acao |
|-------|-----------|------|
| >= 36 | EXCELENTE | Publicar imediatamente |
| 28-35 | BOM | Publicar, considerar ajustes menores |
| 20-27 | REGULAR | Ajustar antes de publicar |
| < 20 | REPROVADO | Redesign necessario |

---

## Blocking Rules

- [ ] Nenhuma dimensao < 5
- [ ] Contrast >= 6
- [ ] Repetition >= 6

Se qualquer blocking rule falha → BLOQUEADO independente do score total.

---

## Feedback Template

Para cada issue encontrado:

```
### Issue: {titulo}
- **O que:** {descricao do problema}
- **Por que:** {por que e um problema}
- **Correcao:** {exatamente como corrigir}
- **Dimensao afetada:** {C/R/A/P}
- **Impacto no score:** {pontos perdidos}
```
