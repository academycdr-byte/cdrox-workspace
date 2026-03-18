# Task: Criar Capas de Highlights

**Task ID:** create-highlight-covers
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Criar capas de destaque consistentes para o perfil do Instagram
**Executor Primario:** chris-do (Tier 1)
**Quality Gate:** robin-williams (Tier 2)
**Estimated Time:** 5-10 min

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `highlights` | list | Yes | Lista de highlights com nomes |
| `style` | enum | No | icone, texto, logo. Default: icone |

---

## Steps

### Step 1: Definir Estilo Visual

**Executor:** chris-do
**Action:** Design consistente para todas as capas

```yaml
highlight_cover_design:
  format: "1080x1920 (aparece circular no perfil)"
  background: "#0A0A0A ou #1A1A1A"

  styles:
    icone:
      icon_color: "#A8D600"
      icon_style: "Line icons, stroke 2-3px"
      icon_size: "Centro, 40% do espaco"
      label: "Abaixo do icone, branco, 24px"

    texto:
      text_color: "#FFFFFF"
      text_style: "Sans-serif Bold, 36-48px"
      accent: "Highlight em #A8D600"

    logo:
      variation: "Seta CDR em diferentes cores/tamanhos"
      background: "Variacao de tons escuros"

  cdr_highlights_sugeridos:
    - nome: "Servicos"
      icone: "Grafico de barras crescente"
    - nome: "Resultados"
      icone: "Trofeu ou seta pra cima"
    - nome: "Clientes"
      icone: "Pessoas ou handshake"
    - nome: "Equipe"
      icone: "Grupo de pessoas"
    - nome: "Educacao"
      icone: "Livro ou lampada"
    - nome: "Bastidores"
      icone: "Camera ou engrenagem"
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Cover Designs | list | Especificacoes de cada capa |
| CRAP Score | number | Score de qualidade |

---

## Acceptance Criteria

- [ ] Todas as capas seguem mesmo estilo
- [ ] Paleta CDR respeitada
- [ ] Funcionam em tamanho circular pequeno
- [ ] Consistentes com estetica do perfil
