```markdown
# Design System Strategy: Engineering Excellence

## 1. Overview & Creative North Star

### The Creative North Star: "Precision Vitality"
This design system moves away from the static, utilitarian nature of traditional engineering sites. Instead, it adopts the persona of **Precision Vitality**. It blends the cold, calculated accuracy of high-end engineering with the warmth (Teplota) and life of the environments it creates. 

The system breaks the "template" look through:
- **Intentional Asymmetry:** Using unbalanced whitespace and off-grid element positioning to create a sense of forward motion.
- **Cinematic Depth:** Moving beyond flat cards to layered, "frosted" glass surfaces that react to the background imagery.
- **Editorial Typography:** Utilizing a high-contrast scale where display titles command the page like a premium architectural magazine, while technical data remains impeccably legible.

The goal is to communicate that heating and water systems are not just "pipes in walls," but the vital infrastructure of modern living.

---

## 2. Colors

The palette is rooted in the "Heat" of the brand's heritage but refined through deep, sophisticated neutrals and functional accents.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders for sectioning are strictly prohibited. The interface must feel seamless. Boundaries are defined solely through:
- **Background Color Shifts:** Using `surface-container-low` for secondary content blocks sitting on a `background` base.
- **Tonal Transitions:** Defining space through subtle value shifts rather than hard strokes.

### Surface Hierarchy & Nesting
Treat the UI as physical layers. Each container tier creates a "nested" depth:
- **Base Layer:** `surface` (#faf9f9)
- **Primary Content Blocks:** `surface-container-low` (#f5f3f3)
- **Interactive Cards:** `surface-container-lowest` (#ffffff) for maximum "lift."

### The "Glass & Gradient" Rule
To add soul to technical layouts:
- **Glassmorphism:** Floating navigation or overlay cards must use `surface` tokens at 70-80% opacity with a `backdrop-blur` (16px-24px).
- **Signature Textures:** Main CTAs should utilize a subtle linear gradient from `primary` (#b02f00) to `primary_container` (#ff5722) at a 135-degree angle. This prevents the "flat-button" look and suggests heat and energy.

---

## 3. Typography

The system utilizes **Plus Jakarta Sans** for high-impact brand expression and **Inter** for technical precision.

| Level | Token | Font Family | Size | Weight | Character |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Plus Jakarta Sans | 3.5rem | 700 | Authoritative, Editorial |
| **Headline** | `headline-md`| Plus Jakarta Sans | 1.75rem | 600 | Structured, Modern |
| **Title** | `title-lg` | Inter | 1.375rem | 600 | Clear, Confident |
| **Body** | `body-lg` | Inter | 1rem | 400 | Approachable, Detailed |
| **Label** | `label-md` | Inter | 0.75rem | 500 | Technical, Precise |

**Typography Intent:** Headlines in Plus Jakarta Sans provide a premium, modern feel, while Inter’s geometric clarity in body text reinforces the brand’s "trustworthy and technologically advanced" promise.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through **Tonal Layering**. Instead of standard shadows, place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural lift that feels integrated into the architecture of the page.

### Ambient Shadows
For floating elements (modals, dropdowns):
- **Blur:** 32px to 64px.
- **Opacity:** 4% - 8%.
- **Color:** Use a tinted version of `on-surface` (#1b1c1c). Never use pure black (#000000) for shadows; it kills the "vibrancy" of the background.

### The "Ghost Border" Fallback
If containment is required for accessibility, use a **Ghost Border**:
- **Token:** `outline-variant` (#e4beb4).
- **Opacity:** 15% Max.
- **Purpose:** To suggest a boundary without breaking the visual flow of the surface.

---

## 5. Components

### Buttons
- **Primary:** Gradient (`primary` to `primary-container`), `xl` (1.5rem) rounded corners. White text (`on-primary`).
- **Secondary:** Glassmorphic. `surface` at 20% opacity with a heavy backdrop blur.
- **Tertiary:** No background. Bold `primary` text with an underline that appears only on hover.

### Input Fields
- **Styling:** Forgo the 4-sided box. Use a `surface-container-high` background with a `sm` (0.25rem) corner radius.
- **State:** On focus, the background shifts to `surface-container-highest` with a 2px `primary` bottom-border accent.

### Cards & Lists
- **Rule:** **No Divider Lines.** Use vertical white space from the 24px/32px spacing scale or subtle background shifts to separate items.
- **Images:** Equipment and interiors should have `lg` (1rem) rounded corners and a subtle `surface-tint` overlay at 5% to ensure they feel part of the brand environment.

### Special Component: Engineering Specs Grid
For showcasing technical data (e.g., pipe diameter, heat output), use a grid of `surface-container-low` tiles with `headline-sm` numbers in `primary` color. This makes technical specifications feel like a premium feature rather than a boring list.

---

## 6. Do's and Don'ts

### Do
- **Use Dynamic Imagery:** Place high-quality engineering equipment photos behind semi-transparent `surface` layers.
- **Embrace White Space:** Let the "oxygen" in the layout communicate the premium nature of the service.
- **Layer Elements:** Overlap a high-quality image with a glassmorphic card containing text to create a three-dimensional, "constructed" feel.

### Don't
- **Don't Use 100% Opaque Borders:** This creates a "cheap" or "boxed-in" feeling.
- **Don't Use Default Shadows:** Avoid the heavy, muddy shadows common in basic CSS frameworks.
- **Don't Center Everything:** Engineering is about structure; use strong left-aligned grids with occasional asymmetrical "interruptions" to keep the user engaged.
- **Don't use Divider Lines:** Use the Spacing Scale (vertical white space) or tonal shifts to separate content. Lines clutter the "Precision" aesthetic.

---

### Russian Language Implementation Note
When styling Russian text (Cyrillic), pay extra attention to line-height (`leading`). Russian words are often longer than English equivalents; ensure `body-lg` has at least `1.6` line-height to maintain the "Editorial" readability.```