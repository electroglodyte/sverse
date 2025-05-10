import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// The Supabase URL and public key are from the project settings
// Hardcoded for now, but could be moved to environment variables
const supabaseUrl = "https://rkmjjhjjpnhjymqmcvpe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrbWpqaGpqcG5oanltcW1jdnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MzM5NDUsImV4cCI6MjA2MjQwOTk0NX0.GlxA96751aHLq0Bi6nhKXtWHF0tlmWvsemGr3heQ13k";

// Create a single supabase client and export it
let _supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!_supabaseClient) {
    _supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.error("Supabase client initialized");
  }
  return _supabaseClient;
};
