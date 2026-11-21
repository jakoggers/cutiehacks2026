/**
 * TEMPORARY front-end-only auth.
 *
 * Remembers who is "signed in" in the browser (username only, never the
 * password) so the UI can be built and tested without a database.
 * Later, replace the bodies of these functions with Supabase calls:
 * the pages that use them won't need to change.
 */

const STORAGE_KEY = "rabbithole-user";
const CHANGE_EVENT = "rabbithole-auth-change";

export interface AuthUser {
  username: string;
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username.trim());
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function setCurrentUser(user: AuthUser | null) {
  try {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage unavailable (e.g. private mode): ignore
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function onAuthChange(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback); // other tabs
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// Small delay so loading states are visible while testing
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function signIn(username: string, _password: string): Promise<AuthUser> {
  await wait(400);
  const user = { username: username.trim() };
  setCurrentUser(user);
  return user;
}

export async function signUp(username: string, _password: string): Promise<AuthUser> {
  await wait(400);
  const user = { username: username.trim() };
  setCurrentUser(user);
  return user;
}

export async function signOut(): Promise<void> {
  setCurrentUser(null);
}