import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp
} from "firebase/firestore";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";

// Firebase App Configuration sourced from workspace environment
const firebaseConfig = {
  projectId: "bustling-sweep-b6vd8",
  appId: "1:729088242560:web:bce16a94fb023c9af7c765",
  apiKey: "AIzaSyAu-t7yQvSdlHmHhog3OedhnVs0KblMSeM",
  authDomain: "bustling-sweep-b6vd8.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-e2a2e56b-0f58-40bc-9a4f-789242f82c99",
  storageBucket: "bustling-sweep-b6vd8.firebasestorage.app",
  messagingSenderId: "729088242560"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const auth = getAuth(app);

export { 
  app, 
  db, 
  auth,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
export type { FirebaseUser };
