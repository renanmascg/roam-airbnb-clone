import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import type { LucideIcon } from "lucide-react-native";
import { styled } from "nativewind";
import { Pressable, View } from "react-native";

import { cn } from "@/lib/cn";

import { Icon } from "./icon";
import { Text } from "./text";

const StyledGlassView = styled(GlassView);

export type TabBarItem<K extends string> = { key: K; label: string; icon: LucideIcon };

export type TabBarProps<K extends string> = {
  items: TabBarItem<K>[];
  activeKey: K;
  onSelect: (key: K) => void;
  className?: string;
};

/** Presentational glass tab bar; wire it to the router's tabs when navigation exists. */
export function TabBar<K extends string>({ items, activeKey, onSelect, className }: TabBarProps<K>) {
  const glass = isLiquidGlassAvailable();
  const Surface = glass ? StyledGlassView : View;
  return (
    <Surface
      accessibilityRole="tablist"
      className={cn(
        "flex-row items-center justify-between rounded-full p-2 shadow-raised",
        // Liquid glass draws its own material; elsewhere fall back to the glass token.
        !glass && "border border-white bg-glass",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(item.key)}
            className={cn(
              "size-18 items-center justify-center gap-1 rounded-full",
              active ? "bg-primary shadow-glow" : "active:bg-surface-muted",
            )}
          >
            <Icon as={item.icon} filled={active} />
            <Text variant="small" weight="medium">
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </Surface>
  );
}
