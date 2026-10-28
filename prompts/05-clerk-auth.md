# 05 — Clerk auth (replaces the mock)

Status: done

## Goal

Replace the in-memory mock in `src/lib/auth/` with Clerk, keeping the custom screens from plan 04. Guests sign up with email + password + a 6-digit email code, sign in, stay signed in across app restarts, hit route guards driven by the real Clerk session, and sign out. Google sign-in goes through Clerk SSO. Apple is removed for now.

## Decisions

Made with the user:

- **Auth model:** keep the password. Sign up still sends the 6-digit code step. The dev instance's password minimum drops from 15 to 8 so it matches the app's rule.
- **Name:** enable `first_name` and `last_name` on the dev instance (not required). The "Full name" field splits at the first space.
- **Social:** keep Google through Clerk SSO. Remove Apple (disabled on the instance, and Apple's button rules are a separate job). The "or" divider and the Google button stay.

Defaults I picked (change any of them before approving):

- **Sign in** is email + password. Clerk's device trust is on, so a new device can return `needs_client_trust`. The verify screen then handles that code too (`signIn.mfa.verifyEmailCode`), which is the "sign in with a verification code" path.
- **`useAuth()` stays the only API screens use** (`auth-context.tsx`), with Clerk behind it. Screens import no Clerk hooks, so the swap stays in one place.
- **Custom-flow API:** the method-based hooks from `@clerk/expo` (`signUp.password`, `signUp.verifications.sendEmailCode`/`verifyEmailCode`, `signIn.password`, `finalize`). Not the legacy `setActive`/`prepare*` API. Google uses `useSSO()` from `@clerk/expo` with `setActive`, as the Clerk skill says. The `@clerk/expo/experimental` variant is not used.
- **Errors:** Clerk error codes map to guest-facing copy in `src/lib/auth/errors.ts` (`form_identifier_exists`, `form_password_pwned`, `form_password_length_too_short`, `form_identifier_not_found`, `form_password_incorrect`, `form_code_incorrect`, `verification_expired`, rate limits, a generic fallback). Raw Clerk messages never reach the screen.
- **Verify screen:** a reload mid-sign-up loses the Clerk attempt, so `/verify` with no attempt in progress redirects to `/sign-up`, as today.
- **Home** greets with `user.firstName`, falling back to the email's local part.
- **Captcha:** bot protection is off on the dev instance, but the sign-up screen still renders `<View nativeID="clerk-captcha" />` so turning it on later works.
- **Scope:** development instance only. No production instance, no API routes (none exist yet), no PostHog identify.

## Findings from the Clerk MCP (dev instance of app `roam`)

- `auth_email`: used for sign up and sign in, verification and sign-in strategy `email_code`. Already correct.
- `auth_password`: enabled and required, `min_length` 15, breach check on. Needs the change to 8.
- `user_model`: `first_name` / `last_name` disabled. Needs the change.
- `connection_oauth_google`: enabled. `connection_oauth_apple`: disabled.
- Bot protection off. Sessions: 7-day maximum lifetime, no inactivity timeout.
- The MCP's `custom-flows` snippet uses the legacy API (`isLoaded`, `setActive`, `prepareEmailAddressVerification`), so it was not used. Hook shapes come from the installed `@clerk/expo` 4.14.4 typings.

## Design

No visual change except the removed Apple button. Copy for the verify screen's sign-in variant is the same as sign-up. The two mock hints ("Demo code", "Demo account") are removed.

## Steps

1. **Instance config via the Clerk MCP**, each as a `dry_run` first, then applied, development instance only:
   - `auth_password.min_length: 8`
   - `user_model.first_name` and `last_name`: `{ enabled: true, required: false }`
2. **Dependencies** (after approval), with `npx expo install expo-secure-store expo-auth-session expo-crypto`. Secure store backs `tokenCache`, so sessions persist. The other two are for SSO.
3. **Root layout:** `ClerkProvider` stays. Guards use Clerk's `isLoaded`/`isSignedIn` through the auth context: render nothing until loaded (no signed-out flash on cold start), then `Stack.Protected` as now. The existing missing-key check stays.
4. **`src/lib/auth/`:**
   - `auth-context.tsx`: `AuthProvider` over `useSignUp`, `useSignIn`, `useUser`, `useAuth`, `useClerk`, `useSSO`. API: `isLoaded`, `user` (`{ id, firstName, email }`), `pendingEmail`, `pendingKind` (`"sign-up" | "sign-in"`), `signUp`, `verifyCode`, `resendCode`, `signIn`, `signInWithGoogle`, `signOut`.
   - `errors.ts`: `AuthError` and `authErrorMessage` from Clerk error codes.
   - `validation.ts`: unchanged.
   - Delete `mock-auth.ts`.
5. **Screens:**
   - `sign-up.tsx`: split name, call `signUp`, push `/verify`, add the captcha mount, drop Apple.
   - `sign-in.tsx`: remove the demo hint, drop Apple. On `needs_client_trust`, push `/verify`.
   - `verify.tsx`: use `verifyCode` / `resendCode`, remove the demo hint, redirect when nothing is pending.
   - `social-buttons.tsx`: Google only (provider type becomes `"google"`).
   - `index.tsx`: the onboarding Google button calls `signInWithGoogle`.
   - `home.tsx`: Clerk user, sign out.
   - `design-system.tsx`: remove Apple entries if the page shows them. `apple-mark.tsx` and `apple-logo.svg` are deleted if nothing else uses them.
6. **Docs:** update `AGENTS.md` (route map, auth section, mock hints, Clerk setup notes), keeping it under 150 lines.

## Files

- `package.json`, `package-lock.json`: three Expo modules.
- `src/app/_layout.tsx`: loaded gate and guards.
- `src/lib/auth/auth-context.tsx`, `errors.ts`: new internals. `mock-auth.ts`: deleted.
- `src/app/(auth)/sign-up.tsx`, `sign-in.tsx`, `verify.tsx`: Clerk calls.
- `src/components/auth/social-buttons.tsx`: Google only.
- `src/app/index.tsx`, `src/app/home.tsx`: Clerk user and actions.
- `src/components/ui/apple-mark.tsx`, `index.ts`, `assets/images/apple-logo.svg`, `src/app/design-system.tsx`: Apple removed.
- `AGENTS.md`: lasting decisions.

## Verification

- `npx tsc --noEmit` and `npx expo lint` pass. `npx expo export` for web (and iOS if the bundler allows on Windows) succeeds.
- No `mock-auth` import and no `MOCK:` comment left (grep). No hex, px or arbitrary values added.
- Clerk MCP `get_instance_config` confirms `min_length: 8` and the name fields enabled.
- Web at an emulated 390×844, with a test email like `you+clerk_test@example.com` (Clerk dev accepts code `424242` for `+clerk_test` addresses):
  1. Sign up with an 8-character password lands on `/verify`, then code `424242` lands on `/home` with the first name.
  2. A wrong code shows the friendly error. Resend works after the countdown.
  3. Existing email on sign up, wrong password on sign in, and an unknown email each show their own message.
  4. Reload on `/home` stays signed in. Signing out goes to `/`.
  5. `/home` while signed out redirects to `/`. `/verify` with nothing pending redirects to `/sign-up`.
  6. `list_users` through the MCP shows the new user with first and last name.
- Google SSO and "survives an app restart on a device" need a real browser/device run: the user checks these (❌ until then).

## Result

Shipped as planned. Type check and lint pass, web and iOS exports bundle, and 19 scripted web checks passed at 390×844 against the real dev instance (guards, form errors, wrong password, unknown email, new-device code with a wrong and a right code, reload and new-tab persistence, sign out, signing in again). The three 422 console errors are the expected rejected attempts.

What differs from the plan:
- **Web sign-up can't be scripted.** Clerk shows a Cloudflare "Verify you are human" check after `sign_ups`, so the sign-up + verify-code path was not exercised end to end. I created one dev test user through the MCP (`roamqa+clerk_test@example.com`) to test everything after it.
- **`@clerk/expo` config plugin not added.** Only `expo-secure-store` is registered in `app.json`, since the plan uses no native components or native Google.
- **`.env.example` added** (names only), as AGENTS.md requires.

Follow-ups:
- Try Google SSO and the full sign-up on a device or in a real browser.
- Enable Clerk's Native API under Dashboard → Native applications for device builds.
- Production instance, API-route session checks and PostHog identify are untouched.
