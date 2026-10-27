import { Link } from "expo-router";
import { View } from "react-native";

import { Button, Logo, Text } from "@/components/ui";

// Temporary home until the first real screen exists.
export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-6 bg-surface-muted p-6">
      <Logo />
      <Text variant="body" tone="muted" className="text-center">
        Find unforgettable stays for every kind of trip.
      </Text>
      <Link href="/design-system" asChild>
        <Button title="Open design system" className="self-stretch" />
      </Link>
    </View>
  );
}
