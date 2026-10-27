import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, View, type PressableProps } from "react-native";

import { cn } from "@/lib/cn";

import { Text } from "./text";

const variants = {
  primary: "bg-primary active:opacity-80",
  secondary: "bg-surface border border-border active:bg-surface-muted",
} as const;

const sizes = {
  md: "h-12 px-5",
  lg: "h-14 px-6",
} as const;

export type ButtonProps = Omit<PressableProps, "children"> & {
  title: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Shown before the title, e.g. a provider logo. */
  leading?: ReactNode;
  /** Pinned to the trailing edge, e.g. an arrow icon. */
  trailing?: ReactNode;
  loading?: boolean;
  className?: string;
};

export function Button({
  title,
  variant = "primary",
  size = "lg",
  leading,
  trailing,
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
        "flex-row items-center justify-center gap-3 rounded-full",
        variants[variant],
        sizes[size],
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
          <Text variant="button">{title}</Text>
          {trailing ? <View className="absolute right-6">{trailing}</View> : null}
        </>
      )}
    </Pressable>
  );
}
