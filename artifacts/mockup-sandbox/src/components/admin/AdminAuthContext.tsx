import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check admin allowlist
  const checkAdminAllowlist = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("id, email")
        .eq("id", userId)
        .maybeSingle();

      if (error || !data) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const allowed = await checkAdminAllowlist(session.user.id);
        setIsAdmin(allowed);
        if (!allowed) {
          setError("Your account is not authorized to access the ABF Admin Dashboard.");
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const allowed = await checkAdminAllowlist(session.user.id);
          setIsAdmin(allowed);
          if (!allowed) {
            setError("Your account is not authorized to access the ABF Admin Dashboard.");
          } else {
            setError(null);
          }
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);

    if (!isSupabaseConfigured()) {
      setLoading(false);
      setError("Supabase is not configured in this environment.");
      return { success: false, error: "Supabase is not configured." };
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (signInError) {
        setLoading(false);
        setError(signInError.message);
        return { success: false, error: signInError.message };
      }

      if (data.user) {
        const allowed = await checkAdminAllowlist(data.user.id);
        if (!allowed) {
          await supabase.auth.signOut();
          setIsAdmin(false);
          setUser(null);
          setLoading(false);
          const msg = "Access denied. Your account is not on the ABF administrators allowlist.";
          setError(msg);
          return { success: false, error: msg };
        }
        setIsAdmin(true);
        setUser(data.user);
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: "Failed to authenticate." };
    } catch (err: any) {
      setLoading(false);
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setError(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        error,
        signIn,
        signOut,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
