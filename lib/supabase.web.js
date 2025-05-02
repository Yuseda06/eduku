// lib/supabase.web.js
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from '../constants';

let supabase = null;

export const getSupabase = () => {
  if (typeof window === 'undefined') return null;

  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabase;
};
