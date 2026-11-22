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
  serverTimestamp,
  getDocFromServer
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
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const auth = getAuth(app);

// Validate connection to Firestore
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

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
