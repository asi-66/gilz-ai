// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fdwpsheuedadsmbalpis.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkd3BzaGV1ZWRhZHNtYmFscGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NjM2NjgsImV4cCI6MjA2MDAzOTY2OH0.RHwR6e4yQn99d9q0PbxII_tEWg8Pubov1ILiUYeNx2E";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);