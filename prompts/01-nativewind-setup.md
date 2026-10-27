# 01 — NativeWind v5 setup

Status: done

## Goal

Style the app with Tailwind `className`s through NativeWind v5 (Tailwind CSS v4), following https://www.nativewind.dev/v5/llms-full.txt (installation for Expo).

## Decisions

- **Version:** NativeWind `5.0.0-rc.0` with `react-native-css` `3.1.0-rc.0`, both pinned exactly. The RC was tested on Expo 57 / RN 0.86, and this app is on Expo 58 / RN 0.88. The user chose to go ahead on SDK 58 and verify it here. Don't change the Expo native dependency versions to suit the RC.
- **Tailwind:** `tailwindcss` and `@tailwindcss/postcss` pinned at `4.1.12`, plus `postcss`, with `lightningcss` pinned at `1.30.1` as a devDependency and through npm `overrides`. Without that pin, `global.css` can fail to deserialize.
- **Native deps:** `npx expo install react-native-reanimated react-native-worklets react-native-safe-area-context expo-system-ui`. These are already installed, so this only confirms the SDK-aligned versions.
- **No Babel changes:** the Metro wrapper applies the className import rewrite (`globalClassNamePolyfill: true` by default). Don't add `nativewind/babel` or `jsxImportSource`.
- **CSS location (default):** `src/global.css`, imported once from `src/app/_layout.tsx`. The guide puts it in the project root, but it says to use whatever relative path you pick, and source code lives under `src/`.
- **Dark mode:** `app.json` already has `"userInterfaceStyle": "automatic"`, so it needs no change.
- **Smoke test:** convert `src/app/index.tsx` from `StyleSheet` to `className`s.
- **Design tokens:** out of scope. Tokens will be defined in `src/global.css` (`@theme`) when the design system is built from the designs.
- **Out of scope:** `prettier-plugin-tailwindcss` (it's optional, and we ask before adding dependencies).

## Steps

1. Install the runtime pair: `npm install --save-exact nativewind@5.0.0-rc.0 react-native-css@3.1.0-rc.0`.
2. Install the build deps: `npm install --save-dev --save-exact tailwindcss@4.1.12 @tailwindcss/postcss@4.1.12 postcss lightningcss@1.30.1`. These are build-time only and not Expo SDK packages, so we use npm with exact pins as the guide says.
3. Add `"overrides": { "lightningcss": "1.30.1" }` to `package.json` and reinstall. Check with `npm ls nativewind react-native-css lightningcss`.
4. Run `npx expo install react-native-reanimated react-native-worklets react-native-safe-area-context expo-system-ui`.
5. Create `postcss.config.mjs` (not `.cjs`):
   ```js
   export default { plugins: { "@tailwindcss/postcss": {} } };
   ```
6. Create `src/global.css`:
   ```css
   @import "tailwindcss/theme.css" layer(theme);
   @import "tailwindcss/preflight.css" layer(base);
   @import "tailwindcss/utilities.css";

   @import "nativewind/theme";
   ```
   Keep the utilities unlayered. Don't collapse these into `@import "tailwindcss"`.
7. Create `metro.config.js`:
   ```js
   const { getDefaultConfig } = require("expo/metro-config");
   const { withNativewind } = require("nativewind/metro");

   /** @type {import('expo/metro-config').MetroConfig} */
   const config = getDefaultConfig(__dirname);

   module.exports = withNativewind(config);
   ```
8. Create `nativewind-env.d.ts` in the root with `/// <reference types="react-native-css/types" />` and commit it. It's already covered by the tsconfig `**/*.ts` include.
9. Add `import "../global.css";` at the top of `src/app/_layout.tsx`.
10. Convert `src/app/index.tsx` to `<View className="flex-1 items-center justify-center bg-white">` with `<Text className="text-xl font-bold text-blue-500">`, and remove the `StyleSheet`.

## Files

- `package.json`, `package-lock.json`: new dependencies and the `overrides` block.
- `postcss.config.mjs`: new.
- `metro.config.js`: new.
- `src/global.css`: new.
- `nativewind-env.d.ts`: new.
- `src/app/_layout.tsx`: imports the CSS.
- `src/app/index.tsx`: uses `className`.

## Verification

- `npx tsc --noEmit` passes, so `className` is typed on RN components.
- `npx expo lint` passes.
- `npx expo-doctor` shows no new failures. Report any it finds about the RC or the overrides.
- `npx expo export --platform ios` and `--platform web` bundle without CSS or lightningcss errors.
- In the web export, the CSS has the `.text-blue-500` / `.flex-1` utilities.
- iOS simulator: can't run on this Windows machine. Report it as ❌ with that reason, and the user checks it on a Mac.

## Result

Shipped as planned. Type check, lint, and expo-doctor (20/20) pass. The iOS and web exports bundle, the web CSS includes the smoke-test utilities, and the iOS bundle includes the compiled `color-blue-500` style. Differences from the plan:
- The first `npx expo lint` run added `eslint`, `eslint-config-expo` and `eslint.config.js`, because ESLint wasn't configured yet.
- On first start, NativeWind added `nativewind-env.d.ts` to the tsconfig `include`.
- No runtime check on the iOS simulator yet: it was built on Windows. Follow-up: check on a Mac.
