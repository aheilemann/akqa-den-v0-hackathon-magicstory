import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const createClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY");
  }

  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
};
