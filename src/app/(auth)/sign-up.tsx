import { useRouter } from "expo-router";
import { ArrowRight, Lock, Mail, User } from "lucide-react-native";
import { useRef, useState } from "react";
import { View, type TextInputInstance } from "react-native";

import { AuthScreen } from "@/components/auth/auth-screen";
import { SocialButtons } from "@/components/auth/social-buttons";
import { SwitchAuthLink } from "@/components/auth/switch-auth-link";
import { Alert, Button, Icon, TextField } from "@/components/ui";
import { useAuth } from "@/lib/auth/auth-context";
import { authErrorMessage } from "@/lib/auth/errors";
import { checkEmail, checkName, checkNewPassword } from "@/lib/auth/validation";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState<"submit" | "google" | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);

  // Errors appear after the first submit, then update as the guest types.
  const errors = submitted
    ? { name: checkName(form.name), email: checkEmail(form.email), password: checkNewPassword(form.password) }
    : {};
  const set = (field: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [field]: value }));

  const submit = async () => {
    setSubmitted(true);
    setFailure(null);
    if (checkName(form.name) || checkEmail(form.email) || checkNewPassword(form.password)) return;
    setBusy("submit");
    try {
      const { needsCode } = await signUp(form);
      if (needsCode) router.push("/verify"); // Otherwise the route guard moves the guest to /home.
    } catch (error) {
      setFailure(authErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  const google = async () => {
    setFailure(null);
    setBusy("google");
    try {
      await signInWithGoogle(); // The route guard moves the guest to /home.
    } catch (error) {
      setFailure(authErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  return (
    <AuthScreen
      // Line break as in the design.
      title={"Create\nyour account"}
      subtitle="Join roam to save your stays, get personalized recommendations and access them across all your devices."
      footer={<SwitchAuthLink prompt="Already have an account?" action="Sign in" href="/sign-in" />}
    >
      <TextField
        icon={User}
        label="Full name"
        placeholder="e.g. Adrian Hajdin"
        value={form.name}
        onChangeText={set("name")}
        error={errors.name}
        autoComplete="name"
        textContentType="name"
        autoCapitalize="words"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      <TextField
        ref={emailRef}
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
        placeholder="At least 8 characters"
        value={form.password}
        onChangeText={set("password")}
        error={errors.password}
        autoComplete="new-password"
        textContentType="newPassword"
        secureTextEntry
        returnKeyType="go"
        onSubmitEditing={submit}
      />
      {failure ? <Alert tone="danger" message={failure} onDismiss={() => setFailure(null)} /> : null}
      <Button
        title="Create account"
        className="mt-2"
        trailing={<Icon as={ArrowRight} />}
        loading={busy === "submit"}
        disabled={busy !== null && busy !== "submit"}
        onPress={submit}
      />
      <SocialButtons loading={busy === "google"} disabled={busy !== null} onPress={google} />
      {/* Mount point for Clerk's bot protection. */}
      <View nativeID="clerk-captcha" />
    </AuthScreen>
  );
}
