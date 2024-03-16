import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    process.env.React_App_Supabase_Url,
    process.env.React_App_Supabase_Anon_Key
);
