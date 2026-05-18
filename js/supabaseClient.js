import { createClient } from '@supabase/supabase-js';

// Vite injects .env values when you run: npm run dev
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback when opening via a static server without Vite (optional meta tags on index.html)
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
}
if (typeof supabaseKey !== 'string' || supabaseKey.trim() === '') {
  console.error('[Supabase] Missing VITE_SUPABASE_ANON_KEY.');
  supabaseKey = 'public-anon-key';
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true
  }
});
