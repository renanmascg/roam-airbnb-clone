import { useAuth as useClerkAuth, useClerk, useSignIn, useSignUp, useSSO, useUser } from "@clerk/expo";
import { createContext, use, type ReactNode } from "react";

import { AuthError, toAuthError } from "./errors";

export type User = { id: string; firstName: string; email: string };

type Pending = { kind: "sign-up" | "sign-in"; email: string };

type AuthContextValue = {
  /** False until Clerk has restored the session from the token cache. */
  isLoaded: boolean;
  user: User | null;
  /** The sign-up or new-device sign-in waiting for its email code, or null. */
  pending: Pending | null;
  /** `needsCode` is true when the guest must enter the emailed code next. */
  signUp: (input: { name: string; email: string; password: string }) => Promise<{ needsCode: boolean }>;
  signIn: (input: { email: string; password: string }) => Promise<{ needsCode: boolean }>;
  verifyCode: (code: string) => Promise<void>;
  resendCode: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Throws the failure of a Clerk call as an AuthError. */
function check({ error }: { error: unknown }) {
  if (error) throw toAuthError(error);
}

// The route guard moves the guest once the session is active, so finalize navigates nowhere.
const stay = () => {};

/** "Adrian Hajdin Jr" -> first "Adrian", last "Hajdin Jr". */
function splitName(name: string) {
  const [firstName = "", ...rest] = name.trim().split(/\s+/);
  const lastName = rest.join(" ");
  return lastName ? { firstName, lastName } : { firstName };
}

/** Session state for the app, backed by Clerk. Screens use this and never import Clerk hooks. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();
  const { startSSOFlow } = useSSO();

  const user: User | null =
    isSignedIn && clerkUser
      ? {
          id: clerkUser.id,
          firstName: clerkUser.firstName ?? "",
          email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        }
      : null;

  let pending: Pending | null = null;
  if (signUp.status === "missing_requirements" && signUp.unverifiedFields.includes("email_address") && signUp.emailAddress) {
    pending = { kind: "sign-up", email: signUp.emailAddress };
  } else if (signIn.status === "needs_client_trust" && signIn.identifier) {
    pending = { kind: "sign-in", email: signIn.identifier };
  }

  const value: AuthContextValue = {
    isLoaded,
    user,
    pending,

    signUp: async ({ name, email, password }) => {
      check(await signUp.password({ emailAddress: email.trim(), password, ...splitName(name) }));
      if (signUp.status === "complete") {
        check(await signUp.finalize({ navigate: stay }));
        return { needsCode: false };
      }
      check(await signUp.verifications.sendEmailCode());
      return { needsCode: true };
    },

    signIn: async ({ email, password }) => {
      check(await signIn.password({ emailAddress: email.trim(), password }));
      if (signIn.status === "complete") {
        check(await signIn.finalize({ navigate: stay }));
        return { needsCode: false };
      }
      if (signIn.status === "needs_client_trust") {
        // New device: Clerk asks for an emailed code before it trusts it.
        check(await signIn.mfa.sendEmailCode());
        return { needsCode: true };
      }
      throw new AuthError("We couldn't finish signing you in. Please try again.");
    },

    verifyCode: async (code) => {
      if (pending?.kind === "sign-in") {
        check(await signIn.mfa.verifyEmailCode({ code }));
        if (signIn.status === "complete") check(await signIn.finalize({ navigate: stay }));
        return;
      }
      if (pending?.kind !== "sign-up") throw toAuthError({ errors: [{ code: "client_state_invalid" }] });
      check(await signUp.verifications.verifyEmailCode({ code }));
      if (signUp.status === "complete") check(await signUp.finalize({ navigate: stay }));
    },

    resendCode: async () => {
      if (pending?.kind === "sign-in") check(await signIn.mfa.sendEmailCode());
      else if (pending?.kind === "sign-up") check(await signUp.verifications.sendEmailCode());
      else throw toAuthError({ errors: [{ code: "client_state_invalid" }] });
    },

    signInWithGoogle: async () => {
      // Cancelling the browser resolves without a session, which is not an error.
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: "oauth_google" });
      if (createdSessionId && setActive) await setActive({ session: createdSessionId });
    },

    signOut: () => signOut(),
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const value = use(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
