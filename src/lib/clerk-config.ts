export function clerkPublishableKey() {
  return (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "").trim();
}

export function clerkSecretKey() {
  return (process.env.CLERK_SECRET_KEY ?? "").trim();
}

export function isClerkConfigured() {
  return clerkPublishableKey().startsWith("pk_");
}

export function isClerkServerConfigured() {
  return isClerkConfigured() && clerkSecretKey().startsWith("sk_");
}
