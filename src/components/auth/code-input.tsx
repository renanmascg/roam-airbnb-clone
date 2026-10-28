import { useState } from "react";
import { TextInput, View } from "react-native";

import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";

const LENGTH = 6;

type Props = {
  value: string;
  onChange: (value: string) => void;
  /** Called once all digits are entered. */
  onComplete: (value: string) => void;
  invalid?: boolean;
  editable?: boolean;
};

/**
 * Six boxes drawn over one transparent input, so typing, paste and
 * one-time-code AutoFill all go through a single field.
 */
export function CodeInput({ value, onChange, onComplete, invalid, editable = true }: Props) {
  const [focused, setFocused] = useState(false);
  const active = Math.min(value.length, LENGTH - 1);

  return (
    <View className="relative">
      <View className="flex-row gap-2" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {Array.from({ length: LENGTH }, (_, i) => (
          <View
            key={i}
            className={cn(
              "h-15 flex-1 items-center justify-center rounded-lg border",
              invalid
                ? "border-danger bg-surface-muted"
                : focused && i === active
                  ? "border-lavender-strong bg-lavender-soft"
                  : "border-transparent bg-surface-muted",
            )}
          >
            <Text variant="heading">{value[i] ?? ""}</Text>
          </View>
        ))}
      </View>
      <TextInput
        className="absolute inset-0 text-transparent opacity-0 web:outline-none"
        value={value}
        onChangeText={(text) => {
          const digits = text.replace(/\D/g, "").slice(0, LENGTH);
          onChange(digits);
          if (digits.length === LENGTH) onComplete(digits);
        }}
        editable={editable}
        maxLength={LENGTH}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        caretHidden
        autoFocus
        accessibilityLabel="Verification code"
        accessibilityHint="Six digits from the email we sent"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}
