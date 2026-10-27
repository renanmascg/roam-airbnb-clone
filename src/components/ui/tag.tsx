import { Star, type LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { cn } from "@/lib/cn";

import { Icon } from "./icon";
import { Text, type TextTone } from "./text";

const tones = {
  favorite: { box: "bg-primary-soft", text: "ink" },
  success: { box: "bg-success-soft", text: "success" },
  danger: { box: "bg-danger-soft", text: "danger" },
  info: { box: "bg-info-soft", text: "info" },
  /** Outlined amenity tag on listing cards ("Hot Tub"). */
  neutral: { box: "bg-surface border border-border", text: "ink" },
} as const satisfies Record<string, { box: string; text: TextTone }>;

const sizes = {
  sm: { box: "h-8 gap-1 px-2.5", text: "small", icon: "xs" },
  md: { box: "h-10 gap-2 px-4", text: "caption", icon: "md" },
} as const;

export type TagProps = {
  label: string;
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
  icon?: LucideIcon;
  className?: string;
};

export function Tag({ label, tone = "neutral", size = "md", icon, className }: TagProps) {
  const t = tones[tone];
  const s = sizes[size];
  // "Guest favorite" always carries the filled star.
  const glyph = icon ?? (tone === "favorite" ? Star : undefined);
  return (
    <View className={cn("flex-row items-center self-start rounded-full", t.box, s.box, className)}>
      {glyph ? (
        <Icon
          as={glyph}
          size={s.icon}
          filled={tone === "favorite"}
          className={tone === "favorite" ? "fill-primary text-ink" : undefined}
        />
      ) : null}
      <Text variant={s.text} tone={t.text} weight={size === "sm" ? "medium" : undefined}>
        {label}
      </Text>
    </View>
  );
}
