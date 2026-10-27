import type { LucideIcon } from "lucide-react-native";
import { Pressable, type PressableProps } from "react-native";

import { cn } from "@/lib/cn";

import { Icon } from "./icon";
import { Text } from "./text";

const variants = {
  /** Text-only search filters ("Under $300"). Selected = lavender. */
  filter: {
    base: "h-12 px-6",
    selected: "bg-lavender border-lavender",
    text: "label",
  },
  /** Stay categories with an icon ("Cabins"). Selected = primary. */
  category: {
    base: "h-10 gap-1.5 px-3.5",
    selected: "bg-primary border-primary",
    text: "caption",
  },
} as const;

export type ChipProps = Omit<PressableProps, "children"> & {
  label: string;
  variant?: keyof typeof variants;
  icon?: LucideIcon;
  selected?: boolean;
  className?: string;
};

export function Chip({ label, variant = "filter", icon, selected, className, ...props }: ChipProps) {
  const v = variants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      className={cn(
        "flex-row items-center justify-center rounded-full border active:opacity-70",
        v.base,
        selected ? v.selected : "border-border bg-surface",
        className,
      )}
      {...props}
    >
      {icon ? <Icon as={icon} size="sm" filled={selected} /> : null}
      <Text variant={v.text} weight={selected && variant === "filter" ? "semibold" : undefined}>
        {label}
      </Text>
    </Pressable>
  );
}
