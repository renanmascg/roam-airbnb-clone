import { Redirect } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { AuthScreen } from "@/components/auth/auth-screen";
import { CodeInput } from "@/components/auth/code-input";
import { Alert, Button, Icon, Text } from "@/components/ui";
import { useAuth } from "@/lib/auth/auth-context";
import { authErrorMessage } from "@/lib/auth/errors";
import { checkCode } from "@/lib/auth/validation";

const RESEND_SECONDS = 30;

export default function VerifyScreen() {
  const { pending, verifyCode, resendCode } = useAuth();
  const [code, setCode] = useState("");
  // Clerk clears the pending attempt as soon as the code is accepted, a moment before the
  // route guard moves the guest. Without this the screen would bounce to /sign-up in between.
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState<"verify" | "resend" | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  // Opened without a sign-up in progress (deep link, reload): start over.
  if (!pending && !verified) return <Redirect href="/sign-up" />;

  const verify = async (value = code) => {
    setNotice(null);
    const invalid = checkCode(value);
    if (invalid) {
      setFailure(invalid);
      return;
    }
    setFailure(null);
    setBusy("verify");
    try {
      await verifyCode(value);
      setVerified(true); // The route guard moves the guest to /home.
    } catch (error) {
      setFailure(authErrorMessage(error));
      setCode("");
      setBusy(null);
    }
  };

  const resend = async () => {
    setFailure(null);
    setBusy("resend");
    try {
      await resendCode();
      setNotice("We sent a new code.");
      setSecondsLeft(RESEND_SECONDS);
    } catch (error) {
      setFailure(authErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  const countdown = `0:${String(secondsLeft).padStart(2, "0")}`;

  return (
    <AuthScreen
      title="Check your email"
      subtitle={
        <>
          We sent a 6-digit code to{" "}
          <Text variant="body" weight="semibold">
            {pending?.email}
          </Text>
          . Enter it below to verify your account.
        </>
      }
    >
      <CodeInput
        value={code}
        onChange={(value) => {
          setCode(value);
          if (failure) setFailure(null);
        }}
        onComplete={verify}
        invalid={!!failure}
        editable={busy === null}
      />
      {failure ? <Alert tone="danger" message={failure} onDismiss={() => setFailure(null)} /> : null}
      {notice ? <Alert tone="success" message={notice} onDismiss={() => setNotice(null)} /> : null}
      <Button
        title="Verify email"
        className="mt-2"
        trailing={<Icon as={ArrowRight} />}
        loading={busy === "verify"}
        disabled={busy === "resend"}
        onPress={() => verify()}
      />
      <View className="flex-row items-center justify-center gap-1 pt-2">
        <Text variant="caption" weight="regular" tone="muted">
          Didn&apos;t get a code?
        </Text>
        {secondsLeft > 0 ? (
          <Text variant="caption" tone="muted" accessibilityLiveRegion="polite">
            Resend in {countdown}
          </Text>
        ) : (
          <Pressable accessibilityRole="button" hitSlop={8} disabled={busy !== null} onPress={resend}>
            <Text variant="caption" className="underline">
              {busy === "resend" ? "Sending…" : "Resend code"}
            </Text>
          </Pressable>
        )}
      </View>
    </AuthScreen>
  );
}
