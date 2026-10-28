import { Stack } from "expo-router";

// The screens draw their own back button so its colors come from design tokens.
// Clerk's Stack.Protected guard (signed-out only) goes here in the Clerk plan.
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
