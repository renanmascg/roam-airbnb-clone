import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

import { cn } from "@/lib/cn";

import { Icon } from "./icon";

export type TextFieldProps = TextInputProps & {
  icon?: LucideIcon;
  /** Trailing control, e.g. a filter button. Password fields get the eye toggle instead. */
  trailing?: ReactNode;
  className?: string;
};

export function TextField({
  icon,
  trailing,
  secureTextEntry,
  editable = true,
  className,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View
      className={cn(
        "h-14 flex-row items-center gap-3 rounded-lg border px-4",
        focused ? "border-lavender-strong bg-lavender-soft" : "border-border bg-surface-muted",
        !editable && "opacity-40",
        className,
      )}
    >
      {icon ? <Icon as={icon} /> : null}
      <TextInput
        className="type-input flex-1 text-ink placeholder:text-ink-muted web:outline-none"
        editable={editable}
        secureTextEntry={secureTextEntry && hidden}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {secureTextEntry ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hidden ? "Show password" : "Hide password"}
          hitSlop={8}
          onPress={() => setHidden((h) => !h)}
        >
          <Icon as={hidden ? EyeOff : Eye} />
        </Pressable>
      ) : (
        trailing
      )}
    </View>
  );
}
