import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { cn } from "@/lib/cn";

const variants = {
  display: "type-display",
  hero: "type-hero",
  heading: "type-heading",
  title: "type-title",
  body: "type-body",
  lead: "type-lead",
  label: "type-label",
  caption: "type-caption",
  small: "type-small",
  button: "type-button",
} as const;

const tones = {
  ink: "text-ink",
  muted: "text-ink-muted",
  inverse: "text-white",
  lavender: "text-lavender-strong",
  success: "text-success",
  danger: "text-danger",
  info: "text-info",
} as const;

// font-* utilities sort after type-*, so `weight` overrides the ramp's family.
const weights = {
  regular: "font-regular",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
} as const;

export type TextVariant = keyof typeof variants;
export type TextTone = keyof typeof tones;

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  weight?: keyof typeof weights;
};

export function Text({ variant = "body", tone = "ink", weight, className, ...props }: TextProps) {
  return (
    <RNText
      className={cn(variants[variant], tones[tone], weight && weights[weight], className)}
      {...props}
    />
  );
}
