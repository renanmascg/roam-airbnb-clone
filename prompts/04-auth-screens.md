# 04 — Sign up, email verification and sign in (mocked auth)

Status: done

## Goal

Rebuild sign up to match the attached design, and add an email-verification screen and a sign-in screen in the same style. Wire up navigation and form behavior between them: validation, loading, errors, resend timer, and keyboard flow. Authentication is a realistic in-memory mock behind a small auth API, so the Clerk plan only swaps the session source. A placeholder signed-in Home screen, guarded by `Stack.Protected`, proves the flow end to end.

## Decisions

- **After auth:** verifying or signing in lands on a placeholder `/home` ("Welcome, {first name}" + Sign out). Signing out returns to onboarding.
  - Routes are split by `Stack.Protected` on the mock session.
  - **Signed out:** `/`, `/sign-up`, `/verify`, `/sign-in`, with `redirectTo="/home"` when signed in.
  - **Signed in:** `/home`, with `redirectTo="/"` when signed out.
  - `/design-system` stays open to everyone.
- **Mock rules** (`src/lib/auth/`, memory only, so a reload resets it; every call waits ~600 ms):
  - **Sign up:** validates name, email and password (≥ 8 characters), rejects an email that already has an account, then goes to verify.
  - **Verify:** code `123456` succeeds and signs in. Any other 6-digit code shows "That code isn't right. Check your email and try again." Resend restarts a 30 s countdown.
  - **Sign in:** accepts accounts created this session plus the demo account `demo@roam.app` / `password123`. Otherwise it shows "Email or password is incorrect."
  - **Google / Apple:** sign in straight away as a mock profile ("Google guest" / "Apple guest").
  - The onboarding "Continue with Google" button does the same.
- **Social buttons:** Google + Apple on sign up and sign in. The Apple logo is a brand image asset (`assets/images/apple-logo.svg` from Simple Icons, CC0), shown through a new `AppleMark`, like `GoogleMark`. Real Sign in with Apple must follow Apple's button rules; that's the Clerk plan's job.
- **No design for verify or sign in:** both reuse the sign-up layout. Attach designs later to refine them.
- **Defaults I picked:**
  - **Validation:** runs on submit. After the first submit, each field re-checks as you type. Field errors show under the field. Mock errors ("already exists", "incorrect", wrong code) show as a danger `Alert` above the main button.
  - **Keyboard:** Return moves to the next field, and on the last field it submits. `autoComplete`/`textContentType` are set so iOS offers AutoFill (`newPassword` on sign up, `oneTimeCode` on verify).
  - **Verify input:** one hidden `TextInput` (digits only, max 6) drawn as 6 boxes, so paste and SMS/email AutoFill work. It submits automatically at 6 digits.
  - **Busy state:** while a call runs, the main button shows its spinner and the other buttons are disabled.
  - **Deep links:** opening `/verify` with no sign up in progress sends you to `/sign-up`.
  - **History:** after sign up, verify is pushed (Back returns to the filled form). Sign up ↔ sign in footer links replace each other, as they do now.

## Design

The screen in the image is ~680 px wide = 390 pt, so 1 pt ≈ 1.74 px. All values are estimated.

### Shared auth layout (`AuthScreen`, rebuilt)

- **Background:** `bg-surface`.
- **Header row:** top safe-area inset + 8.
  - Left: back button, a 44 circle with a white fill and `border` hairline and a `ChevronLeft` 20. This is a new `IconButton` variant `outline` and size `md` (44). The existing default 56 becomes `lg`, so current callers are unchanged.
  - Right: the "roam" `Logo` at a new size `sm` (`type-heading` ExtraBold), still the text placeholder.
- **Title:** 32 pt below the header, `type-hero` (40 / 42), 2 lines, `ink`.
- **Subtitle:** 12 pt below the title, `type-body` (16 / 24), `ink-muted`.
- **Form:** 24 pt below the subtitle. Fields have a `gap-3.5` (14).
- **Primary button:** 22 pt below the last field (`mt-2`). `Button` primary `lg` with a trailing `ArrowRight`.
- **"or" divider:** `OrDivider` with `py-2`.
- **Social buttons:** `Button` secondary `md` (48), `gap-3.5`. The logo and label are **start-aligned**, so both buttons line up: icon at 68 pt from the button's left edge, label 32 pt after it. This is a new `Button` prop, `align="start"`.
- **Footer:** pinned to the bottom (`mt-auto`), about 26 pt below the last button. "Already have an account?" in `type-caption` regular, `ink-muted`. "Sign in" in `type-caption` medium, `ink`, **underlined**.

### Labeled text field (new `TextField` props)

- **`label`:** shows a label line (`type-label`, `ink`) above the input (`type-input`, placeholder `ink-muted`).
  - Height 60 (`h-15`), `rounded-lg`, `bg-surface-muted`, no visible border (`border-transparent`).
  - Leading icon 24 at `pl-4.5`, with `gap-6` to the text.
  - Focused: `border-lavender-strong bg-lavender-soft`, as now.
- **`error`:** `border-danger` and an error line below the field (`type-small`, `danger`), linked to the input for screen readers.
- **`ref`:** passed through to the `TextInput` so Return can move focus.

### Copy

| Screen | Title | Subtitle | Fields (label, placeholder) | Main button |
|---|---|---|---|---|
| Sign up (design) | Create your account | Join roam to save your stays, get personalized recommendations and access them across all your devices. | Full name, "e.g. Adrian Hajdin" · Email address, "you@example.com" · Password, "At least 8 characters" | Create account → |
| Verify (derived) | Check your email | We sent a 6-digit code to **{email}**. Enter it below to verify your account. | 6-box code | Verify email → |
| Sign in (derived) | Welcome back | Sign in to see your saved stays, trips and recommendations. | Email address, "you@example.com" · Password, "Your password" | Sign in → |

- **Verify extras:**
  - **Code boxes:** 6 boxes, each `h-15 flex-1 rounded-lg bg-surface-muted` with `gap-2`. The box the next digit goes into gets the focused style. Digits use `type-heading`, centered.
  - **Below the button:** "Didn't get a code? **Resend in 0:30**", which becomes a "Resend code" link once the timer ends.
  - A hint for the mock: "Demo code: 123456" (`type-small`, muted), removed when Clerk lands.
- **Sign-in extra:** a hint under the form, "Demo account: demo@roam.app · password123", also removed with Clerk.
- **Home (placeholder):**
  - `Logo`, "Welcome, {first name}" (`type-hero`), and the muted body "Search for stays is coming soon."
  - **Sign out** (secondary `lg`).

### Tokens

- No new color, type or radius tokens. Everything maps to existing ones.
- `h-15`, `pl-4.5`, `gap-3.5`, `pl-17` and `gap-6`/`gap-8` are steps on the 4-pt grid.

### Assets

- `assets/images/apple-logo.svg`: new, Simple Icons `apple` (CC0).
- Still missing: the "roam" wordmark (text placeholder).

## Steps

1. Components:
   - `IconButton`: `outline` variant, sizes `md` 44 / `lg` 56, default `lg`.
   - `Logo`: `size` prop.
   - `Button`: `align` prop.
   - `TextField`: `label`, `error`, `ref`.
   - `AppleMark`.
   - `/design-system` entries for the new options.
2. Mock auth in `src/lib/auth/`:
   - `mock-auth.ts`: in-memory accounts, pending sign up, delays, typed errors.
   - `auth-context.tsx`: `AuthProvider` + `useAuth()`, with `user`, `pendingEmail`, `signUp`, `verifyEmail`, `resendCode`, `signIn`, `signInWithProvider`, `signOut`.
   - `validation.ts`: name, email and password rules.
3. Routing: `AuthProvider` in the root layout, plus `Stack.Protected` groups. Add `src/app/home.tsx` and `src/app/(auth)/verify.tsx`.
4. Rebuild `AuthScreen` and `SwitchAuthLink` (underline). Add `SocialButtons` and `CodeInput` in `src/components/auth/`.
5. Rebuild `sign-up.tsx` and `sign-in.tsx`, then build `verify.tsx` and `home.tsx`. The onboarding Google button signs in through the mock.
6. Visual pass: web at an emulated 390×844, comparing sign up with the design and listing the differences. Click through every path: success, each error, resend timer, social, sign out.

## Files

- `src/components/ui/icon-button.tsx`, `logo.tsx`, `button.tsx`, `text-field.tsx`: new options.
- `src/components/ui/apple-mark.tsx`, `index.ts`: new.
- `assets/images/apple-logo.svg`: new.
- `src/lib/auth/mock-auth.ts`, `auth-context.tsx`, `validation.ts`: new.
- `src/components/auth/auth-screen.tsx`, `switch-auth-link.tsx`: rebuilt.
- `src/components/auth/social-buttons.tsx`, `code-input.tsx`: new.
- `src/app/_layout.tsx`: provider + protected groups.
- `src/app/(auth)/sign-up.tsx`, `sign-in.tsx`: rebuilt.
- `src/app/(auth)/verify.tsx`, `src/app/home.tsx`: new.
- `src/app/index.tsx`: Google signs in through the mock.
- `src/app/design-system.tsx`: new variants.
- `AGENTS.md`: auth flow, mock API contract, route guard.

## Verification

- `npx tsc --noEmit`, `npx expo lint` pass. `npx expo export` for iOS and web succeeds.
- No hex, px or arbitrary values in `src/` (grep).
- Web at an emulated 390×844, scripted clicks and typing:
  1. Sign up with empty fields shows three field errors.
  2. A bad email or a 5-character password shows those errors.
  3. Valid details go to `/verify`, which shows the email.
  4. Code `111111` shows the error. `123456` lands on `/home` with the first name.
  5. Sign out goes back to `/`.
  6. Sign in with a wrong password shows the error. `demo@roam.app` / `password123` goes to `/home`.
  7. Signing up with `demo@roam.app` shows the "already exists" error.
  8. Google and Apple go to `/home`.
  9. Opening `/home` while signed out redirects to `/`. Opening `/verify` with nothing pending redirects to `/sign-up`.
- Screenshot of sign up compared with the design, with each difference listed.
- iOS simulator: ❌ on Windows. The user checks the keyboard, AutoFill and safe areas on a Mac.

## Result

Shipped as planned. Type check and lint pass, the iOS and web exports bundle (both brand SVGs included), and the grep finds no hex, px or arbitrary values. All 9 scripted web scenarios passed at an emulated 390×844, with no app console errors. One run logged a browser-extension message-channel error, which isn't from the app.

What differs from the plan:
- **`type-hero` token:** now ExtraBold with -1 px tracking (was Bold). Both the sign-up and onboarding designs use a heavier, tighter headline, and the change applies to both screens.
- **Sign-up title:** has an explicit line break ("Create / your account"), as in the design.
- **`TextInputInstance` / `ScrollViewInstance`:** RN 0.88 ref types are used for field refs.

Differences from the design that are still open:
- The body copy wraps as 3 lines of different length. The design's paragraph is narrower or slightly larger.
- The screen background is `surface` (white), where the design is a faint off-white.
- The wordmark is still a text placeholder.

Not verified: iOS (keyboard Return flow, AutoFill for passwords and one-time codes, safe areas).
