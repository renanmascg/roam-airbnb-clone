import { cn } from "@/lib/cn";

import { Text } from "./text";

// PLACEHOLDER: the "roam" wordmark is a brand asset. Replace this text with
// assets/images/logo.png (or an SVG) once it is provided.
export function Logo({ className }: { className?: string }) {
  return (
    <Text
      variant="display"
      weight="extrabold"
      accessibilityRole="header"
      accessibilityLabel="Roam"
      className={cn("tracking-tighter", className)}
    >
      roam
    </Text>
  );
}
