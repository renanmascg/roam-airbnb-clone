import { Link, type Href } from "expo-router";

import { Text } from "@/components/ui";

/** "Already have an account? Sign in". Replaces the screen so the two don't stack up. */
export function SwitchAuthLink({ prompt, action, href }: { prompt: string; action: string; href: Href }) {
  return (
    <Link href={href} replace accessibilityRole="link">
      <Text variant="caption" weight="regular" tone="muted">
        {prompt}{"  "}
        <Text variant="caption" className="underline">
          {action}
        </Text>
      </Text>
    </Link>
  );
}
