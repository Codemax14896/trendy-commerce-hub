
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
import { toast } from "sonner";

// Admin credentials
const ADMIN_EMAIL = "admin@tntrendy.com";

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

  // Login function - only allows admin login
  async function login(email: string, password: string) {
    try {
      // Only allow admin login
      if (email !== ADMIN_EMAIL) {
        toast.error("Only administrators are allowed to log in");
        throw new Error("Only administrators are allowed to log in");
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsAdmin(true);
      toast.success("Successfully logged in");
      return;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to log in");
      throw error;
    }
  }

  function logout() {
    return signOut(auth).then(() => {
      toast.success("Logged out successfully");
    });
  }

  // Signup function - only allow admin registration
  async function signup(email: string, password: string, displayName: string) {
    try {
      // Only allow admin registration
      if (email !== ADMIN_EMAIL) {
        toast.error("Registration is restricted to administrators only");
        throw new Error("Registration is restricted to administrators only");
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      toast.success("Account created successfully");
      return;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  }

  // Add password reset function
  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Failed to send password reset email");
      throw error;
    }
  }

  // Profile update functions
  async function updateUserProfile(displayName: string) {
    if (!currentUser) {
      toast.error("No user is logged in");
      throw new Error("No user is logged in");
    }
    try {
      await updateProfile(currentUser, { displayName });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  }

  async function updateUserEmail(newEmail: string) {
    if (!currentUser) {
      toast.error("No user is logged in");
      throw new Error("No user is logged in");
    }
    try {
      await updateEmail(currentUser, newEmail);
      toast.success("Email updated successfully");
    } catch (error: any) {
      console.error("Email update error:", error);
      toast.error(error.message || "Failed to update email");
      throw error;
    }
  }

  async function updateUserPassword(newPassword: string) {
    if (!currentUser) {
      toast.error("No user is logged in");
      throw new Error("No user is logged in");
    }
    try {
      await updatePassword(currentUser, newPassword);
      toast.success("Password updated successfully");
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "Failed to update password");
      throw error;
    }
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
