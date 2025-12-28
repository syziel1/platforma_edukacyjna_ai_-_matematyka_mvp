// Supabase mock — całkowicie odłączony
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: {}, error: { message: 'Supabase disabled' } }),
    signInWithOAuth: async () => ({ error: { message: 'Supabase disabled' } }),
    signOut: async () => ({ error: null })
  },
  from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null, error: { message: 'Supabase disabled' } }) }) }) })
};