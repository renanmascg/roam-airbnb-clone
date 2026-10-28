import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { IconButton, Logo, Text } from "@/components/ui";

type Props = {
  title: string;
  /** May contain nested <Text> for emphasis (e.g. the email on verify). */
  subtitle: ReactNode;
  children: ReactNode;
  /** Pinned to the bottom, e.g. the link to the other auth screen. */
  footer?: ReactNode;
};

/** Shared frame for the auth screens: back button + logo header, title, scrollable form. */
export function AuthScreen({ title, subtitle, children, footer }: Props) {
  const router = useRouter();
  // Decided on press, not during render (canGoBack reads navigation focus state).
  const goBack = () => (router.canGoBack() ? router.back() : router.replace("/"));
  return (
    <KeyboardAvoidingView className="flex-1 bg-surface" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-6 pt-safe-offset-2 pb-safe-or-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between">
          <IconButton icon={ChevronLeft} size="md" variant="outline" accessibilityLabel="Back" onPress={goBack} />
          {/* PLACEHOLDER: wordmark asset still missing (see Logo). */}
          <Logo size="sm" />
        </View>
        <View className="mt-8 gap-3">
          <Text variant="hero" accessibilityRole="header">
            {title}
          </Text>
          <Text variant="body" tone="muted">
            {subtitle}
          </Text>
        </View>
        <View className="mt-6 gap-3.5">{children}</View>
        {footer ? <View className="mt-auto items-center pt-6">{footer}</View> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
