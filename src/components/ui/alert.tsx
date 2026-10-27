import { CircleAlert, CircleCheck, X } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { cn } from "@/lib/cn";

import { Icon } from "./icon";
import { Text } from "./text";

const tones = {
  success: { box: "bg-success-soft", icon: CircleCheck, fill: "fill-success", text: "success" },
  danger: { box: "bg-danger-soft", icon: CircleAlert, fill: "fill-danger", text: "danger" },
} as const;

export type AlertProps = {
  message: string;
  tone: keyof typeof tones;
  onDismiss?: () => void;
  className?: string;
};

export function Alert({ message, tone, onDismiss, className }: AlertProps) {
  const t = tones[tone];
  return (
    <View
      accessibilityRole="alert"
      className={cn("min-h-14 flex-row items-center gap-3 rounded-lg px-4 py-3", t.box, className)}
    >
      <Icon as={t.icon} size="lg" filled className={cn("text-white", t.fill)} />
      <Text variant="caption" weight="regular" tone={t.text} className="flex-1">
        {message}
      </Text>
      {onDismiss ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" hitSlop={8} onPress={onDismiss}>
          <Icon as={X} size="md" className={tone === "success" ? "text-success" : "text-danger"} />
        </Pressable>
      ) : null}
    </View>
  );
}
