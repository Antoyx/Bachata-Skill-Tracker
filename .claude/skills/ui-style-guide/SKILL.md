---
name: ui-style-guide
description: UI design system and style guide. Use when building components, pages, forms, dashboards, layouts, or any frontend UI. Covers colors, typography, buttons, inputs, spacing, and grid. Apply these rules whenever writing HTML, CSS, JSX, TSX, or styled-components.
---

# UI Style Guide

## Color Palette

| Token                   | Value                        | Usage                              |
|-------------------------|------------------------------|------------------------------------|
| `--color-dark`          | `#222222`                    | Backgrounds, primary text          |
| `--color-white`         | `#FFFFFF`                    | Card surfaces, page backgrounds    |
| `--color-indigo`        | `#4B4E6D`                    | Secondary buttons, accent panels   |
| `--color-mint`          | `#84DCC6`                    | Primary CTA, success, highlights   |
| `--color-grey`          | `#95A3B3`                    | Secondary text, borders, muted     |

### Semantic Tokens

| Token                      | Value                          |
|----------------------------|--------------------------------|
| `--color-primary`          | `#84DCC6`                      |
| `--color-primary-hover`    | `#6FD4B8`                      |
| `--color-primary-subtle`   | `rgba(132, 220, 198, 0.12)`   |
| `--color-surface`          | `#F8F9FA`                      |
| `--color-border`           | `rgba(149, 163, 179, 0.2)`    |
| `--color-border-subtle`    | `rgba(149, 163, 179, 0.1)`    |
| `--color-text`             | `#222222`                      |
| `--color-text-muted`       | `#95A3B3`                      |
| `--color-danger`           | `#E5534B`                      |
| `--color-warning`          | `#E5A93D`                      |
| `--color-success`          | `#84DCC6`                      |

## Typography

**Heading font:** Manrope (Google Fonts)
**Body font:** Karla (Google Fonts)

### Type Scale

| Level    | Size  | Weight | Font    | Line Height | Letter Spacing |
|----------|-------|--------|---------|-------------|----------------|
| Display  | 48px  | 700    | Manrope | 1.1         | -0.03em        |
| H1       | 32px  | 700    | Manrope | 1.15        | -0.02em        |
| H2       | 24px  | 600    | Manrope | 1.2         | -0.01em        |
| H3       | 20px  | 600    | Manrope | 1.25        | 0              |
| H4       | 16px  | 600    | Manrope | 1.3         | 0              |
| Body     | 16px  | 400    | Karla   | 1.6         | 0              |
| Body Sm  | 14px  | 400    | Karla   | 1.55        | 0              |
| Caption  | 12px  | 500    | Karla   | 1.4         | 0.04em         |
| Overline | 11px  | 500    | Karla   | 1.3         | 0.12em, uppercase |

### Rules
- NEVER use Inter, Roboto, Arial, or system-ui as fonts
- Import from Google Fonts: `family=Manrope:wght@400;500;600;700;800&family=Karla:wght@300;400;500`

## Buttons

**Style:** Solid fill
**Border radius:** 6px
**Font:** Manrope, weight 600
**Letter spacing:** 0.01em
**Transition:** `all 0.2s ease`

### Sizes

| Size   | Padding       | Font Size |
|--------|---------------|-----------|
| Small  | 8px 18px      | 12px      |
| Medium | 12px 28px     | 13px      |
| Large  | 16px 36px     | 15px      |

### Variants

| Variant   | Background              | Text Color                    | Border                               |
|-----------|-------------------------|-------------------------------|--------------------------------------|
| Primary   | `#84DCC6`               | `#222222`                     | none                                 |
| Secondary | `#4B4E6D`               | `#FFFFFF`                     | none                                 |
| Ghost     | transparent             | `#222222`                     | `1.5px solid rgba(149,163,179,0.25)` |
| Danger    | `#E5534B`               | `#FFFFFF`                     | none                                 |
| Text      | transparent             | `#84DCC6`                     | none                                 |
| Disabled  | `rgba(149,163,179,0.1)` | `rgba(149,163,179,0.5)`       | none                                 |

### States
- **Hover:** `translateY(-1px)` + `box-shadow: 0 8px 24px rgba(132,220,198,0.2)`
- **Active:** slightly darker shade (`#5BC9A8` for primary)
- **Focus:** `box-shadow: 0 0 0 3px rgba(132,220,198,0.3)`

## Inputs & Forms

**Style:** Bordered
**Border radius:** 6px
**Font:** Karla, weight 400, 14px
**Padding:** 12px 16px
**Label font:** Manrope, weight 600, 13px

### States

| State    | Border                               | Additional                                      |
|----------|--------------------------------------|-------------------------------------------------|
| Default  | `1.5px solid rgba(149,163,179,0.25)` |                                                 |
| Focus    | `1.5px solid #84DCC6`                | `box-shadow: 0 0 0 3px rgba(132,220,198,0.15)` |
| Error    | `1.5px solid #E5534B`                | `box-shadow: 0 0 0 3px rgba(229,83,75,0.1)`    |
| Disabled | `1px solid rgba(149,163,179,0.15)`   | `background: rgba(149,163,179,0.06)`, dimmed text |

### Controls
- **Checkbox (checked):** fill `#84DCC6`, border-radius 4px, white checkmark
- **Checkbox (unchecked):** `2px solid rgba(149,163,179,0.3)`, border-radius 4px
- **Toggle (on):** pill shape, fill `#84DCC6`, white knob right
- **Toggle (off):** pill shape, fill `rgba(149,163,179,0.25)`, white knob left
- **Error text:** Karla 12px, color `#E5534B`, 4px below input

## Spacing

**Base unit:** 8px
**Density:** Comfortable

### Scale

| Token     | Value |
|-----------|-------|
| `space-0` | 0px   |
| `space-1` | 4px   |
| `space-2` | 8px   |
| `space-3` | 16px  |
| `space-4` | 24px  |
| `space-5` | 32px  |
| `space-6` | 48px  |
| `space-7` | 64px  |
| `space-8` | 96px  |

### Common Usage
- Card padding: `space-4` (24px)
- Element gap within cards: `space-3` (16px)
- Section gap: `space-6` (48px)
- Form field gap: `space-3` (16px)
- Label to input gap: `space-1` (4px) to `space-2` (8px)

## Layout & Grid

**Grid type:** Fluid / auto-fit
**Max container width:** 1200px
**Side padding:** 24px
**Grid gap:** 16px

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
```

### Breakpoints

| Name    | Range         | Typical Columns |
|---------|---------------|-----------------|
| Mobile  | 0 – 639px     | 1               |
| Tablet  | 640 – 1023px  | 2               |
| Desktop | 1024 – 1439px | 3               |
| Wide    | 1440px+       | 3–4             |

## CSS Variables Template

```css
:root {
  /* Colors */
  --color-dark: #222222;
  --color-white: #FFFFFF;
  --color-indigo: #4B4E6D;
  --color-mint: #84DCC6;
  --color-grey: #95A3B3;
  --color-primary: #84DCC6;
  --color-primary-hover: #6FD4B8;
  --color-primary-subtle: rgba(132, 220, 198, 0.12);
  --color-surface: #F8F9FA;
  --color-border: rgba(149, 163, 179, 0.2);
  --color-border-subtle: rgba(149, 163, 179, 0.1);
  --color-text: #222222;
  --color-text-muted: #95A3B3;
  --color-danger: #E5534B;
  --color-warning: #E5A93D;
  --color-success: #84DCC6;

  /* Typography */
  --font-heading: 'Manrope', sans-serif;
  --font-body: 'Karla', sans-serif;

  /* Spacing */
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
  --space-7: 64px;
  --space-8: 96px;

  /* Components */
  --radius: 6px;
  --container-max: 1200px;
  --grid-gap: 16px;
}
```
