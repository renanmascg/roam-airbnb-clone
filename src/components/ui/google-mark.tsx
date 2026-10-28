import { Image } from "expo-image";
import { View } from "react-native";

import { cn } from "@/lib/cn";

/** Google's official multicolor "G" (brand asset, never recolored), for "Continue with Google". */
export function GoogleMark({ className }: { className?: string }) {
  return (
    <View className={cn("size-5", className)} accessibilityElementsHidden importantForAccessibility="no">
      <Image
        source={require("@/assets/images/google-g.svg")}
        contentFit="contain"
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
