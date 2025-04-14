
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQijwNr10IJNvZ5LeltFLX4wKkUCmCM8Q",
  authDomain: "testproject-5f0d8.firebaseapp.com",
  projectId: "testproject-5f0d8",
  storageBucket: "testproject-5f0d8.appspot.com", // Fixed storageBucket URL
  messagingSenderId: "140930533716",
  appId: "1:140930533716:web:2ccd3cb691d59909bfe0c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
