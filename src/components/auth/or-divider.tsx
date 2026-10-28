import { View } from "react-native";

import { Text } from "@/components/ui";

export function OrDivider() {
  return (
    <View className="flex-row items-center gap-3 py-2" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View className="h-px flex-1 bg-border" />
      <Text variant="caption" weight="regular" tone="muted">
        or
      </Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}
