"use client";

import { useSyncExternalStore } from "react";
import { ACCOUNTS_KEY, AUTH_SESSION_KEY } from "@/lib/constants";
import { hydrateStore } from "@/lib/store";

export type AuthUser = {
  id: string;
  email: string;
};

type AccountRecord = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: number;
};

export type AuthState = {
  hydrated: boolean;
  user: AuthUser | null;
};

const defaultAuth: AuthState = {
  hydrated: false,
  user: null,
};

let authState: AuthState = defaultAuth;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function readAccounts(): AccountRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AccountRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: AccountRecord[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

async function hashPassword(email: string, password: string) {
  const payload = `${email.toLowerCase()}:${password}:catalyst-demo`;
  const bytes = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function hydrateAuth() {
  if (typeof window === "undefined") return;
  const sessionId = window.localStorage.getItem(AUTH_SESSION_KEY);
  const accounts = readAccounts();
  const account = accounts.find((row) => row.id === sessionId);
  authState = {
    hydrated: true,
    user: account ? { id: account.id, email: account.email } : null,
  };
  emit();
}

export function subscribeAuth(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAuthSnapshot() {
  return authState;
}

export function getAuthServerSnapshot() {
  return defaultAuth;
}

export function useAuth() {
  return useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getAuthServerSnapshot,
  );
}

export async function signUp(email: string, password: string) {
  const normalized = normalizeEmail(email);
  if (!isEmail(normalized)) {
    return { ok: false as const, reason: "Enter a valid email." };
  }
  if (password.length < 6) {
    return { ok: false as const, reason: "Use at least 6 characters." };
  }

  const accounts = readAccounts();
  if (accounts.some((row) => row.email === normalized)) {
    return { ok: false as const, reason: "That email already has a demo account." };
  }

  const account: AccountRecord = {
    id: crypto.randomUUID(),
    email: normalized,
    passwordHash: await hashPassword(normalized, password),
    createdAt: Date.now(),
  };
  writeAccounts([...accounts, account]);
  window.localStorage.setItem(AUTH_SESSION_KEY, account.id);
  authState = {
    hydrated: true,
    user: { id: account.id, email: account.email },
  };
  hydrateStore(account.id);
  emit();
  return { ok: true as const };
}

export async function logIn(email: string, password: string) {
  const normalized = normalizeEmail(email);
  const accounts = readAccounts();
  const account = accounts.find((row) => row.email === normalized);
  if (!account) {
    return { ok: false as const, reason: "No demo account with that email." };
  }
  const hash = await hashPassword(normalized, password);
  if (hash !== account.passwordHash) {
    return { ok: false as const, reason: "Email or password does not match." };
  }
  window.localStorage.setItem(AUTH_SESSION_KEY, account.id);
  authState = {
    hydrated: true,
    user: { id: account.id, email: account.email },
  };
  hydrateStore(account.id);
  emit();
  return { ok: true as const };
}

export function logOut() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
  }
  authState = { hydrated: true, user: null };
  hydrateStore(null);
  emit();
}
