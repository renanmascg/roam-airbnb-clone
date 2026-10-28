import { useRouter } from "expo-router";
import { ArrowRight, Lock, Mail } from "lucide-react-native";
import { useRef, useState } from "react";
import type { TextInputInstance } from "react-native";

import { AuthScreen } from "@/components/auth/auth-screen";
import { SocialButtons } from "@/components/auth/social-buttons";
import { SwitchAuthLink } from "@/components/auth/switch-auth-link";
import { Alert, Button, Icon, TextField } from "@/components/ui";
import { useAuth } from "@/lib/auth/auth-context";
import { authErrorMessage } from "@/lib/auth/errors";
import { checkEmail, checkPassword } from "@/lib/auth/validation";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState<"submit" | "google" | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const passwordRef = useRef<TextInputInstance>(null);

  // Errors appear after the first submit, then update as the guest types.
  const errors = submitted ? { email: checkEmail(form.email), password: checkPassword(form.password) } : {};
  const set = (field: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [field]: value }));

  // On success the route guard moves the guest to /home, so only failures need handling.
  const run = async (kind: "submit" | "google", call: () => Promise<void>) => {
    setFailure(null);
    setBusy(kind);
    try {
      await call();
    } catch (error) {
      setFailure(authErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  const submit = () => {
    setSubmitted(true);
    if (checkEmail(form.email) || checkPassword(form.password)) return;
    run("submit", async () => {
      const { needsCode } = await signIn(form);
      // A new device must confirm with an emailed code first.
      if (needsCode) router.push("/verify");
    });
  };

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to see your saved stays, trips and recommendations."
      footer={<SwitchAuthLink prompt="New to roam?" action="Create an account" href="/sign-up" />}
    >
      <TextField
        icon={Mail}
        label="Email address"
        placeholder="you@example.com"
        value={form.email}
        onChangeText={set("email")}
        error={errors.email}
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextField
        ref={passwordRef}
        icon={Lock}
        label="Password"
        placeholder="Your password"
        value={form.password}
        onChangeText={set("password")}
        error={errors.password}
        autoComplete="current-password"
        textContentType="password"
        secureTextEntry
        returnKeyType="go"
        onSubmitEditing={submit}
      />
      {failure ? <Alert tone="danger" message={failure} onDismiss={() => setFailure(null)} /> : null}
      <Button
        title="Sign in"
        className="mt-2"
        trailing={<Icon as={ArrowRight} />}
        loading={busy === "submit"}
        disabled={busy !== null && busy !== "submit"}
        onPress={submit}
      />
      <SocialButtons loading={busy === "google"} disabled={busy !== null} onPress={() => run("google", signInWithGoogle)} />
    </AuthScreen>
  );
}
