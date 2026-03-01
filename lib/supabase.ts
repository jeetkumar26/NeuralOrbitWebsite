import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client (uses service role key for RLS bypass)
// NEXT_PUBLIC keys are public; service role key must be in server-only var
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
