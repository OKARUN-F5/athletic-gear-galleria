
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wyzfswoqschuesnkguli.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5emZzd29xc2NodWVzbmtndWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxODU5OTcsImV4cCI6MjA1ODc2MTk5N30.7EHALJFKglhtkwlDBeugvG21ce3I-1Rcz4F5LVipgEM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
