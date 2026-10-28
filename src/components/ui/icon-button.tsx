import type { LucideIcon } from "lucide-react-native";
import { Pressable, type PressableProps } from "react-native";

import { cn } from "@/lib/cn";

import { Icon } from "./icon";

const variants = {
  muted: "bg-surface-muted active:bg-border",
  surface: "bg-surface shadow-card active:bg-surface-muted",
  /** White with a hairline, e.g. the back button on light screens. */
  outline: "bg-surface border border-border active:bg-surface-muted",
} as const;

const sizes = {
  sm: { box: "size-8", icon: "sm" },
  md: { box: "size-11", icon: "md" },
  lg: { box: "size-14", icon: "lg" },
} as const;

export type IconButtonProps = Omit<PressableProps, "children"> & {
  icon: LucideIcon;
  /** Required: icon-only controls have no visible text. */
  accessibilityLabel: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Fills the glyph, e.g. a saved heart. */
  active?: boolean;
  iconClassName?: string;
  className?: string;
};

export function IconButton({
  icon,
  variant = "muted",
  size = "lg",
  active,
  iconClassName,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!active, disabled: !!props.disabled }}
      hitSlop={size === "sm" ? 8 : undefined}
      className={cn(
        "items-center justify-center rounded-full",
        variants[variant],
        sizes[size].box,
        className,
      )}
      {...props}
    >
      <Icon as={icon} size={sizes[size].icon} filled={active} className={iconClassName} />
    </Pressable>
  );
}
