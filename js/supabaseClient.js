import { createClient } from '@supabase/supabase-js';

// Default to undefined, we'll try to extract them safely
let supabaseUrl = undefined;
let supabaseKey = undefined;

// Vite injects .env values when you run: npm run dev
// We wrap this in try-catch because raw browsers (like unbuilt GitHub Pages) will throw a TypeError if import.meta.env doesn't exist
try {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
} catch (e) {
  console.warn('[Supabase] Not running in Vite environment.');
}

// Fallback when opening via a static server without Vite (optional meta tags)
if (typeof document !== 'undefined') {
  const urlMeta = document.querySelector('meta[name="supabase-url"]');
  const keyMeta = document.querySelector('meta[name="supabase-anon-key"]');
  if ((!supabaseUrl || !supabaseKey) && urlMeta?.content && keyMeta?.content) {
    supabaseUrl = urlMeta.content;
    supabaseKey = keyMeta.content;
  }
}

if (typeof supabaseUrl !== 'string' || supabaseUrl.trim() === '') {
  console.error('[Supabase] Missing VITE_SUPABASE_URL. Use npm run dev or add meta tags.');
  supabaseUrl = 'https://placeholder.supabase.co';
} else {
  // Remove /rest/v1 or /rest/v1/ if present
  supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '');
}

if (typeof supabaseKey !== 'string' || supabaseKey.trim() === '') {
  console.error('[Supabase] Missing VITE_SUPABASE_ANON_KEY.');
  supabaseKey = 'public-anon-key';
}

export let supabase = null;

try {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true
    }
  });
} catch (error) {
  console.error('[Supabase] Failed to initialize Supabase client:', error);
  // Provide a dummy client to prevent downstream crashes that lead to white screens
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: new Error('Supabase not initialized') }),
      onAuthStateChange: () => {},
      signOut: async () => ({ error: null })
    }
  };
}
