/**
 * authCallback.js — Completes email verification when user clicks the Supabase link.
 * Must run before authCheck.js on login/signup pages.
 */
import { supabase } from './supabaseClient.js';

/** Build where Supabase should send users after they click the email link */
export function getEmailRedirectUrl() {
  const { origin, pathname } = window.location;
  if (pathname.includes('signup.html')) {
    return `${origin}${pathname.replace('signup.html', 'login.html')}`;
  }
  if (pathname.includes('login.html')) {
    return `${origin}${pathname}`;
  }
  return `${origin}/login.html`;
}

/**
 * Finish email confirmation from URL (token_hash query or #access_token hash).
 * @returns {Promise<boolean>} true if a session was established
 */
export async function completeEmailConfirmation() {
  const params = new URLSearchParams(window.location.search);
  const token_hash = params.get('token_hash');
  const type = params.get('type');

  // Newer Supabase email links: ?token_hash=...&type=signup
  if (token_hash && type) {
    const otpType = type === 'recovery' ? 'recovery' : type === 'signup' ? 'signup' : 'email';
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: otpType
    });

    if (error) {
      console.error('[AuthCallback] verifyOtp failed:', error.message);
      return false;
    }

    if (data?.session) {
      cleanAuthParamsFromUrl();
      console.log('[AuthCallback] Email confirmed via token_hash.');
      return true;
    }
  }

  // Older / alternate links: #access_token=... in the URL hash
  if (window.location.hash.includes('access_token')) {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('[AuthCallback] getSession after hash failed:', error.message);
      return false;
    }
    if (session) {
      cleanAuthParamsFromUrl();
      console.log('[AuthCallback] Session established from URL hash.');
      return true;
    }
  }

  return false;
}

function cleanAuthParamsFromUrl() {
  window.history.replaceState({}, document.title, window.location.pathname);
}
