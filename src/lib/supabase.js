import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: createSafeStorage()
  }
});

/**
 * Creates a safe storage adapter for Supabase Auth.
 *
 * Falls back to in-memory storage if localStorage is unavailable or throws
 * (e.g. Safari private browsing, disabled storage, SSR, etc.).
 *
 * Note on persistSession: true
 * Persisting the Supabase session (JWT) in web storage increases the impact
 * of XSS attacks. We accept this tradeoff for better UX (session recovery).
 * Mitigations in place: no dangerouslySetInnerHTML on user-controlled content,
 * and the app is primarily a demo/MVP. Production deployments should add a strict CSP.
 */
function createSafeStorage() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    // Probe localStorage to ensure it actually works in this environment
    const testKey = '__supabase_storage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);

    return window.localStorage;
  } catch {
    // Graceful fallback — in-memory only for this session
    const memoryStore = new Map();
    return {
      getItem: (key) => memoryStore.get(key) ?? null,
      setItem: (key, value) => memoryStore.set(key, value),
      removeItem: (key) => memoryStore.delete(key),
    };
  }
}
