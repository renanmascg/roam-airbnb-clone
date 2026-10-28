# 03 — Onboarding and auth screen shells

Status: done

## Goal

Replace the temporary home screen with the designed onboarding: three swipeable slides that end in Sign up. Add sign-in and sign-up screens built from the design system so the flow can be followed end to end. Clerk wiring is the next feature, so these screens are shells for now.

## Decisions

- **Auth scope:** shells only. Sign in and Sign up are full screens with fields and buttons, but submitting shows a "not connected yet" alert. Clerk (keys, sessions, Google OAuth, and a `Stack.Protected` guard with `redirectTo`, available in SDK 58) is the next plan.
- **Slides:** 3, swipeable. Slide 1 copies the design exactly. Slides 2 and 3 use my drafted copy in the same layout (below), so edit them in this review if needed.
- **Buttons:**
  - **Get started** moves to the next slide, and on the last slide opens Sign up.
  - **Skip** opens Sign up.
  - **Continue with Google** opens Sign in.
  - Swiping also changes slides, and the progress bars follow.
- **Defaults I picked:**
  - Onboarding is the `/` route. It shows on every launch for now. With no auth there's no "signed in" state yet, and Clerk's guard will decide later.
  - `(auth)` route group: `/sign-in` and `/sign-up` use a stack header with a back button and no title. They link to each other.
  - Photos are remote Unsplash URLs (checked to load), shown with `expo-image` (cover, 200 ms fade, `surface-muted` placeholder).
  - Status bar: dark content over the photo's light sky.
  - `/design-system` stays reachable by deep link (`roamapp://design-system`). The home screen no longer links to it.
  - The slide's location chip is a non-interactive label.

## Design

Measured from the attached screenshot: the phone screen is ~630 px wide = 390 pt, so 1 pt ≈ 1.6 px. All values are estimated.

### Slide layout (one per slide)

- **Photo:** full-screen background (cover), behind everything.
- **Top bar:** padded `px-6` with the top safe-area inset plus 16.
  - **Left:** the "roam" `Logo` in `ink` (still the text placeholder; the wordmark asset is missing).
  - **Right:** **Skip** pill, about 62×40 (`h-10 px-4`), translucent white `bg-glass`, `type-label` ink. This is a new `Button` variant `glass` and size `sm`.
- **Location chip:** bottom-left of the photo, 16 pt above the sheet's top edge, `ml-6`. About 123×40, dark translucent (`bg-ink/40`, `border-white/30` hairline), with a filled white `MapPin` 16 and `type-caption` white text. This is a new `Tag` tone, `overlay`.
- **Sheet:** white (`bg-surface`) and anchored to the bottom.
  - Its top edge is a soft curve, highest at the left (rounded corner, r 32) and dipping about 44 pt lower toward the right edge, where it rounds down. It's drawn with `react-native-svg` (already installed) in the `surface` color, passed through `Icon`-style className mapping (`fill-surface`).
  - Contents, `px-6`:
    - **Progress bars:** 3 bars, `h-1 w-8 rounded-full`, `gap-2`. Active = `bg-lavender`, others `bg-border`. Placed about 32 pt below the curve's high point.
    - **Heading:** 20 pt below the bars, `type-hero` (proposed: Bold 40 / 42), `ink`, 2 lines.
    - **Body:** 12 pt below the heading, `type-lead` (proposed: Regular 16 / 20), `ink-muted`, up to 3 lines.
    - **Buttons** (fixed across slides; don't swipe): 16 pt below the body.
      - **Get started:** `Button` primary, `md` (48), trailing `ArrowRight`.
      - **Continue with Google:** `Button` secondary, `md`, leading Google mark (still the Globe placeholder; the asset is missing).
      - `gap-3`. Bottom padding is the bottom safe-area inset, at least 16.

### Copy

| Slide | Location chip | Heading | Body | Photo (Unsplash) |
|---|---|---|---|---|
| 1 | Whistler, BC | Find a stay that fits your story | From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip. | `photo-1510798831971-661eb04b3739`: lit cabin at dusk by a mountain lake |
| 2 *(draft)* | Tulum, Mexico | Describe it, we'll find it | Tell us what you want in one sentence, like a quiet pet friendly cabin with a hot tub, and get stays ranked for you. | `photo-1499793983690-e29da59ef1c2`: beachfront villa |
| 3 *(draft)* | Palm Springs, CA | Answers straight from the stay | Ask about check-in, pets or cancellation and see the house rules and policies word for word. | `photo-1613490493576-7fde63acd811`: modern pool villa |

Draft locations are sample labels for stock photos, not claims about where they were taken.

### Auth shells (no design yet, built from design-system components; replace once designs are attached)

- **Sign up:**
  - `Logo`, heading "Create your account" (`type-heading`), muted body "Save stays and ask about policies in one place."
  - `TextField`s: Name (User icon), Email (Mail icon, email keyboard), Password (Lock icon, secure).
  - **Create account** (primary `lg`), then an "or" divider, then **Continue with Google** (secondary).
  - Footer: "Already have an account? **Sign in**".
- **Sign in:** same layout with "Welcome back", fields Email and Password, **Sign in**, and footer "New to roam? **Create an account**".
- Submitting, or pressing Continue with Google on these screens, shows a danger `Alert` above the button: "Sign in isn't connected yet." Fields keep their values.

### Proposed new tokens

- `type-hero`: Bold 40 / 42 (onboarding heading; `type-display` 56 is too big for this screen).
- `type-lead`: Regular 16 / 20 (onboarding body; `type-body` 16 / 24 is looser than the design).
- No new colors. `bg-ink/40` and `border-white/30` use opacity modifiers on existing tokens.

### Missing assets (marked placeholders)

- "roam" wordmark (text placeholder, from plan 02).
- Google "G" mark (Globe placeholder, from plan 02).

## Steps

1. Tokens: add `type-hero` and `type-lead` to `src/global.css`. Add `Button` variant `glass` + size `sm`, and `Tag` tone `overlay`, plus `/design-system` entries for each.
2. `src/components/onboarding/`: `slides.ts` (copy + image URLs), `sheet-curve.tsx` (SVG top edge), `progress-bars.tsx`, `onboarding-slide.tsx`. These are screen-private, kept outside `src/app/`.
3. `src/app/index.tsx`: onboarding screen. It's a horizontal paging `ScrollView` of slides with the fixed button bar over the sheet. The index is tracked from scroll position, and Get started / Skip / Google navigate as decided. The root layout hides the header for `index`.
4. `src/app/(auth)/_layout.tsx` (Stack, transparent header with back button, no title), `sign-up.tsx` and `sign-in.tsx` shells. Shared form pieces (the "or" divider) live in `src/components/auth/`.
5. Visual pass: web screenshot of `/`, `/sign-up` and `/sign-in` at phone width. Compare `/` with the design, list differences, fix, repeat.

## Files

- `src/global.css`: `type-hero`, `type-lead`.
- `src/components/ui/button.tsx`: `glass` variant, `sm` size.
- `src/components/ui/tag.tsx`: `overlay` tone.
- `src/app/design-system.tsx`: show the new variants.
- `src/components/onboarding/*`: new.
- `src/components/auth/*`: new.
- `src/app/_layout.tsx`: screen options (index headerless, `(auth)` group).
- `src/app/index.tsx`: onboarding (replaces the temporary home).
- `src/app/(auth)/_layout.tsx`, `sign-in.tsx`, `sign-up.tsx`: new.
- `AGENTS.md`: route map (onboarding at `/`, `(auth)` group, Clerk guard to come).

## Verification

- `npx tsc --noEmit`, `npx expo lint`, `npx expo-doctor` pass.
- `npx expo export --platform ios` and `--platform web` succeed.
- No hex, px or arbitrary values in the new files (grep).
- Web (headless Edge, phone-width viewport):
  - `/` matches the design, with each difference listed.
  - Clicking Get started twice reaches slide 3, and a third click lands on `/sign-up`.
  - Skip → `/sign-up`, Google → `/sign-in`, and the footer links switch between them.
- iOS simulator: ❌ on this Windows machine. The user checks swiping, safe areas and the status bar on a Mac.

## Result

Shipped as planned: 3-slide onboarding at `/`, sign-in and sign-up shells, `type-hero` / `type-lead`, Button `glass` + `sm`, and Tag `overlay`. Type check and lint pass. The iOS and web exports bundle. A web run at an emulated 390×844 phone viewport clicked through every route with no console errors.

What differs from the plan:
- **Pager width:** measured with `onLayout`, not `useWindowDimensions`. Window sizes differ between the server render and the client on web, which broke hydration. The sheet curve is a fixed 390-wide `viewBox` stretched to 100%.
- **Slide index:** follows `onScroll`, because web fires no momentum-end events.
- **Back button:** `AuthScreen` always shows it. On press it goes back, or to `/` if there's no history. Calling `router.canGoBack()` during render triggered a navigation warning.
- **Verification tooling:** headless Edge has a ~500px minimum window, so screenshots ran through a small DevTools-protocol script with device emulation (scratchpad only, not committed).

Differences from the design that are still open:
- The photos are different Unsplash shots: a snowy dusk cabin rather than a sunset deck.
- The location pin is an outline, where the design's is filled.
- Body text wraps one word differently.
- The Google mark and the wordmark are still placeholders.
- On slide 3, the pool villa photo crops to a busy facade at portrait size, so a better-framed photo would help.

Not verified: iOS (swipe feel, safe areas, status bar). `expo-doctor` now flags 4 SDK 58 patch updates published since plan 02 (`expo`, `expo-router`, `@expo/ui`, `expo-web-browser`); they aren't applied, pending approval.
