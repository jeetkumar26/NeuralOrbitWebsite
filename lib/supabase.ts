import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single client instance (safe for browser since keys are NEXT_PUBLIC)
export const supabase = createClient(supabaseUrl, supabaseKey);
