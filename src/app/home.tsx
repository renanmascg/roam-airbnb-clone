import { View } from "react-native";

import { Button, Logo, Text } from "@/components/ui";
import { useAuth } from "@/lib/auth/auth-context";

// Placeholder signed-in screen until search exists.
export default function HomeScreen() {
  const { user, signOut } = useAuth();
  // Guests who signed up with Google may have no first name, so fall back to the email's local part.
  const greeting = user?.firstName || user?.email.split("@")[0] || "";

  return (
    <View className="flex-1 justify-between bg-surface px-6 pt-safe-offset-6 pb-safe-or-6">
      <View className="gap-6">
        {/* PLACEHOLDER: wordmark asset still missing (see Logo). */}
        <Logo />
        <View className="gap-3">
          <Text variant="hero" accessibilityRole="header">
            Welcome, {greeting}
          </Text>
          <Text variant="body" tone="muted">
            Search for stays is coming soon.
          </Text>
        </View>
      </View>
      <Button title="Sign out" variant="secondary" onPress={() => void signOut()} />
    </View>
  );
}
