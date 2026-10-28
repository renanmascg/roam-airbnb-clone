import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, View, type PressableProps } from "react-native";

import { cn } from "@/lib/cn";

import { Text } from "./text";

const variants = {
  primary: "bg-primary active:opacity-80",
  secondary: "bg-surface border border-border active:bg-surface-muted",
  /** Translucent pill over photos ("Skip"). */
  glass: "bg-glass active:opacity-80",
} as const;

// Gap lives here (not in the base classes) so two gap-* never compete.
const alignments = {
  center: "justify-center gap-3",
  /** Provider buttons: logo and label line up across stacked buttons. */
  start: "justify-start gap-8 pl-17",
} as const;

const sizes = {
  sm: { box: "h-10 px-4", text: "label" },
  md: { box: "h-12 px-5", text: "button" },
  lg: { box: "h-14 px-6", text: "button" },
} as const;

export type ButtonProps = Omit<PressableProps, "children"> & {
  title: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Shown before the title, e.g. a provider logo. */
  leading?: ReactNode;
  /** Pinned to the trailing edge, e.g. an arrow icon. */
  trailing?: ReactNode;
  align?: keyof typeof alignments;
  loading?: boolean;
  className?: string;
};

export function Button({
  title,
  variant = "primary",
  size = "lg",
  leading,
  trailing,
  align = "center",
  loading,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const inactive = !!(disabled || loading);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive, busy: !!loading }}
      disabled={inactive}
      className={cn(
        "flex-row items-center rounded-full",
        variants[variant],
        sizes[size].box,
        loading ? alignments.center : alignments[align],
        disabled && "opacity-40",
        className,
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator className="text-ink" />
      ) : (
        <>
          {leading}
          <Text variant={sizes[size].text}>{title}</Text>
          {trailing ? <View className="absolute right-6">{trailing}</View> : null}
        </>
      )}
    </Pressable>
  );
}
