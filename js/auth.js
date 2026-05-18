import { supabase } from './supabaseClient.js';
import { getEmailRedirectUrl } from './authCallback.js';

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getEmailRedirectUrl()
    }
  });
  return { data, error };
}

export async function resendConfirmationEmail(email) {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: getEmailRedirectUrl()
    }
  });
  return { data, error };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

document.addEventListener('DOMContentLoaded', () => {
  // Handle Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errorMsg = document.getElementById('errorMsg');
      const submitBtn = document.getElementById('submitBtn');
      
      console.log(`[Auth] Attempting login for ${email}...`);
      submitBtn.textContent = 'Signing In...';
      submitBtn.disabled = true;
      errorMsg.style.display = 'none';

      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error('[Auth] Login failed:', error.message);
        errorMsg.textContent = error.message;
        errorMsg.style.display = 'block';
        submitBtn.textContent = 'Sign In';
        submitBtn.disabled = false;
      } else {
        console.log('[Auth] Login successful!', data);
        window.location.href = './index.html';
      }
    });
  }

  // Handle Signup Form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errorMsg = document.getElementById('errorMsg');
      const submitBtn = document.getElementById('submitBtn');
      
      console.log(`[Auth] Attempting signup for ${email}...`);
      submitBtn.textContent = 'Creating Account...';
      submitBtn.disabled = true;
      errorMsg.style.display = 'none';

      const { data, error } = await signUp(email, password);
      
      if (error) {
        console.error('[Auth] Signup failed:', error.message);
        errorMsg.textContent = error.message;
        errorMsg.style.display = 'block';
        submitBtn.textContent = 'Sign Up';
        submitBtn.disabled = false;
      } else {
        // If email confirmation is required, Supabase returns a user with empty identities if it already exists
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            console.warn('[Auth] Signup warning: Email already exists.');
            errorMsg.textContent = 'An account with this email already exists.';
            errorMsg.style.display = 'block';
            submitBtn.textContent = 'Sign Up';
            submitBtn.disabled = false;
        } else if (data.session) {
            console.log('[Auth] Signup successful with session!', data);
            window.location.href = './index.html';
        } else {
            errorMsg.style.color = '#059669';
            errorMsg.textContent = 'Account created! Check your email, click the confirmation link, then sign in.';
            errorMsg.style.display = 'block';
            submitBtn.textContent = 'Sign Up';
            submitBtn.disabled = false;
        }
      }
    });
  }
});
