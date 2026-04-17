import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabase';
import { userService } from '../services/userService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      userService.getUser(user.id).then(setUserData).catch(console.error);
    } else {
      setUserData(null);
    }
  }, [user]);

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email, password, username) => {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });
    if (signUpError) throw signUpError;

    if (authData.user) {
      await userService.upsertUser(authData.user.id, { username, city: '', country: '' });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setUserData(null);
  };
  const updateProfile = async (updates) => {
    if (!user) throw new Error('Utilisateur non connecté');
    const updated = await userService.upsertUser(user.id, updates);
    setUserData(updated);
    return updated;
  };
  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);