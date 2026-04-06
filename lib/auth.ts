import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from './firebase';

export const authErrorMessage = (error: unknown): string => {
  const code = typeof error === 'object' && error && 'code' in error ? String((error as { code?: string }).code) : '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Email invalido.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Credenciais invalidas.';
    case 'auth/email-already-in-use':
      return 'Este email ja esta em uso.';
    case 'auth/weak-password':
      return 'A palavra-passe deve ter pelo menos 6 caracteres.';
    default:
      return `Erro de autenticacao${code ? ` (${code})` : ''}.`;
  }
};

export const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email.trim(), password);

export const register = async (name: string, email: string, password: string) => {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (name.trim()) {
    await updateProfile(credential.user, { displayName: name.trim() });
  }
  return credential;
};

export const logout = () => signOut(auth);
