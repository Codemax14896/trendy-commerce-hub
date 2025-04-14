
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
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

// Enable offline persistence
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("Firestore persistence enabled");
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable persistence');
      }
    });
} catch (error) {
  console.error("Error setting up Firestore persistence:", error);
}

export default app;
