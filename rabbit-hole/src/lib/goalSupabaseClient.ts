import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !publicKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and a public Supabase key");
}

// Uses the default browser session storage. If your auth module uses a custom
// storage adapter, import its existing client in Home.tsx instead.
export const goalSupabaseClient = createClient(url, publicKey);
