/** Client-side field checks. Each returns a guest-facing message, or undefined when valid. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD = 8;

export function checkName(value: string) {
  if (!value.trim()) return "Enter your full name.";
}

export function checkEmail(value: string) {
  if (!value.trim()) return "Enter your email address.";
  if (!EMAIL.test(value.trim())) return "Enter a valid email address, like you@example.com.";
}

export function checkNewPassword(value: string) {
  if (!value) return "Create a password.";
  if (value.length < MIN_PASSWORD) return `Use at least ${MIN_PASSWORD} characters.`;
}

export function checkPassword(value: string) {
  if (!value) return "Enter your password.";
}

export function checkCode(value: string) {
  if (value.length !== 6) return "Enter the 6-digit code.";
}
