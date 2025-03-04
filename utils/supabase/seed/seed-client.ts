import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const createClient = () => {
  if (!process.env.SUPABASE_URL) {
    throw new Error("Missing env.SUPABASE_URL");
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY");
  }

  return createSupabaseClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};
