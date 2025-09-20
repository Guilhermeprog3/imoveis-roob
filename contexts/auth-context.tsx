"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  deleteUser,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User as FirebaseUser 
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

interface User {
  uid: string;
  email: string | null;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  deleteCurrentUser: () => Promise<{ success: boolean; error?: string }>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  deactivateCurrentUser: () => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FIVE_HOURS_IN_MS = 5 * 60 * 60 * 1000;
const SESSION_TIMESTAMP_KEY = 'session_start_time';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem(SESSION_TIMESTAMP_KEY);
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  useEffect(() => {
    const sessionTimeout = setInterval(() => {
      const startTime = localStorage.getItem(SESSION_TIMESTAMP_KEY);
      if (startTime && user) {
        if (Date.now() - parseInt(startTime, 10) > FIVE_HOURS_IN_MS) {
          alert("Sua sessão expirou. Por favor, faça login novamente.");
          logout();
        }
      }
    }, 60 * 1000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "usuarios", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: userData.nome || 'Admin',
          });
        } else {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: 'Admin',
          });
        }
      } else {
        setUser(null);
        localStorage.removeItem(SESSION_TIMESTAMP_KEY);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      clearInterval(sessionTimeout);
    };
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signUp = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await setDoc(doc(db, "usuarios", newUser.uid), {
        nome: name,
        email: email,
      });

      return { success: true };
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      let errorMessage = "Ocorreu um erro ao criar o administrador.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este e-mail já está em uso por outra conta.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "A senha é muito fraca. Ela deve ter pelo menos 6 caracteres.";
      }
      return { success: false, error: errorMessage };
    }
  };

  const sendPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao enviar email de recuperação:", error);
      return { success: false, error: "Falha ao enviar e-mail de recuperação." };
    }
  }
  
  const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      return { success: false, error: "Usuário não encontrado ou e-mail não verificado." };
    }

    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      if (error.code === 'auth/wrong-password') {
        return { success: false, error: "A senha atual está incorreta." };
      }
       if (error.code === 'auth/requires-recent-login') {
        return { success: false, error: "Esta operação é sensível e requer um login recente. Por favor, saia e entre novamente." };
      }
      return { success: false, error: "Ocorreu um erro ao atualizar a senha." };
    }
  };
  
  const deactivateCurrentUser = async (): Promise<{ success: boolean; error?: string }> => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        return { success: false, error: "Nenhum usuário logado." };
    }
    try {
        const userDocRef = doc(db, "usuarios", currentUser.uid);
        await updateDoc(userDocRef, { "visibility.isPublic": false });
        await logout();
        
        return { success: true };
    } catch (error: any) {
        console.error("Erro ao desativar conta:", error);
        return { success: false, error: "Ocorreu um erro ao desativar a conta." };
    }
  };

  const deleteCurrentUser = async (): Promise<{ success: boolean; error?: string }> => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: false, error: "Nenhum usuário logado." };
    }

    try {
      const userDocRef = doc(db, "usuarios", currentUser.uid);
      await deleteDoc(userDocRef);
      await deleteUser(currentUser);
      localStorage.removeItem(SESSION_TIMESTAMP_KEY);
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao deletar conta:", error);
      let errorMessage = "Ocorreu um erro ao excluir a conta.";
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = "Esta operação é sensível e requer autenticação recente. Por favor, faça login novamente.";
      }
      return { success: false, error: errorMessage };
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp, sendPasswordReset, deleteCurrentUser, updateUserPassword, deactivateCurrentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}