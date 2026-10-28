import { View } from "react-native";

import { cn } from "@/lib/cn";

export function ProgressBars({ count, index }: { count: number; index: number }) {
  return (
    <View
      className="flex-row gap-2"
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${index + 1} of ${count}`}
      accessibilityValue={{ min: 1, max: count, now: index + 1 }}
    >
      {Array.from({ length: count }, (_, i) => (
        <View key={i} className={cn("h-1 w-8 rounded-full", i === index ? "bg-lavender" : "bg-border")} />
      ))}
    </View>
  );
}
