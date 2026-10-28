import { cn } from "@/lib/cn";

import { Text } from "./text";

const sizes = {
  /** Hero placement: onboarding, home. */
  lg: "display",
  /** Header placement, opposite the back button. */
  sm: "heading",
} as const;

// PLACEHOLDER: the "roam" wordmark is a brand asset. Replace this text with
// assets/images/logo.png (or an SVG) once it is provided.
export function Logo({ size = "lg", className }: { size?: keyof typeof sizes; className?: string }) {
  return (
    <Text
      variant={sizes[size]}
      weight="extrabold"
      accessibilityRole="header"
      accessibilityLabel="Roam"
      className={cn("tracking-tighter", className)}
    >
      roam
    </Text>
  );
}
