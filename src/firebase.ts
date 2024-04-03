// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCoL4HDqmWmJReQonRuz77cex7lk7CIvPM",
  authDomain: "chat-734f8.firebaseapp.com",
  projectId: "chat-734f8",
  storageBucket: "chat-734f8.appspot.com",
  messagingSenderId: "518982971808",
  appId: "1:518982971808:web:34e294065354b669fe74c5",
  databaseURL:
    "https://chat-734f8-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// export const db = getFirestore(app);

export const realDB = getDatabase(app);

export const googleProvider = new GoogleAuthProvider();
