import { supabase } from './supabaseClient.js';
import { completeEmailConfirmation } from './authCallback.js';

console.log('[AuthCheck] Initializing session detection...');

async function enforceAuth() {
    try {
        // Complete email verification if user just clicked the link in their inbox
        const confirmed = await completeEmailConfirmation();
        if (confirmed) {
            console.log('[AuthCheck] Email confirmation completed from URL.');
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Handle URL paths correctly for both dev (e.g. /login.html) and nested pages
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath.endsWith('login.html') || currentPath.endsWith('signup.html');
        const isNested = currentPath.includes('/sdg-');
        
        console.log(`[AuthCheck] Path: ${currentPath} | isAuthPage: ${isAuthPage} | HasSession: ${!!session}`);

        if (error) {
            console.error('[AuthCheck] Session error:', error.message);
        }

        if (!session && !isAuthPage) {
            console.log('[AuthCheck] No session detected on protected page. Redirecting to login...');
            const redirectTarget = isNested ? '../login.html' : './login.html';
            window.location.href = redirectTarget;
            return;
        }

        if (session && isAuthPage) {
            console.log('[AuthCheck] Active session detected on auth page. Redirecting to home...');
            window.location.href = './index.html';
            return;
        }

        // Auth check passed, reveal UI
        document.documentElement.style.display = '';
        console.log('[AuthCheck] Access granted. UI revealed.');

        // If on a protected page, update the UI (e.g. change "Join Us" to "Logout")
        if (session && !isAuthPage) {
            updateNavbarForAuthenticatedUser();
        }

    } catch (err) {
        console.error('[AuthCheck] Critical Auth Failure:', err);
        // Display configuration error so the user knows why it failed instead of silently bypassing auth
        document.documentElement.innerHTML = `<h1 style="color:red; text-align:center; padding: 50px; font-family: sans-serif;">Auth Configuration Error.<br>Please check the console for details. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.</h1>`;
        document.documentElement.style.display = '';
    }
}

function updateNavbarForAuthenticatedUser() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachLogout);
    } else {
        attachLogout();
    }
}

function attachLogout() {
    const navContactBtn = document.querySelector('.nav-contact-btn');
    if (navContactBtn) {
        navContactBtn.textContent = 'Logout';
        navContactBtn.href = '#';
        navContactBtn.id = 'logoutBtn';
        
        navContactBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('[AuthCheck] Logout button clicked. Clearing session...');
            await supabase.auth.signOut();
            console.log('[AuthCheck] Session cleared.');
            
            const currentPath = window.location.pathname;
            const isNested = currentPath.includes('/sdg-');
            const redirectTarget = isNested ? '../login.html' : './login.html';
            window.location.href = redirectTarget;
        });
    }
}

// Run immediately
enforceAuth();

// Listen for auth state changes (e.g. if logged out from another tab)
supabase.auth.onAuthStateChange((event, session) => {
    console.log(`[AuthCheck] Auth state changed: ${event}`);
    const currentPath = window.location.pathname;
    const isAuthPage = currentPath.endsWith('login.html') || currentPath.endsWith('signup.html');
    const isNested = currentPath.includes('/sdg-');
    
    // Ignore INITIAL_SESSION as enforceAuth handles the initial load
    if (event === 'INITIAL_SESSION') return;
    
    if (event === 'SIGNED_OUT' && !isAuthPage) {
        console.log('[AuthCheck] Signed out from another context. Redirecting to login...');
        const redirectTarget = isNested ? '../login.html' : './login.html';
        window.location.href = redirectTarget;
    } else if (event === 'SIGNED_IN' && isAuthPage) {
        console.log('[AuthCheck] Signed in from another context. Redirecting to home...');
        window.location.href = './index.html';
    }
});
