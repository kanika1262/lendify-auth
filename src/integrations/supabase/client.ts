
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://elkaooxddbshxqnnnshw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsa2Fvb3hkZGJzaHhxbm5uc2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1ODk4MzksImV4cCI6MjA1NzE2NTgzOX0.dM1XZ5LPB11-xLPqiR_aTTKhppgGJL3ecY89M-hwwlM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
