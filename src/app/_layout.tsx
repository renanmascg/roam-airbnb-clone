import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import "../global.css";

import { Stack } from "expo-router";

import { AuthProvider, useAuth } from "@/lib/auth/auth-context";
import { useBrandFonts } from "@/lib/fonts";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add your key to .env.local.\nRun: 1) clerk auth login  2) clerk link  3) clerk env pull — then restart the dev server.");
}

function RootStack() {
  const { isLoaded, user } = useAuth();
  const signedIn = !!user;

  // Clerk restores the session from the token cache first. Rendering before that
  // would flash the signed-out screens on every cold start.
  if (!isLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Signed out: onboarding and the auth flow. */}
      <Stack.Protected guard={!signedIn} redirectTo="/home">
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      {/* Signed in. */}
      <Stack.Protected guard={signedIn} redirectTo="/">
        <Stack.Screen name="home" />
      </Stack.Protected>
      <Stack.Screen name="design-system" options={{ headerShown: true, title: "Design system" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const fontsReady = useBrandFonts();
  if (!fontsReady) return null;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <AuthProvider>
        <RootStack />
      </AuthProvider>
    </ClerkProvider>
  );
}