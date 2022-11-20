import "react-native-url-polyfill/auto";
import React, { createContext, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "~/supabase";
import { Profile } from "~/types";

type ContextProps = {
  user: Profile | null | undefined;
  session: Session | null | undefined;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
  const [user, setUser] = useState<Profile | null>();
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription!.unsubscribe();
    };
  }, []);

  async function loadUser() {
    if (!session) {
      setUser(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session?.user?.id)
      .limit(1)
      .single();

    if (error) {
      console.log(error);
      setUser(null);
      return;
    }

    setUser(data);
  }

  useEffect(() => {
    loadUser();
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
