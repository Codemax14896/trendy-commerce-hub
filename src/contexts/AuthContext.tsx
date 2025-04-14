
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// Admin credentials
const ADMIN_EMAIL = "admin@tntrendy.com";
const ADMIN_PASSWORD = "admin123"; // In a real app, this would not be hardcoded

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Simplified login function - only allows the admin email
  async function login(email: string, password: string) {
    // Only allow admin login
    if (email !== ADMIN_EMAIL) {
      throw new Error("Only administrators are allowed to log in");
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsAdmin(true);
      return;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  // Add signup function
  async function signup(email: string, password: string, displayName: string) {
    // Only allow admin registration
    if (email !== ADMIN_EMAIL) {
      throw new Error("Registration is restricted to administrators only");
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      return;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  // Add password reset function
  async function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  // Add profile update functions
  async function updateUserProfile(displayName: string) {
    if (!currentUser) throw new Error("No user is logged in");
    return updateProfile(currentUser, { displayName });
  }

  async function updateUserEmail(newEmail: string) {
    if (!currentUser) throw new Error("No user is logged in");
    return updateEmail(currentUser, newEmail);
  }

  async function updateUserPassword(newPassword: string) {
    if (!currentUser) throw new Error("No user is logged in");
    return updatePassword(currentUser, newPassword);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      // If user's email matches admin email, they are an admin
      if (user && user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    loading,
    login,
    logout,
    signup,
    resetPassword,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
