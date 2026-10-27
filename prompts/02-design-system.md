# 02 — Design system

Status: done

## Goal

Turn the Roam design board (sections 01–15: brand, palette, type, buttons, inputs, chips, listing card, policy card, profile row, glass tab bar, icons, segmented control, toggle/stepper, alerts, tags) into one design system: tokens in `src/global.css`, plus shared components in `src/components/ui/` that every screen uses. Screens should never need raw colors, sizes or radii.

## Decisions

- **Storage (expo-design-system skill, Tailwind branch):** NativeWind is already the declared system, so all tokens live in `src/global.css` as `@theme` CSS variables and are used as classNames. There is no `src/theme/` folder and no second source of truth.
- **Closed palette:** reset Tailwind's default colors (`--color-*: initial`), radius scale (`--radius-*: initial`) and text scale (`--text-*: initial`). Only Roam tokens (plus `white`, `black`, `transparent`) exist, so `bg-blue-500` stops compiling to a color and drift is easy to spot.
- **Units:** set `:root { font-size: 16px }` so `rem` is 16 on native as well as web (NativeWind defaults to 14 on native), and `--spacing: 4px`, so `p-4` = 16 on every platform. Spacing uses Tailwind's numeric 4-pt scale (`gap-2` = 8, `p-5` = 20), which is NativeWind's own idiom.
- **Font:** Plus Jakarta Sans (OFL), with static Regular, Medium, SemiBold, Bold and ExtraBold `.ttf` files in `assets/fonts/`. Each file is named after its PostScript name (`PlusJakartaSans-Bold.ttf`) because iOS looks fonts up by PostScript name. Fonts load through the `expo-font` config plugin in `app.json`, which is already installed, so there's no runtime loading state. The files are copied out of the `@expo-google-fonts/plus-jakarta-sans` tarball (`npm pack`), and that package is **not** added as a dependency. Weights are set with `fontFamily` (`font-bold` → `PlusJakartaSans-Bold`), not `fontWeight`.
- **Icons:** Lucide (`lucide-react-native` + `react-native-svg` via `npx expo install`). One `Icon` wrapper maps `className` text colors to the icon's `color` prop through NativeWind `styled` (`nativeStyleMapping: { color: true }`). Lucide has no filled set, so the active Home tab and the star use `fill="currentColor"` on the outline glyph.
- **Scope:** every component on the board (list under Steps).
- **Dark mode:** light only. Set `"userInterfaceStyle": "light"` in `app.json`, and keep token names semantic (`surface`, `text-primary`), not literal, so a dark palette can be added later in one place.
- **Defaults I picked:**
  - Components go in `src/components/ui/`, one file each, using kebab-case file names to match the template.
  - Variants are className maps, with a small `cn()` join helper in `src/lib/cn.ts`. No `cva`/`tailwind-merge` dependency. NativeWind resolves conflicts by CSS source order, not className order, so callers override layout only (margin, flex, width), as the skill says.
  - Pressed feedback uses `active:` classes. Selected chips and tabs use `aria-selected` + `aria-selected:` classes (RC0 ignores `accessibilityState.selected` for styling).
  - Toggle is React Native's `Switch`, with track and thumb colors mapped from classNames through `styled` (`nativeStyleMapping` dot paths `trackColor.true` / `thumbColor`). If that mapping fails on device, stop and report rather than hand-building a switch.
  - The glass tab bar uses `GlassView` from `expo-glass-effect` (already installed) when `isLiquidGlassAvailable()`, and otherwise the `bg-glass` token with a hairline border. It's a presentational component (`items`, `activeKey`, `onSelect`). Hooking it up to real tab routes is left for the navigation feature.
  - Preview: `src/app/design-system.tsx` renders every token and component in the board's order (deep link `roamapp://design-system`). `index.tsx` drops the NativeWind smoke test and links to it until real screens exist.

## Design

All measurements are estimated from the board image (it has no spec values beyond the palette and type notes).

### Tokens: colors (`@theme --color-*`)

Given on the board:

| Token | Value | Use |
|---|---|---|
| `primary` | `#FFC629` | primary buttons, active states, toggle, active tab, stars |
| `lavender` | `#C9B4FF` | secondary actions, selected filter chip, highlights |
| `text-primary` | `#0B0B1A` | headings, primary text, segmented selected bg |
| `text-secondary` | `#6B7280` | body text, secondary text, placeholders |
| `surface` | `#FFFFFF` | cards, sheets, modals |
| `surface-muted` | `#F4F5F7` | app background, input fields, icon buttons |
| `border` | `#E5E7EB` | dividers, borders |
| `glass` | `rgba(255,255,255,0.7)` | tab bar, glass surfaces |

**Proposed new tokens** (not in the palette, but the board uses them; values estimated):

| Token | Value | Seen in |
|---|---|---|
| `lavender-soft` | `#F1ECFF` | focused input bg, policy card bg |
| `lavender-strong` | `#7C5CFA` | focused input border, policy icon glyphs |
| `success` / `success-soft` | `#1E9E5A` / `#E7F5EC` | success alert, "New" tag |
| `danger` / `danger-soft` | `#E5484D` / `#FDECEC` | error alert, "20% off" tag |
| `info` / `info-soft` | `#3B5BDB` / `#E8EEFE` | "Superhost" tag |
| `primary-soft` | `#FFF5D6` | "Guest favorite" tag |

The `text-` prefix collides with Tailwind's `text-*` utility (`text-text-primary`), so color tokens are named `ink` (`#0B0B1A`) and `ink-muted` (`#6B7280`). The classes are `text-ink`, `text-ink-muted`, `bg-ink`. Every other name stays as in the tables.

### Tokens: typography

Fonts: `--font-sans` (Regular, so it's the default), `--font-medium`, `--font-semibold`, `--font-bold`, `--font-extrabold`. Type ramp as `@utility` classes (family + size + line height):

| Utility | Font | Size / line height | Board |
|---|---|---|---|
| `type-display` | Bold | 56 / 56 (1.0) | Display 56–64 |
| `type-heading` | Bold | 28 / 34 (1.2) | Heading 28–32 |
| `type-title` | Bold | 18 / 22 | listing card title |
| `type-body` | Regular | 16 / 24 (1.5) | Body 16 |
| `type-label` | Medium | 15 / 20 | chips, inputs, rows |
| `type-caption` | Medium | 14 / 20 | Caption 14 |
| `type-small` | Regular | 12 / 16 | policy descriptions, tab labels |
| `type-button` | SemiBold | 17 / 22 | Button 17–18 |

`type-label`, `type-title` and `type-small` are proposed new steps (the board uses them but doesn't name them).

### Tokens: radius (`--radius-*`)

`sm` 8 · `md` 12 · `lg` 16 (inputs, listing photo, policy card) · `xl` 20 (cards, alerts) · `2xl` 24 (board panels, sheets) · `full` (buttons, chips, tags, icon buttons, segmented control, stepper).

### Tokens: shadows (`@utility`)

`shadow-card` `0 1px 2px rgba(11,11,26,0.05)` · `shadow-raised` `0 6px 16px rgba(11,11,26,0.08)` (tab bar, listing card) · `shadow-glow` `0 4px 12px rgba(255,198,41,0.45)` (active tab circle). React Native `boxShadow` strings, per the skill.

### Components (`src/components/ui/`)

| Component | Variants / states | From board |
|---|---|---|
| `Text` | `variant` = ramp step, `tone` = ink / muted / … | 03 |
| `Icon` | Lucide glyph, `className` color, size 16/20/24 | 11 |
| `Button` | `primary` (yellow, ink text, optional trailing arrow) · `secondary` (white, border, optional leading image); `md` 48 / `lg` 56 height; pressed, disabled, loading | 04 |
| `IconButton` | circular 56, `surface-muted` bg, 24 icon; pressed, required `accessibilityLabel` | 04 |
| `TextField` | leading icon, optional trailing slot (filter button, eye toggle); default / focused (lavender-strong border, lavender-soft bg) / disabled; `secure` with eye toggle; 56 high, radius `lg` | 05 |
| `Chip` | `filter` (text only, 48 high; selected = lavender bg) · `category` (icon + label, 40 high; selected = primary bg); white unselected with border | 06 |
| `ListingCard` | photo (radius `lg`) with favorite heart, title, pin + location, star rating + count, amenity tags, price + "/ night" | 07 |
| `PolicyCard` | lavender-soft card, 44 icon tile, title, 2-line description, chevron, pressable | 08 |
| `ListRow` + `ListGroup` | icon, label, chevron; group = white card, hairline dividers between rows | 09 |
| `TabBar` | glass capsule, 4 items (icon + `type-small` label), active = 56 yellow circle with glow and filled icon | 10 |
| `SegmentedControl` | capsule track, selected = ink pill with white icon + label | 12 |
| `Toggle` | `Switch`, primary track | 13 |
| `Stepper` | capsule with border, − value + | 13 |
| `Alert` | `success` / `danger`, leading circle icon, message, dismiss ×, radius `lg` | 14 |
| `Tag` | `favorite` (primary-soft, star) · `success` · `danger` · `info`; capsule, `type-caption` | 15 |
| `Logo` | wordmark placeholder (see Assets) | 01 |

### Assets

- Fonts: Plus Jakarta Sans static TTFs (downloaded, OFL licence file included).
- **Missing, using marked placeholders:**
  - The "roam" wordmark: rendered as text in ExtraBold with a `// PLACEHOLDER: replace with assets/images/logo.png` comment.
  - The Google "G" logo for "Continue with Google": a placeholder Lucide glyph, also commented.
- Listing photo: a remote placeholder image (Unsplash cabin URL) in the preview only.

## Steps

1. Fonts: run `npm pack @expo-google-fonts/plus-jakarta-sans` in the scratchpad, copy the 400/500/600/700/800 TTFs to `assets/fonts/` with PostScript-name file names, and add `OFL.txt`. Check the PostScript names. Register them under the `expo-font` plugin in `app.json`, and set `userInterfaceStyle` to `"light"` there too.
2. `npx expo install lucide-react-native react-native-svg`.
3. Tokens in `src/global.css`: theme resets, colors, `--spacing`, `rem`, fonts, radii, the `type-*` and `shadow-*` utilities. Check: web export CSS contains them, and `bg-blue-500` no longer generates a color.
4. `src/lib/cn.ts`, then `Text`, `Icon`.
5. `Button`, `IconButton`, `TextField`.
6. `Chip`, `Tag`, `Alert`, `Toggle`, `Stepper`, `SegmentedControl`.
7. `ListRow`/`ListGroup`, `PolicyCard`, `ListingCard`, `TabBar`, `Logo`.
8. `src/app/design-system.tsx` preview in board order, and `index.tsx` link.
9. Visual pass: screenshot the preview (web via headless Edge here; iOS needs a Mac), compare with the board, list the differences, fix, repeat.

## Files

- `assets/fonts/*.ttf`, `assets/fonts/OFL.txt`: new.
- `app.json`: `expo-font` fonts, `userInterfaceStyle: "light"`.
- `package.json`: `lucide-react-native`, `react-native-svg`.
- `src/global.css`: all tokens and shared utilities.
- `src/lib/cn.ts`: new.
- `src/components/ui/*.tsx`: the 16 components above.
- `src/app/design-system.tsx`: new preview route.
- `src/app/index.tsx`: link to the preview.
- `AGENTS.md`: design-system rules (where tokens live, closed palette, components in `src/components/ui/`).

## Verification

- `npx tsc --noEmit`, `npx expo lint`, `npx expo-doctor` pass.
- `npx expo export --platform ios` and `--platform web` succeed. The web CSS contains `--color-primary: #FFC629`, the `type-*` utilities and `font-family: PlusJakartaSans-Bold`.
- No hex colors outside `src/global.css`: `grep -rnE "#[0-9a-fA-F]{3,8}\b" src --include=*.tsx` returns only commented placeholders.
- Web screenshot of `/design-system` compared with the board, with every difference listed.
- iOS simulator screenshot: ❌ on this Windows machine. The user checks `roamapp://design-system` on a Mac (fonts, glass tab bar, Switch colors).

## Result

Shipped as planned: the tokens are in `src/global.css`, the 16 components are in `src/components/ui/`, and the `/design-system` preview mirrors the board. Type check, lint and expo-doctor (20/20) pass. The iOS and web exports bundle. A web screenshot was compared with the board, and the console has no hydration or style warnings.

What differs from the plan:
- **Font utilities:** families are `font-regular` / `font-medium` / `font-semibold` / `font-bold` / `font-extrabold`. The Tailwind font-weight scale is reset so these map only to families. `--font-sans` was not used because `nativewind/theme` overrides it on `:root` per platform.
- **Extra type step:** added `type-input` (Regular 16 with no line height), because iOS `TextInput` offsets text when a line height is set.
- **Text weights:** `Text` takes a `weight` prop. `font-*` utilities sort after `type-*`, so the weight overrides the ramp's family.
- **Web fonts:** `src/lib/fonts.web.ts` loads them at runtime with `useFonts`, because the config plugin is native-only. It doesn't block rendering, since that would break SSR hydration.
- **Toggle:** colors map onto flat props of a small `Switch` wrapper. Dot paths (`trackColor.true`) are too complex for TypeScript. On web the mapping is skipped, so web keeps the default switch colors.
- **ListingCard:** the heart button is a sibling overlay, not a child of the card's pressable. Nested buttons are invalid HTML and broke web hydration.
- **Selection state:** chips, tabs and segments compute selected classes from props instead of `aria-selected:`.
- **Pressable nesting:** a card that contains another control must keep it as a sibling, not a child. The same applies to future cards.

Still open:
- iOS check on a Mac: fonts, the liquid glass tab bar, the Switch colors, and the focused field (headless web can't show the focus state).
- Real assets for the "roam" wordmark and the Google "G".
- Hook `TabBar` up to real tab routes when navigation is built.
