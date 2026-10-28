/** Guest-facing messages for auth failures. Raw Clerk messages never reach the screens. */

export class AuthError extends Error {}

const GENERIC = "Something went wrong. Please try again.";

// Clerk error codes: https://clerk.com/docs/guides/development/custom-flows/error-handling
const MESSAGES: Record<string, string> = {
  form_identifier_exists: "An account with this email already exists. Try signing in.",
  form_param_format_invalid: "Enter a valid email address, like you@example.com.",
  form_password_pwned: "That password has appeared in a data breach. Choose a different one.",
  form_password_length_too_short: "Your password is too short. Use at least 8 characters.",
  form_password_not_strong_enough: "Choose a stronger password.",
  form_identifier_not_found: "Email or password is incorrect.",
  form_password_incorrect: "Email or password is incorrect.",
  strategy_for_user_invalid: "Email or password is incorrect.",
  form_code_incorrect: "That code isn't right. Check your email and try again.",
  verification_failed: "That code isn't right. Check your email and try again.",
  verification_expired: "That code has expired. Request a new one.",
  too_many_requests: "Too many attempts. Wait a moment and try again.",
  client_state_invalid: "Your sign-up expired. Please start again.",
};

type ClerkErrorLike = { errors?: { code?: string }[] };

/** Turns a Clerk error (or anything thrown) into an AuthError with a guest-facing message. */
export function toAuthError(error: unknown) {
  if (error instanceof AuthError) return error;
  const code = (error as ClerkErrorLike | null)?.errors?.[0]?.code;
  return new AuthError((code && MESSAGES[code]) || GENERIC);
}

/** Message to show for any failure, including unexpected ones. */
export function authErrorMessage(error: unknown) {
  return toAuthError(error).message;
}
