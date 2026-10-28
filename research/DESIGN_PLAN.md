# 407 Cafe — Two-Pass `/frontend-design` Plan

## Pass 1: Initial Token System, Typography, Layout & Principles

### 1. Color Palette (5 Named Hex Values)
Grounded directly in 407 Cafe's black-and-white oval Art Deco emblem (`Gelato • Crepes • Paninis / 407 / Cafe`) and their signature menu items (Nutella, Espresso Crema, Pistachio Dubai Chocolate, Steamed Milk):
- **Espresso Ink (`#14110F`)**: Deep roasted coffee bean black-brown for structural dividers, the left counter rail, and primary typography.
- **Steamed Milk (`#FAF6F0`)**: Warm parchment cream for the main menu ledger background.
- **Toasted Crepe (`#EFE7DA`)**: Secondary warm surface for interactive ledger rows, category headers, and receipt tickets.
- **Roasted Hazelnut (`#A85828`)**: Warm caramel-espresso accent for price numerals, active category indicators, and primary CTAs.
- **Pistachio Crema (`#4A6B46`)**: Accents for `#1 Best seller` callouts, ratings badges, and live open status.

### 2. Typography
- **Display & Dish Titles**: `'Cormorant Garamond', Georgia, serif` (600/700 weights, plus italic accents for category subtitles) — evokes a classic European creperie & gelateria menu board while harmonizing with the inline Art Deco curves of the `407` emblem.
- **UI & Ingredient Copy**: `'Plus Jakarta Sans', -apple-system, sans-serif` (400/500/600) — high-legibility humanist sans for short ingredient lists (`Nutella + Pistachio Butter + Shredded Fillo`) and navigation.
- **Tabular Prices**: `font-variant-numeric: tabular-nums` so prices (`$17.29`, `$18.19`, `$7.15`) align cleanly down every ledger column.

### 3. Layout Concept & Wireframes ("The Triptych & Counter Ledger")
Instead of a standard business template (top sticky white bar + centered hero paragraph + 3-column SaaS card grid), the site is structured as a tactile **European Café Triptych & Counter Ledger**:

```
DESKTOP VIEWPORT 1 (100dvh — Triple-Split Macro Menu Stage):
+-----------------------------------------------------------------------+
| [407 Logo] 407 Cafe · Lake Nona   Gelato • Crepes • Paninis  [Order]  |
+-----------------------+-----------------------+-----------------------+
|                       |                       |                       |
|    PANEL 1 (MACRO)    |    PANEL 2 (MACRO)    |    PANEL 3 (MACRO)    |
|    Petit Chocolate    |      Iced Latte       |      Cappuccino       |
|   Ganache & Coconut   |   Ice & Espresso      |   Hot Steam & Cinnamon|
|                       |   Splash Out          |                       |
|  [Petit Chocolate]    |  [Iced Latte]         |  [Cappuccino]         |
|  [$4.75 -> Desserts]  |  [$6.54 -> Iced]      |  [$7.15 -> Hot]       |
+-----------------------+-----------------------+-----------------------+

MOBILE VIEWPORT 1 (100dvh — Single-Photo 2-Second Crossfade Loop):
+-----------------------------------+
| [407 Logo]  407 Cafe    [Order]   |
|     Gelato • Crepes • Paninis     |
+-----------------------------------+
|                                   |
|     FULL-BLEED MACRO PHOTO        |
|   (Fades 1 -> 2 -> 3 every 2.0s   |
|        in a continuous loop)      |
|                                   |
|  (•) Petit Chocolate — $4.75      |
|  [ o  •  o ]     [Menu ↓]         |
+-----------------------------------+

BELOW THE FOLD (Asymmetric Left Counter Rail + Right Compact Menu Ledger):
+----------------------+------------------------------------------------+
| STICKY CAFE TICKET   | HORIZONTAL "MOST ORDERED" OVAL TASTING STRIP   |
| (Notched Receipt)    | (Compact 76px oval dish portraits + prices)    |
|                      +------------------------------------------------+
| [Redrawn 407 Emblem] | CATEGORY LEDGER (All 16 Categories, 201 Items) |
| 9161 Narcoossee Rd   | +----------------------+---------------------+ |
| Suite 108, Orlando   | | [76x76] Item Name $P | [76x76] Item Name $P| |
| (407) 658-6733       | | Exact ingredients    | Exact ingredients   | |
| info@407cafe.com     | +----------------------+---------------------+ |
| Mon-Thu 8:30a-8:30p  | | Typographic Item .... $P | Item Name ... $P| |
| Fri-Sun 8:30a-9:30p  | +----------------------+---------------------+ |
| [Order Online CTA]   +------------------------------------------------+
| [Search Menu...]     | GUEST NOTES & REAL CAFE PHOTO FILMSTRIP        |
| - Most Ordered (12)  | (Compact 130px height strip + real reviews)    |
| - Sweet Crepes (25)  +------------------------------------------------+
| - Savory Crepes (22) | STOREFRONT & CONTACT LEDGER (Lake Nona + Map)  |
| - Paninis (22) ...   +------------------------------------------------+
+----------------------+------------------------------------------------+
```

---

## Pass 2: Review & Self-Critique Against the Brief

1. **Check against AI design clichés (`/frontend-design` calibration)**:
   - *Did we use tracked-out ALL-CAPS eyebrows above every heading or `→` arrows on buttons?* Removed any `→` arrows and decorative eyebrow labels. Section headers use the exact category names from DoorDash (`Sweet Crepes`, `Savory Crepes`, `Paninis (Sandwich) or Flatbreads`, `Belgian Waffles`, etc.) with an item count badge.
   - *Did we use identical rounded SaaS cards (`border-radius: 12px` everywhere)?* Replaced uniform cards with **distinct functional shapes**:
     - **Sharp structural vertical panels** (`0px` radius, `2px` espresso dividers) for the 3-split Hero Triptych.
     - **Circular/Oval portraits** (echoing the oval 407 Cafe logo) for the horizontal *Most Ordered* tasting strip.
     - **Compact horizontal ledger rows** (`72px × 72px` thumbnails on mobile, `84px × 84px` on desktop) for the 201-item menu so no photo below the hero ever hogs the screen or forces vertical scrolling past a giant card.
     - **Scalloped/notched café receipt ticket** for the left store info & hours rail.
2. **Check against strict user rules**:
   - *Very little text / zero AI slop*: Only exact product names, exact ingredient descriptions from DoorDash/MunchEm, exact prices, real Google Maps reviews, and real contact/hours details. Zero filler paragraphs.
   - *Mobile 2-second crossfade loop on hero*: Implemented with a clean `2000ms` timer cycling `activeSlide` (`0 -> 1 -> 2 -> 0`) with smooth CSS `opacity` transition (`600ms ease-in-out`), plus respect for user interaction.
   - *No giant images below the fold*: Enforced strict max heights (`72px–88px` for menu item thumbnails, `120px–150px` for gallery filmstrip thumbnails) with a click-to-zoom modal if the user chooses to inspect a photo.
