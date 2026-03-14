import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Provide a safe stub so the app doesn't crash during development
// while the Supabase project is being set up.
const safeFallbackUrl = 'https://placeholder.supabase.co';
const safeFallbackKey = 'placeholder-anon-key';

if (!supabaseUrl || supabaseUrl === 'your-project-url') {
  console.warn('⚠️  NEXOS: Supabase URL not configured. Set NEXT_PUBLIC_SUPABASE_URL in .env.local');
}

export const supabase = createClient(
  (supabaseUrl && supabaseUrl !== 'your-project-url') ? supabaseUrl : safeFallbackUrl,
  (supabaseAnonKey && supabaseAnonKey !== 'your-anon-key') ? supabaseAnonKey : safeFallbackKey,
  {
    auth: {
      persistSession: typeof window !== 'undefined',
    },
  }
);

export const isSupabaseConfigured =
  !!supabaseUrl && supabaseUrl !== 'your-project-url' &&
  !!supabaseAnonKey && supabaseAnonKey !== 'your-anon-key';
