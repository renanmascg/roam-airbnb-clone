import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { Pressable, View, type PressableProps } from "react-native";

import { cn } from "@/lib/cn";

import { Icon } from "./icon";
import { Text } from "./text";

export type PolicyCardProps = Omit<PressableProps, "children"> & {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
};

export function PolicyCard({ title, description, icon, className, ...props }: PolicyCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      className={cn(
        "flex-row items-center gap-3 rounded-lg bg-lavender-soft p-3 active:opacity-80",
        className,
      )}
      {...props}
    >
      <View className="size-11 items-center justify-center rounded-md bg-lavender/40">
        <Icon as={icon} className="text-lavender-strong" />
      </View>
      <View className="flex-1 gap-0.5">
        <Text variant="label" weight="semibold">
          {title}
        </Text>
        <Text variant="small" tone="muted" numberOfLines={2}>
          {description}
        </Text>
      </View>
      <Icon as={ChevronRight} size="md" className="text-lavender-strong" />
    </Pressable>
  );
}
