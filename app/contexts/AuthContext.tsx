import { createContext, useContext, useEffect, useState } from "react";

import type { User } from "@supabase/supabase-js";
import { supabase } from "~/services/supabase";

interface IAuthContext {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const validateUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (error) {
          const isAuthError =
            error.status != null &&
            (error.status === 401 || error.status === 403);

          if (isAuthError) {
            const { error: signOutError } = await supabase.auth.signOut();

            if (signOutError) console.error(signOutError);

            if (!isMounted) return;
            setUser(null);
          } else {
            console.error(error);

            const {
              data: { session },
            } = await supabase.auth.getSession();

            if (!isMounted) return;
            setUser(session?.user ?? null);
          }
        } else {
          if (!isMounted) return;
          setUser(data.user);
        }
      } catch (error) {
        console.error(error);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;
        setUser(session?.user ?? null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    validateUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) console.error(error);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return { context };
}
