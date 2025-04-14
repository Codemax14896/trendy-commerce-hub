
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
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

  // Modified signup function to only allow admin registration based on a predefined list
  async function signup(email: string, password: string, displayName: string) {
    try {
      // You can define your admin emails here or fetch from a secure location
      const allowedAdminEmails = ["admin@tntrendy.com", "admin@example.com"];
      
      // Only allow registration if email is in allowed admin list
      if (!allowedAdminEmails.includes(email.toLowerCase())) {
        throw new Error("Registration is restricted to administrators only");
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document in Firestore with admin flag
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName,
        isAdmin: true, // All registered users are admins in this case
        createdAt: new Date().toISOString()
      });
      
      return userCredential.user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  // Modified login function to check if user is an admin
  async function login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Verify if user is an admin
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists() || !userDoc.data().isAdmin) {
        // If not admin, log them out immediately
        await signOut(auth);
        throw new Error("Only administrators are allowed to log in");
      }
      
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateUserProfile(displayName: string) {
    if (!currentUser) throw new Error("No user logged in");
    return updateProfile(currentUser, { displayName });
  }

  function updateUserEmail(email: string) {
    if (!currentUser) throw new Error("No user logged in");
    return updateEmail(currentUser, email);
  }

  function updateUserPassword(password: string) {
    if (!currentUser) throw new Error("No user logged in");
    return updatePassword(currentUser, password);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Check if user is admin
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setIsAdmin(userDoc.data().isAdmin || false);
          } else {
            // If user document doesn't exist, create one (fallback)
            await setDoc(doc(db, "users", user.uid), {
              email: user.email,
              displayName: user.displayName,
              isAdmin: false,
              createdAt: new Date().toISOString()
            });
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
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
    signup,
    login,
    logout,
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
