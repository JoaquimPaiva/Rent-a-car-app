import { onAuthStateChanged, type User } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authErrorMessage, login, logout, register } from '../lib/auth';
import { auth } from '../lib/firebase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      throw new Error(authErrorMessage(error));
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      await register(name, email, password);
    } catch (error) {
      throw new Error(authErrorMessage(error));
    }
  };

  const signOutUser = async () => {
    try {
      await logout();
    } catch (error) {
      throw new Error(authErrorMessage(error));
    }
  };

  const value = useMemo<AuthContextValue>(() => ({ user, loading, signIn, signUp, signOutUser }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
