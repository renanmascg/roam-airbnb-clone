import type { LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { cn } from "@/lib/cn";

import { Icon } from "./icon";
import { Text } from "./text";

export type Segment<T extends string> = { value: T; label: string; icon?: LucideIcon };

export type SegmentedControlProps<T extends string> = {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <View
      accessibilityRole="tablist"
      className={cn("flex-row self-start rounded-full bg-surface-muted p-1", className)}
    >
      {segments.map((s) => {
        const selected = s.value === value;
        return (
          <Pressable
            key={s.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(s.value)}
            className={cn(
              "h-12 flex-row items-center gap-2 rounded-full px-8",
              selected ? "bg-ink" : "active:bg-border",
            )}
          >
            {s.icon ? (
              <Icon as={s.icon} size="md" className={selected ? "text-white" : "text-ink"} />
            ) : null}
            <Text variant="label" tone={selected ? "inverse" : "ink"}>
              {s.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
