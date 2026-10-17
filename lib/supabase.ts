import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// This is a public publishable key. Database access is protected by Supabase RLS.
const SUPABASE_URL = "https://hlhbrkwsrhvbibhovnge.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_a8ycuRT6Xwd6qTkilBNtqw_1H8l9j7Q";
let client: SupabaseClient | undefined;
export function supabaseBrowser() {
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return client;
}
