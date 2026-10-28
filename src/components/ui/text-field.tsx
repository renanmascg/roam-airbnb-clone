import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import { useId, useState, type ReactNode, type Ref } from "react";
import { Pressable, TextInput, View, type TextInputInstance, type TextInputProps } from "react-native";

import { cn } from "@/lib/cn";

import { Icon } from "./icon";
import { Text } from "./text";

export type TextFieldProps = TextInputProps & {
  icon?: LucideIcon;
  /** Label shown above the input inside the field (taller, borderless form style). */
  label?: string;
  /** Validation message; shows under the field and turns the border red. */
  error?: string;
  /** Trailing control, e.g. a filter button. Password fields get the eye toggle instead. */
  trailing?: ReactNode;
  ref?: Ref<TextInputInstance>;
  className?: string;
};

export function TextField({
  icon,
  label,
  error,
  trailing,
  secureTextEntry,
  editable = true,
  className,
  onFocus,
  onBlur,
  ref,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const errorId = useId();

  const input = (
    <TextInput
      ref={ref}
      className="type-input flex-1 text-ink placeholder:text-ink-muted web:outline-none"
      editable={editable}
      secureTextEntry={secureTextEntry && hidden}
      accessibilityLabel={label ?? props.placeholder}
      aria-invalid={!!error}
      aria-describedby={error ? errorId : undefined}
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
  );

  return (
    <View className="gap-1.5">
      <View
        className={cn(
          "flex-row items-center rounded-lg border",
          label ? "h-15 gap-6 pl-4.5 pr-4" : "h-14 gap-3 px-4",
          error
            ? "border-danger bg-surface-muted"
            : focused
              ? "border-lavender-strong bg-lavender-soft"
              : label
                ? "border-transparent bg-surface-muted"
                : "border-border bg-surface-muted",
          !editable && "opacity-40",
          className,
        )}
      >
        {icon ? <Icon as={icon} /> : null}
        {label ? (
          <View className="flex-1 justify-center">
            <Text variant="label">{label}</Text>
            {input}
          </View>
        ) : (
          input
        )}
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
      {error ? (
        <Text nativeID={errorId} variant="small" tone="danger" className="px-1">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
