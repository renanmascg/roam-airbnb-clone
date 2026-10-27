import { Minus, Plus } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { cn } from "@/lib/cn";

import { Icon } from "./icon";
import { Text } from "./text";

export type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** What is being counted, for screen readers ("Guests"). */
  label: string;
  className?: string;
};

export function Stepper({ value, onChange, min = 0, max = Infinity, label, className }: StepperProps) {
  const canDecrease = value > min;
  const canIncrease = value < max;
  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ now: value, min, max: Number.isFinite(max) ? max : undefined }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === "increment" && canIncrease) onChange(value + 1);
        if (e.nativeEvent.actionName === "decrement" && canDecrease) onChange(value - 1);
      }}
      className={cn("h-12 flex-row items-center gap-2 self-start rounded-full border border-border bg-surface px-1", className)}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${label}`}
        disabled={!canDecrease}
        onPress={() => onChange(value - 1)}
        className={cn("size-10 items-center justify-center rounded-full active:bg-surface-muted", !canDecrease && "opacity-40")}
      >
        <Icon as={Minus} size="md" />
      </Pressable>
      <Text variant="title" weight="semibold" className="min-w-6 text-center">
        {value}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Increase ${label}`}
        disabled={!canIncrease}
        onPress={() => onChange(value + 1)}
        className={cn("size-10 items-center justify-center rounded-full active:bg-surface-muted", !canIncrease && "opacity-40")}
      >
        <Icon as={Plus} size="md" />
      </Pressable>
    </View>
  );
}
