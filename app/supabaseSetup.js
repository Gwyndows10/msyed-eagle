import { createClient } from "@supabase/supabase-js";
require("dotenv").config()

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
     process.env.NEXT_PUBLIC_SUPABASE_KEY // Ensure this key is available in your environment
  );