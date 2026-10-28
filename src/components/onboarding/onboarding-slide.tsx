import { Image } from "expo-image";
import { MapPin } from "lucide-react-native";
import { View } from "react-native";

import { Tag, Text } from "@/components/ui";

import { ProgressBars } from "./progress-bars";
import { SheetCurve } from "./sheet-curve";
import type { OnboardingSlide as Slide } from "./slides";

type Props = {
  slide: Slide;
  index: number;
  count: number;
  width: number;
  /** Space kept free at the bottom of the sheet for the fixed button bar. */
  footerHeight: number;
};

export function OnboardingSlide({ slide, index, count, width, footerHeight }: Props) {
  return (
    <View className="h-full bg-surface-muted" style={{ width }}>
      <Image
        source={slide.imageUrl}
        contentFit="cover"
        transition={200}
        accessibilityIgnoresInvertColors
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
      <View className="absolute inset-x-0 bottom-0">
        <Tag tone="overlay" label={slide.location} icon={MapPin} className="mb-4 ml-6" />
        <SheetCurve />
        <View className="gap-5 bg-surface px-6" style={{ paddingBottom: footerHeight }}>
          <ProgressBars count={count} index={index} />
          <View className="gap-3">
            <Text variant="hero" accessibilityRole="header">
              {slide.heading}
            </Text>
            <Text variant="lead" tone="muted">
              {slide.body}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
